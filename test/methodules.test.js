import {
    useUnion,
    useStrictUnion,
    keySearch,
    keySearchAll,
    requestData,
    keyValueSwitch,
    arrayShuffle,
} from "../src/methodules.js";

/**
 * Function: useUnion(any, {object | function}[]);
 */

//  -- String --
test('Sets variable to a primitive string. uTypes: ["string"]', () => {
    const s = useUnion("hello", ["string"]);

    expect(s).toBeUndefined();
});
test("Sets variable to a primitive string. uTypes: [String]", () => {
    const s = useUnion("hello", [String]);

    expect(Object.prototype.toString.call(s)).toEqual("[object String]");
    expect(s).toBe("hello");
});

//  -- Number --
test("Sets variable to a primitive number. uTypes: [Number]", () => {
    const n = useUnion(5, [Number]);

    expect(Object.prototype.toString.call(n)).toEqual("[object Number]");
    expect(n).toBe(5);
});

//  -- BigInt --
test("Sets variable to a primitive bigint. uTypes: [BigInt]", () => {
    const n = useUnion(5n, [BigInt]);

    expect(Object.prototype.toString.call(n)).toEqual("[object BigInt]");
    expect(n).toBe(5n);
});
//  -- Function --
test("Sets variable to sum function. uType: [sum]", () => {
    function sum(x, y) {
        return x + y;
    }

    const f = useUnion(sum, [sum]);

    expect(Object.prototype.toString.call(f)).toEqual("[object Function]");
    expect(f).toEqual(sum);
});
test("Sets variable to subtract function. uType: [subtract]", () => {
    const subtract = (a, b) => {
        return a - b;
    };

    const f = useUnion(subtract, [subtract]);

    expect(Object.prototype.toString.call(f)).toEqual("[object Function]");
    expect(f).toEqual(subtract);
});

//  -- Undefined --
test("Sets variable to undefined. uType: [undefined]", () => {
    const u = useUnion(undefined, [undefined]);

    expect(u).toBeUndefined();
});

//  -- Null --
test("Sets variable to null. uType: [null]", () => {
    const nu = useUnion(null, [null]);

    expect(nu).toBeNull();
});

//  -- Boolean --
test("Sets variable to a boolean. uTypes: [Boolean]", () => {
    const b = useUnion(true, [Boolean]);

    expect(b).not.toBeUndefined();
    expect(typeof b).toEqual("boolean");
    expect(b).toBeTruthy();
});

//  -- Array --
test("Sets variable to a string array. uType: [Array]", () => {
    const arr = useUnion(["hello", "world"], [Array]);

    expect(arr).not.toBeUndefined();
    expect(Object.prototype.toString.call(arr)).toEqual("[object Array]");
    expect(arr).toEqual(["hello", "world"]);
});
test("Sets variable to a string array, test. uType: [test]", () => {
    const test = ["hello", "world"];
    const arr = useUnion(test, [test]);

    expect(arr).not.toBeUndefined();
    expect(Object.prototype.toString.call(arr)).toEqual("[object Array]");
    expect(arr).toEqual(test);
});

//  -- Multi union types --

//  TRUTHY
test("Sets variable to a string. uTypes: [Array, String]", () => {
    const s = useUnion("javascript", [Array, String]);

    expect(Object.prototype.toString.call(s)).not.toEqual("[object Array]");
    expect(Object.prototype.toString.call(s)).toEqual("[object String]");
    expect(s).toBe("javascript");
});
test("Sets variable to a string array, test. uType: [test, String]", () => {
    const test = ["hello", "world"];

    const arr = useUnion(test, [test, String]);

    expect(Object.prototype.toString.call(arr)).not.toEqual("[object String]");
    expect(Object.prototype.toString.call(arr)).toEqual("[object Array]");
    expect(arr).toEqual(test);
});

//  FALSEY
test("Sets variable to a number. uTypes: [Array, String]", () => {
    const n = useUnion(2, [Array, String]);

    expect(Object.prototype.toString.call(n)).not.toEqual("[object Array]");
    expect(Object.prototype.toString.call(n)).not.toEqual("[object String]");
    expect(n).toBeUndefined();
});
test("Sets variable to String function, test. uType: [test, String]", () => {
    const test = ["hello", "world"];

    const arr = useUnion(String, [test, String]);

    expect(Object.prototype.toString.call(arr)).not.toEqual("[object Array]");
    expect(Object.prototype.toString.call(arr)).not.toEqual("[object String]");
    expect(arr).not.toEqual(test);
    expect(arr).toEqual(String);
});

