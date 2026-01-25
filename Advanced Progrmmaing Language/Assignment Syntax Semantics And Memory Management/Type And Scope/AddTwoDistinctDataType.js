function addTwoDistinctValues(val1, val2) {
  console.log(`Attempting to add ${typeof val1} and ${typeof val2}`);

  // JS will coerce the number 10 into the string "10" and concatenate
  let result = val1 + val2;

  console.log(`Result: ${result}`);
  console.log(`Result Type: ${typeof result}`);
}

// Main execution
let num = 10;
let text = "20";
addTwoDistinctValues(num, text);
