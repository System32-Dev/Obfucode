# Obfucode
<p>The ultimate script to prevent script kiddies</p>

## Example
```js
// Input:
console.log("Hello, World!");

// Output:
const __f042af52e6a4f5cd=((encoded) => { return encoded.split(/ㅤ/g).map((_item) => { return _item == "" ? _item : String.fromCharCode(_item) }).join("") });
global[atob('Y29uc29sZQ==')][atob('bG9n')](__f042af52e6a4f5cd('\u316472\u3164101\u3164108\u3164108\u3164111\u316444\u316432\u316487\u3164111\u3164114\u3164108\u3164100\u316433'));
```

## Usage

### Node.js, Javascript, and Typescript Usage
```js
/*
	Imports and requirements
*/

// CommonJS
const Obfucode = require("obfucode").Obfucode;
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