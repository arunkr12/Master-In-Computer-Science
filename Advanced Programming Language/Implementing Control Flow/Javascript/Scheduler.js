/**
 * An application for managing a 7-day employee shift schedule.
 * * Business Rules Enforced:
 * 1. An employee cannot work more than one shift per day.
 * 2. An employee can work a maximum of 5 days per week.
 * 3. Each shift requires a minimum of 2 employees.
 * 4. Scheduling attempts to honor employee shift preferences before auto-assigning.
 */

const NUMBER_OF_DAYS = 7;

/**
 * Mimicking a Java Enum using an immutable, frozen object.
 */
const ShiftType = Object.freeze({
  MORNING: "MORNING",
  AFTERNOON: "AFTERNOON",
  EVENING: "EVENING",
});

class Employee {
  constructor(name) {
    this.name = name;
    this.preferences = new Map(); // Map<DayNumber, ShiftType>
    this.daysWorked = 0;
    this.daysWorkedSet = new Set();
  }
}

class Scheduler {
  /**
   * The main execution flow. Acts as an orchestrator that outlines the step-by-step
   * solution for generating, populating, and displaying the weekly schedule.
   */
  static main() {
    const maxEmployeesPerShift = 3; // To trigger conflict as given maxEmployeePerShift is 2
    const employees = Scheduler.getEmployees();

    const schedule = Scheduler.createEmptyWeeklySchedule();

    Scheduler.assignEmployeesBasedOnPreferences(
      schedule,
      employees,
      maxEmployeesPerShift,
    );

    Scheduler.enforceMinimumShiftCoverage(schedule, employees);

    Scheduler.displayFormattedSchedule(schedule);
  }

  /**
   * Initializes the core data structure for the week.
   * @returns {Map} A nested map representing Days -> Shifts -> Array of Assigned Employee Names.
   */
  static createEmptyWeeklySchedule() {
    const schedule = new Map();
    for (let i = 1; i <= NUMBER_OF_DAYS; i++) {
      const dailySchedule = new Map();
      for (const shift of Object.values(ShiftType)) {
        dailySchedule.set(shift, []);
      }
      schedule.set(i, dailySchedule);
    }
    return schedule;
  }

  /**
   * Iterates through all employees and attempts to place them in their preferred shifts.
   * If a preferred shift is full, it resolves the conflict by assigning them to the
   * next available shift on that same day.
   * * @param {Map} schedule The weekly schedule map to populate.
   * @param {Array<Employee>} employees The list of available employees.
   * @param {number} maxPerShift The capacity limit for a single shift before triggering conflict resolution.
   */
  static assignEmployeesBasedOnPreferences(schedule, employees, maxPerShift) {
    for (let day = 1; day <= NUMBER_OF_DAYS; day++) {
      for (const emp of employees) {
        // Enforce business rules: Max 5 days a week, Max 1 shift a day
        if (emp.daysWorked >= 5 || emp.daysWorkedSet.has(day)) continue;

        const pref = emp.preferences.has(day)
          ? emp.preferences.get(day)
          : ShiftType.MORNING;

        // Try assigning to preferred shift first
        if (schedule.get(day).get(pref).length < maxPerShift) {
          Scheduler.assignWorkerToShift(schedule, emp, day, pref);
        } else {
          // Conflict Resolution: Find alternative shift for the day
          for (const altShift of Object.values(ShiftType)) {
            if (schedule.get(day).get(altShift).length < maxPerShift) {
              Scheduler.assignWorkerToShift(schedule, emp, day, altShift);
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
   * * @param {Map} schedule The schedule to audit and modify.
   * @param {Array<Employee>} employees The list of employees to pull from for auto-assignment.
   */
  static enforceMinimumShiftCoverage(schedule, employees) {
    for (let day = 1; day <= NUMBER_OF_DAYS; day++) {
      for (const shift of Object.values(ShiftType)) {
        const workers = schedule.get(day).get(shift);

        while (workers.length < 2) {
          let workerAssigned = false;
          for (const emp of employees) {
            if (emp.daysWorked < 5 && !emp.daysWorkedSet.has(day)) {
              workers.push(emp.name + " (Auto-Assigned)");
              emp.daysWorked++;
              emp.daysWorkedSet.add(day);
              workerAssigned = true;
              break;
            }
          }

          // Safety valve: Stop looking if total human capital is exhausted
          if (!workerAssigned) {
            workers.push("[Alert: Short Staffed]");
            break;
          }
        }
      }
    }
  }

  /**
   * Renders the final schedule to the console in a clean, human-readable format.
   * * @param {Map} schedule The completed weekly schedule.
   */
  static displayFormattedSchedule(schedule) {
    console.log("===============================");
    console.log("      WEEKLY SHIFT SCHEDULE    ");
    console.log("===============================");

    for (let day = 1; day <= NUMBER_OF_DAYS; day++) {
      console.log(`\nDay ${day}:`);
      for (const shift of Object.values(ShiftType)) {
        const assignedWorkers = schedule.get(day).get(shift);
        const formattedShiftName =
          shift.charAt(0) + shift.slice(1).toLowerCase();
        const workerList =
          assignedWorkers.length === 0 ? "None" : assignedWorkers.join(", ");

        // Using padEnd to ensure the colons align perfectly, mimicking Java's %-10s
        console.log(`  ${formattedShiftName.padEnd(10, " ")}: ${workerList}`);
      }
    }
  }

  /**
   * Centralized helper method to assign an employee to a shift.
   * This ensures that the schedule and the employee's state tracking variables
   * are always updated together, preventing data synchronization bugs.
   */
  static assignWorkerToShift(schedule, emp, day, shift) {
    schedule.get(day).get(shift).push(emp.name);
    emp.daysWorked++;
    emp.daysWorkedSet.add(day);
  }

  /**
   * Generates seed data for testing the application.
   * * @returns {Array<Employee>} A list of mock employees with pre-defined shift preferences.
   */
  static getEmployees() {
    const employees = [
      new Employee("Arun"),
      new Employee("Bob"),
      new Employee("Charlie"),
      new Employee("Diana"),
      new Employee("Eve"),
      new Employee("Frank"),
    ];
    employees[0].preferences.set(1, ShiftType.MORNING);
    employees[1].preferences.set(1, ShiftType.MORNING);
    employees[2].preferences.set(1, ShiftType.AFTERNOON);
    employees[3].preferences.set(1, ShiftType.AFTERNOON);
    employees[4].preferences.set(1, ShiftType.EVENING);
    employees[5].preferences.set(1, ShiftType.EVENING);
    return employees;
  }
}

// Execute the application
Scheduler.main();
