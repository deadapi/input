const syncPrompt = require("syncprompt");
const readline = require("readline");
const { v4: uuidv4, validate: uuidValidate } = require("uuid");
const validator = require("validator");

// Regular expressions for types
const phoneRegex = /^\+?[1-9]\d{1,14}$/;
const urlRegex = /^(https?:\/\/)?([\w\d\-_]+\.)+[\w\d\-_]+(\/[\w\d\-_]*)*$/;
const ipRegex =
  /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
const hexColorRegex = /^#([0-9A-Fa-f]{6}|[0-9A-Fa-f]{3})$/;
const creditCardRegex = /^(\d{4}[- ]?){3}\d{4}$/; // Simplified for example purposes

function input(typeString, promptStr, options = {}) {
  const promptMessage = promptStr.replace(/{}/g, "");

  const typeHandlers = {
    str: (input) => {
      const trimmedInput = validator.trim(input);
      if (validator.isEmpty(trimmedInput)) {
        throw new Error("Invalid string. Please enter a non-empty string.");
      }
      return trimmedInput;
    },
    int: (input) => {
      const trimmedInput = validator.trim(input);
      if (!validator.isInt(trimmedInput)) {
        throw new Error("Invalid integer. Please enter a valid integer.");
      }
      return parseInt(trimmedInput, 10);
    },
    float: (input) => {
      const trimmedInput = validator.trim(input);
      if (!validator.isFloat(trimmedInput)) {
        throw new Error(
          "Invalid float. Please enter a valid floating-point number.",
        );
      }
      return parseFloat(trimmedInput);
    },
    num: (input) => {
      const trimmedInput = validator.trim(input);
      if (!validator.isFloat(trimmedInput)) {
        throw new Error("Invalid number. Please enter a valid number.");
      }
      return parseFloat(trimmedInput);
    },
    bool: (input) => {
      const lowerInput = validator.trim(input).toLowerCase();
      if (lowerInput === "true") return true;
      if (lowerInput === "false") return false;
      throw new Error("Invalid boolean. Please enter 'true' or 'false'.");
    },
    date: (input) => {
      const trimmedInput = validator.trim(input);
      const date = new Date(trimmedInput);
      if (isNaN(date.getTime())) {
        throw new Error("Invalid date. Please enter a valid date.");
      }
      return date;
    },
    email: (input) => {
      const sanitizedInput = validator.normalizeEmail(validator.trim(input));
      if (!validator.isEmail(sanitizedInput)) {
        throw new Error("Invalid email. Please enter a valid email address.");
      }
      return sanitizedInput;
    },
    url: (input) => {
      const trimmedInput = validator.trim(input);
      if (!urlRegex.test(trimmedInput)) {
        throw new Error("Invalid URL. Please enter a valid URL.");
      }
      return trimmedInput;
    },
    uuid: (input) => {
      const trimmedInput = validator.trim(input);
      if (!uuidValidate(trimmedInput)) {
        throw new Error("Invalid UUID. Please enter a valid UUID.");
      }
      return trimmedInput;
    },
    array: (input, itemType) => {
      const arr = validator
        .trim(input)
        .split(",")
        .map((item) => validator.trim(item));
      if (itemType) {
        const itemHandler = typeHandlers[itemType];
        arr.forEach((item) => {
          if (!itemHandler) throw new Error("Unsupported item type.");
          try {
            itemHandler(item);
          } catch {
            throw new Error(
              "Invalid array item. Ensure each item is correctly formatted.",
            );
          }
        });
      }
      return arr;
    },
    tuple: (input, itemTypes) => {
      const arr = validator
        .trim(input)
        .split(",")
        .map((item) => validator.trim(item));
      if (arr.length !== itemTypes.length) {
        throw new Error(
          `Invalid tuple. Expected a tuple of length ${itemTypes.length}.`,
        );
      }
      arr.forEach((item, index) => {
        const itemType = itemTypes[index];
        const itemHandler = typeHandlers[itemType];
        if (!itemHandler) throw new Error("Unsupported item type.");
        try {
          itemHandler(item);
        } catch {
          throw new Error(
            `Invalid item at index ${index}. Ensure the item is correctly formatted.`,
          );
        }
      });
      return arr;
    },
    time: (input) => {
      const trimmedInput = validator.trim(input);
      const timePattern = /^([01]?[0-9]|2[0-3]):([0-5][0-9])(:([0-5][0-9]))?$/;
      if (!timePattern.test(trimmedInput)) {
        throw new Error(
          "Invalid time format. Please enter time in HH:MM or HH:MM:SS format.",
        );
      }
      return trimmedInput;
    },
    ip: (input) => {
      const trimmedInput = validator.trim(input);
      if (!ipRegex.test(trimmedInput)) {
        throw new Error("Invalid IP address. Please enter a valid IP address.");
      }
      return trimmedInput;
    },
    hexColor: (input) => {
      const trimmedInput = validator.trim(input);
      if (!hexColorRegex.test(trimmedInput)) {
        throw new Error(
          "Invalid hex color code. Please enter a valid hex color code (e.g., #RRGGBB).",
        );
      }
      return trimmedInput;
    },
    creditCard: (input) => {
      const cardNumber = validator.trim(input).replace(/\D/g, "");
      if (!creditCardRegex.test(cardNumber) || !isValidCreditCard(cardNumber)) {
        throw new Error(
          "Invalid credit card number. Please enter a valid credit card number.",
        );
      }
      return cardNumber;
    },
    enum: (input, options) => {
      const trimmedInput = validator.trim(input);
      if (!options.includes(trimmedInput)) {
        throw new Error(
          `Invalid option. Valid options are: ${options.join(", ")}.`,
        );
      }
      return trimmedInput;
    },
    regex: (input, pattern) => {
      const trimmedInput = validator.trim(input);
      const regex = new RegExp(pattern);
      if (!regex.test(trimmedInput)) {
        throw new Error(
          "Input does not match the pattern. Please ensure the input matches the expected pattern.",
        );
      }
      return trimmedInput;
    },
    positive: (input) => {
      const number = parseFloat(validator.trim(input));
      if (isNaN(number) || number <= 0) {
        throw new Error(
          "Must be a positive number. Please enter a number greater than zero.",
        );
      }
      return number;
    },
    negative: (input) => {
      const number = parseFloat(validator.trim(input));
      if (isNaN(number) || number >= 0) {
        throw new Error(
          "Must be a negative number. Please enter a number less than zero.",
        );
      }
      return number;
    },
  };

  const handleExit = (input) => {
    if (validator.trim(input).toLowerCase() === "q") {
      console.log("Exiting...");
      process.exit(0);
    }
    return input;
  };

  const handleInput = (input) => {
    input = handleExit(input);

    // If input is empty and defaultValue is provided, return the defaultValue
    if (
      validator.isEmpty(validator.trim(input)) &&
      options.defaultValue !== undefined
    ) {
      return options.defaultValue;
    }

    // Otherwise, process the input
    const [baseType, ...extraTypes] = typeString.replace(/^&/, "").split(":");

    if (typeof typeHandlers[baseType] !== "function") {
      throw new Error(`Type handler for '${baseType}' is not a function.`);
    }

    if (baseType === "array" || baseType === "tuple") {
      return typeHandlers[baseType](
        input,
        extraTypes[0] ? extraTypes[0].split("|") : undefined,
      );
    }

    return typeHandlers[baseType](input, ...extraTypes);
  };

  const repromptSync = () => {
    while (true) {
      try {
        const userInput = syncPrompt(promptMessage);
        return handleInput(userInput);
      } catch (error) {
        console.error(`${error.message} To exit, press Ctrl+C or type 'q'.`);
      }
    }
  };

  const repromptAsync = async (rl) => {
    while (true) {
      try {
        const answer = await new Promise((resolve) => {
          rl.question(promptMessage, resolve);
        });
        const result = handleInput(answer);
        rl.close();
        return result;
      } catch (error) {
        console.error(`${error.message} To exit, press Ctrl+C or type 'q'.`);
      }
    }
  };

  if (options.isAsync) {
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });
    return repromptAsync(rl);
  } else {
    return repromptSync();
  }
}

// Simple Luhn's Algorithm for credit card validation
function isValidCreditCard(number) {
  let sum = 0;
  let shouldDouble = false;
  for (let i = number.length - 1; i >= 0; i--) {
    let digit = parseInt(number.charAt(i), 10);
    if (shouldDouble) {
      digit *= 2;
      if (digit > 9) digit -= 9;
    }
    sum += digit;
    shouldDouble = !shouldDouble;
  }
  return sum % 10 === 0;
}

module.exports.input = input;
