# Methodules
Relevant/useful reusable methods for JavaScript.

# Installation

`npm i methodules`

# Methods

[`useUnion`](#useunionvalue-any-types-any) - This function will enforce the same type or object given for the new value.

[`useStrictUnion`](#usestrictunionvalue-any-types-any-limit-number) - This function will enforce an initialized variable to use the given types everytime a, initialized variable is set to a new value. (Note: limit is default to `Infinity`).

[`keySearch`](#keysearchobject-any-key-string) - This function will search and return the first matching value.

[`keySearchAll`](#keysearchallobject-any--any-key-string) - This function will search all and return all matching values.

[`requestData`](#requestdataurl-string-option-object) - This function will make any request from a desired API server.

[`keyValueSwitch`](#keyvalueswitchobject-any) - This function will switch all keys and values.

[`arrayShuffle`](#arrayshufflearray-any) - This function will shuffle an array.

# `useUnion(value: any, types: any[])`

First argument is the initial/new value of any type. However, the value cannot be a function, because there are no use-cases or no reasonable use-case to enforce the value. It is best to use an arrow function instead useUnion method if the value is intended to be a function.

Second argument is the array of primitive types (`String`, `Number`, `BigInt`, `null`, etc.) and/or built-in objects (`Date`, `Math`, `Map`, etc.) and/or custom constructor functions.

```
const a = useUnion('hello world', [String]); // returns: 'hello world'
const b = useUnion(2, [String, Number]); // returns: 2
const c = useUnion([1,2,3], [BigInt]); // returns: Undefined
```
Objects

```
const myDate = useUnion(new Date(), [Date]);
const myMap = useUnion(new Map(), [Map]);

console.log(myDate.getFullYear()); // returns current year
console.log(myMap.size); //  returns 0
```

Constructor function

```
function Person (name, age) {
  this.name = name;
  this.age = age;
}

const P1 = useUnion(new Person('Alice', 99), [Person]);
const P2 = useUnion(new Person('John', 34), [Object]); // Will return as undefined

console.log(P1.name); //  Alice
console.log(P2.name); //  TypeError: Cannot read properties of undefined (reading 'name')
```
Use case example:

```
//  index.js

import { fun } from "../fun.js";

fun.createFun(document.getElementByClassName('fun'));


// fun.js

import { useUnion } from "../methodules.js";

function _createFun(htmlcollection)) {

  if (useUnion(htmlcollection, [HTMLCollection]) {
    htmlcollection.forEach(element => {

      const dataColor = useUnion(element.getAttribute('data-color'), [String]));
      const dataHighLight = useUnion(element.getAttribute('data-highlight'), [Boolean]));

      ...
    });
  }
}
const fun = () => {
  return {
    createFun: _createFun(htmlcollection)
  }
}

export default fun;
```

# `useStrictUnion(value: any, types: any[], limit: Number)`

Similar to [useUnion](#useunionvalue-any-types-any) (and also similar to React's hook [useState](https://react.dev/reference/react/useState)), this will be an array deconstructing assignment. Call the first argument to get the current value. Call the second argument to set a value.

```
//  String only
const [value, setValue] = useStrictUnion('hello world', [String]);

console.log(value()); //  'hello world'

setValue(7); // this will error

//  String and Number with a limit of 3 sets
const [alphaNum, setAlphaNum] = useStrictUnion('methodule', [String, Number], 2);

console.log(alphaNum()); //  'methodule'

setAlphaNum(7);

console.log(alphaNum()); //  7

setAlphaNum({name: 'javascript'}); //  this will error
setAlphaNum(8);
setAlphaNum('Error'); // this will error due to number of sets has been exceeded

console.log(alphaNum()); //  alphaNum() should still be Number 8
```

# `keySearch(object: any{}, key: String)`

First argument MUST be an object, and the second will be the search key string.

```
function Person(name, age) {
  this.name = name;
  this.age = age;
}

const p1 = new Person('Alice', 45);

console.log(keySearch(p1, name); //  'Alice'
```

# `keySearchAll(object: any[] | any{}, key: String)`

Like [`keySearch()`](#keysearchobject-any-key-string), this function accepts an array of objects or a complex object, and returns all values of the same key.

```
function Person(name, age) {
  this.name = name;
  this.age = age;
}

const people = [new Person('John', 35), new Person('Jane', 35)];

console.log(keySearchAll(people, name)); //  ['John', 'Jane']
```

# `requestData(url: String, option: Object)`

First argument MUST be a URL string STARTING with 'http://' or 'https://'. Second argument is an object of options to add `headers`, `method`, `body`, etc.

It is highly recommend to use `async` and `await` keywords for this function due to `fetch()` method is promise-based. Using these keywords for readability and error handling.

```
import { requestData } from "../methodules.js"

const data = async () => {
  return await fetchData("https://jsonplaceholder.typicode.com/posts/1", {method: 'GET'});
};

//  Another way
async function getData(url, option) {
  return await fetchData(url, option);
}
```

# `keyValueSwitch(object: any{})`

Self-explanatory. Pass in an object to switch the keys and values. (This will copy the referrenced object).

```
const a = { a: 1, b: 2 };
const b = keyValueSwitch(a);

console.log(a);  //  { a: 1, b: 2 }
console.log(b);  //  { 1: a, 2: b }
```

# `arrayShuffle(array: any[])`

Self-explanatory. Pass in an array to be shuffled. (This will copy the referrenced array).

```
const arr = [1,2,3,4,5];

console.log(arrayShuffle(arr));  //  possibilities: [2,4,3,5,1], [1,3,4,2,5], ...
```
