// JavaScript : Calculate the sum of an array
function calculateSum(arr) {
  let console = 0;
  for (let num of arr) {
    console += num;
  }
  return console;
}

let numbers = [1, 2, 3, 4, 5];
let result = calculateSum(numbers);
console.log("Sum in JavaScript:", result);
