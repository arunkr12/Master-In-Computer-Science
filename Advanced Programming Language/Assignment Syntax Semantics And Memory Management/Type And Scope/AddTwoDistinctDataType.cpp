#include <iostream>
#include <string>

// C++ requires type declaration in the function signature
void addValues(int val1, std::string val2) {
	// This line causes a COMPILE-TIME ERROR.

	std::cout << "Error: Compiler prevents adding int and string directly." << std::endl;
}

int main() {
	int num = 10;
	std::string text = "20";

	addValues(num, text);
	return 0;
}