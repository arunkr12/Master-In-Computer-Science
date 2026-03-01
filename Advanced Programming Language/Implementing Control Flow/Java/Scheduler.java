package universityOfCumberland;

import java.util.*;

/**
 * An application for managing a 7-day employee shift schedule.
 * * Business Rules Enforced:
 * 1. An employee cannot work more than one shift per day.
 * 2. An employee can work a maximum of 5 days per week.
 * 3. Each shift requires a minimum of 2 employees.
 * 4. Scheduling attempts to honor employee shift preferences before auto-assigning.
 */
public class Scheduler {

    private static final int NUMBER_OF_DAYS = 7;

    enum ShiftType {
        MORNING,
        AFTERNOON,
        EVENING
    }

    private static class Employee {
        private String name;
        private Map<Integer, ShiftType> preferences;
        private int daysWorked = 0;
        private Set<Integer> daysWorkedSet;

        public Employee(String name) {
            this.name = name;
            preferences = new HashMap<>();
            daysWorkedSet = new HashSet<>();
        }
    }

    /**
     * The main execution flow. Acts as an orchestrator that outlines the step-by-step
     * solution for generating, populating, and displaying the weekly schedule.
     */
    public static void main(String[] args) {

        int maxEmployeesPerShift = 3; // To trigger conflict as given maxEmployeePerShift is 2
        List<Employee> employees = getEmployees();

        Map<Integer, Map<ShiftType, List<String>>> schedule = createEmptyWeeklySchedule();

        assignEmployeesBasedOnPreferences(schedule, employees, maxEmployeesPerShift);

        enforceMinimumShiftCoverage(schedule, employees);

        displayFormattedSchedule(schedule);
    }

    /**
     * Initializes the core data structure for the week.
     * * @return A nested map representing Days -> Shifts -> List of Assigned Employee Names.
     */
    private static Map<Integer, Map<ShiftType, List<String>>> createEmptyWeeklySchedule() {
        Map<Integer, Map<ShiftType, List<String>>> schedule = new HashMap<>();
        for (int i = 1; i <= NUMBER_OF_DAYS; i++) {
            schedule.put(i, new HashMap<>());
            for (ShiftType type : ShiftType.values()) {
                schedule.get(i).put(type, new ArrayList<>());
            }
        }
        return schedule;
    }

    /**
     * Iterates through all employees and attempts to place them in their preferred shifts.
     * If a preferred shift is full, it resolves the conflict by assigning them to the
     * next available shift on that same day.
     * * @param schedule The weekly schedule map to populate.
     * @param employees The list of available employees.
     * @param maxPerShift The capacity limit for a single shift before triggering conflict resolution.
     */
    private static void assignEmployeesBasedOnPreferences(Map<Integer, Map<ShiftType, List<String>>> schedule, List<Employee> employees, int maxPerShift) {
        for (int day = 1; day <= NUMBER_OF_DAYS; day++) {
            for (Employee emp : employees) {
                // Enforce business rules: Max 5 days a week, Max 1 shift a day
                if (emp.daysWorked >= 5 || emp.daysWorkedSet.contains(day)) continue;

                ShiftType pref = emp.preferences.getOrDefault(day, ShiftType.MORNING);

                // Try assigning to preferred shift first
                if (schedule.get(day).get(pref).size() < maxPerShift) {
                    assignWorkerToShift(schedule, emp, day, pref);
                } else {
                    // Conflict Resolution: Find alternative shift for the day
                    for (ShiftType altShift : ShiftType.values()) {
                        if (schedule.get(day).get(altShift).size() < maxPerShift) {
                            assignWorkerToShift(schedule, emp, day, altShift);
                            break;
                        }
                    }
                }
            }
        }
    }

    /**
     * Audits the populated schedule to ensure every shift meets the minimum required headcount.
     * If a shift is understaffed, it auto-assigns available employees. If no eligible
     * employees remain, it flags the shift as short-staffed to prevent infinite loops.
     * * @param schedule The schedule to audit and modify.
     * @param employees The list of employees to pull from for auto-assignment.
     */
    private static void enforceMinimumShiftCoverage(Map<Integer, Map<ShiftType, List<String>>> schedule, List<Employee> employees) {
        for (int day = 1; day <= NUMBER_OF_DAYS; day++) {
            for (ShiftType shift : ShiftType.values()) {
                List<String> workers = schedule.get(day).get(shift);

                while (workers.size() < 2) {
                    boolean workerAssigned = false;
                    for (Employee emp : employees) {
                        if (emp.daysWorked < 5 && !emp.daysWorkedSet.contains(day)) {
                            workers.add(emp.name + " (Auto-Assigned)");
                            emp.daysWorked++;
                            emp.daysWorkedSet.add(day);
                            workerAssigned = true;
                            break;
                        }
                    }

                    // Safety valve: Stop looking if total human capital is exhausted
                    if (!workerAssigned) {
                        workers.add("[Alert: Short Staffed]");
                        break;
                    }
                }
            }
        }
    }

    /**
     * Renders the final schedule to the console in a clean, human-readable format.
     * * @param schedule The completed weekly schedule.
     */
    private static void displayFormattedSchedule(Map<Integer, Map<ShiftType, List<String>>> schedule) {
        System.out.println("===============================");
        System.out.println("      WEEKLY SHIFT SCHEDULE    ");
        System.out.println("===============================");

        for (int day = 1; day <= NUMBER_OF_DAYS; day++) {
            System.out.println("\nDay " + day + ":");
            for (ShiftType shift : ShiftType.values()) {
                List<String> assignedWorkers = schedule.get(day).get(shift);
                String formattedShiftName = shift.name().substring(0, 1) + shift.name().substring(1).toLowerCase();
                String workerList = assignedWorkers.isEmpty() ? "None" : String.join(", ", assignedWorkers);

                System.out.printf("  %-10s: %s%n", formattedShiftName, workerList);
            }
        }
    }

    /**
     * Centralized helper method to assign an employee to a shift.
     * This ensures that the schedule and the employee's state tracking variables
     * are always updated together, preventing data synchronization bugs.
     */
    private static void assignWorkerToShift(Map<Integer, Map<ShiftType, List<String>>> schedule, Employee emp, int day, ShiftType shift) {
        schedule.get(day).get(shift).add(emp.name);
        emp.daysWorked++;
        emp.daysWorkedSet.add(day);
    }

    /**
     * Generates seed data for testing the application.
     * * @return A list of mock employees with pre-defined shift preferences.
     */
    private static List<Employee> getEmployees() {
        List<Employee> employees = Arrays.asList(
                new Employee("Arun"), new Employee("Bob"), new Employee("Charlie"),
                new Employee("Diana"), new Employee("Eve"), new Employee("Frank")
        );
        employees.get(0).preferences.put(1, ShiftType.MORNING);
        employees.get(1).preferences.put(1, ShiftType.MORNING);
        employees.get(2).preferences.put(1, ShiftType.AFTERNOON);
        employees.get(3).preferences.put(1, ShiftType.AFTERNOON);
        employees.get(4).preferences.put(1, ShiftType.EVENING);
        employees.get(5).preferences.put(1, ShiftType.EVENING);
        return employees;
    }
}