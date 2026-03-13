import { SUPPORTED_LANGUAGES } from '@atlaskit/code/constants';

// We expect alias[0] to be used for the ADF attribute, see ED-2813
export const DEFAULT_LANGUAGES: (
	| {
			readonly name: 'PHP';
			readonly alias: readonly ['php', 'php3', 'php4', 'php5'];
			readonly value: 'php';
	  }
	| {
			readonly name: 'Java';
			readonly alias: readonly ['java'];
			readonly value: 'java';
	  }
	| {
			readonly name: 'CSharp';
			readonly alias: readonly ['csharp', 'c#'];
			readonly value: 'cs';
	  }
	| {
			readonly name: 'Python';
			readonly alias: readonly ['python', 'py'];
			readonly value: 'python';
	  }
	| {
			readonly name: 'JavaScript';
			readonly alias: readonly ['javascript', 'js'];
			readonly value: 'javascript';
	  }
	| {
			readonly name: 'Html';
			readonly alias: readonly ['html'];
			readonly value: 'xml';
	  }
	| {
			readonly name: 'C++';
			readonly alias: readonly ['c++', 'cpp', 'clike'];
			readonly value: 'cpp';
	  }
	| {
			readonly name: 'Ruby';
			readonly alias: readonly ['ruby', 'rb', 'duby'];
			readonly value: 'ruby';
	  }
	| {
			readonly name: 'Objective-C';
			readonly alias: readonly ['objective-c', 'objectivec', 'obj-c', 'objc'];
			readonly value: 'objectivec';
	  }
	| {
			readonly name: 'C';
			readonly alias: readonly ['c'];
			readonly value: 'cpp';
	  }
	| {
			readonly name: 'Swift';
			readonly alias: readonly ['swift'];
			readonly value: 'swift';
	  }
	| {
			readonly name: 'TeX';
			readonly alias: readonly ['tex', 'latex'];
			readonly value: 'tex';
	  }
	| {
			readonly name: 'Shell';
			readonly alias: readonly ['shell', 'bash', 'sh', 'ksh', 'zsh'];
			readonly value: 'shell';
	  }
	| {
			readonly name: 'Scala';
			readonly alias: readonly ['scala'];
			readonly value: 'scala';
	  }
	| {
			readonly name: 'Go';
			readonly alias: readonly ['go'];
			readonly value: 'go';
	  }
	| {
			readonly name: 'ActionScript';
			readonly alias: readonly ['actionscript', 'actionscript3', 'as'];
			readonly value: 'actionscript';
	  }
	| {
			readonly name: 'ColdFusion';
			readonly alias: readonly ['coldfusion'];
			readonly value: 'xml';
	  }
	| {
			readonly name: 'JavaFX';
			readonly alias: readonly ['javafx', 'jfx'];
			readonly value: 'java';
	  }
	| {
			readonly name: 'VbNet';
			readonly alias: readonly ['vbnet', 'vb.net', 'vfp', 'clipper', 'xbase'];
			readonly value: 'vbnet';
	  }
	| {
			readonly name: 'JSON';
			readonly alias: readonly ['json'];
			readonly value: 'json';
	  }
	| {
			readonly name: 'MATLAB';
			readonly alias: readonly ['matlab'];
			readonly value: 'matlab';
	  }
	| {
			readonly name: 'Groovy';
			readonly alias: readonly ['groovy'];
			readonly value: 'groovy';
	  }
	| {
			readonly name: 'SQL';
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
			readonly value: 'sql';
	  }
	| {
			readonly name: 'R';
			readonly alias: readonly ['r'];
			readonly value: 'r';
	  }
	| {
			readonly name: 'Perl';
			readonly alias: readonly ['perl', 'pl'];
			readonly value: 'perl';
	  }
	| {
			readonly name: 'Lua';
			readonly alias: readonly ['lua'];
			readonly value: 'lua';
	  }
	| {
			readonly name: 'Pascal';
			readonly alias: readonly ['pas', 'pascal', 'objectpascal', 'delphi'];
			readonly value: 'pascal';
	  }
	| {
			readonly name: 'XML';
			readonly alias: readonly ['xml'];
			readonly value: 'xml';
	  }
	| {
			readonly name: 'TypeScript';
			readonly alias: readonly ['typescript', 'ts'];
			readonly value: 'typescript';
	  }
	| {
			readonly name: 'CoffeeScript';
			readonly alias: readonly ['coffeescript', 'coffee-script', 'coffee'];
			readonly value: 'coffeescript';
	  }
	| {
			readonly name: 'Haskell';
			readonly alias: readonly ['haskell', 'hs'];
			readonly value: 'haskell';
	  }
	| {
			readonly name: 'Puppet';
			readonly alias: readonly ['puppet'];
			readonly value: 'puppet';
	  }
	| {
			readonly name: 'Arduino';
			readonly alias: readonly ['arduino'];
			readonly value: 'arduino';
	  }
	| {
			readonly name: 'Fortran';
			readonly alias: readonly ['fortran'];
			readonly value: 'fortran';
	  }
	| {
			readonly name: 'Erlang';
			readonly alias: readonly ['erlang', 'erl'];
			readonly value: 'erlang';
	  }
	| {
			readonly name: 'PowerShell';
			readonly alias: readonly ['powershell', 'posh', 'ps1', 'psm1'];
			readonly value: 'powershell';
	  }
	| {
			readonly name: 'Haxe';
			readonly alias: readonly ['haxe', 'hx', 'hxsl'];
			readonly value: 'haxe';
	  }
	| {
			readonly name: 'Elixir';
			readonly alias: readonly ['elixir', 'ex', 'exs'];
			readonly value: 'elixir';
	  }
	| {
			readonly name: 'Verilog';
			readonly alias: readonly ['verilog', 'v'];
			readonly value: 'verilog';
	  }
	| {
			readonly name: 'Rust';
			readonly alias: readonly ['rust'];
			readonly value: 'rust';
	  }
	| {
			readonly name: 'VHDL';
			readonly alias: readonly ['vhdl'];
			readonly value: 'vhdl';
	  }
	| {
			readonly name: 'Sass';
			readonly alias: readonly ['sass'];
			readonly value: 'less';
	  }
	| {
			readonly name: 'OCaml';
			readonly alias: readonly ['ocaml'];
			readonly value: 'ocaml';
	  }
	| {
			readonly name: 'Dart';
			readonly alias: readonly ['dart'];
			readonly value: 'dart';
	  }
	| {
			readonly name: 'CSS';
			readonly alias: readonly ['css'];
			readonly value: 'css';
	  }
	| {
			readonly name: 'reStructuredText';
			readonly alias: readonly ['restructuredtext', 'rst', 'rest'];
			readonly value: 'rest';
	  }
	| {
			readonly name: 'Kotlin';
			readonly alias: readonly ['kotlin'];
			readonly value: 'kotlin';
	  }
	| {
			readonly name: 'D';
			readonly alias: readonly ['d'];
			readonly value: 'd';
	  }
	| {
			readonly name: 'Octave';
			readonly alias: readonly ['octave'];
			readonly value: 'matlab';
	  }
	| {
			readonly name: 'QML';
			readonly alias: readonly ['qbs', 'qml'];
			readonly value: 'qml';
	  }
	| {
			readonly name: 'Prolog';
			readonly alias: readonly ['prolog'];
			readonly value: 'prolog';
	  }
	| {
			readonly name: 'FoxPro';
			readonly alias: readonly ['foxpro', 'purebasic'];
			readonly value: 'purebasic';
	  }
	| {
			readonly name: 'Scheme';
			readonly alias: readonly ['scheme', 'scm'];
			readonly value: 'scheme';
	  }
	| {
			readonly name: 'CUDA';
			readonly alias: readonly ['cuda', 'cu'];
			readonly value: 'cpp';
	  }
	| {
			readonly name: 'Julia';
			readonly alias: readonly ['julia', 'jl'];
			readonly value: 'julia';
	  }
	| {
			readonly name: 'Racket';
			readonly alias: readonly ['racket', 'rkt'];
			readonly value: 'lisp';
	  }
	| {
			readonly name: 'Ada';
			readonly alias: readonly ['ada', 'ada95', 'ada2005'];
			readonly value: 'ada';
	  }
	| {
			readonly name: 'Tcl';
			readonly alias: readonly ['tcl'];
			readonly value: 'tcl';
	  }
	| {
			readonly name: 'Mathematica';
			readonly alias: readonly ['mathematica', 'mma', 'nb'];
			readonly value: 'mathematica';
	  }
	| {
			readonly name: 'Autoit';
			readonly alias: readonly ['autoit'];
			readonly value: 'autoit';
	  }
	| {
			readonly name: 'StandardML';
			readonly alias: readonly ['standardmL', 'sml', 'standardml'];
			readonly value: 'sml';
	  }
	| {
			readonly name: 'Objective-J';
			readonly alias: readonly ['objective-j', 'objectivej', 'obj-j', 'objj'];
			readonly value: 'objectivec';
	  }
	| {
			readonly name: 'Smalltalk';
			readonly alias: readonly ['smalltalk', 'squeak', 'st'];
			readonly value: 'smalltalk';
	  }
	| {
			readonly name: 'Vala';
			readonly alias: readonly ['vala', 'vapi'];
			readonly value: 'vala';
	  }
	| {
			readonly name: 'LiveScript';
			readonly alias: readonly ['livescript', 'live-script'];
			readonly value: 'livescript';
	  }
	| {
			readonly name: 'XQuery';
			readonly alias: readonly ['xquery', 'xqy', 'xq', 'xql', 'xqm'];
			readonly value: 'xquery';
	  }
	| {
			readonly name: 'PlainText';
			readonly alias: readonly ['text', 'plaintext'];
			readonly value: 'text';
	  }
	| {
			readonly name: 'Yaml';
			readonly alias: readonly ['yaml', 'yml'];
			readonly value: 'yaml';
	  }
	| {
			readonly name: 'GraphQL';
			readonly alias: readonly ['graphql'];
			readonly value: 'graphql';
	  }
	| {
			readonly name: 'AppleScript';
			readonly alias: readonly ['applescript'];
			readonly value: 'applescript';
	  }
	| {
			readonly name: 'Clojure';
			readonly alias: readonly ['clojure'];
			readonly value: 'clojure';
	  }
	| {
			readonly name: 'Diff';
			readonly alias: readonly ['diff'];
			readonly value: 'diff';
	  }
	| {
			readonly name: 'VisualBasic';
			readonly alias: readonly ['visualbasic'];
			readonly value: 'visual-basic';
	  }
	| {
			readonly name: 'JSX';
			readonly alias: readonly ['jsx'];
			readonly value: 'jsx';
	  }
	| {
			readonly name: 'TSX';
			readonly alias: readonly ['tsx'];
			readonly value: 'tsx';
	  }
	| {
			readonly name: 'SplunkSPL';
			readonly alias: readonly ['splunk-spl'];
			readonly value: 'splunk-spl';
	  }
	| {
			readonly name: 'Dockerfile';
			readonly alias: readonly ['docker', 'dockerfile'];
			readonly value: 'dockerfile';
	  }
	| {
			readonly name: 'HCL';
			readonly alias: readonly ['hcl', 'terraform'];
			readonly value: 'hcl';
	  }
	| {
			readonly name: 'NGINX';
			readonly alias: readonly ['nginx'];
			readonly value: 'nginx';
	  }
	| {
			readonly name: 'Protocol Buffers';
			readonly alias: readonly ['protobuf', 'proto'];
			readonly value: 'protobuf';
	  }
	| {
			readonly name: 'TOML';
			readonly alias: readonly ['toml'];
			readonly value: 'toml';
	  }
	| {
			readonly name: 'Handlebars';
			readonly alias: readonly ['handlebars', 'mustache'];
			readonly value: 'handlebars';
	  }
	| {
			readonly name: 'Gherkin';
			readonly alias: readonly ['gherkin', 'cucumber'];
			readonly value: 'gherkin';
	  }
	| {
			readonly name: 'ABAP';
			readonly alias: readonly ['abap'];
			readonly value: 'abap';
	  }
	| {
			readonly name: 'Markdown';
			readonly alias: readonly ['markdown'];
			readonly value: 'markdown';
	  }
	| {
			name: string;
			alias: string[];
			value: string;
	  }
)[] = [{ name: '(None)', alias: ['none'], value: 'none' }, ...SUPPORTED_LANGUAGES];

