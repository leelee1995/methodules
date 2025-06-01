/**
 * @file modules.js
 * The purpose of this script is to provide essential or useful modules for various use cases.
 * This file is part of the Methodules project, which aims to provide a collection of reusable modules.
 * Contributors can add their own modules to this file.
 *
 * @author leelee1995
 * @version 1.0.0
 * @license MIT
 */

/**
 * @module modules
 * @description - This module provides functions to enforce strict type checking and union type checking on input values.
 * @author leelee1995
 */
const TYPES = Object.freeze({
    "[object String]": String,
    "[object Number]": Number,
    "[object BigInt]": BigInt,
    "[object Null]": null,
    "[object Undefined]": undefined,
    "[object Boolean]": Boolean,
    "[object Symbol]": Symbol,
    "[object Array]": Array,
    "[object Object]": Object,
    "[object Map]": Map,
    "[object RegExp]": RegExp,
    "[object Date]": Date,
    "[object Promise]": Promise,
});

/**
 * @function OPSCall
 * @description - This function returns the type of the input argument as a string.
 * @param {any} arg - Input argument to determine its type.
 * @returns {String} - The type of the input argument as a string.
 * @author leelee1995
 * @since 05/28/2025
 */
function OPSCall(arg) {
    return Object.prototype.toString.call(arg);
}
/**
 * @function throwError
 * @description - This function throws an error with a specified message.
 * @param {String} error
 * @returns {void}
 * @author leelee1995
 * @since 05/28/2025
 */
function throwError(error) {
    throw new Error(error);
}

export function isObject(value) {
    return (
        typeof value === "object" &&
        Object.prototype.toString.call(value) === "[object Object]"
    );
}

/**
 * @function useUnion
 * @description - This function's purpose is to enforce the same type or object given for the new value.
 * @param {any} input - Input is the initial value to be assigned to a variable to be processed.
 * @param {Array} uTypes - Array of data types and object types to enforce input type.
 * @returns {value} - Result
 * @throws {Error} - Throws an error if the input is not of the specified types.
 * @author leelee1995
 * @since 05/28/2025
 */
export const useUnion = (input, uTypes = []) => {
    let value = undefined;

    try {
        // Check if input is of a valid type
        if (!Array.isArray(uTypes)) {
            throwError(`Must provide an array of types.`);
            return undefined;
        }
        // Check if uTypes is not empty
        if (!uTypes.length) {
            throwError(`The array of types must not be empty.`);
            return undefined;
        }
        // Check for duplicates in uTypes
        if (new Set(uTypes).size !== uTypes.length) {
            throwError(`Array uTypes cannot have duplicates.`);
            return undefined;
        }
        // Check if input is of a valid type
        if (typeof input === "function") {
            throwError(
                `New/initial value cannot be a function. If the intended new/initial value is to be a function, use an arrow function. Otherwise, please provide a new/initial primitive or object value.`
            );
            return undefined;
        }
        uTypes.forEach((ut) => {
            // Check if union type (ut) is a valid type
            if (
                !Object.values(TYPES).includes(ut) &&
                typeof ut !== "function"
            ) {
                throwError(
                    `One of the given union type is not any of the primitive, object or constructor function. Please provide a valid type. See https://github.com/leelee1995/methodules for more information.`
                );
                return undefined;
            }
        });
    } catch (error) {
        console.error(error);
    }

    // Iterate through the union types and check if input matches any of them
    for (const ut of uTypes) {
        // Check if input is of the same type as ut
        if (typeof input === "object") {
            if (input === null && ut === null) {
                value = input;
                break;
            }
            if (input.constructor === ut) {
                value = input;
                break;
            }

            continue;
        }

        // Check if input is a primitive type and matches the union type
        if (TYPES[OPSCall(input)] === ut) {
            value = input;
            break;
        }
    }

    return value;
};

/**
 * @function useStrictUnion
 * @description - This function enforces strict type checking on the input value against the specified types in uTypes.
 * @param {any} initial - Initial value to be assigned to a variable to be processed.
 * @param {Array} uTypes - Array of data types and object types to enforce input type.
 * @param {Number} limit - Maximum number of attempts to set the value. Default is Infinity.
 * @returns {any} - Result
 * @throws {Error} - Throws an error if the input is not of the specified types or if the limit is exceeded.
 * @author leelee1995
 * @since 05/28/2025
 */
