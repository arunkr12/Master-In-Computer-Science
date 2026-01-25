#include <iostream>

void manualAllocation() {
    // Allocate memory on the heap
    int* ptr = new int(42);
    std::cout << "Allocated value: " << *ptr << std::endl;

    // MANUAL RELEASE: Critical step - Explictly delete keyword
    delete ptr;

    // Danger: ptr is now a "dangling pointer."
    // Accessing *ptr here would crash or corrupt data.
    std::cout << "Memory freed manually." << std::endl;
}

int main() {
    manualAllocation();
    return 0;
}
