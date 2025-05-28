import { useUnion, getDOT } from "../src/methodules.js";
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
