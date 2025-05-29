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
        const tvs = Object.values(TYPES); //  Type values
        const ots = ["function", "object"]; // Object types
        const it = TYPES[OPSCall(input)]; //  Input type

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

        for (const ut of uTypes) {
            // Check if ut is a valid type
            if (!tvs[ut] && !ots.includes(typeof ut)) {
                throwError(
                    `The input union type(s) MUST have an array of: String, Number, BigInt, null, undefined, Boolean, Symbol and/or Array (and/or custom Arrays and/or custom Objects). See https://github.com/leelee1995/methodules`
                );
            }

            // Check if input matches the type in uTypes
            if (it === ut || (ots.includes(typeof ut) && input === ut))
                value = input;
        }
    } catch (error) {
        console.error(error);
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

        function setValue(newValue) {
            // Check if newValue matches any of the specified types in uTypes
            if (attempts >= limit) {
                throwError(`Exceeded the maximum number of attempts: ${limit}`);
            }
            value = useUnion(newValue, uTypes);
            attempts++;
        }
    } catch (error) {
        console.error(error);
    }

    return [value, setValue];
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
    try {
        if (OPSCall(obj) !== "[object Object]") {
            throwError("The first argument must be an object.");
        }
        if (!key && typeof key !== "string") {
            throwError("The second argument must be a string.");
        }
    } catch (error) {
        console.error(error);
        return undefined;
    }

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
    try {
        if (OPSCall(obj) !== "[object Object]") {
            throwError("The first argument must be an object.");
        }
        if (!key && typeof key !== "string") {
            throwError("The second argument must be a string.");
        }
    } catch (error) {
        console.error(error);
        return [];
    }

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
 * @function valueSearch
 * @description - This function searches for a specific value in an object and returns the first key that matches.
 * @param {Object} obj - The object to search within.
 * @param {any} value - The value to search for.
 * @returns
 * @author leelee1995
 * @since 05/29/2025
 */
export const valueSearch = (obj, value) => {
    try {
        if (OPSCall(obj) !== "[object Object]") {
            throwError("The first argument must be an object.");
        }
        if (value === undefined) {
            throwError("The second argument must not be undefined.");
        }
    } catch (error) {
        console.error(error);
        return undefined;
    }

    for (const k in obj) {
        if (obj[k] === value) {
            return k;
        }

        if (typeof obj[k] === "object" && obj[k] !== null) {
            const result = valueSearch(obj[k], value);
            if (result !== undefined) {
                return result;
            }
        }
    }

    return undefined;
};

/**
 * @function valueSearchAll
 * @description - This function searches for all occurrences of a specific value in an object and returns an array of their keys.
 * @param {Object} obj - The object to search within.
 * @param {String} value
 * @returns
 * @author leelee1995
 * @since 05/29/2025
 */
export const valueSearchAll = (obj, value) => {
    try {
        if (OPSCall(obj) !== "[object Object]") {
            throwError("The first argument must be an object.");
        }
        if (value === undefined) {
            throwError("The second argument must not be undefined.");
        }
    } catch (error) {
        console.error(error);
        return [];
    }

    const results = [];

    for (const k in obj) {
        if (obj[k] === value) {
            results.push(k);
        }

        if (typeof obj[k] === "object" && obj[k] !== null) {
            const nestedResults = valueSearchAll(obj[k], value);
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
    try {
        if (typeof url !== "string" || !url) {
            throw new Error("URL must be a non-empty string.");
        }
        if (!url.match(/^http[s]?:\/\//g)) {
            throw new Error("URL must start with http:// or https://.");
        }
        if (typeof options !== "object" || options === null) {
            throw new Error("Options must be a valid object.");
        }
    } catch (error) {
        console.error("Invalid parameters:", error);
        return [];
    }

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
    try {
        if (OPSCall(obj) !== "[object Object]") {
            throwError("The argument must be an object.");
        }
    } catch (error) {
        console.error(error);
        return {};
    }

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
    try {
        if (!Array.isArray(arr)) {
            throwError("The argument must be an array.");
        }
    } catch (error) {
        console.error(error);
        return [];
    }

    for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
};
