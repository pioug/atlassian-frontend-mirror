import { SUPPORTED_LANGUAGES } from '@atlaskit/code/constants';

// We expect alias[0] to be used for the ADF attribute, see ED-2813
export const DEFAULT_LANGUAGES: (
	| {
			readonly alias: readonly ['php', 'php3', 'php4', 'php5'];
			readonly name: 'PHP';
			readonly value: 'php';
	  }
	| {
			readonly alias: readonly ['java'];
			readonly name: 'Java';
			readonly value: 'java';
	  }
	| {
			readonly alias: readonly ['csharp', 'c#'];
			readonly name: 'CSharp';
			readonly value: 'cs';
	  }
	| {
			readonly alias: readonly ['python', 'py'];
			readonly name: 'Python';
			readonly value: 'python';
	  }
	| {
			readonly alias: readonly ['javascript', 'js'];
			readonly name: 'JavaScript';
			readonly value: 'javascript';
	  }
	| {
			readonly alias: readonly ['html'];
			readonly name: 'Html';
			readonly value: 'xml';
	  }
	| {
			readonly alias: readonly ['c++', 'cpp', 'clike'];
			readonly name: 'C++';
			readonly value: 'cpp';
	  }
	| {
			readonly alias: readonly ['ruby', 'rb', 'duby'];
			readonly name: 'Ruby';
			readonly value: 'ruby';
	  }
	| {
			readonly alias: readonly ['objective-c', 'objectivec', 'obj-c', 'objc'];
			readonly name: 'Objective-C';
			readonly value: 'objectivec';
	  }
	| {
			readonly alias: readonly ['c'];
			readonly name: 'C';
			readonly value: 'cpp';
	  }
	| {
			readonly alias: readonly ['swift'];
			readonly name: 'Swift';
			readonly value: 'swift';
	  }
	| {
			readonly alias: readonly ['tex', 'latex'];
			readonly name: 'TeX';
			readonly value: 'tex';
	  }
	| {
			readonly alias: readonly ['shell', 'bash', 'sh', 'ksh', 'zsh'];
			readonly name: 'Shell';
			readonly value: 'shell';
	  }
	| {
			readonly alias: readonly ['scala'];
			readonly name: 'Scala';
			readonly value: 'scala';
	  }
	| {
			readonly alias: readonly ['go'];
			readonly name: 'Go';
			readonly value: 'go';
	  }
	| {
			readonly alias: readonly ['actionscript', 'actionscript3', 'as'];
			readonly name: 'ActionScript';
			readonly value: 'actionscript';
	  }
	| {
			readonly alias: readonly ['coldfusion'];
			readonly name: 'ColdFusion';
			readonly value: 'xml';
	  }
	| {
			readonly alias: readonly ['javafx', 'jfx'];
			readonly name: 'JavaFX';
			readonly value: 'java';
	  }
	| {
			readonly alias: readonly ['vbnet', 'vb.net', 'vfp', 'clipper', 'xbase'];
			readonly name: 'VbNet';
			readonly value: 'vbnet';
	  }
	| {
			readonly alias: readonly ['json'];
			readonly name: 'JSON';
			readonly value: 'json';
	  }
	| {
			readonly alias: readonly ['matlab'];
			readonly name: 'MATLAB';
			readonly value: 'matlab';
	  }
	| {
			readonly alias: readonly ['groovy'];
			readonly name: 'Groovy';
			readonly value: 'groovy';
	  }
	| {
			readonly alias: readonly [
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
			];
			readonly name: 'SQL';
			readonly value: 'sql';
	  }
	| {
			readonly alias: readonly ['r'];
			readonly name: 'R';
			readonly value: 'r';
	  }
	| {
			readonly alias: readonly ['perl', 'pl'];
			readonly name: 'Perl';
			readonly value: 'perl';
	  }
	| {
			readonly alias: readonly ['lua'];
			readonly name: 'Lua';
			readonly value: 'lua';
	  }
	| {
			readonly alias: readonly ['pas', 'pascal', 'objectpascal', 'delphi'];
			readonly name: 'Pascal';
			readonly value: 'pascal';
	  }
	| {
			readonly alias: readonly ['xml'];
			readonly name: 'XML';
			readonly value: 'xml';
	  }
	| {
			readonly alias: readonly ['typescript', 'ts'];
			readonly name: 'TypeScript';
			readonly value: 'typescript';
	  }
	| {
			readonly alias: readonly ['coffeescript', 'coffee-script', 'coffee'];
			readonly name: 'CoffeeScript';
			readonly value: 'coffeescript';
	  }
	| {
			readonly alias: readonly ['haskell', 'hs'];
			readonly name: 'Haskell';
			readonly value: 'haskell';
	  }
	| {
			readonly alias: readonly ['puppet'];
			readonly name: 'Puppet';
			readonly value: 'puppet';
	  }
	| {
			readonly alias: readonly ['arduino'];
			readonly name: 'Arduino';
			readonly value: 'arduino';
	  }
	| {
			readonly alias: readonly ['fortran'];
			readonly name: 'Fortran';
			readonly value: 'fortran';
	  }
	| {
			readonly alias: readonly ['erlang', 'erl'];
			readonly name: 'Erlang';
			readonly value: 'erlang';
	  }
	| {
			readonly alias: readonly ['powershell', 'posh', 'ps1', 'psm1'];
			readonly name: 'PowerShell';
			readonly value: 'powershell';
	  }
	| {
			readonly alias: readonly ['haxe', 'hx', 'hxsl'];
			readonly name: 'Haxe';
			readonly value: 'haxe';
	  }
	| {
			readonly alias: readonly ['elixir', 'ex', 'exs'];
			readonly name: 'Elixir';
			readonly value: 'elixir';
	  }
	| {
			readonly alias: readonly ['verilog', 'v'];
			readonly name: 'Verilog';
			readonly value: 'verilog';
	  }
	| {
			readonly alias: readonly ['rust'];
			readonly name: 'Rust';
			readonly value: 'rust';
	  }
	| {
			readonly alias: readonly ['vhdl'];
			readonly name: 'VHDL';
			readonly value: 'vhdl';
	  }
	| {
			readonly alias: readonly ['sass'];
			readonly name: 'Sass';
			readonly value: 'less';
	  }
	| {
			readonly alias: readonly ['ocaml'];
			readonly name: 'OCaml';
			readonly value: 'ocaml';
	  }
	| {
			readonly alias: readonly ['dart'];
			readonly name: 'Dart';
			readonly value: 'dart';
	  }
	| {
			readonly alias: readonly ['css'];
			readonly name: 'CSS';
			readonly value: 'css';
	  }
	| {
			readonly alias: readonly ['restructuredtext', 'rst', 'rest'];
			readonly name: 'reStructuredText';
			readonly value: 'rest';
	  }
	| {
			readonly alias: readonly ['kotlin'];
			readonly name: 'Kotlin';
			readonly value: 'kotlin';
	  }
	| {
			readonly alias: readonly ['d'];
			readonly name: 'D';
			readonly value: 'd';
	  }
	| {
			readonly alias: readonly ['octave'];
			readonly name: 'Octave';
			readonly value: 'matlab';
	  }
	| {
			readonly alias: readonly ['qbs', 'qml'];
			readonly name: 'QML';
			readonly value: 'qml';
	  }
	| {
			readonly alias: readonly ['prolog'];
			readonly name: 'Prolog';
			readonly value: 'prolog';
	  }
	| {
			readonly alias: readonly ['foxpro', 'purebasic'];
			readonly name: 'FoxPro';
			readonly value: 'purebasic';
	  }
	| {
			readonly alias: readonly ['scheme', 'scm'];
			readonly name: 'Scheme';
			readonly value: 'scheme';
	  }
	| {
			readonly alias: readonly ['cuda', 'cu'];
			readonly name: 'CUDA';
			readonly value: 'cpp';
	  }
	| {
			readonly alias: readonly ['julia', 'jl'];
			readonly name: 'Julia';
			readonly value: 'julia';
	  }
	| {
			readonly alias: readonly ['racket', 'rkt'];
			readonly name: 'Racket';
			readonly value: 'lisp';
	  }
	| {
			readonly alias: readonly ['ada', 'ada95', 'ada2005'];
			readonly name: 'Ada';
			readonly value: 'ada';
	  }
	| {
			readonly alias: readonly ['tcl'];
			readonly name: 'Tcl';
			readonly value: 'tcl';
	  }
	| {
			readonly alias: readonly ['mathematica', 'mma', 'nb'];
			readonly name: 'Mathematica';
			readonly value: 'mathematica';
	  }
	| {
			readonly alias: readonly ['autoit'];
			readonly name: 'Autoit';
			readonly value: 'autoit';
	  }
	| {
			readonly alias: readonly ['standardmL', 'sml', 'standardml'];
			readonly name: 'StandardML';
			readonly value: 'sml';
	  }
	| {
			readonly alias: readonly ['objective-j', 'objectivej', 'obj-j', 'objj'];
			readonly name: 'Objective-J';
			readonly value: 'objectivec';
	  }
	| {
			readonly alias: readonly ['smalltalk', 'squeak', 'st'];
			readonly name: 'Smalltalk';
			readonly value: 'smalltalk';
	  }
	| {
			readonly alias: readonly ['vala', 'vapi'];
			readonly name: 'Vala';
			readonly value: 'vala';
	  }
	| {
			readonly alias: readonly ['livescript', 'live-script'];
			readonly name: 'LiveScript';
			readonly value: 'livescript';
	  }
	| {
			readonly alias: readonly ['xquery', 'xqy', 'xq', 'xql', 'xqm'];
			readonly name: 'XQuery';
			readonly value: 'xquery';
	  }
	| {
			readonly alias: readonly ['text', 'plaintext'];
			readonly name: 'PlainText';
			readonly value: 'text';
	  }
	| {
			readonly alias: readonly ['yaml', 'yml'];
			readonly name: 'Yaml';
			readonly value: 'yaml';
	  }
	| {
			readonly alias: readonly ['graphql'];
			readonly name: 'GraphQL';
			readonly value: 'graphql';
	  }
	| {
			readonly alias: readonly ['applescript'];
			readonly name: 'AppleScript';
			readonly value: 'applescript';
	  }
	| {
			readonly alias: readonly ['clojure'];
			readonly name: 'Clojure';
			readonly value: 'clojure';
	  }
	| {
			readonly alias: readonly ['diff'];
			readonly name: 'Diff';
			readonly value: 'diff';
	  }
	| {
			readonly alias: readonly ['visualbasic'];
			readonly name: 'VisualBasic';
			readonly value: 'visual-basic';
	  }
	| {
			readonly alias: readonly ['jsx'];
			readonly name: 'JSX';
			readonly value: 'jsx';
	  }
	| {
			readonly alias: readonly ['tsx'];
			readonly name: 'TSX';
			readonly value: 'tsx';
	  }
	| {
			readonly alias: readonly ['splunk-spl'];
			readonly name: 'SplunkSPL';
			readonly value: 'splunk-spl';
	  }
	| {
			readonly alias: readonly ['docker', 'dockerfile'];
			readonly name: 'Dockerfile';
			readonly value: 'dockerfile';
	  }
	| {
			readonly alias: readonly ['hcl', 'terraform'];
			readonly name: 'HCL';
			readonly value: 'hcl';
	  }
	| {
			readonly alias: readonly ['nginx'];
			readonly name: 'NGINX';
			readonly value: 'nginx';
	  }
	| {
			readonly alias: readonly ['protobuf', 'proto'];
			readonly name: 'Protocol Buffers';
			readonly value: 'protobuf';
	  }
	| {
			readonly alias: readonly ['toml'];
			readonly name: 'TOML';
			readonly value: 'toml';
	  }
	| {
			readonly alias: readonly ['handlebars', 'mustache'];
			readonly name: 'Handlebars';
			readonly value: 'handlebars';
	  }
	| {
			readonly alias: readonly ['gherkin', 'cucumber'];
			readonly name: 'Gherkin';
			readonly value: 'gherkin';
	  }
	| {
			readonly alias: readonly ['abap'];
			readonly name: 'ABAP';
			readonly value: 'abap';
	  }
	| {
			readonly alias: readonly ['markdown'];
			readonly name: 'Markdown';
			readonly value: 'markdown';
	  }
	| {
			alias: string[];
			name: string;
			value: string;
	  }
)[] = [{ name: '(None)', alias: ['none'], value: 'none' }, ...SUPPORTED_LANGUAGES];

