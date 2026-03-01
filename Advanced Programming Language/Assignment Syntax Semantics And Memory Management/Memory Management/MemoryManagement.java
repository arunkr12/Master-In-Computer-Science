public class MemoryManagement{
    private int salary;
    private String empMessage;

    public MemoryManagement(int salary, String empMessage) {
        this.salary = salary;
        this.empMessage = empMessage;
    }

       public static void allocateMemory() {
        // Allocate memory on the heap
        MemoryManagementdata = new MemoryManagement(100, "Java manages this string automatically");
        System.out.println(data);
        
        // No explicit free() or delete. 
        // The Garbage Collector will clean this up later.
    }

    public static void main(String[] args) {
        allocateMemory();
        System.out.println("Method finished. GC will run eventually.");
    }

}