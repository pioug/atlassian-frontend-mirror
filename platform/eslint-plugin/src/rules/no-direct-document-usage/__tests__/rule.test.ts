import { Linter } from 'eslint';

import rule from '../index';

const linter = new Linter();
linter.defineRule('no-direct-document-usage', rule);
const config: Linter.Config = {
	parserOptions: { ecmaVersion: 2020, sourceType: 'module' },
	rules: { 'no-direct-document-usage': 'error' },
};
const lint = (code: string) => linter.verify(code, config, '/repo/component.ts');

test('reports direct DOM access without a safe wrapper', () => {
	expect(lint('const root = document.body;')).toEqual([
		expect.objectContaining({ messageId: 'useGetDocument' }),
	]);
});

test('does not report a document value supplied by a caller', () => {
	expect(lint('function getTitle(document) { return document.title; }')).toEqual([]);
});

test('does not report a document value imported from another package', () => {
	expect(lint('import document from "document-model"; document.title;')).toEqual([]);
});

test('an unused getDocument import does not hide unsafe global DOM access', () => {
	expect(lint('import { getDocument } from "@atlaskit/browser-apis"; document.body;')).toEqual([
		expect.objectContaining({ messageId: 'useGetDocument' }),
	]);
});

test('the documented null-safe wrapper usage is accepted', () => {
	expect(
		lint('import { getDocument } from "@atlaskit/browser-apis"; const root = getDocument()?.body;'),
	).toEqual([]);
});
