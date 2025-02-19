import { defaultSchema } from '@atlaskit/adf-schema/schema-default';
import { adf2wiki, wiki2adf } from '../_test-helpers';

import { code, doc, p } from '@atlaskit/editor-test-helpers/doc-builder';

describe('ADF => WikiMarkup => ADF - Monospace', () => {
	test('should convert monospace node with attachment link', () => {
		adf2wiki(doc(p(code('[^link.txt]')))(defaultSchema));
	});

	test('should convert monospace node with bold', () => {
		adf2wiki(doc(p(code('*formatting*')))(defaultSchema));
	});

	test('should convert monospace node with italic', () => {
		adf2wiki(doc(p(code('_formatting_')))(defaultSchema));
	});

	// Ignored via go/ees005
	// eslint-disable-next-line jest/no-identical-title
	test('should convert monospace node with italic', () => {
		adf2wiki(doc(p(code('+formatting+')))(defaultSchema));
	});

	test('should convert monospace node with ruler', () => {
		adf2wiki(doc(p(code('-----')))(defaultSchema));
	});

	test('should convert monospace node with bullet list', () => {
		adf2wiki(doc(p(code('* abc')))(defaultSchema));
	});

	// Ignored via go/ees005
	// eslint-disable-next-line jest/no-identical-title
	test('should convert monospace node with attachment link', () => {
		wiki2adf('{{[^link.txt]}}');
	});

	// Ignored via go/ees005
	// eslint-disable-next-line jest/no-identical-title
	test('should convert monospace node with bold', () => {
		wiki2adf('{{*formatting*}}');
	});

	// Ignored via go/ees005
	// eslint-disable-next-line jest/no-identical-title
	test('should convert monospace node with italic', () => {
		wiki2adf('{{_formatting_}}');
	});
	test('should convert monospace node with underline', () => {
		wiki2adf('{{+formatting+}}');
	});
	// Ignored via go/ees005
	// eslint-disable-next-line jest/no-identical-title
	test('should convert monospace node with ruler', () => {
		wiki2adf('{{-----}}');
	});
	// Ignored via go/ees005
	// eslint-disable-next-line jest/no-identical-title
	test('should convert monospace node with bullet list', () => {
		wiki2adf('{{* abc}}');
	});
});
