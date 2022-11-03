# Obfucode
<p>The ultimate script to prevent script kiddies</p>

## Example
```js
// Input:
console.log("Hello World!");

// Output:
global[atob("Y29uc29sZQ==")][atob("bG9n")](atob("SGVsbG8gV29ybGQh"));
```

## Usage
```js
/*
	Imports and requirements
*/

// CommonJS
const Obfucode = require("obfucode");
// EMCAScript
import { Obfucode } from 'obfucode';

/*
	Obfuscation Usage Example
*/

const obfuscator = new Obfucode({
	// Choose target platform for obfucation
	platform: "node", // eg. browser
})

const script = `
console.log("Shhhh! >:D");
`;
// Do something with this!
obfuscator.obfuscate(script);
```