export type Language = (typeof DEFAULT_LANGUAGES)[number];

export function findMatchedLanguage(
	supportedLanguages: Language[],
	language?: string,
):
	| {
			readonly name: 'PHP';
			readonly alias: readonly ['php', 'php3', 'php4', 'php5'];
			readonly value: 'php';
	  }
	| {
			readonly name: 'Java';
			readonly alias: readonly ['java'];
			readonly value: 'java';
	  }
	| {
			readonly name: 'CSharp';
			readonly alias: readonly ['csharp', 'c#'];
			readonly value: 'cs';
	  }
	| {
			readonly name: 'Python';
			readonly alias: readonly ['python', 'py'];
			readonly value: 'python';
	  }
	| {
			readonly name: 'JavaScript';
			readonly alias: readonly ['javascript', 'js'];
			readonly value: 'javascript';
	  }
	| {
			readonly name: 'Html';
			readonly alias: readonly ['html'];
			readonly value: 'xml';
	  }
	| {
			readonly name: 'C++';
			readonly alias: readonly ['c++', 'cpp', 'clike'];
			readonly value: 'cpp';
	  }
	| {
			readonly name: 'Ruby';
			readonly alias: readonly ['ruby', 'rb', 'duby'];
			readonly value: 'ruby';
	  }
	| {
			readonly name: 'Objective-C';
			readonly alias: readonly ['objective-c', 'objectivec', 'obj-c', 'objc'];
			readonly value: 'objectivec';
	  }
	| {
			readonly name: 'C';
			readonly alias: readonly ['c'];
			readonly value: 'cpp';
	  }
	| {
			readonly name: 'Swift';
			readonly alias: readonly ['swift'];
			readonly value: 'swift';
	  }
	| {
			readonly name: 'TeX';
			readonly alias: readonly ['tex', 'latex'];
			readonly value: 'tex';
	  }
	| {
			readonly name: 'Shell';
			readonly alias: readonly ['shell', 'bash', 'sh', 'ksh', 'zsh'];
			readonly value: 'shell';
	  }
	| {
			readonly name: 'Scala';
			readonly alias: readonly ['scala'];
			readonly value: 'scala';
	  }
	| {
			readonly name: 'Go';
			readonly alias: readonly ['go'];
			readonly value: 'go';
	  }
	| {
			readonly name: 'ActionScript';
			readonly alias: readonly ['actionscript', 'actionscript3', 'as'];
			readonly value: 'actionscript';
	  }
	| {
			readonly name: 'ColdFusion';
			readonly alias: readonly ['coldfusion'];
			readonly value: 'xml';
	  }
	| {
			readonly name: 'JavaFX';
			readonly alias: readonly ['javafx', 'jfx'];
			readonly value: 'java';
	  }
	| {
			readonly name: 'VbNet';
			readonly alias: readonly ['vbnet', 'vb.net', 'vfp', 'clipper', 'xbase'];
			readonly value: 'vbnet';
	  }
	| {
			readonly name: 'JSON';
			readonly alias: readonly ['json'];
			readonly value: 'json';
	  }
	| {
			readonly name: 'MATLAB';
			readonly alias: readonly ['matlab'];
			readonly value: 'matlab';
	  }
	| {
			readonly name: 'Groovy';
			readonly alias: readonly ['groovy'];
			readonly value: 'groovy';
	  }
	| {
			readonly name: 'SQL';
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
			readonly value: 'sql';
	  }
	| {
			readonly name: 'R';
			readonly alias: readonly ['r'];
			readonly value: 'r';
	  }
	| {
			readonly name: 'Perl';
			readonly alias: readonly ['perl', 'pl'];
			readonly value: 'perl';
	  }
	| {
			readonly name: 'Lua';
			readonly alias: readonly ['lua'];
			readonly value: 'lua';
	  }
	| {
			readonly name: 'Pascal';
			readonly alias: readonly ['pas', 'pascal', 'objectpascal', 'delphi'];
			readonly value: 'pascal';
	  }
	| {
			readonly name: 'XML';
			readonly alias: readonly ['xml'];
			readonly value: 'xml';
	  }
	| {
			readonly name: 'TypeScript';
			readonly alias: readonly ['typescript', 'ts'];
			readonly value: 'typescript';
	  }
	| {
			readonly name: 'CoffeeScript';
			readonly alias: readonly ['coffeescript', 'coffee-script', 'coffee'];
			readonly value: 'coffeescript';
	  }
	| {
			readonly name: 'Haskell';
			readonly alias: readonly ['haskell', 'hs'];
			readonly value: 'haskell';
	  }
	| {
			readonly name: 'Puppet';
			readonly alias: readonly ['puppet'];
			readonly value: 'puppet';
	  }
	| {
			readonly name: 'Arduino';
			readonly alias: readonly ['arduino'];
			readonly value: 'arduino';
	  }
	| {
			readonly name: 'Fortran';
			readonly alias: readonly ['fortran'];
			readonly value: 'fortran';
	  }
	| {
			readonly name: 'Erlang';
			readonly alias: readonly ['erlang', 'erl'];
			readonly value: 'erlang';
	  }
	| {
			readonly name: 'PowerShell';
			readonly alias: readonly ['powershell', 'posh', 'ps1', 'psm1'];
			readonly value: 'powershell';
	  }
	| {
			readonly name: 'Haxe';
			readonly alias: readonly ['haxe', 'hx', 'hxsl'];
			readonly value: 'haxe';
	  }
	| {
			readonly name: 'Elixir';
			readonly alias: readonly ['elixir', 'ex', 'exs'];
			readonly value: 'elixir';
	  }
	| {
			readonly name: 'Verilog';
			readonly alias: readonly ['verilog', 'v'];
			readonly value: 'verilog';
	  }
	| {
			readonly name: 'Rust';
			readonly alias: readonly ['rust'];
			readonly value: 'rust';
	  }
	| {
			readonly name: 'VHDL';
			readonly alias: readonly ['vhdl'];
			readonly value: 'vhdl';
	  }
	| {
			readonly name: 'Sass';
			readonly alias: readonly ['sass'];
			readonly value: 'less';
	  }
	| {
			readonly name: 'OCaml';
			readonly alias: readonly ['ocaml'];
			readonly value: 'ocaml';
	  }
	| {
			readonly name: 'Dart';
			readonly alias: readonly ['dart'];
			readonly value: 'dart';
	  }
	| {
			readonly name: 'CSS';
			readonly alias: readonly ['css'];
			readonly value: 'css';
	  }
	| {
			readonly name: 'reStructuredText';
			readonly alias: readonly ['restructuredtext', 'rst', 'rest'];
			readonly value: 'rest';
	  }
	| {
			readonly name: 'Kotlin';
			readonly alias: readonly ['kotlin'];
			readonly value: 'kotlin';
	  }
	| {
			readonly name: 'D';
			readonly alias: readonly ['d'];
			readonly value: 'd';
	  }
	| {
			readonly name: 'Octave';
			readonly alias: readonly ['octave'];
			readonly value: 'matlab';
	  }
	| {
			readonly name: 'QML';
			readonly alias: readonly ['qbs', 'qml'];
			readonly value: 'qml';
	  }
	| {
			readonly name: 'Prolog';
			readonly alias: readonly ['prolog'];
			readonly value: 'prolog';
	  }
	| {
			readonly name: 'FoxPro';
			readonly alias: readonly ['foxpro', 'purebasic'];
			readonly value: 'purebasic';
	  }
	| {
			readonly name: 'Scheme';
			readonly alias: readonly ['scheme', 'scm'];
			readonly value: 'scheme';
	  }
	| {
			readonly name: 'CUDA';
			readonly alias: readonly ['cuda', 'cu'];
			readonly value: 'cpp';
	  }
	| {
			readonly name: 'Julia';
			readonly alias: readonly ['julia', 'jl'];
			readonly value: 'julia';
	  }
	| {
			readonly name: 'Racket';
			readonly alias: readonly ['racket', 'rkt'];
			readonly value: 'lisp';
	  }
	| {
			readonly name: 'Ada';
			readonly alias: readonly ['ada', 'ada95', 'ada2005'];
			readonly value: 'ada';
	  }
	| {
			readonly name: 'Tcl';
			readonly alias: readonly ['tcl'];
			readonly value: 'tcl';
	  }
	| {
			readonly name: 'Mathematica';
			readonly alias: readonly ['mathematica', 'mma', 'nb'];
			readonly value: 'mathematica';
	  }
	| {
			readonly name: 'Autoit';
			readonly alias: readonly ['autoit'];
			readonly value: 'autoit';
	  }
	| {
			readonly name: 'StandardML';
			readonly alias: readonly ['standardmL', 'sml', 'standardml'];
			readonly value: 'sml';
	  }
	| {
			readonly name: 'Objective-J';
			readonly alias: readonly ['objective-j', 'objectivej', 'obj-j', 'objj'];
			readonly value: 'objectivec';
	  }
	| {
			readonly name: 'Smalltalk';
			readonly alias: readonly ['smalltalk', 'squeak', 'st'];
			readonly value: 'smalltalk';
	  }
	| {
			readonly name: 'Vala';
			readonly alias: readonly ['vala', 'vapi'];
			readonly value: 'vala';
	  }
	| {
			readonly name: 'LiveScript';
			readonly alias: readonly ['livescript', 'live-script'];
			readonly value: 'livescript';
	  }
	| {
			readonly name: 'XQuery';
			readonly alias: readonly ['xquery', 'xqy', 'xq', 'xql', 'xqm'];
			readonly value: 'xquery';
	  }
	| {
			readonly name: 'PlainText';
			readonly alias: readonly ['text', 'plaintext'];
			readonly value: 'text';
	  }
	| {
			readonly name: 'Yaml';
			readonly alias: readonly ['yaml', 'yml'];
			readonly value: 'yaml';
	  }
	| {
			readonly name: 'GraphQL';
			readonly alias: readonly ['graphql'];
			readonly value: 'graphql';
	  }
	| {
			readonly name: 'AppleScript';
			readonly alias: readonly ['applescript'];
			readonly value: 'applescript';
	  }
	| {
			readonly name: 'Clojure';
			readonly alias: readonly ['clojure'];
			readonly value: 'clojure';
	  }
	| {
			readonly name: 'Diff';
			readonly alias: readonly ['diff'];
			readonly value: 'diff';
	  }
	| {
			readonly name: 'VisualBasic';
			readonly alias: readonly ['visualbasic'];
			readonly value: 'visual-basic';
	  }
	| {
			readonly name: 'JSX';
			readonly alias: readonly ['jsx'];
			readonly value: 'jsx';
	  }
	| {
			readonly name: 'TSX';
			readonly alias: readonly ['tsx'];
			readonly value: 'tsx';
	  }
	| {
			readonly name: 'SplunkSPL';
			readonly alias: readonly ['splunk-spl'];
			readonly value: 'splunk-spl';
	  }
	| {
			readonly name: 'Dockerfile';
			readonly alias: readonly ['docker', 'dockerfile'];
			readonly value: 'dockerfile';
	  }
	| {
			readonly name: 'HCL';
			readonly alias: readonly ['hcl', 'terraform'];
			readonly value: 'hcl';
	  }
	| {
			readonly name: 'NGINX';
			readonly alias: readonly ['nginx'];
			readonly value: 'nginx';
	  }
	| {
			readonly name: 'Protocol Buffers';
			readonly alias: readonly ['protobuf', 'proto'];
			readonly value: 'protobuf';
	  }
	| {
			readonly name: 'TOML';
			readonly alias: readonly ['toml'];
			readonly value: 'toml';
	  }
	| {
			readonly name: 'Handlebars';
			readonly alias: readonly ['handlebars', 'mustache'];
			readonly value: 'handlebars';
	  }
	| {
			readonly name: 'Gherkin';
			readonly alias: readonly ['gherkin', 'cucumber'];
			readonly value: 'gherkin';
	  }
	| {
			readonly name: 'ABAP';
			readonly alias: readonly ['abap'];
			readonly value: 'abap';
	  }
	| {
			readonly name: 'Markdown';
			readonly alias: readonly ['markdown'];
			readonly value: 'markdown';
	  }
	| {
			name: string;
			alias: string[];
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
			readonly name: 'PHP';
			readonly alias: readonly ['php', 'php3', 'php4', 'php5'];
			readonly value: 'php';
	  }
	| {
			readonly name: 'Java';
			readonly alias: readonly ['java'];
			readonly value: 'java';
	  }
	| {
			readonly name: 'CSharp';
			readonly alias: readonly ['csharp', 'c#'];
			readonly value: 'cs';
	  }
	| {
			readonly name: 'Python';
			readonly alias: readonly ['python', 'py'];
			readonly value: 'python';
	  }
	| {
			readonly name: 'JavaScript';
			readonly alias: readonly ['javascript', 'js'];
			readonly value: 'javascript';
	  }
	| {
			readonly name: 'Html';
			readonly alias: readonly ['html'];
			readonly value: 'xml';
	  }
	| {
			readonly name: 'C++';
			readonly alias: readonly ['c++', 'cpp', 'clike'];
			readonly value: 'cpp';
	  }
	| {
			readonly name: 'Ruby';
			readonly alias: readonly ['ruby', 'rb', 'duby'];
			readonly value: 'ruby';
	  }
	| {
			readonly name: 'Objective-C';
			readonly alias: readonly ['objective-c', 'objectivec', 'obj-c', 'objc'];
			readonly value: 'objectivec';
	  }
	| {
			readonly name: 'C';
			readonly alias: readonly ['c'];
			readonly value: 'cpp';
	  }
	| {
			readonly name: 'Swift';
			readonly alias: readonly ['swift'];
			readonly value: 'swift';
	  }
	| {
			readonly name: 'TeX';
			readonly alias: readonly ['tex', 'latex'];
			readonly value: 'tex';
	  }
	| {
			readonly name: 'Shell';
			readonly alias: readonly ['shell', 'bash', 'sh', 'ksh', 'zsh'];
			readonly value: 'shell';
	  }
	| {
			readonly name: 'Scala';
			readonly alias: readonly ['scala'];
			readonly value: 'scala';
	  }
	| {
			readonly name: 'Go';
			readonly alias: readonly ['go'];
			readonly value: 'go';
	  }
	| {
			readonly name: 'ActionScript';
			readonly alias: readonly ['actionscript', 'actionscript3', 'as'];
			readonly value: 'actionscript';
	  }
	| {
			readonly name: 'ColdFusion';
			readonly alias: readonly ['coldfusion'];
			readonly value: 'xml';
	  }
	| {
			readonly name: 'JavaFX';
			readonly alias: readonly ['javafx', 'jfx'];
			readonly value: 'java';
	  }
	| {
			readonly name: 'VbNet';
			readonly alias: readonly ['vbnet', 'vb.net', 'vfp', 'clipper', 'xbase'];
			readonly value: 'vbnet';
	  }
	| {
			readonly name: 'JSON';
			readonly alias: readonly ['json'];
			readonly value: 'json';
	  }
	| {
			readonly name: 'MATLAB';
			readonly alias: readonly ['matlab'];
			readonly value: 'matlab';
	  }
	| {
			readonly name: 'Groovy';
			readonly alias: readonly ['groovy'];
			readonly value: 'groovy';
	  }
	| {
			readonly name: 'SQL';
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
			readonly value: 'sql';
	  }
	| {
			readonly name: 'R';
			readonly alias: readonly ['r'];
			readonly value: 'r';
	  }
	| {
			readonly name: 'Perl';
			readonly alias: readonly ['perl', 'pl'];
			readonly value: 'perl';
	  }
	| {
			readonly name: 'Lua';
			readonly alias: readonly ['lua'];
			readonly value: 'lua';
	  }
	| {
			readonly name: 'Pascal';
			readonly alias: readonly ['pas', 'pascal', 'objectpascal', 'delphi'];
			readonly value: 'pascal';
	  }
	| {
			readonly name: 'XML';
			readonly alias: readonly ['xml'];
			readonly value: 'xml';
	  }
	| {
			readonly name: 'TypeScript';
			readonly alias: readonly ['typescript', 'ts'];
			readonly value: 'typescript';
	  }
	| {
			readonly name: 'CoffeeScript';
			readonly alias: readonly ['coffeescript', 'coffee-script', 'coffee'];
			readonly value: 'coffeescript';
	  }
	| {
			readonly name: 'Haskell';
			readonly alias: readonly ['haskell', 'hs'];
			readonly value: 'haskell';
	  }
	| {
			readonly name: 'Puppet';
			readonly alias: readonly ['puppet'];
			readonly value: 'puppet';
	  }
	| {
			readonly name: 'Arduino';
			readonly alias: readonly ['arduino'];
			readonly value: 'arduino';
	  }
	| {
			readonly name: 'Fortran';
			readonly alias: readonly ['fortran'];
			readonly value: 'fortran';
	  }
	| {
			readonly name: 'Erlang';
			readonly alias: readonly ['erlang', 'erl'];
			readonly value: 'erlang';
	  }
	| {
			readonly name: 'PowerShell';
			readonly alias: readonly ['powershell', 'posh', 'ps1', 'psm1'];
			readonly value: 'powershell';
	  }
	| {
			readonly name: 'Haxe';
			readonly alias: readonly ['haxe', 'hx', 'hxsl'];
			readonly value: 'haxe';
	  }
	| {
			readonly name: 'Elixir';
			readonly alias: readonly ['elixir', 'ex', 'exs'];
			readonly value: 'elixir';
	  }
	| {
			readonly name: 'Verilog';
			readonly alias: readonly ['verilog', 'v'];
			readonly value: 'verilog';
	  }
	| {
			readonly name: 'Rust';
			readonly alias: readonly ['rust'];
			readonly value: 'rust';
	  }
	| {
			readonly name: 'VHDL';
			readonly alias: readonly ['vhdl'];
			readonly value: 'vhdl';
	  }
	| {
			readonly name: 'Sass';
			readonly alias: readonly ['sass'];
			readonly value: 'less';
	  }
	| {
			readonly name: 'OCaml';
			readonly alias: readonly ['ocaml'];
			readonly value: 'ocaml';
	  }
	| {
			readonly name: 'Dart';
			readonly alias: readonly ['dart'];
			readonly value: 'dart';
	  }
	| {
			readonly name: 'CSS';
			readonly alias: readonly ['css'];
			readonly value: 'css';
	  }
	| {
			readonly name: 'reStructuredText';
			readonly alias: readonly ['restructuredtext', 'rst', 'rest'];
			readonly value: 'rest';
	  }
	| {
			readonly name: 'Kotlin';
			readonly alias: readonly ['kotlin'];
			readonly value: 'kotlin';
	  }
	| {
			readonly name: 'D';
			readonly alias: readonly ['d'];
			readonly value: 'd';
	  }
	| {
			readonly name: 'Octave';
			readonly alias: readonly ['octave'];
			readonly value: 'matlab';
	  }
	| {
			readonly name: 'QML';
			readonly alias: readonly ['qbs', 'qml'];
			readonly value: 'qml';
	  }
	| {
			readonly name: 'Prolog';
			readonly alias: readonly ['prolog'];
			readonly value: 'prolog';
	  }
	| {
			readonly name: 'FoxPro';
			readonly alias: readonly ['foxpro', 'purebasic'];
			readonly value: 'purebasic';
	  }
	| {
			readonly name: 'Scheme';
			readonly alias: readonly ['scheme', 'scm'];
			readonly value: 'scheme';
	  }
	| {
			readonly name: 'CUDA';
			readonly alias: readonly ['cuda', 'cu'];
			readonly value: 'cpp';
	  }
	| {
			readonly name: 'Julia';
			readonly alias: readonly ['julia', 'jl'];
			readonly value: 'julia';
	  }
	| {
			readonly name: 'Racket';
			readonly alias: readonly ['racket', 'rkt'];
			readonly value: 'lisp';
	  }
	| {
			readonly name: 'Ada';
			readonly alias: readonly ['ada', 'ada95', 'ada2005'];
			readonly value: 'ada';
	  }
	| {
			readonly name: 'Tcl';
			readonly alias: readonly ['tcl'];
			readonly value: 'tcl';
	  }
	| {
			readonly name: 'Mathematica';
			readonly alias: readonly ['mathematica', 'mma', 'nb'];
			readonly value: 'mathematica';
	  }
	| {
			readonly name: 'Autoit';
			readonly alias: readonly ['autoit'];
			readonly value: 'autoit';
	  }
	| {
			readonly name: 'StandardML';
			readonly alias: readonly ['standardmL', 'sml', 'standardml'];
			readonly value: 'sml';
	  }
	| {
			readonly name: 'Objective-J';
			readonly alias: readonly ['objective-j', 'objectivej', 'obj-j', 'objj'];
			readonly value: 'objectivec';
	  }
	| {
			readonly name: 'Smalltalk';
			readonly alias: readonly ['smalltalk', 'squeak', 'st'];
			readonly value: 'smalltalk';
	  }
	| {
			readonly name: 'Vala';
			readonly alias: readonly ['vala', 'vapi'];
			readonly value: 'vala';
	  }
	| {
			readonly name: 'LiveScript';
			readonly alias: readonly ['livescript', 'live-script'];
			readonly value: 'livescript';
	  }
	| {
			readonly name: 'XQuery';
			readonly alias: readonly ['xquery', 'xqy', 'xq', 'xql', 'xqm'];
			readonly value: 'xquery';
	  }
	| {
			readonly name: 'PlainText';
			readonly alias: readonly ['text', 'plaintext'];
			readonly value: 'text';
	  }
	| {
			readonly name: 'Yaml';
			readonly alias: readonly ['yaml', 'yml'];
			readonly value: 'yaml';
	  }
	| {
			readonly name: 'GraphQL';
			readonly alias: readonly ['graphql'];
			readonly value: 'graphql';
	  }
	| {
			readonly name: 'AppleScript';
			readonly alias: readonly ['applescript'];
			readonly value: 'applescript';
	  }
	| {
			readonly name: 'Clojure';
			readonly alias: readonly ['clojure'];
			readonly value: 'clojure';
	  }
	| {
			readonly name: 'Diff';
			readonly alias: readonly ['diff'];
			readonly value: 'diff';
	  }
	| {
			readonly name: 'VisualBasic';
			readonly alias: readonly ['visualbasic'];
			readonly value: 'visual-basic';
	  }
	| {
			readonly name: 'JSX';
			readonly alias: readonly ['jsx'];
			readonly value: 'jsx';
	  }
	| {
			readonly name: 'TSX';
			readonly alias: readonly ['tsx'];
			readonly value: 'tsx';
	  }
	| {
			readonly name: 'SplunkSPL';
			readonly alias: readonly ['splunk-spl'];
			readonly value: 'splunk-spl';
	  }
	| {
			readonly name: 'Dockerfile';
			readonly alias: readonly ['docker', 'dockerfile'];
			readonly value: 'dockerfile';
	  }
	| {
			readonly name: 'HCL';
			readonly alias: readonly ['hcl', 'terraform'];
			readonly value: 'hcl';
	  }
	| {
			readonly name: 'NGINX';
			readonly alias: readonly ['nginx'];
			readonly value: 'nginx';
	  }
	| {
			readonly name: 'Protocol Buffers';
			readonly alias: readonly ['protobuf', 'proto'];
			readonly value: 'protobuf';
	  }
	| {
			readonly name: 'TOML';
			readonly alias: readonly ['toml'];
			readonly value: 'toml';
	  }
	| {
			readonly name: 'Handlebars';
			readonly alias: readonly ['handlebars', 'mustache'];
			readonly value: 'handlebars';
	  }
	| {
			readonly name: 'Gherkin';
			readonly alias: readonly ['gherkin', 'cucumber'];
			readonly value: 'gherkin';
	  }
	| {
			readonly name: 'ABAP';
			readonly alias: readonly ['abap'];
			readonly value: 'abap';
	  }
	| {
			readonly name: 'Markdown';
			readonly alias: readonly ['markdown'];
			readonly value: 'markdown';
	  }
	| {
			name: string;
			alias: string[];
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
