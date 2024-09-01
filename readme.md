# @deadapi/input

A flexible input gathering and validation utility for Node.js. Supports multiple data types, including strings, numbers, arrays, tuples, and more, with both synchronous and asynchronous modes.

## Installation

To install the `@deadapi/input` package, use npm:

```bash
npm install @deadapi/input
```

## Usage

### Basic Examples

#### String Input:
```javascript
const { input } = require('@deadapi/input');
const name = input("&str", "Enter your name:");
console.log("Your name is:", name);
```

#### Integer Input with Default:
```javascript
const age = input("&int", "Enter your age:", { defaultValue: "25" });
console.log("Your age is:", age);
```

### Intermediate Examples

#### Array of Numbers:
```javascript
const numbers = input("&array:num", "Enter numbers (comma-separated):", { defaultValue: "1.1,2.2,3.3" });
console.log("Your number array is:", numbers);
```

#### Boolean Input:
```javascript
const isConfirmed = input("&bool", "Are you sure? (true/false):", { defaultValue: "true" });
console.log("Confirmation:", isConfirmed);
```

### Advanced Examples

#### Tuple with Mixed Types:
```javascript
const userInfo = input("&tuple:str|int|bool", "Enter info (comma-separated, e.g., Name, Age, IsMember):", { defaultValue: "John Doe,30,true" });
console.log("User Information:", userInfo);
```

#### Asynchronous Input:
```javascript
const runAsyncExample = async () => {
const result = await input("&str", "Enter input asynchronously:", { defaultValue: "Async Default", isAsync: true });
console.log("Your async result is:", result);
};
runAsyncExample();
```

## Input Types

- `&str`: String
- `&int`: Integer
- `&float`: Float
- `&num`: Number (float or int)
- `&bool`: Boolean
- `&date`: Date
- `&array:type`: Array of specified type (e.g., `&array:int`)
- `&tuple:type|type|...`: Tuple with specified types (e.g., `&tuple:str|int|bool`)
- `&ip`: IP Address
- `&url`: URL
- `&email`: Email
- `&uuid`: UUID
- `&hexColor`: Hex Color Code
- `&creditCard`: Credit Card Number (use responsibly, for valid purposes only)

## Disclaimer for Credit Card Input

The `&creditCard` type is provided for educational purposes and should only be used for legitimate and secure handling of credit card information. The package author is not responsible for any misuse or consequences related to the use of this feature. Ensure compliance with relevant regulations and standards when handling sensitive information.

## Contributing

Contributions are welcome! Fork the repository, create a feature branch, make your changes, and open a pull request.

## License

Licensed under the MIT License.
