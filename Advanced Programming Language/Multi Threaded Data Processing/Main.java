import java.util.concurrent.*;
import java.util.concurrent.locks.ReentrantLock;
import java.util.concurrent.ConcurrentHashMap;
import java.util.Map;
import java.util.UUID;
import java.util.List;
import java.util.ArrayList;

/**
 * Record: Employee
 * A modern Java record to hold immutable employee data.
 */
record Employee(String name, double baseSalary, double taxRate) {}

/**
 * Class: DataTask
 * It holds an Employee object and the calculated result.
 */
class DataTask {
    public enum State { PENDING, PROCESSING, COMPLETED, SHUTDOWN }
    
    private final String id;
    private final Employee employee; // The "Real World" data
    private State status;
    private double processedNetSalary;

    public DataTask(Employee employee, State initialState) {
        this.id = UUID.randomUUID().toString().substring(0, 8);
        this.employee = employee;
        this.status = initialState;
    }

    // Getters and Setters
    public String getId() { return id; }
    public Employee getEmployee() { return employee; }
    public State getStatus() { return status; }
    public void setStatus(State status) { this.status = status; }
    public double getProcessedNetSalary() { return processedNetSalary; }
    public void setProcessedNetSalary(double salary) { this.processedNetSalary = salary; }
}








/**
 * Class: TaskQueue
 * Thread-safe shared queue using ReentrantLock.
 */
class TaskQueue {
    private final BlockingQueue<DataTask> queue = new LinkedBlockingQueue<>(200);
    private final ReentrantLock lock = new ReentrantLock();

    public void addTask(DataTask task) {
        lock.lock();
        try {
            queue.put(task); 
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
        } finally {
            lock.unlock(); 
        }
    }

    public DataTask getTask() throws InterruptedException {
        // We use tryLock and a shortened poll to avoid the deadlock we discussed earlier.
        if (lock.tryLock(100, TimeUnit.MILLISECONDS)) {
            try {
                return queue.poll(); 
            } finally {
                lock.unlock();
            }
        }
        return queue.poll(100, TimeUnit.MILLISECONDS);
    }
}

/**
 * CLASS: DataTaskExecutor
 * Uses Virtual Threads to process the payroll calculations.
 */
class DataTaskExecutor {
    private final TaskQueue taskQueue;
    // Map stores Employee Name -> Net Salary
    private final Map<String, Double> payrollRegister = new ConcurrentHashMap<>();
    private final int workerCount = 10;

    public DataTaskExecutor(TaskQueue taskQueue) {
        this.taskQueue = taskQueue;
    }

    public void startProcessing(int totalTasks) {
        try (var executor = Executors.newVirtualThreadPerTaskExecutor()) {
            
            // 1. Initialize Workers
            for (int i = 0; i < workerCount; i++) {
                executor.submit(this::processPayroll);
            }

            // 2. Producer: Generate Realistic Employees
            for (int i = 0; i < totalTasks; i++) {
                Employee emp = new Employee("Employee_" + i, 50000 + (i * 100), 0.25);
                taskQueue.addTask(new DataTask(emp, DataTask.State.PENDING));
            }

            // 3. Graceful Shutdown: Poison Pills
            for (int i = 0; i < workerCount; i++) {
                taskQueue.addTask(new DataTask(null, DataTask.State.SHUTDOWN));
            }

        } catch (Exception e) {
            System.err.println("System Error: " + e.getMessage());
        }

        // Final Summary
        System.out.println("[Payroll Summary] Processed: " + payrollRegister.size() + " records.");
    }

    /**
     * Logic for calculating salary. 
     * In a real app, this might involve calling a tax API or a database.
     */
    private void processPayroll() {
        try {
            while (!Thread.currentThread().isInterrupted()) {
                DataTask task = taskQueue.getTask();
                if (task == null) continue;
                if (task.getStatus() == DataTask.State.SHUTDOWN) break;

                task.setStatus(DataTask.State.PROCESSING);
                
                // BUSINESS LOGIC: 
                // Calculate Net Salary: Base - (Base * TaxRate)
                Employee e = task.getEmployee();
                double netSalary = e.baseSalary() * (1 - e.taxRate());
                
                // Simulate I/O Delay (e.g., writing to a database)
                // Virtual thread unmounts here
                Thread.sleep(10); 

                task.setProcessedNetSalary(netSalary);
                task.setStatus(DataTask.State.COMPLETED);
                
                payrollRegister.put(e.name(), netSalary);
                
                // Log progress occasionally
                if (payrollRegister.size() % 20 == 0) {
                    System.out.println("[Thread: " + Thread.currentThread() + "] Processed " + e.name());
                }
            }
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
        }
    }
}


/**
 * Main Entry Point
 */
public class Main {
    public static void main(String[] args) {
        System.out.println("--- Starting Virtual Thread Payroll System ---");
        
        TaskQueue queue = new TaskQueue();
        DataTaskExecutor executor = new DataTaskExecutor(queue);
        
        long startTime = System.currentTimeMillis();
        executor.startProcessing(100); 
        long endTime = System.currentTimeMillis();
        
        System.out.println("--- Batch Run Complete in " + (endTime - startTime) + "ms ---");
    }
}
