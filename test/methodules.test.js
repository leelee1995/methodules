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

test("Setting variable to various values. Union types: String, Number, BigInt, Symbol, Array, Map, Date, Object, null and undefined", () => {
    //  String
    let value = useUnion("javascript", [String]);

    expect(value).not.toBeUndefined();
    expect(Object.prototype.toString.call(value)).toEqual("[object String]");
    expect(value).toEqual("javascript");

    //  Number
    value = useUnion(42, [Number]);

    expect(value).not.toBeUndefined();
    expect(Object.prototype.toString.call(value)).toEqual("[object Number]");
    expect(value).toEqual(42);

    //  String and Number
    value = useUnion("Hello World", [String, Number]);

    expect(value).not.toBeUndefined();
    expect(Object.prototype.toString.call(value)).toEqual("[object String]");
    expect(value).toEqual("Hello World");

    value = useUnion(123, [String, Number]);

    expect(value).not.toBeUndefined();
    expect(Object.prototype.toString.call(value)).toEqual("[object Number]");
    expect(value).toEqual(123);

    //  BigInt
    value = useUnion(BigInt(123456789), [BigInt]);

    expect(value).not.toBeUndefined();
    expect(Object.prototype.toString.call(value)).toEqual("[object BigInt]");
    expect(value).toEqual(BigInt(123456789));

    //  Symbol
    value = useUnion(Symbol("unique"), [Symbol]);
    expect(value).not.toBeUndefined();
    expect(Object.prototype.toString.call(value)).toEqual("[object Symbol]");
    expect(value.toString()).toEqual("Symbol(unique)");

    //  Array
    value = useUnion([1, 2, 3], [Array]);
    expect(value).not.toBeUndefined();
    expect(Object.prototype.toString.call(value)).toEqual("[object Array]");
    expect(value).toEqual([1, 2, 3]);

    //  Map
    value = useUnion(
        new Map([
            ["key1", "value1"],
            ["key2", "value2"],
        ]),
        [Map]
    );
    expect(value).not.toBeUndefined();
    expect(Object.prototype.toString.call(value)).toEqual("[object Map]");
    expect(value.get("key1")).toEqual("value1");
    expect(value.get("key2")).toEqual("value2");
    expect(value.size).toEqual(2);

    //  Date
    const date = new Date("2025-05-29T00:00:00Z");
    value = useUnion(date, [Date]);
    expect(value).not.toBeUndefined();
    expect(Object.prototype.toString.call(value)).toEqual("[object Date]");
    expect(value.toISOString()).toEqual("2025-05-29T00:00:00.000Z");
    expect(value.getFullYear()).toEqual(2025);

    //  Object
    value = useUnion({ key: "value" }, [Object]);
    expect(value).not.toBeUndefined();
    expect(Object.prototype.toString.call(value)).toEqual("[object Object]");
    expect(value.key).toEqual("value");

    //  null
    value = useUnion(null, [null]);
    expect(value).toBeNull();
    expect(Object.prototype.toString.call(value)).toEqual("[object Null]");

    //  undefined
    value = useUnion(undefined, [undefined]);
    expect(value).toBeUndefined();
    expect(Object.prototype.toString.call(value)).toEqual("[object Undefined]");

    //  Constructor function
    function Person(name, age) {
        this.name = name;
        this.age = age;
    }

    value = useUnion(new Person("Alice", 30), [Person]);
    expect(value).not.toBeUndefined();
    expect(Object.prototype.toString.call(value)).toEqual("[object Object]");
    expect(value.name).toEqual("Alice");
    expect(value.age).toEqual(30);

    //  Custom array
    const customArray = [1, 2, 3];

    value = useUnion([...customArray], [Array]);
    expect(value).not.toBeUndefined();
    expect(Object.prototype.toString.call(value)).toEqual("[object Array]");
    expect(value).toEqual(customArray);
    expect(value.length).toEqual(3);

    //  Falsey - this should throw an error
    value = useUnion(new Person("Bob", 25), [Object]);
    expect(value).toBeUndefined();
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

    // Set to string
    setValue("hello");
    expect(Object.prototype.toString.call(value())).not.toEqual(
        "[object Array]"
    );
    expect(Object.prototype.toString.call(value())).toEqual("[object String]");
    expect(value()).toEqual("hello");

    // Set to an array - this should throw an error
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
