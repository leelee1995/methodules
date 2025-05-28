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
 * @description - This function checks if the input matches any of the specified types in uTypes.
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
 * @function useRID
 * @description - This function generates a random ID of a specified length and character type.
 * @param {Number} limit - The length of the generated random ID. Default is 14.
 * @param {String} charType - The type of characters to include in the ID. Options are "alphanumeric", "numeric", or "alpha". Default is "alphanumeric".
 * @returns
 * @author leelee1995
 * @since 05/28/2025
 */
export const useRID = (limit = 14, charType = "alphanumeric") => {
    // Validate the character type
    if (typeof limit !== "number" || limit <= 0) {
        throwError(`Limit must be greater than zero.`);
    }

    const chars =
        {
            alphanumeric:
                "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789",
            numeric: "0123456789",
            alpha: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz",
        }[charType] || chars.alphanumeric;

    let result = "";

    for (let i = 0; i < limit; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
    }

    return result;
};
