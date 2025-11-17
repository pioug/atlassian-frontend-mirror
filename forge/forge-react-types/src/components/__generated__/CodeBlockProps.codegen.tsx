/**
 * THIS FILE WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 *
 * Extract component prop types from UIKit 2 components - CodeBlockProps
 *
 * @codegen <<SignedSource::6c26b81b83c693ac6c0552fd53179c16>>
 * @codegenCommand yarn workspace @atlaskit/forge-react-types codegen
 * @codegenDependency ../../../../forge-ui/src/components/UIKit/code/__generated__/codeblock.partial.tsx <<SignedSource::27a16c7d91cb7ca0b0cdaa2eb9314633>>
 */
/* eslint @repo/internal/codegen/signed-source-integrity: "warn" */


// Serialized type
type PlatformCodeBlockProps = {
  /**
	 * The code to be formatted.
	 */
	text: string;
  /**
	 * A unique string that appears as a data attribute `data-testid` in the
	 * rendered code. Serves as a hook for automated tests.
	 */
	testId?: string;
  /**
	 *  Sets whether to display code line numbers or not.
	 *  @default true
	 * @deprecated Use `shouldShowLineNumbers` instead
	 */
	showLineNumbers?: boolean;
  /**
	 * Language reference designed to be populated from `SUPPORTED_LANGUAGES` in
	 * `design-system/code`. Run against language grammars from PrismJS (full list
	 * available at [PrismJS documentation](https://prismjs.com/#supported-languages)).
	 *
	 * When set to "text" will not perform highlighting. If unsupported language
	 * provided - code will be treated as "text" with no highlighting.
	 *
	 * @default 'text'
	 */
	language?: 'text' | 'PHP' | 'php' | 'php3' | 'php4' | 'php5' | 'Java' | 'java' | 'CSharp' | 'csharp' | 'c#' | 'Python' | 'python' | 'py' | 'JavaScript' | 'javascript' | 'js' | 'Html' | 'html' | 'xml' | 'C++' | 'c++' | 'cpp' | 'clike' | 'Ruby' | 'ruby' | 'rb' | 'duby' | 'Objective-C' | 'objective-c' | 'objectivec' | 'obj-c' | 'objc' | 'C' | 'c' | 'Swift' | 'swift' | 'TeX' | 'tex' | 'latex' | 'Shell' | 'shell' | 'bash' | 'sh' | 'ksh' | 'zsh' | 'Scala' | 'scala' | 'Go' | 'go' | 'ActionScript' | 'actionscript' | 'actionscript3' | 'as' | 'ColdFusion' | 'coldfusion' | 'JavaFX' | 'javafx' | 'jfx' | 'VbNet' | 'vbnet' | 'vb.net' | 'vfp' | 'clipper' | 'xbase' | 'JSON' | 'json' | 'MATLAB' | 'matlab' | 'Groovy' | 'groovy' | 'SQL' | 'sql' | 'postgresql' | 'postgres' | 'plpgsql' | 'psql' | 'postgresql-console' | 'postgres-console' | 'tsql' | 't-sql' | 'mysql' | 'sqlite' | 'R' | 'r' | 'Perl' | 'perl' | 'pl' | 'Lua' | 'lua' | 'Pascal' | 'pas' | 'pascal' | 'objectpascal' | 'delphi' | 'XML' | 'TypeScript' | 'typescript' | 'ts' | 'CoffeeScript' | 'coffeescript' | 'coffee-script' | 'coffee' | 'Haskell' | 'haskell' | 'hs' | 'Puppet' | 'puppet' | 'Arduino' | 'arduino' | 'Fortran' | 'fortran' | 'Erlang' | 'erlang' | 'erl' | 'PowerShell' | 'powershell' | 'posh' | 'ps1' | 'psm1' | 'Haxe' | 'haxe' | 'hx' | 'hxsl' | 'Elixir' | 'elixir' | 'ex' | 'exs' | 'Verilog' | 'verilog' | 'v' | 'Rust' | 'rust' | 'VHDL' | 'vhdl' | 'Sass' | 'sass' | 'OCaml' | 'ocaml' | 'Dart' | 'dart' | 'CSS' | 'css' | 'reStructuredText' | 'restructuredtext' | 'rst' | 'rest' | 'Kotlin' | 'kotlin' | 'D' | 'd' | 'Octave' | 'octave' | 'QML' | 'qbs' | 'qml' | 'Prolog' | 'prolog' | 'FoxPro' | 'foxpro' | 'purebasic' | 'Scheme' | 'scheme' | 'scm' | 'CUDA' | 'cuda' | 'cu' | 'Julia' | 'julia' | 'jl' | 'Racket' | 'racket' | 'rkt' | 'Ada' | 'ada' | 'ada95' | 'ada2005' | 'Tcl' | 'tcl' | 'Mathematica' | 'mathematica' | 'mma' | 'nb' | 'Autoit' | 'autoit' | 'StandardML' | 'standardmL' | 'sml' | 'standardml' | 'Objective-J' | 'objective-j' | 'objectivej' | 'obj-j' | 'objj' | 'Smalltalk' | 'smalltalk' | 'squeak' | 'st' | 'Vala' | 'vala' | 'vapi' | 'LiveScript' | 'livescript' | 'live-script' | 'XQuery' | 'xquery' | 'xqy' | 'xq' | 'xql' | 'xqm' | 'PlainText' | 'plaintext' | 'Yaml' | 'yaml' | 'yml' | 'GraphQL' | 'graphql' | 'AppleScript' | 'applescript' | 'Clojure' | 'clojure' | 'Diff' | 'diff' | 'VisualBasic' | 'visualbasic' | 'JSX' | 'jsx' | 'TSX' | 'tsx' | 'SplunkSPL' | 'splunk-spl' | 'Dockerfile' | 'docker' | 'dockerfile' | 'HCL' | 'hcl' | 'terraform' | 'NGINX' | 'nginx' | 'Protocol Buffers' | 'protobuf' | 'proto' | 'TOML' | 'toml' | 'Handlebars' | 'handlebars' | 'mustache' | 'Gherkin' | 'gherkin' | 'cucumber' | 'ABAP' | 'abap' | 'Markdown' | 'markdown';
  /**
	 * Comma delimited lines to highlight.
	 *
	 * Example uses:
	 * - To highlight one line `highlight="3"`
	 * - To highlight a group of lines `highlight="1-5"`
	 * - To highlight multiple groups `highlight="1-5,7,10,15-20"`
	 */
	highlight?: string;
  /**
	 * Screen reader text for the start of a highlighted line.
	 */
	highlightedStartText?: string;
  /**
	 * Screen reader text for the end of a highlighted line.
	 */
	highlightedEndText?: string;
  /**
	 * Sets whether long lines will create a horizontally scrolling container.
	 * When set to `true`, these lines will visually wrap instead.
	 * @default false
	 */
	shouldWrapLongLines?: boolean;
};

export type CodeBlockProps = Pick<
  PlatformCodeBlockProps,
  'text' | 'testId' | 'showLineNumbers' | 'language' | 'highlight' | 'highlightedStartText' | 'highlightedEndText' | 'shouldWrapLongLines'
>;

/**
 * Code highlights short strings of code snippets inline with body text.
 *
 * @see [CodeBlock](https://developer.atlassian.com/platform/forge/ui-kit/components/code-block/) in UI Kit documentation for more information
 */
export type TCodeBlock<T> = (props: CodeBlockProps) => T;