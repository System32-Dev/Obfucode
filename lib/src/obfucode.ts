import { parseScript } from 'meriyah';
import { generate } from 'esotope-hammerhead';

class Obfucode {
	// @ts-ignore
	__funcRep;
	// @ts-ignore
	__varsRep;
	// @ts-ignore
	__config;

	get __functions() {
		return this.__funcRep;
	}
	set __functions(val) {
		this.__funcRep = val;
	}
	get __variables() {
		return this.__funcRep;
	}
	set __variables(val) {
		this.__funcRep = val;
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

	constructor(config: any = {}) {
		this._config = config;
	}

	stringHandler(value: string) {
		// @ts-ignore
		return parseScript(`atob("${btoa(value)}");`).body[0].expression;
	}

	hexGen(size: number = 7) {
		return [...Array(size)].map((_c) => "abcdefghijklmnopqrstuvwxyz"[Math.round(Math.random() * 25)][Math.round(Math.random() * 2) == 1 ? "toUpperCase" : "toLowerCase"]()).join("")
	}

	componentConversion(node: any) {
		const type = node.type;
		if (type == "Literal") node = this.stringHandler(node.value);
		if (type == "Identifier") {
			if (typeof this.__variables[node.name] === "undefined") {
				// @ts-ignore
				node = parseScript(`${this.__parentObject}[atob("${btoa(node.name)}")]`).body[0].expression;
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
				name: this.hexGen(),
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
		this.__functions = {};
		const _parsed = parseScript(source);
		var _SCRIPT = "";
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