# Methodules
Relevant/useful reusable methods for JavaScript. Documents of methods are listed and linked below:

# Methods

[`useUnion`](useunion) - This function will enforce the same type or object given for the new value.

[`useStrictUnion(value: any, types: any[], limit: Number)`](usestrictunion) - This function will enforce an initialized variable to use the given types everytime a, initialized variable is set to a new value. (Note: limit is default to `Infinity`).

`keySearch(object: any{}, key: String)` - This function will search and return the first matching value.

`keySearchAll(object: any{}, key: String)` - This function will search all and return all matching values.

`requestData(url: String, option: any{})` - This function will make any request from a desired API server.

`keyValueSwitch(object: any{})` - This function will switch all keys and values.

`arrayShuffle(array: any[])` - This function will shuffle an array.

# [useunion]`useUnion(value: any, types: any[])`

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
Use case examples:

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

# [usestrictunion]`useStrictUnion(value: any, types: any[], limit: Number)`

Similar to [useUnion](useunion), but this will be an array deconstructing assignment.

```
const [value, setValue] = useStrictUnion('hello world', [String]);

console.log(value()); //  'hello world'

set