export type Language = (typeof DEFAULT_LANGUAGES)[number];

// Feature-gated languages injected into the picker at runtime. Kept out of the
// shared @atlaskit/code SUPPORTED_LANGUAGES so they stay gated and don't leak to
// other consumers (e.g. the renderer). The mutable-array literal matches the
// `Language` union's catch-all member, so the verbose types above need no change.
export const MERMAID_LANGUAGE: Language = {
	name: 'Mermaid',
	alias: ['mermaid'],
	value: 'mermaid',
};

export function findMatchedLanguage(
	supportedLanguages: Language[],
	language?: string,
):
	| {
			readonly alias: readonly ['php', 'php3', 'php4', 'php5'];
			readonly name: 'PHP';
			readonly value: 'php';
	  }
	| {
			readonly alias: readonly ['java'];
			readonly name: 'Java';
			readonly value: 'java';
	  }
	| {
			readonly alias: readonly ['csharp', 'c#'];
			readonly name: 'CSharp';
			readonly value: 'cs';
	  }
	| {
			readonly alias: readonly ['python', 'py'];
			readonly name: 'Python';
			readonly value: 'python';
	  }
	| {
			readonly alias: readonly ['javascript', 'js'];
			readonly name: 'JavaScript';
			readonly value: 'javascript';
	  }
	| {
			readonly alias: readonly ['html'];
			readonly name: 'Html';
			readonly value: 'xml';
	  }
	| {
			readonly alias: readonly ['c++', 'cpp', 'clike'];
			readonly name: 'C++';
			readonly value: 'cpp';
	  }
	| {
			readonly alias: readonly ['ruby', 'rb', 'duby'];
			readonly name: 'Ruby';
			readonly value: 'ruby';
	  }
	| {
			readonly alias: readonly ['objective-c', 'objectivec', 'obj-c', 'objc'];
			readonly name: 'Objective-C';
			readonly value: 'objectivec';
	  }
	| {
			readonly alias: readonly ['c'];
			readonly name: 'C';
			readonly value: 'cpp';
	  }
	| {
			readonly alias: readonly ['swift'];
			readonly name: 'Swift';
			readonly value: 'swift';
	  }
	| {
			readonly alias: readonly ['tex', 'latex'];
			readonly name: 'TeX';
			readonly value: 'tex';
	  }
	| {
			readonly alias: readonly ['shell', 'bash', 'sh', 'ksh', 'zsh'];
			readonly name: 'Shell';
			readonly value: 'shell';
	  }
	| {
			readonly alias: readonly ['scala'];
			readonly name: 'Scala';
			readonly value: 'scala';
	  }
	| {
			readonly alias: readonly ['go'];
			readonly name: 'Go';
			readonly value: 'go';
	  }
	| {
			readonly alias: readonly ['actionscript', 'actionscript3', 'as'];
			readonly name: 'ActionScript';
			readonly value: 'actionscript';
	  }
	| {
			readonly alias: readonly ['coldfusion'];
			readonly name: 'ColdFusion';
			readonly value: 'xml';
	  }
	| {
			readonly alias: readonly ['javafx', 'jfx'];
			readonly name: 'JavaFX';
			readonly value: 'java';
	  }
	| {
			readonly alias: readonly ['vbnet', 'vb.net', 'vfp', 'clipper', 'xbase'];
			readonly name: 'VbNet';
			readonly value: 'vbnet';
	  }
	| {
			readonly alias: readonly ['json'];
			readonly name: 'JSON';
			readonly value: 'json';
	  }
	| {
			readonly alias: readonly ['matlab'];
			readonly name: 'MATLAB';
			readonly value: 'matlab';
	  }
	| {
			readonly alias: readonly ['groovy'];
			readonly name: 'Groovy';
			readonly value: 'groovy';
	  }
	| {
			readonly alias: readonly [
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
			];
			readonly name: 'SQL';
			readonly value: 'sql';
	  }
	| {
			readonly alias: readonly ['r'];
			readonly name: 'R';
			readonly value: 'r';
	  }
	| {
			readonly alias: readonly ['perl', 'pl'];
			readonly name: 'Perl';
			readonly value: 'perl';
	  }
	| {
			readonly alias: readonly ['lua'];
			readonly name: 'Lua';
			readonly value: 'lua';
	  }
	| {
			readonly alias: readonly ['pas', 'pascal', 'objectpascal', 'delphi'];
			readonly name: 'Pascal';
			readonly value: 'pascal';
	  }
	| {
			readonly alias: readonly ['xml'];
			readonly name: 'XML';
			readonly value: 'xml';
	  }
	| {
			readonly alias: readonly ['typescript', 'ts'];
			readonly name: 'TypeScript';
			readonly value: 'typescript';
	  }
	| {
			readonly alias: readonly ['coffeescript', 'coffee-script', 'coffee'];
			readonly name: 'CoffeeScript';
			readonly value: 'coffeescript';
	  }
	| {
			readonly alias: readonly ['haskell', 'hs'];
			readonly name: 'Haskell';
			readonly value: 'haskell';
	  }
	| {
			readonly alias: readonly ['puppet'];
			readonly name: 'Puppet';
			readonly value: 'puppet';
	  }
	| {
			readonly alias: readonly ['arduino'];
			readonly name: 'Arduino';
			readonly value: 'arduino';
	  }
	| {
			readonly alias: readonly ['fortran'];
			readonly name: 'Fortran';
			readonly value: 'fortran';
	  }
	| {
			readonly alias: readonly ['erlang', 'erl'];
			readonly name: 'Erlang';
			readonly value: 'erlang';
	  }
	| {
			readonly alias: readonly ['powershell', 'posh', 'ps1', 'psm1'];
			readonly name: 'PowerShell';
			readonly value: 'powershell';
	  }
	| {
			readonly alias: readonly ['haxe', 'hx', 'hxsl'];
			readonly name: 'Haxe';
			readonly value: 'haxe';
	  }
	| {
			readonly alias: readonly ['elixir', 'ex', 'exs'];
			readonly name: 'Elixir';
			readonly value: 'elixir';
	  }
	| {
			readonly alias: readonly ['verilog', 'v'];
			readonly name: 'Verilog';
			readonly value: 'verilog';
	  }
	| {
			readonly alias: readonly ['rust'];
			readonly name: 'Rust';
			readonly value: 'rust';
	  }
	| {
			readonly alias: readonly ['vhdl'];
			readonly name: 'VHDL';
			readonly value: 'vhdl';
	  }
	| {
			readonly alias: readonly ['sass'];
			readonly name: 'Sass';
			readonly value: 'less';
	  }
	| {
			readonly alias: readonly ['ocaml'];
			readonly name: 'OCaml';
			readonly value: 'ocaml';
	  }
	| {
			readonly alias: readonly ['dart'];
			readonly name: 'Dart';
			readonly value: 'dart';
	  }
	| {
			readonly alias: readonly ['css'];
			readonly name: 'CSS';
			readonly value: 'css';
	  }
	| {
			readonly alias: readonly ['restructuredtext', 'rst', 'rest'];
			readonly name: 'reStructuredText';
			readonly value: 'rest';
	  }
	| {
			readonly alias: readonly ['kotlin'];
			readonly name: 'Kotlin';
			readonly value: 'kotlin';
	  }
	| {
			readonly alias: readonly ['d'];
			readonly name: 'D';
			readonly value: 'd';
	  }
	| {
			readonly alias: readonly ['octave'];
			readonly name: 'Octave';
			readonly value: 'matlab';
	  }
	| {
			readonly alias: readonly ['qbs', 'qml'];
			readonly name: 'QML';
			readonly value: 'qml';
	  }
	| {
			readonly alias: readonly ['prolog'];
			readonly name: 'Prolog';
			readonly value: 'prolog';
	  }
	| {
			readonly alias: readonly ['foxpro', 'purebasic'];
			readonly name: 'FoxPro';
			readonly value: 'purebasic';
	  }
	| {
			readonly alias: readonly ['scheme', 'scm'];
			readonly name: 'Scheme';
			readonly value: 'scheme';
	  }
	| {
			readonly alias: readonly ['cuda', 'cu'];
			readonly name: 'CUDA';
			readonly value: 'cpp';
	  }
	| {
			readonly alias: readonly ['julia', 'jl'];
			readonly name: 'Julia';
			readonly value: 'julia';
	  }
	| {
			readonly alias: readonly ['racket', 'rkt'];
			readonly name: 'Racket';
			readonly value: 'lisp';
	  }
	| {
			readonly alias: readonly ['ada', 'ada95', 'ada2005'];
			readonly name: 'Ada';
			readonly value: 'ada';
	  }
	| {
			readonly alias: readonly ['tcl'];
			readonly name: 'Tcl';
			readonly value: 'tcl';
	  }
	| {
			readonly alias: readonly ['mathematica', 'mma', 'nb'];
			readonly name: 'Mathematica';
			readonly value: 'mathematica';
	  }
	| {
			readonly alias: readonly ['autoit'];
			readonly name: 'Autoit';
			readonly value: 'autoit';
	  }
	| {
			readonly alias: readonly ['standardmL', 'sml', 'standardml'];
			readonly name: 'StandardML';
			readonly value: 'sml';
	  }
	| {
			readonly alias: readonly ['objective-j', 'objectivej', 'obj-j', 'objj'];
			readonly name: 'Objective-J';
			readonly value: 'objectivec';
	  }
	| {
			readonly alias: readonly ['smalltalk', 'squeak', 'st'];
			readonly name: 'Smalltalk';
			readonly value: 'smalltalk';
	  }
	| {
			readonly alias: readonly ['vala', 'vapi'];
			readonly name: 'Vala';
			readonly value: 'vala';
	  }
	| {
			readonly alias: readonly ['livescript', 'live-script'];
			readonly name: 'LiveScript';
			readonly value: 'livescript';
	  }
	| {
			readonly alias: readonly ['xquery', 'xqy', 'xq', 'xql', 'xqm'];
			readonly name: 'XQuery';
			readonly value: 'xquery';
	  }
	| {
			readonly alias: readonly ['text', 'plaintext'];
			readonly name: 'PlainText';
			readonly value: 'text';
	  }
	| {
			readonly alias: readonly ['yaml', 'yml'];
			readonly name: 'Yaml';
			readonly value: 'yaml';
	  }
	| {
			readonly alias: readonly ['graphql'];
			readonly name: 'GraphQL';
			readonly value: 'graphql';
	  }
	| {
			readonly alias: readonly ['applescript'];
			readonly name: 'AppleScript';
			readonly value: 'applescript';
	  }
	| {
			readonly alias: readonly ['clojure'];
			readonly name: 'Clojure';
			readonly value: 'clojure';
	  }
	| {
			readonly alias: readonly ['diff'];
			readonly name: 'Diff';
			readonly value: 'diff';
	  }
	| {
			readonly alias: readonly ['visualbasic'];
			readonly name: 'VisualBasic';
			readonly value: 'visual-basic';
	  }
	| {
			readonly alias: readonly ['jsx'];
			readonly name: 'JSX';
			readonly value: 'jsx';
	  }
	| {
			readonly alias: readonly ['tsx'];
			readonly name: 'TSX';
			readonly value: 'tsx';
	  }
	| {
			readonly alias: readonly ['splunk-spl'];
			readonly name: 'SplunkSPL';
			readonly value: 'splunk-spl';
	  }
	| {
			readonly alias: readonly ['docker', 'dockerfile'];
			readonly name: 'Dockerfile';
			readonly value: 'dockerfile';
	  }
	| {
			readonly alias: readonly ['hcl', 'terraform'];
			readonly name: 'HCL';
			readonly value: 'hcl';
	  }
	| {
			readonly alias: readonly ['nginx'];
			readonly name: 'NGINX';
			readonly value: 'nginx';
	  }
	| {
			readonly alias: readonly ['protobuf', 'proto'];
			readonly name: 'Protocol Buffers';
			readonly value: 'protobuf';
	  }
	| {
			readonly alias: readonly ['toml'];
			readonly name: 'TOML';
			readonly value: 'toml';
	  }
	| {
			readonly alias: readonly ['handlebars', 'mustache'];
			readonly name: 'Handlebars';
			readonly value: 'handlebars';
	  }
	| {
			readonly alias: readonly ['gherkin', 'cucumber'];
			readonly name: 'Gherkin';
			readonly value: 'gherkin';
	  }
	| {
			readonly alias: readonly ['abap'];
			readonly name: 'ABAP';
			readonly value: 'abap';
	  }
	| {
			readonly alias: readonly ['markdown'];
			readonly name: 'Markdown';
			readonly value: 'markdown';
	  }
	| {
			alias: string[];
			name: string;
			value: string;
	  }
	| undefined {
	if (!language) {
		return undefined;
	}

	const matches = supportedLanguages.filter((supportedLanguage) => {
		return supportedLanguage.alias.indexOf(language.toLowerCase() as never) !== -1;
	});

	if (matches.length > 0) {
		return matches[0];
	}

	return undefined;
}

