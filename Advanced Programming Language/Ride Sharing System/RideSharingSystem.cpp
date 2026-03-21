#include <iostream>
#include <vector>
#include <string>
#include <iomanip>

/**
* Class: Ride
* Author: Arun Kumar
* Description: Base class representing the core attributes and behaviors of a ride.
*/
class Ride {
protected:
   std::string rideID;
   std::string pickupLocation;
   std::string dropoffLocation;
   double distance;
   double fare;

public:
   /**
    * Method: Ride (Constructor)
    */
   Ride(std::string id, std::string pickup, std::string dropoff, double dist)
       : rideID(id), pickupLocation(pickup), dropoffLocation(dropoff), distance(dist), fare(0.0) {}

   virtual ~Ride() {}






   /**
    * Method: calculateFare
    *
    * Description: Virtual method to be overridden by subclasses for specific pricing logic.
    */
   virtual void calculateFare() = 0;

   /**
    * Method: rideDetails
    * Description: Displays basic information about the ride.
    */
   virtual void rideDetails() const {
       std::cout << "[ID: " << rideID << "] " << pickupLocation << " -> " << dropoffLocation
                 << " (" << distance << " miles) | Fare: $" << std::fixed << std::setprecision(2) << fare;
   }

   double getFare() const { return fare; }
};

/**
* Class: StandardRide
* Description: A derived class for basic rides with standard pricing.
*/
class StandardRide : public Ride {
public:
   StandardRide(std::string id, std::string pickup, std::string dropoff, double dist)
       : Ride(id, pickup, dropoff, dist) {}




   /**
    * Method: calculateFare (Override)
    * Description: Standard rate of $1.50 per mile is assumption.
    */
   void calculateFare() override {
       fare = distance * 1.50;
   }

   void rideDetails() const override {
       std::cout << "Standard Ride: ";
       Ride::rideDetails();
       std::cout << std::endl;
   }
};

/**
* Class: PremiumRide
* Description: A derived class for luxury rides with premium pricing.
*/
class PremiumRide : public Ride {
public:
   PremiumRide(std::string id, std::string pickup, std::string dropoff, double dist)
       : Ride(id, pickup, dropoff, dist) {}

   /**
    * Method: calculateFare (Override)
    * Description: Premium rate of $3.50 per mile + $5.00 base fee.
    */
   void calculateFare() override {
       fare = (distance * 3.50) + 5.00;
   }





   void rideDetails() const override {
       std::cout << "Premium Ride: ";
       Ride::rideDetails();
       std::cout << " (Luxury vehicle included)" << std::endl;
   }
};

/**
* Class: Driver
* Author: Arun Kumar
* Description: Represents a driver in the system with a private list of assigned rides.
*/
class Driver {
private:
   std::string driverID;
   std::string name;
   double rating;
   std::vector<Ride*> assignedRides; // Encapsulated list

public:
   /**
    * Method: Driver (Constructor)
    */
   Driver(std::string id, std::string n, double r) : driverID(id), name(n), rating(r) {}

   /**
    * Method: addRide
    * Description: Adds a completed ride to the driver's private list.
    */
   void addRide(Ride* ride) {
       assignedRides.push_back(ride);
   }

   /**
    * Method: getDriverInfo
    * Description: Displays driver details and history.
    */
   void getDriverInfo() const {
       std::cout << "\n--- Driver Profile ---" << std::endl;
       std::cout << "Name: " << name << " | ID: " << driverID << " | Rating: " << rating << "/5.0" << std::endl;
       std::cout << "Completed Rides: " << assignedRides.size() << std::endl;
       for (auto ride : assignedRides) {
           std::cout << " - ";
           ride->rideDetails();
       }
   }
};

/**
* Class: Rider
* Author: Arun Kumar
* Description: Represents a customer who can request and view rides.
*/
class Rider {
private:
   std::string riderID;
   std::string name;
   std::vector<Ride*> requestedRides;

public:
   /**
    * Method: Rider (Constructor)
    */
   Rider(std::string id, std::string n) : riderID(id), name(n) {}



   /**
    * Method: requestRide
    * Description: Adds a new ride request to the rider's history.
    */
   void requestRide(Ride* ride) {
       ride->calculateFare();
       requestedRides.push_back(ride);
   }

   /**
    * Method: viewRides
    * Description: Displays all rides requested by this rider.
    */
   void viewRides() const {
       std::cout << "\n--- Ride History for " << name << " ---" << std::endl;
       for (auto ride : requestedRides) {
           ride->rideDetails();
       }
   }
};

// --- System Demonstration ---
int main() {
   // 1. Initialize Users
   Rider rider1("R-001", "Arun Kumar");
   Driver driver1("D-99", "John Smith", 4.8);

   // 2. Create polymorphic rides
   // Using pointers to demonstrate polymorphism
   std::vector<Ride*> systemRides;
   systemRides.push_back(new StandardRide("S101", "Downtown", "Airport", 15.5));
   systemRides.push_back(new PremiumRide("P202", "Golden Gate", "Silicon Valley", 35.0));

   // 3. Process Rides
   std::cout << "Processing System Rides Polymorphically:" << std::endl;
   for (Ride* r : systemRides) {
       rider1.requestRide(r); // Calculates fare & adds to rider history
       driver1.addRide(r);    // Adds to driver history
   }

   // 4. Display Outputs
   rider1.viewRides();
   driver1.getDriverInfo();

   // 5. Cleanup
   for (Ride* r : systemRides) {
       delete r;
   }

   return 0;
}
