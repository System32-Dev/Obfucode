import { parse, parseScript } from 'meriyah';
import { generate } from 'esotope-hammerhead';
import { randomBytes } from "node:crypto";

class Obfucode {
	// @ts-ignore
	__funcRep: any = {};
	// @ts-ignore
	__varsRep: any = {};
	// @ts-ignore
	__config: any = { platform: "node" };
	// @ts-ignore
	__hex: any = randomBytes(8).toString("hex");

	get __tempConfig() {
		return {
			decoderHex: "__" + this.__hex
		}
	}

	get __inject() {
		return `const ${this.__tempConfig.decoderHex}=((encoded) => { return encoded.split(/\u3164/g).map((_item) => { return _item == "" ? _item : String.fromCharCode(_item) }).join("") });`;
	}

	get __functions() {
		return this.__funcRep;
	}
	set __functions(val) {
		this.__funcRep = val;
	}
	get __variables() {
		return this.__varsRep;
	}
	set __variables(val) {
		this.__varsRep = val;
	}
	get _config() {
		return this.__config;
	}
	set _config(val: any) {
		this.__config = val;
	}
	get __parentObject() {
		return ((this._config.platform || "node") == "browser") ? "this" : "global";
	}

	__textData(target: string, prefix = "") {
		var code: Array<string> = [];
		target.split("").forEach((_char: any) => {
			code.push(prefix + _char.codePointAt(0).toString(16));
		})
		return code;
	}

	constructor(config: any = {}) {
		this._config = config;
	}

	stringHandler(str: string) {
		var result = "";
		for (let i = 0; i < str.length; i++) {
			result += "\u3164" + str[i].charCodeAt(0);
		}
		return parseScript(`${this.__tempConfig.decoderHex}("${result}")`).body[0].expression;
	}

	hexGen(size: number = 7) {
		return [...Array(size)].map((_c) => "abcdefghijklmnopqrstuvwxyz"[Math.round(Math.random() * 25)][Math.round(Math.random() * 2) == 1 ? "toUpperCase" : "toLowerCase"]()).join("")
	}

	componentConversion(node: any) {
		const type = node.type;
		if (type == "Literal") node = this.stringHandler(node.value);
		if (type == "Identifier") {
			if (typeof this.__variables[node.name] === "undefined") {
				var _id = btoa(node.name);
				this.__variables[node.name] = {
					name: _id,
				}
				// @ts-ignore
				node = parseScript(`${this.__parentObject}[atob("${_id}")]`).body[0].expression;
			} else {
				node.name = this.__variables[node.name].name;
			}
		}
		if (type == "Property") {
			node.key.name = btoa(node.key.name);
			node.value = this.componentConversion(node.value);
		}
		if (type == "BlockStatement") node.body.forEach((_block: any) => _block = this.componentConversion(_block));
		if (type == "ExpressionStatement") node.expression = this.componentConversion(node.expression);
		if (type == "CallExpression") {
			if (this.__functions[node.callee.name]) node.callee.name = this.__functions[node.callee.name];
			else node.callee = this.componentConversion(node.callee);
			let _i = 0;
			node.arguments.forEach((arg: any) => {
				node.arguments[_i] = this.componentConversion(arg);
				_i++;
			})
		}
		if (type == "NewExpression") {
			// @ts-ignore
			node.callee = parseScript(`${this.__parentObject}[atob("${btoa(node.callee.name)}")]`).body[0].expression;
			var _i = 0;
			node.arguments.forEach((arg: any) => {
				node.arguments[_i] = this.componentConversion(arg);
				_i++;
			})
		}
		if (type == "MemberExpression") {
			if (this.__variables[node.object.name]) {
				// @ts-ignore
				node = parseScript(`${this.__variables[node.object.name].name}["${btoa(node.property.name)}"]`).body[0].expression;
			}
			else {
				// @ts-ignore
				node = parseScript(`${this.__parentObject}[atob("${btoa(node.object.name)}")][atob("${btoa(node.property.name)}")]`).body[0].expression;
			}
		}
		if (type == "BinaryExpression") {
			node.left = this.componentConversion(node.left);
			node.right = this.componentConversion(node.right);
		}
		if (type == "FunctionDeclaration" || type == "ArrowFunctionExpression") {
			if (type == "FunctionDeclaration") {
				var _id = this.hexGen();
				this.__functions[node.id.name] = _id;
				node.id.name = _id;
			}
			node.body = this.componentConversion(node.body);
		}
		if (type == "VariableDeclaration") node.declarations.forEach((_declarator: any) => _declarator = this.componentConversion(_declarator));
		if (type == "VariableDeclarator") {
			this.__variables[node.id.name] = {
				name: btoa(node.id.name).replaceAll(/=/g, ""),
			}
			node.id.name = this.__variables[node.id.name].name;
			var _props = this.componentConversion(node.init);
			if (node.init.type == "ObjectExpression") this.__variables.prop = _props;
			node.init = _props;
		}
		if (type == "IfStatement") {
			if (node.alternate) node.alternate = this.componentConversion(node.alternate);
			node.consequent = this.componentConversion(node.consequent);
			node.test = this.componentConversion(node.test);
		}
		if (type == "AwaitExpression") {
			node.argument = this.componentConversion(node.argument);
		}
		if (type == "ObjectExpression") {
			node.properties.forEach((prop: any) => {
				prop = this.componentConversion(prop);
			})
		}
		if (type == "ReturnStatement") node.argument = this.componentConversion(node.argument);
		return node;
	}

	obfuscate(source: string) {
		/**
				* Obfuscates the source string
				* @param {string} source
				* @return {string}
				* Obfucode.obfuscate("console.log('Foo');");
				*/
		this.__functions = {};
		const _parsed = parseScript(source);
		var _SCRIPT = this.__inject;
		_parsed.body.forEach((component: any) => {
			_SCRIPT += generate({
				type: "Program",
				sourceType: "script",
				body: [this.componentConversion(component)],
			});
		})
		return _SCRIPT;
	}
}

export {
	Obfucode,
}