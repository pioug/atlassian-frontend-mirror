import { failGate, passGate } from '@atlassian/feature-flags-test-utils/mock-gates';

import { getExtension } from '../../getExtension';
import { getLanguageType } from '../../getLanguageType';
import { isCodeViewerItem } from '../../isCodeViewerItem';

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
		['text/plain', '', 'text'],
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

describe('git format-patch previews', () => {
	// Sniffing labels the same patch bytes as several textual types, sometimes with a
	// charset parameter. Without the gate those types go to document preview, which fails.
	test.each([
		['0001-fix.patch', 'text/x-diff'],
		['0001-fix.patch', 'text/x-patch'],
		['0001-fix.diff', 'application/x-patch'],
		['0001-fix.patch', 'application/mbox'],
		['0001-fix.patch', 'message/rfc822'],
		['0001-fix.diff', 'message/rfc822'],
		['0001-FIX.PATCH', 'application/mbox'],
		['0001-fix.patch', 'text/x-diff; charset=utf-8'],
		['0001-fix.patch', 'text/x-diff ; charset=utf-8'],
		['0001-fix.patch', 'Text/Plain; charset=utf-8'],
		['notes', 'text/plain; charset=utf-8'],
		['changes', 'text/x-diff'],
	])('does not preview %s (%s) when the gate is off', (filename, mimetype) => {
		failGate('platform_media_patch_text_preview');

		expect(getLanguageType(filename, mimetype)).toBeNull();
		expect(isCodeViewerItem(filename, mimetype ?? 'unknown')).toBe(false);
	});

	test('previews a .patch file already labelled text/plain without reading the gate', () => {
		expect(getLanguageType('0001-fix.patch', 'text/plain')).toBe('text');
		expect(isCodeViewerItem('0001-fix.patch', 'text/plain')).toBe(true);
	});

	test.each([
		['0001-fix.patch', 'application/octet-stream'],
		['0001-fix.patch', undefined],
		['0001-fix.diff', undefined],
	])('does not preview %s (%s) from the file name alone', (filename, mimetype) => {
		expect(getLanguageType(filename, mimetype)).toBeNull();
		expect(isCodeViewerItem(filename, mimetype ?? 'unknown')).toBe(false);
	});

	test.each([
		['0001-fix.patch', 'text/x-diff'],
		['0001-fix.patch', 'text/x-patch'],
		['0001-fix.diff', 'application/x-patch'],
		['0001-fix.patch', 'application/mbox'],
		['0001-fix.patch', 'message/rfc822'],
		['0001-fix.diff', 'message/rfc822'],
		['0001-FIX.PATCH', 'application/mbox'],
		['0001-fix.patch', 'Application/Mbox; charset=utf-8'],
		['0001-fix.patch', 'text/x-diff ; charset=utf-8'],
		['0001-fix.patch', 'Text/Plain; charset=utf-8'],
		['notes', 'text/plain; charset=utf-8'],
		['changes', 'text/x-diff'],
	])('previews %s (%s) as text when the gate is on', (filename, mimetype) => {
		passGate('platform_media_patch_text_preview');

		expect(getLanguageType(filename, mimetype)).toBe('text');
		expect(isCodeViewerItem(filename, mimetype ?? 'unknown')).toBe(true);
	});

	test('does not preview email or mailbox files when the gate is on', () => {
		passGate('platform_media_patch_text_preview');

		expect(getLanguageType('mail.eml', 'message/rfc822')).toBeNull();
		expect(isCodeViewerItem('mail.eml', 'message/rfc822')).toBe(false);
		expect(getLanguageType('inbox.mbox', 'application/mbox')).toBeNull();
		expect(isCodeViewerItem('inbox.mbox', 'application/mbox')).toBe(false);
		expect(getLanguageType('changes', 'message/rfc822')).toBeNull();
		// A patch name is what reads the gate. Mail types on other names must not.
		expect(getLanguageType('0001-fix.patch', 'text/x-diff')).toBe('text');
	});
});

describe(isCodeViewerItem, () => {
	test.each([
		['file.html', 'text/html', true],
		['file', 'text/html', true],
		['file.cs', undefined, true],
		['file.doc', undefined, false],
		['file', 'text/plain', true],
	])(
		'filename %s with mimetype %s is a code viewer item? %s',
		(filename, mimetype, shouldBeCodeViewer) => {
			expect(isCodeViewerItem(filename, mimetype)).toEqual(shouldBeCodeViewer);
		},
	);
});
