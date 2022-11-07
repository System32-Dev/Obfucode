import { Obfucode } from '../src/obfucode';
import { writeFileSync } from 'fs';

const _obfoc = new Obfucode({
	platform: "node",
})

var _obfuscated = _obfoc.obfuscate(`
console.log("Hello, World!");
`)

console.log(_obfuscated);

eval(_obfuscated);