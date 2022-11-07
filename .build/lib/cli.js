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
  default: () => __cli
});
var yargs = __toModule(require("yargs"));
var import_path = __toModule(require("path"));
var import_fs = __toModule(require("fs"));
var import_obfucode = __toModule(require("./src/obfucode"));
function __cli() {
  let args = yargs.option("platform", {
    alias: "p",
    description: "Set the obfuscated script target platform.",
    demand: false
  }).option("output", {
    alias: "o",
    description: "Write to an output file.",
    demand: false
  }).option("file", {
    alias: "f",
    description: "Obfuscate a file.",
    demand: false
  }).argv;
  if (args.file) {
    var platform = args.platform || "node";
    try {
      var _file = (0, import_fs.readFileSync)((0, import_path.resolve)(args.file), "utf-8");
      var obfuscator = new import_obfucode.Obfucode({
        platform
      });
      var result = obfuscator.obfuscate(_file);
      if (args.output) {
        (0, import_fs.writeFileSync)((0, import_path.resolve)(args.output), result);
      } else {
        console.log(result);
      }
    } catch (e) {
      console.log(e.message);
    }
  }
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {});
//# sourceMappingURL=cli.js.map
