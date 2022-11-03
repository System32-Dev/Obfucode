var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __markAsModule = (target) => __defProp(target, "__esModule", { value: true });
var __export = (target, all) => {
  __markAsModule(target);
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __reExport = (target, module2, desc) => {
  if (module2 && typeof module2 === "object" || typeof module2 === "function") {
    for (let key of __getOwnPropNames(module2))
      if (!__hasOwnProp.call(target, key) && key !== "default")
        __defProp(target, key, { get: () => module2[key], enumerable: !(desc = __getOwnPropDesc(module2, key)) || desc.enumerable });
  }
  return target;
};
var __toModule = (module2) => {
  return __reExport(__markAsModule(__defProp(module2 != null ? __create(__getProtoOf(module2)) : {}, "default", module2 && module2.__esModule && "default" in module2 ? { get: () => module2.default, enumerable: true } : { value: module2, enumerable: true })), module2);
};
__export(exports, {
  Obfucode: () => Obfucode
});
var import_meriyah = __toModule(require("meriyah"));
var import_esotope_hammerhead = __toModule(require("esotope-hammerhead"));
class Obfucode {
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
  set _config(val) {
    this.__config = val;
  }
  get __parentObject() {
    return (this._config.platform || "node") == "browser" ? "this" : "global";
  }
  constructor(config = {}) {
    this._config = config;
  }
  stringHandler(value) {
    return (0, import_meriyah.parseScript)(`atob("${btoa(value)}");`).body[0].expression;
  }
  hexGen(size = 7) {
    return [...Array(size)].map((_c) => "abcdefghijklmnopqrstuvwxyz"[Math.round(Math.random() * 25)][Math.round(Math.random() * 2) == 1 ? "toUpperCase" : "toLowerCase"]()).join("");
  }
  componentConversion(node) {
    const type = node.type;
    if (type == "Literal")
      node = this.stringHandler(node.value);
    if (type == "Identifier") {
      if (typeof this.__variables[node.name] === "undefined") {
        node = (0, import_meriyah.parseScript)(`${this.__parentObject}[atob("${btoa(node.name)}")]`).body[0].expression;
      } else {
        node.name = this.__variables[node.name].name;
      }
    }
    if (type == "Property") {
      node.key.name = btoa(node.key.name);
      node.value = this.componentConversion(node.value);
    }
    if (type == "BlockStatement")
      node.body.forEach((_block) => _block = this.componentConversion(_block));
    if (type == "ExpressionStatement")
      node.expression = this.componentConversion(node.expression);
    if (type == "CallExpression") {
      if (this.__functions[node.callee.name])
        node.callee.name = this.__functions[node.callee.name];
      else
        node.callee = this.componentConversion(node.callee);
      let _i2 = 0;
      node.arguments.forEach((arg) => {
        node.arguments[_i2] = this.componentConversion(arg);
        _i2++;
      });
    }
    if (type == "NewExpression") {
      node.callee = (0, import_meriyah.parseScript)(`${this.__parentObject}[atob("${btoa(node.callee.name)}")]`).body[0].expression;
      var _i = 0;
      node.arguments.forEach((arg) => {
        node.arguments[_i] = this.componentConversion(arg);
        _i++;
      });
    }
    if (type == "MemberExpression") {
      if (this.__variables[node.object.name]) {
        node = (0, import_meriyah.parseScript)(`${this.__variables[node.object.name].name}["${btoa(node.property.name)}"]`).body[0].expression;
      } else {
        node = (0, import_meriyah.parseScript)(`${this.__parentObject}[atob("${btoa(node.object.name)}")][atob("${btoa(node.property.name)}")]`).body[0].expression;
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
    if (type == "VariableDeclaration")
      node.declarations.forEach((_declarator) => _declarator = this.componentConversion(_declarator));
    if (type == "VariableDeclarator") {
      this.__variables[node.id.name] = {
        name: this.hexGen()
      };
      node.id.name = this.__variables[node.id.name].name;
      var _props = this.componentConversion(node.init);
      if (node.init.type == "ObjectExpression")
        this.__variables.prop = _props;
      node.init = _props;
    }
    if (type == "IfStatement") {
      if (node.alternate)
        node.alternate = this.componentConversion(node.alternate);
      node.consequent = this.componentConversion(node.consequent);
      node.test = this.componentConversion(node.test);
    }
    if (type == "AwaitExpression") {
      node.argument = this.componentConversion(node.argument);
    }
    if (type == "ObjectExpression") {
      node.properties.forEach((prop) => {
        prop = this.componentConversion(prop);
      });
    }
    if (type == "ReturnStatement")
      node.argument = this.componentConversion(node.argument);
    return node;
  }
  obfuscate(source) {
    this.__functions = {};
    const _parsed = (0, import_meriyah.parseScript)(source);
    var _SCRIPT = "";
    _parsed.body.forEach((component) => {
      _SCRIPT += (0, import_esotope_hammerhead.generate)({
        type: "Program",
        sourceType: "script",
        body: [this.componentConversion(component)]
      });
    });
    return _SCRIPT;
  }
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  Obfucode
});
//# sourceMappingURL=obfucode.js.map
