#!/usr/bin/env node
/* eslint-disable */
/* prettier-ignore */
require('ts-node').register({
  compilerOptions: {
    lib: [
      'DOM',
      'ES2017',
      'ScriptHost',
      'ES2015.Core',
      'ES2015.Collection',
      'ES2015.Symbol',
      'ES2015.Iterable',
      'ES2015.Promise',
    ],

    types: ['node'],
    target: 'ES2017',
    module: 'CommonJS',
    sourceMap: false,
    jsx: 'React',
    alwaysStrict: true,
    strictNullChecks: true,
    noImplicitAny: false,
    noImplicitThis: false,
    noUnusedLocals: true,
  },
  // It is faster to skip typechecking.
  "transpileOnly": true,
  // We must load files for third party defs - https://typestrong.org/ts-node/docs/types
  "files": true,
});

require('./src/cli.ts');