export function filterSupportedLanguages(supportedLanguages: Array<string>): Language[] {
	if (!supportedLanguages || !supportedLanguages.length) {
		return DEFAULT_LANGUAGES;
	}

	return DEFAULT_LANGUAGES.filter((language) => {
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

export function createLanguageList(supportedLanguages: Language[]): (
	| {
			readonly alias: readonly ['php', 'php3', 'php4', 'php5'];
			readonly name: 'PHP';
			readonly value: 'php';
	  }
	| {
			readonly alias: readonly ['java'];
			readonly name: 'Java';
			readonly value: 'java';
	  }
	| {
			readonly alias: readonly ['csharp', 'c#'];
			readonly name: 'CSharp';
			readonly value: 'cs';
	  }
	| {
			readonly alias: readonly ['python', 'py'];
			readonly name: 'Python';
			readonly value: 'python';
	  }
	| {
			readonly alias: readonly ['javascript', 'js'];
			readonly name: 'JavaScript';
			readonly value: 'javascript';
	  }
	| {
			readonly alias: readonly ['html'];
			readonly name: 'Html';
			readonly value: 'xml';
	  }
	| {
			readonly alias: readonly ['c++', 'cpp', 'clike'];
			readonly name: 'C++';
			readonly value: 'cpp';
	  }
	| {
			readonly alias: readonly ['ruby', 'rb', 'duby'];
			readonly name: 'Ruby';
			readonly value: 'ruby';
	  }
	| {
			readonly alias: readonly ['objective-c', 'objectivec', 'obj-c', 'objc'];
			readonly name: 'Objective-C';
			readonly value: 'objectivec';
	  }
	| {
			readonly alias: readonly ['c'];
			readonly name: 'C';
			readonly value: 'cpp';
	  }
	| {
			readonly alias: readonly ['swift'];
			readonly name: 'Swift';
			readonly value: 'swift';
	  }
	| {
			readonly alias: readonly ['tex', 'latex'];
			readonly name: 'TeX';
			readonly value: 'tex';
	  }
	| {
			readonly alias: readonly ['shell', 'bash', 'sh', 'ksh', 'zsh'];
			readonly name: 'Shell';
			readonly value: 'shell';
	  }
	| {
			readonly alias: readonly ['scala'];
			readonly name: 'Scala';
			readonly value: 'scala';
	  }
	| {
			readonly alias: readonly ['go'];
			readonly name: 'Go';
			readonly value: 'go';
	  }
	| {
			readonly alias: readonly ['actionscript', 'actionscript3', 'as'];
			readonly name: 'ActionScript';
			readonly value: 'actionscript';
	  }
	| {
			readonly alias: readonly ['coldfusion'];
			readonly name: 'ColdFusion';
			readonly value: 'xml';
	  }
	| {
			readonly alias: readonly ['javafx', 'jfx'];
			readonly name: 'JavaFX';
			readonly value: 'java';
	  }
	| {
			readonly alias: readonly ['vbnet', 'vb.net', 'vfp', 'clipper', 'xbase'];
			readonly name: 'VbNet';
			readonly value: 'vbnet';
	  }
	| {
			readonly alias: readonly ['json'];
			readonly name: 'JSON';
			readonly value: 'json';
	  }
	| {
			readonly alias: readonly ['matlab'];
			readonly name: 'MATLAB';
			readonly value: 'matlab';
	  }
	| {
			readonly alias: readonly ['groovy'];
			readonly name: 'Groovy';
			readonly value: 'groovy';
	  }
	| {
			readonly alias: readonly [
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
			];
			readonly name: 'SQL';
			readonly value: 'sql';
	  }
	| {
			readonly alias: readonly ['r'];
			readonly name: 'R';
			readonly value: 'r';
	  }
	| {
			readonly alias: readonly ['perl', 'pl'];
			readonly name: 'Perl';
			readonly value: 'perl';
	  }
	| {
			readonly alias: readonly ['lua'];
			readonly name: 'Lua';
			readonly value: 'lua';
	  }
	| {
			readonly alias: readonly ['pas', 'pascal', 'objectpascal', 'delphi'];
			readonly name: 'Pascal';
			readonly value: 'pascal';
	  }
	| {
			readonly alias: readonly ['xml'];
			readonly name: 'XML';
			readonly value: 'xml';
	  }
	| {
			readonly alias: readonly ['typescript', 'ts'];
			readonly name: 'TypeScript';
			readonly value: 'typescript';
	  }
	| {
			readonly alias: readonly ['coffeescript', 'coffee-script', 'coffee'];
			readonly name: 'CoffeeScript';
			readonly value: 'coffeescript';
	  }
	| {
			readonly alias: readonly ['haskell', 'hs'];
			readonly name: 'Haskell';
			readonly value: 'haskell';
	  }
	| {
			readonly alias: readonly ['puppet'];
			readonly name: 'Puppet';
			readonly value: 'puppet';
	  }
	| {
			readonly alias: readonly ['arduino'];
			readonly name: 'Arduino';
			readonly value: 'arduino';
	  }
	| {
			readonly alias: readonly ['fortran'];
			readonly name: 'Fortran';
			readonly value: 'fortran';
	  }
	| {
			readonly alias: readonly ['erlang', 'erl'];
			readonly name: 'Erlang';
			readonly value: 'erlang';
	  }
	| {
			readonly alias: readonly ['powershell', 'posh', 'ps1', 'psm1'];
			readonly name: 'PowerShell';
			readonly value: 'powershell';
	  }
	| {
			readonly alias: readonly ['haxe', 'hx', 'hxsl'];
			readonly name: 'Haxe';
			readonly value: 'haxe';
	  }
	| {
			readonly alias: readonly ['elixir', 'ex', 'exs'];
			readonly name: 'Elixir';
			readonly value: 'elixir';
	  }
	| {
			readonly alias: readonly ['verilog', 'v'];
			readonly name: 'Verilog';
			readonly value: 'verilog';
	  }
	| {
			readonly alias: readonly ['rust'];
			readonly name: 'Rust';
			readonly value: 'rust';
	  }
	| {
			readonly alias: readonly ['vhdl'];
			readonly name: 'VHDL';
			readonly value: 'vhdl';
	  }
	| {
			readonly alias: readonly ['sass'];
			readonly name: 'Sass';
			readonly value: 'less';
	  }
	| {
			readonly alias: readonly ['ocaml'];
			readonly name: 'OCaml';
			readonly value: 'ocaml';
	  }
	| {
			readonly alias: readonly ['dart'];
			readonly name: 'Dart';
			readonly value: 'dart';
	  }
	| {
			readonly alias: readonly ['css'];
			readonly name: 'CSS';
			readonly value: 'css';
	  }
	| {
			readonly alias: readonly ['restructuredtext', 'rst', 'rest'];
			readonly name: 'reStructuredText';
			readonly value: 'rest';
	  }
	| {
			readonly alias: readonly ['kotlin'];
			readonly name: 'Kotlin';
			readonly value: 'kotlin';
	  }
	| {
			readonly alias: readonly ['d'];
			readonly name: 'D';
			readonly value: 'd';
	  }
	| {
			readonly alias: readonly ['octave'];
			readonly name: 'Octave';
			readonly value: 'matlab';
	  }
	| {
			readonly alias: readonly ['qbs', 'qml'];
			readonly name: 'QML';
			readonly value: 'qml';
	  }
	| {
			readonly alias: readonly ['prolog'];
			readonly name: 'Prolog';
			readonly value: 'prolog';
	  }
	| {
			readonly alias: readonly ['foxpro', 'purebasic'];
			readonly name: 'FoxPro';
			readonly value: 'purebasic';
	  }
	| {
			readonly alias: readonly ['scheme', 'scm'];
			readonly name: 'Scheme';
			readonly value: 'scheme';
	  }
	| {
			readonly alias: readonly ['cuda', 'cu'];
			readonly name: 'CUDA';
			readonly value: 'cpp';
	  }
	| {
			readonly alias: readonly ['julia', 'jl'];
			readonly name: 'Julia';
			readonly value: 'julia';
	  }
	| {
			readonly alias: readonly ['racket', 'rkt'];
			readonly name: 'Racket';
			readonly value: 'lisp';
	  }
	| {
			readonly alias: readonly ['ada', 'ada95', 'ada2005'];
			readonly name: 'Ada';
			readonly value: 'ada';
	  }
	| {
			readonly alias: readonly ['tcl'];
			readonly name: 'Tcl';
			readonly value: 'tcl';
	  }
	| {
			readonly alias: readonly ['mathematica', 'mma', 'nb'];
			readonly name: 'Mathematica';
			readonly value: 'mathematica';
	  }
	| {
			readonly alias: readonly ['autoit'];
			readonly name: 'Autoit';
			readonly value: 'autoit';
	  }
	| {
			readonly alias: readonly ['standardmL', 'sml', 'standardml'];
			readonly name: 'StandardML';
			readonly value: 'sml';
	  }
	| {
			readonly alias: readonly ['objective-j', 'objectivej', 'obj-j', 'objj'];
			readonly name: 'Objective-J';
			readonly value: 'objectivec';
	  }
	| {
			readonly alias: readonly ['smalltalk', 'squeak', 'st'];
			readonly name: 'Smalltalk';
			readonly value: 'smalltalk';
	  }
	| {
			readonly alias: readonly ['vala', 'vapi'];
			readonly name: 'Vala';
			readonly value: 'vala';
	  }
	| {
			readonly alias: readonly ['livescript', 'live-script'];
			readonly name: 'LiveScript';
			readonly value: 'livescript';
	  }
	| {
			readonly alias: readonly ['xquery', 'xqy', 'xq', 'xql', 'xqm'];
			readonly name: 'XQuery';
			readonly value: 'xquery';
	  }
	| {
			readonly alias: readonly ['text', 'plaintext'];
			readonly name: 'PlainText';
			readonly value: 'text';
	  }
	| {
			readonly alias: readonly ['yaml', 'yml'];
			readonly name: 'Yaml';
			readonly value: 'yaml';
	  }
	| {
			readonly alias: readonly ['graphql'];
			readonly name: 'GraphQL';
			readonly value: 'graphql';
	  }
	| {
			readonly alias: readonly ['applescript'];
			readonly name: 'AppleScript';
			readonly value: 'applescript';
	  }
	| {
			readonly alias: readonly ['clojure'];
			readonly name: 'Clojure';
			readonly value: 'clojure';
	  }
	| {
			readonly alias: readonly ['diff'];
			readonly name: 'Diff';
			readonly value: 'diff';
	  }
	| {
			readonly alias: readonly ['visualbasic'];
			readonly name: 'VisualBasic';
			readonly value: 'visual-basic';
	  }
	| {
			readonly alias: readonly ['jsx'];
			readonly name: 'JSX';
			readonly value: 'jsx';
	  }
	| {
			readonly alias: readonly ['tsx'];
			readonly name: 'TSX';
			readonly value: 'tsx';
	  }
	| {
			readonly alias: readonly ['splunk-spl'];
			readonly name: 'SplunkSPL';
			readonly value: 'splunk-spl';
	  }
	| {
			readonly alias: readonly ['docker', 'dockerfile'];
			readonly name: 'Dockerfile';
			readonly value: 'dockerfile';
	  }
	| {
			readonly alias: readonly ['hcl', 'terraform'];
			readonly name: 'HCL';
			readonly value: 'hcl';
	  }
	| {
			readonly alias: readonly ['nginx'];
			readonly name: 'NGINX';
			readonly value: 'nginx';
	  }
	| {
			readonly alias: readonly ['protobuf', 'proto'];
			readonly name: 'Protocol Buffers';
			readonly value: 'protobuf';
	  }
	| {
			readonly alias: readonly ['toml'];
			readonly name: 'TOML';
			readonly value: 'toml';
	  }
	| {
			readonly alias: readonly ['handlebars', 'mustache'];
			readonly name: 'Handlebars';
			readonly value: 'handlebars';
	  }
	| {
			readonly alias: readonly ['gherkin', 'cucumber'];
			readonly name: 'Gherkin';
			readonly value: 'gherkin';
	  }
	| {
			readonly alias: readonly ['abap'];
			readonly name: 'ABAP';
			readonly value: 'abap';
	  }
	| {
			readonly alias: readonly ['markdown'];
			readonly name: 'Markdown';
			readonly value: 'markdown';
	  }
	| {
			alias: string[];
			name: string;
			value: string;
	  }
)[] {
	return supportedLanguages.sort((left, right) => {
		if (left.alias[0] === 'none') {
			return -1;
		}
		if (left.name.toLowerCase() > right.name.toLowerCase()) {
			return 1;
		}
		if (left.name.toLowerCase() < right.name.toLowerCase()) {
			return -1;
		}
		return 0;
	});
}