export const useStrictUnion = (initial, uTypes = [], limit = Infinity) => {
    let attempts = 0;
    let value = initial;

    try {
        // Check if input is of a valid type
        if (!Array.isArray(uTypes)) {
            throwError(`Must provide an array of types.`);
        }
        // Check if uTypes is not empty
        if (!uTypes.length) {
            throwError(`The array of types must not be empty.`);
        }
        // Check for duplicates in uTypes
        if (new Set(uTypes).size !== uTypes.length) {
            throwError(`Array uTypes cannot have duplicates.`);
        }
        // Check if limit is a valid number
        if (typeof limit !== "number" || limit <= 0) {
            throwError(`Limit must be greater than zero.`);
        }
    } catch (error) {
        console.error(error);
    }

    // Sets the new value
    function setValue(newValue) {
        try {
            // Check if newValue matches any of the specified types in uTypes
            if (attempts >= limit) {
                throwError(`Exceeded the maximum number of attempts: ${limit}`);
            }

            attempts++;
            value = useUnion(newValue, uTypes);
        } catch (error) {
            console.error(error);
        }
    }

    function getValue() {
        return value;
    }

    return [getValue, setValue];
};

/**
 * @function keySearch
 * @description - This function searches for a specific key in an object and returns its value.
 * @param {Object} obj - The object to search within.
 * @param {String} key - The key to search for.
 * @returns
 * @author leelee1995
 * @since 05/29/2025
 */
export const keySearch = (obj, key) => {
    // Handle dot notation for nested keys
    if (key.includes(".")) {
        const parts = key.split(".");
        let current = obj;
        for (const part of parts) {
            if (current && typeof current === "object" && part in current) {
                current = current[part];
            } else {
                return undefined;
            }
        }
        return current;
    }

    // Fallback to original recursive search
    for (const k in obj) {
        if (k === key) {
            return obj[k];
        }

        if (typeof obj[k] === "object" && obj[k] !== null) {
            const result = keySearch(obj[k], key);
            if (result !== undefined) {
                return result;
            }
        }
    }

    return undefined;
};

/**
 * @function keySearchAll
 * @description - This function searches for all occurrences of a specific key in an object and returns an array of their values.
 * @param {Object} obj - The object to search within.
 * @param {String} key - The key to search for.
 * @returns
 * @author leelee1995
 * @since 05/29/2025
 */
export const keySearchAll = (obj, key) => {
    const results = [];

    for (const k in obj) {
        if (k === key) {
            results.push(obj[k]);
        }

        if (typeof obj[k] === "object" && obj[k] !== null) {
            const nestedResults = keySearchAll(obj[k], key);
            results.push(...nestedResults);
        }
    }

    return results;
};

/**
 * @function requestData
 * @description - This function fetches data from a given URL and returns the response as JSON.
 * @param {String} url - The URL to fetch data from.
 * @param {Object} options - The options for the fetch request, such as method, headers, body, etc.
 * @returns
 * @author leelee1995
 * @since 05/29/2025
 */
export const requestData = async (url, options = {}) => {
    return await fetch(url, options)
        .then((response) => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .catch((error) => {
            console.error("Fetch error:", error);
            throw error;
        });
};

/**
 * @function keyValueSwitch
 * @description - This function switches the keys and values of an object.
 * @param {Object} obj - The object to switch keys and values.
 * @returns
 * @author leelee1995
 * @since 05/29/2025
 */
export const keyValueSwitch = (obj) => {
    const result = {};
    for (const key in obj) {
        if (obj.hasOwnProperty(key)) {
            result[obj[key]] = key;
        }
    }
    return result;
};

/**
 * @function arrayShuffle
 * @description - This function shuffles the elements of an array in place and returns the shuffled array.
 * @param {Array} arr - The array to shuffle.
 * @returns
 * @author leelee1995
 * @since 05/29/2025
 */
export const arrayShuffle = (arr) => {
    const copy = [...arr]; // Create a copy of the array to avoid modifying the original

    for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return copy;
};
