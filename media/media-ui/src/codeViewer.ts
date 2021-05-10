import type { SupportedLanguages } from '@atlaskit/code/types';

/**
 * Given an item, it grabs the file name of that item. For example, an item with the filename item.txt
 * would return the extension txt
 */
export function getExtension(filename: string) {
  if (filename.indexOf('.') > -1) {
    return filename.split('.').pop() as string;
  }
  return '';
}

export function isCodeViewerItem(name: string) {
  return getLanguageType(name) !== null;
}

/*
 * Given an item, it assigns the corresponding language for that item if it is a code item. For example, an item with the filename test.py
 * would return the language 'python'. If an item is not a code item, the language returned is 'null'.
 */
export function getLanguageType(name: string): SupportedLanguages | null {
  const ext = getExtension(name);
  switch (ext) {
    case 'abap':
    case 'ada':
    case 'c':
    case 'css':
    case 'd':
    case 'dart':
    case 'go':
    case 'graphql':
    case 'groovy':
    case 'html':
    case 'java':
    case 'json':
    case 'matlab':
    case 'xml':
    case 'lua':
    case 'puppet':
    case 'qml':
    case 'sass':
    case 'sql':
    case 'php':
    case 'r':
    case 'swift':
    case 'tcl':
    case 'vala':
    case 'vhdl':
    case 'xquery':
      return ext;
    case 'as':
    case 'asc':
      return 'actionscript';
    case 'ino':
      return 'arduino';
    case 'au3':
      return 'autoit';
    case 'cpp':
    case 'h':
    case 'c++':
      return 'c++';
    case 'coffee':
      return 'coffeescript';
    case 'cs':
      return 'csharp';
    case 'cu':
      return 'cuda';
    case 'pas':
    case 'dpr':
    case 'dproj':
    case 'dpk':
      return 'delphi';
    case 'ex':
    case 'exs':
      return 'elixir';
    case 'erl':
    case 'hrl':
      return 'erlang';
    case 'f90':
    case 'for':
    case 'f':
    case 'fpp':
    case 'i':
    case 'i90':
    case 'ftn':
      return 'fortran';
    case 'dbc':
      return 'foxpro';
    case 'hs':
    case 'has':
      return 'haskell';
    case 'hx':
      return 'haxe';
    case 'js':
      return 'javascript';
    case 'jl':
      return 'julia';
    case 'kt':
      return 'kotlin';
    case 'm':
    case 'mm':
      return 'objective-c';
    case 'j':
      return 'objective-j';
    case 'tex':
      return 'latex';
    case 'nb':
    case 'cdf':
      return 'mathematica';
    case 'cma':
      return 'ocaml';
    case 'pl':
      return 'perl';
    case 'py':
      return 'python';
    case 'ps1':
    case 'psd1':
    case 'psm1':
      return 'powershell';
    case 'rb':
      return 'ruby';
    case 'rst':
      return 'restructuredtext';
    case 'rs':
      return 'rust';
    case 'rkt':
      return 'racket';
    case 'sh':
      return 'shell';
    case 'sc':
    case 'sch':
      return 'scheme';
    case 'txt':
    case 'msg':
    case 'log':
    case 'csv':
      return 'text';
    case 'ts':
      return 'typescript';
    case 'v':
      return 'verilog';
    case 'xq':
    case 'xql':
    case 'xqm':
    case 'xqy':
      return 'xquery';
    default:
      return null;
  }
}
