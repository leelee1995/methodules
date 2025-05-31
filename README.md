# Methodules
Relevant/useful reusable methods for JavaScript. Documents of methods are listed and linked below:

# Methods

`useUnion(value: any, types: any[])` - This function will enforce the same type or object given for the new value.

`useStrictUnion(value: any, types: any[], limit: Number)` - This function will enforce an initialized variable to use the given types everytime a, initialized variable is set to a new value. (Note: limit is default to `Infinity`).

`keySearch(object: any{}, key: String)` - This function will search and return the first matching value.

`keySearchAll(object: any{}, key: String)` - This function will search all and return all matching values.

`requestData(url: String, option: any{})` - This function will make any request from a desired API server.

`keyValueSwitch(object: any{})` - This function will switch all keys and values.

`arrayShuffle(array: any[])` - This function will shuffle an array.

# Usage

## `useUnion(value: any, types: any[])`

The first argument will be any value to be assigned, and the array will be any type to be enforced. Types are: String, Number, BigInt, Boolean, Array, Symbol, null and undefined.

```
const text = useUnion('hello world', [String]); // returns: 'hello world'

for (let arg of [1, 'methodules', 5n]) console.log(useUnion(arg, [String, Number]));

// 1st: 1
// 2nd: methodules
// 3rd: Error
```

The types array can have customer objects and arrays.

```
function Person (name, age) {
  this.name = name;
  this.age = age;
}

const P1 = useUnion(new Person('Alice', 99), [Object]);


