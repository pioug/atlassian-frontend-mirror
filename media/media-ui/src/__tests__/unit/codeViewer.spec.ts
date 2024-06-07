import { getLanguageType, getExtension, isCodeViewerItem } from '../../codeViewer';

describe(getLanguageType, () => {
	test.each([
		['abap', 'abap'],
		['ada', 'ada'],
		['c', 'c'],
		['css', 'css'],
		['d', 'd'],
		['dart', 'dart'],
		['go', 'go'],
		['graphql', 'graphql'],
		['groovy', 'groovy'],
		['html', 'html'],
		['java', 'java'],
		['json', 'json'],
		['matlab', 'matlab'],
		['xml', 'xml'],
		['lua', 'lua'],
		['puppet', 'puppet'],
		['qml', 'qml'],
		['sass', 'sass'],
		['sql', 'sql'],
		['php', 'php'],
		['r', 'r'],
		['swift', 'swift'],
		['tcl', 'tcl'],
		['vala', 'vala'],
		['vhdl', 'vhdl'],
		['xquery', 'xquery'],
		['as', 'actionscript'],
		['asc', 'actionscript'],
		['ino', 'arduino'],
		['au3', 'autoit'],
		['cpp', 'c++'],
		['h', 'c++'],
		['c++', 'c++'],
		['coffee', 'coffeescript'],
		['cs', 'csharp'],
		['cu', 'cuda'],
		['pas', 'delphi'],
		['dpr', 'delphi'],
		['dproj', 'delphi'],
		['dpk', 'delphi'],
		['ex', 'elixir'],
		['exs', 'elixir'],
		['erl', 'erlang'],
		['hrl', 'erlang'],
		['f90', 'fortran'],
		['for', 'fortran'],
		['f', 'fortran'],
		['fpp', 'fortran'],
		['i', 'fortran'],
		['i90', 'fortran'],
		['ftn', 'fortran'],
		['dbc', 'foxpro'],
		['hs', 'haskell'],
		['has', 'haskell'],
		['hx', 'haxe'],
		['js', 'javascript'],
		['jsx', 'javascript'],
		['jl', 'julia'],
		['kt', 'kotlin'],
		['m', 'objective-c'],
		['mm', 'objective-c'],
		['j', 'objective-j'],
		['tex', 'latex'],
		['nb', 'mathematica'],
		['cdf', 'mathematica'],
		['cma', 'ocaml'],
		['pl', 'perl'],
		['py', 'python'],
		['ps1', 'powershell'],
		['psd1', 'powershell'],
		['psm1', 'powershell'],
		['rb', 'ruby'],
		['rst', 'restructuredtext'],
		['rs', 'rust'],
		['rkt', 'racket'],
		['sh', 'shell'],
		['sc', 'scheme'],
		['sch', 'scheme'],
		['txt', 'text'],
		['msg', 'text'],
		['log', 'text'],
		['csv', 'text'],
		['md', 'text'],
		['ts', 'typescript'],
		['tsx', 'typescript'],
		['v', 'verilog'],
		['xq', 'xquery'],
		['xql', 'xquery'],
		['xqm', 'xquery'],
		['xqy', 'xquery'],
		['lock', 'yaml'],
		['yaml', 'yaml'],
		['yml', 'yaml'],
		['iamnotanextension', null],
	])('Testing by extension %s will return %s', (ext, format) => {
		expect(getLanguageType(`something.${ext}`)).toEqual(format);
	});
	test.each([
		['application/json', '', 'json'],
		['text/html', '', 'html'],
		[undefined, '.nope', null],
	])(
		'Should identify the correct type when mimetype=$s extension=%s expected=%s is supplied',
		(mimetype, ext, expected) => {
			expect(getLanguageType(ext, mimetype)).toEqual(expected);
		},
	);
});
describe(getExtension, () => {
	test.each([
		['cat.dog', 'dog'],
		['noextension', ''],
		['five.chars', 'chars'],
		['2character.ex', 'ex'],
	])('filename %s should give extension "%s"', (filename, extension) => {
		expect(getExtension(filename)).toEqual(extension);
	});
});

describe(isCodeViewerItem, () => {
	test.each([
		['file.html', 'text/html', true],
		['file', 'text/html', true],
		['file.cs', undefined, true],
		['file.doc', undefined, false],
	])(
		'filename %s with mimetype %s is a code viewer item? %s',
		(filename, mimetype, shouldBeCodeViewer) => {
			expect(isCodeViewerItem(filename, mimetype)).toEqual(shouldBeCodeViewer);
		},
	);
});
