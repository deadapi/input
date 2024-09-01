
README.js

# @deadapi/input

A flexible input gathering and validation utility for Node.js. Supports multiple data types, including strings, numbers, arrays, and tuples, with both synchronous and asynchronous modes.

## Installation

To install the `@deadapi/input` package, use npm:

```bash
npm install @deadapi/input
```

## Usage Examples

### Basic Examples

#### Basic String Input:
```javascript
const { input } = require('@deadapi/input');

const name = input("&str", "Enter your name:");
console.log("Your name is:", name);
```
This example prompts the user for a name and ensures that the input is a non-empty string.

#### Integer Input with Default Value:
```javascript
const age = input("&int", "Enter your age:", { defaultValue: "25" });
console.log("Your age is:", age);
```
Here, if the user presses Enter without providing a value, the default value `25` will be used.

### Intermediate Examples

#### Array of Numbers:
```javascript
const numbers = input("&array:num", "Enter a list of numbers (comma-separated):", { defaultValue: "1.1, 2.2, 3.3" });
console.log("Your number array is:", numbers);
```
This example collects an array of numbers from the user. The user can press Enter to accept the default array.

#### Boolean Input:
```javascript
const isConfirmed = input("&bool", "Are you sure? (true/false):", { defaultValue: "true" });
console.log("Confirmation:", isConfirmed);
```
This example asks the user for a boolean value (`true` or `false`), with a default option of `true`.

### Advanced Examples

#### Tuple with Mixed Types:
```javascript
const userInfo = input("&tuple:str|int|bool", "Enter your info (e.g., Name, Age, IsMember):", { defaultValue: "John Doe,30,true" });
console.log("User Information:", userInfo);
```
This advanced example gathers a tuple consisting of a string, an integer, and a boolean from the user.

#### Asynchronous Input Handling:
```javascript
const runAsyncExample = async () => {
  const result = await input("&str", "Enter your input asynchronously:", { defaultValue: "Async Default", isAsync: true });
  console.log("Your async result is:", result);
};

runAsyncExample();
```
Use this when you need to collect input asynchronously, useful in non-blocking environments.

## Contributing

Contributions are welcome! If you want to contribute:

1. Fork the repository.
2. Create a new branch (`git checkout -b feature-branch`).
3. Make your changes.
4. Commit your changes (`git commit -m 'Add new feature'`).
5. Push to the branch (`git push origin feature-branch`).
6. Open a pull request.

Please make sure your code follows the established coding style.

## License

This project is licensed under the MIT License.
