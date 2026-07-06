/* eslint-disable
  @atlaskit/design-system/no-to-match-snapshot,
  @atlaskit/design-system/no-unsafe-inline-snapshot
  -- TODO(IND-4952): existing snapshot tests will be removed in a follow-up cleanup PR.
  See https://hello.atlassian.net/wiki/spaces/afm/pages/7146174189/LDR+Unit+Tests+-+Ban+Snapshot+tests+in+Platform
  and raise concerns in https://atlassian.enterprise.slack.com/archives/C0BD4K40BLH
*/

import { defaultSchema } from '@atlaskit/adf-schema/schema-default';
import WikiMarkupTransformer from '../../../index';

import { code_block, doc } from '@atlaskit/editor-test-helpers/doc-builder';

describe('ADF => WikiMarkup - CodeBlock', () => {
	const transformer = new WikiMarkupTransformer();

	test('should convert codeBlock node', () => {
		const node = doc(code_block({ language: 'javascript' })('const i = 0;'))(defaultSchema);
		expect(transformer.encode(node)).toMatchSnapshot();
	});

	test('should convert codeBlock node with no language specified', () => {
		const node = doc(code_block()('const i = 0;'))(defaultSchema);
		expect(transformer.encode(node)).toMatchSnapshot();
	});

	test('should convert codeBlock node with unsupported language specified', () => {
		const node = doc(code_block({ language: 'xxx' })('const i = 0;'))(defaultSchema);
		expect(transformer.encode(node)).toMatchSnapshot();
	});

	test('[CS-293] should not escape formatter charaters in wiki', () => {
		const node = doc(
			code_block({ language: 'xxx' })('This will not escape [~mention] !file.txt! and {macro}'),
		)(defaultSchema);
		expect(transformer.encode(node)).toMatchSnapshot();
	});
});
