import * as yargs from 'yargs';
import { resolve } from 'path';
import { writeFileSync, readFileSync } from 'fs';
import { Obfucode } from './src/obfucode';
export default function __cli() {
	let args = yargs
		.option('platform', {
			alias: 'p',
			description: "Set the obfuscated script target platform.",
			demand: false
		})
		.option('output', {
			alias: 'o',
			description: "Write to an output file.",
			demand: false
		})
		.option('file', {
			alias: 'f',
			description: "Obfuscate a file.",
			demand: false
		}).argv;

	if (args.file) {
		var platform = (args.platform || "node");
		try {
			var _file = readFileSync(resolve(args.file), "utf-8");
			var obfuscator = new Obfucode({
				platform: platform
			})
			var result = obfuscator.obfuscate(_file);
			if (args.output) {
				writeFileSync(resolve(args.output), result);
			} else {
				console.log(result);
			}
		} catch (e:any) {
			console.log(e.message);
		}
	}
}