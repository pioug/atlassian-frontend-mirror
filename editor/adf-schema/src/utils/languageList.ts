export type Language = { name: string; alias: string[] };

// We expect alias[0] to be used for the ADF attribute, see ED-2813
export const DEFAULT_LANGUAGES: Language[] = [
  { name: 'ABAP', alias: ['abap'] },
  { name: 'ActionScript', alias: ['actionscript', 'actionscript3', 'as'] },
  { name: 'Ada', alias: ['ada', 'ada95', 'ada2005'] },
  { name: 'AppleScript', alias: ['applescript'] },
  { name: 'Arduino', alias: ['arduino'] },
  { name: 'Autoit', alias: ['autoit'] },
  { name: 'C', alias: ['c'] },
  { name: 'C++', alias: ['c++', 'cpp'] },
  { name: 'Clojure', alias: ['clojure', 'clj'] },
  { name: 'CoffeeScript', alias: ['coffeescript', 'coffee-script', 'coffee'] },
  { name: 'ColdFusion', alias: ['coldfusion'] },
  { name: 'CSharp', alias: ['csharp', 'c#'] },
  { name: 'CSS', alias: ['css'] },
  { name: 'CUDA', alias: ['cuda', 'cu'] },
  { name: 'D', alias: ['d'] },
  { name: 'Dart', alias: ['dart'] },
  { name: 'Delphi', alias: ['delphi', 'pas', 'pascal', 'objectpascal'] },
  { name: 'Diff', alias: ['diff'] },
  { name: 'Elixir', alias: ['elixir', 'ex', 'exs'] },
  { name: 'Erlang', alias: ['erlang', 'erl'] },
  { name: 'Fortran', alias: ['fortran'] },
  { name: 'FoxPro', alias: ['foxpro', 'vfp', 'clipper', 'xbase'] },
  { name: 'Go', alias: ['go'] },
  { name: 'GraphQL', alias: ['graphql'] },
  { name: 'Groovy', alias: ['groovy'] },
  { name: 'Haskell', alias: ['haskell', 'hs'] },
  { name: 'Haxe', alias: ['haxe', 'hx', 'hxsl'] },
  { name: 'Html', alias: ['html'] },
  { name: 'Java', alias: ['java'] },
  { name: 'JavaFX', alias: ['javafx', 'jfx'] },
  { name: 'JavaScript', alias: ['javascript', 'js'] },
  { name: 'JSON', alias: ['json'] },
  { name: 'Julia', alias: ['julia', 'jl'] },
  { name: 'Kotlin', alias: ['kotlin'] },
  { name: 'LiveScript', alias: ['livescript', 'live-script'] },
  { name: 'Lua', alias: ['lua'] },
  { name: 'Mathematica', alias: ['mathematica', 'mma', 'nb'] },
  { name: 'MATLAB', alias: ['matlab'] },
  {
    name: 'Objective-C',
    alias: ['objective-c', 'objectivec', 'obj-c', 'objc'],
  },
  {
    name: 'Objective-J',
    alias: ['objective-j', 'objectivej', 'obj-j', 'objj'],
  },
  { name: 'ObjectPascal', alias: ['objectpascal'] },
  { name: 'OCaml', alias: ['ocaml'] },
  { name: 'Octave', alias: ['octave'] },
  { name: 'Perl', alias: ['perl', 'pl'] },
  { name: 'PHP', alias: ['php', 'php3', 'php4', 'php5'] },
  { name: 'PlainText', alias: ['plaintext', 'text'] },
  { name: 'PowerShell', alias: ['powershell', 'posh', 'ps1', 'psm1'] },
  { name: 'Prolog', alias: ['prolog'] },
  { name: 'Puppet', alias: ['puppet'] },
  { name: 'Python', alias: ['python', 'py'] },
  { name: 'QML', alias: ['qbs'] },
  { name: 'R', alias: ['r'] },
  { name: 'Racket', alias: ['racket', 'rkt'] },
  { name: 'reStructuredText', alias: ['restructuredtext', 'rst', 'rest'] },
  { name: 'Ruby', alias: ['ruby', 'rb', 'duby'] },
  { name: 'Rust', alias: ['rust'] },
  { name: 'Sass', alias: ['sass'] },
  { name: 'Scala', alias: ['scala'] },
  { name: 'Scheme', alias: ['scheme', 'scm'] },
  { name: 'Shell', alias: ['shell', 'bash', 'sh', 'ksh', 'zsh'] },
  { name: 'Smalltalk', alias: ['smalltalk', 'squeak', 'st'] },
  {
    name: 'SQL',
    alias: [
      'sql',
      'postgresql',
      'postgres',
      'plpgsql',
      'psql',
      'postgresql-console',
      'postgres-console',
      'tsql',
      't-sql',
      'mysql',
      'sqlite',
    ],
  },
  { name: 'StandardML', alias: ['standardmL', 'sml'] },
  { name: 'Swift', alias: ['swift'] },
  { name: 'Tcl', alias: ['tcl'] },
  { name: 'TeX', alias: ['tex', 'latex'] },
  { name: 'TypeScript', alias: ['typescript', 'ts'] },
  { name: 'Vala', alias: ['vala', 'vapi'] },
  { name: 'VbNet', alias: ['vbnet', 'vb.net'] },
  { name: 'Verilog', alias: ['verilog', 'v'] },
  { name: 'VHDL', alias: ['vhdl'] },
  { name: 'VisualBasic', alias: ['visualbasic', 'vb'] },
  { name: 'XML', alias: ['xml'] },
  { name: 'XQuery', alias: ['xquery', 'xqy', 'xq', 'xql', 'xqm'] },
  { name: 'YAML', alias: ['yaml', 'yml'] },
];

export function findMatchedLanguage(
  supportedLanguages: Language[],
  language?: string,
) {
  if (!language) {
    return undefined;
  }

  const matches = supportedLanguages.filter(supportedLanguage => {
    return supportedLanguage.alias.indexOf(language.toLowerCase()) !== -1;
  });

  if (matches.length > 0) {
    return matches[0];
  }

  return undefined;
}

export function filterSupportedLanguages(
  supportedLanguages: Array<string>,
): Language[] {
  if (!supportedLanguages || !supportedLanguages.length) {
    return DEFAULT_LANGUAGES;
  }

  return DEFAULT_LANGUAGES.filter(language => {
    let i = language.alias.length;
    while (i--) {
      if (supportedLanguages.indexOf(language.alias[i]) > -1) {
        return true;
      }
    }
    return false;
  });
}

export function getLanguageIdentifier(language: Language): string {
  return language.alias[0];
}

export function createLanguageList(supportedLanguages: Language[]) {
  return supportedLanguages.sort((left, right) => {
    if (left.name > right.name) {
      return 1;
    }
    if (left.name < right.name) {
      return -1;
    }
    return 0;
  });
}
