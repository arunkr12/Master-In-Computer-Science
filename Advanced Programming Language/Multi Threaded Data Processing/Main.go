package main

import (
	"fmt"
	"math/rand"
	"sync"
	"time"
)

// --- 1. DATA MODELS ---

// State represents the lifecycle of a task
type State int

const (
	Pending State = iota
	Processing
	Completed
	Shutdown
)

// Employee is the equivalent of a Java Record
type Employee struct {
	Name       string
	BaseSalary float64
	TaxRate    float64
}

// DataTask represents the unit of work
type DataTask struct {
	ID                 string
	Employee           *Employee
	Status             State
	ProcessedNetSalary float64
}

// --- 2. SHARED RESOURCE ---

// TaskQueue acts as the thread-safe shared resource.
// While Go channels are natively thread-safe, we wrap it in a struct 
// with a Mutex to satisfy the explicit synchronization requirement.
type TaskQueue struct {
	tasks chan *DataTask
	lock  sync.Mutex
}

func NewTaskQueue(capacity int) *TaskQueue {
	return &TaskQueue{
		tasks: make(chan *DataTask, capacity),
	}
}

// AddTask adds a task to the queue safely.
func (t *TaskQueue) AddTask(task *DataTask) {
	t.lock.Lock() // Explicit synchronization
	defer t.lock.Unlock()
	t.tasks <- task
}

// GetTask retrieves a task. This blocks (yielding the goroutine) if the queue is empty.
func (t *TaskQueue) GetTask() *DataTask {
	// Note: We don't lock the channel receive because channels 
	// are already synchronized by the Go Runtime.
	return <-t.tasks
}

// --- 3. EXECUTOR ---

// DataTaskExecutor orchestrates the workers and aggregates results.
type DataTaskExecutor struct {
	taskQueue       *TaskQueue
	payrollRegister sync.Map // Thread-safe map for results
	workerCount     int
}

func NewDataTaskExecutor(tq *TaskQueue) *DataTaskExecutor {
	return &DataTaskExecutor{
		taskQueue:   tq,
		workerCount: 10,
	}
}

func (e *DataTaskExecutor) StartProcessing(totalTasks int) {
	var wg sync.WaitGroup

	// 1. Initialize Workers (Goroutines)
	for i := 0; i < e.workerCount; i++ {
		wg.Add(1)
		go e.processPayroll(&wg)
	}

	// 2. Producer: Generate Employees
	for i := 0; i < totalTasks; i++ {
		emp := &Employee{
			Name:       fmt.Sprintf("Employee_%d", i),
			BaseSalary: 50000 + float64(i*100),
			TaxRate:    0.25,
		}
		e.taskQueue.AddTask(&DataTask{
			ID:       fmt.Sprintf("%x", rand.Intn(1000000)),
			Employee: emp,
			Status:   Pending,
		})
	}

	// 3. Graceful Shutdown: Poison Pills
	// We send a specific signal to each worker to stop.
	for i := 0; i < e.workerCount; i++ {
		e.taskQueue.AddTask(&DataTask{Status: Shutdown})
	}

	// Wait for all workers to finish
	wg.Wait()

	// Final Summary
	count := 0
	e.payrollRegister.Range(func(_, _ interface{}) bool {
		count++
		return true
	})
	fmt.Printf("[Payroll Summary] Processed: %d records.\n", count)
}

// processPayroll is the logic executed by each Goroutine
func (e *DataTaskExecutor) processPayroll(wg *sync.WaitGroup) {
	defer wg.Done()

	for {
		task := e.taskQueue.GetTask()

		if task.Status == Shutdown {
			break // Exit Goroutine
		}

		task.Status = Processing

		// BUSINESS LOGIC
		emp := task.Employee
		netSalary := emp.BaseSalary * (1 - emp.TaxRate)

		// Simulate I/O Delay (The goroutine is suspended by the Go scheduler)
		time.Sleep(10 * time.Millisecond)

		task.ProcessedNetSalary = netSalary
		task.Status = Completed

		e.payrollRegister.Store(emp.Name, netSalary)

		// Occasional logging
		if rand.Intn(10) == 1 {
			fmt.Printf("[Worker] Processed %s (Net: %.2f)\n", emp.Name, netSalary)
		}
	}
}

// --- 4. MAIN CLIENT ---

func main() {
	fmt.Println("--- Starting Go Payroll System ---")

	queue := NewTaskQueue(200)
	executor := NewDataTaskExecutor(queue)

	startTime := time.Now()
	executor.StartProcessing(100)
	duration := time.Since(startTime)

	fmt.Printf("--- Batch Run Complete in %v ---\n", duration)
}
