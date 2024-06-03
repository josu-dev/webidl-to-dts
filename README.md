# Web IDL to d.ts

Repository for the online [Web IDL to d.ts][this-site], which converts Web IDL definitions into TypeScript declaration (.d.ts) definitions. It is powered by [webidl-dts-gen][webidl-dts-gen].

Web IDL is a format for describing interfaces meant for objects in web APIs. TypeScript declaration files (.d.ts) provide a way to describe the shape of JavaScript libraries not written in TypeScript.

The transpiler is kept up-to-date thanks to a [fork][webidl-dts-gen] of the original [webidl2ts][wbidl2ts] library.

## License

[MIT](./LICENSE)

[this-site]: https://webidl-to-dts.vercel.app/
[wbidl2ts]:https://github.com/giniedp/webidl2ts
[webidl-dts-gen]: https://github.com/pmndrs/webidl-dts-gen