/**
 * Function: useStrictUnion(any, {object | function}[], limit = Infinity)
 */
test("Sets variable to a string. uTypes: [Array, String], limit: 1", () => {
    const [value, setValue] = useStrictUnion("javascript", [Array, String], 1);

    expect(Object.prototype.toString.call(value())).not.toEqual(
        "[object Array]"
    );
    expect(Object.prototype.toString.call(value())).toEqual("[object String]");
    expect(value()).toEqual("javascript");

    setValue("hello");
    expect(Object.prototype.toString.call(value())).not.toEqual(
        "[object Array]"
    );
    expect(Object.prototype.toString.call(value())).toEqual("[object String]");
    expect(value()).toEqual("hello");

    setValue(["world"]);
    expect(Object.prototype.toString.call(value())).not.toEqual(
        "[object Array]"
    );
    expect(Object.prototype.toString.call(value())).toEqual("[object String]");
    expect(value()).toEqual("hello");
});

/**
 * Function: keySearch(object, string)
 */
test("Searches for a key in an object", () => {
    const obj = {
        name: "Example",
        age: 42,
        isActive: true,
        tags: ["js", "test", "object"],
        meta: {
            created: "2025-05-29",
            updated: "2025-05-29",
            nested: {
                flag: false,
                values: [1, 2, 3],
            },
        },
        data: [
            { id: 1, value: "a" },
            { id: 2, value: "b" },
        ],
        date: new Date("2025-05-29T00:00:00Z"),
        nullProp: null,
        undefinedProp: undefined,
    };

    const name = keySearch(obj, "name");
    expect(name).toBe("Example");

    const created = keySearch(obj, "meta.created");
    expect(created).toBe("2025-05-29");

    const flag = keySearch(obj, "meta.nested.flag");
    expect(flag).toBe(false);
});

/**
 * Function: keySearchAll(object, string)
 */
test("Searches for all keys in an object", () => {
    const obj = {
        name: "Example",
        age: 42,
        isActive: true,
        tags: ["js", "test", "object"],
        meta: {
            created: "2025-05-29",
            updated: "2025-05-29",
            nested: {
                flag: false,
                values: [1, 2, 3],
            },
        },
        data: [
            { id: 1, value: "a" },
            { id: 2, value: "b" },
        ],
        date: new Date("2025-05-29T00:00:00Z"),
        nullProp: null,
        undefinedProp: undefined,
    };

    const ids = keySearchAll(obj, "id");
    expect(ids).toEqual([1, 2]);

    const values = keySearchAll(obj, "value");
    expect(values).toEqual(["a", "b"]);
});

/**
 * Function: requestData(url, options)
 */

test("Fetches data from a URL", async () => {
    const url = "https://jsonplaceholder.typicode.com/posts/1";
    const options = { method: "GET" };

    const data = await requestData(url, options);
    expect(data).toHaveProperty("id");
    expect(data.id).toBe(1);
    expect(data).toHaveProperty("title");
});

/**
 * Function: keyValueSwitch(object, string, any)
 */

test("Switches keys and values in an object", () => {
    const obj = {
        a: 1,
        b: 2,
        c: 3,
    };

    const switched = keyValueSwitch(obj);
    expect(switched).toEqual({
        1: "a",
        2: "b",
        3: "c",
    });

    const objWithDuplicates = {
        a: 1,
        b: 2,
        c: 2,
    };

    const switchedWithDuplicates = keyValueSwitch(objWithDuplicates);
    expect(switchedWithDuplicates).toEqual({
        1: "a",
        2: "c", // Last occurrence of the duplicate key
    });
});

/**
 * Function: arrayShuffle(array)
 */

test("Shuffles an array", () => {
    const arr = [1, 2, 3, 4, 5];
    const shuffled = arrayShuffle(arr);

    expect(shuffled).not.toEqual(arr); // The shuffled array should not be the same as the original
    expect(shuffled.length).toBe(arr.length); // The length should remain the same

    // Check if all elements are still present
    expect(shuffled.sort()).toEqual(arr.sort());
});
