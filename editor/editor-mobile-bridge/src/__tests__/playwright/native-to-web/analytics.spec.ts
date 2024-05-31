import { mobileBridgeEditorTestCase as test, expect } from '../not-libra';

[
	{
		payloadExpected: {
			action: 'formatted',
			actionSubject: 'text',
			actionSubjectId: 'strong',
		},
		callArgs: {
			funcName: 'onBoldClicked',
			args: ['toolbar'],
		},
	},

	{
		payloadExpected: {
			action: 'formatted',
			actionSubject: 'text',
			actionSubjectId: 'italic',
		},
		callArgs: { funcName: 'onItalicClicked', args: ['toolbar'] },
	},

	{
		payloadExpected: {
			action: 'formatted',
			actionSubject: 'text',
			actionSubjectId: 'underline',
		},
		callArgs: { funcName: 'onUnderlineClicked', args: ['toolbar'] },
	},

	{
		payloadExpected: {
			action: 'formatted',
			actionSubject: 'text',
			actionSubjectId: 'code',
		},
		callArgs: { funcName: 'onCodeClicked', args: ['toolbar'] },
	},

	{
		payloadExpected: {
			action: 'formatted',
			actionSubject: 'text',
			actionSubjectId: 'strike',
		},
		callArgs: { funcName: 'onStrikeClicked', args: ['toolbar'] },
	},

	{
		payloadExpected: {
			action: 'formatted',
			actionSubject: 'text',
			actionSubjectId: 'superscript',
		},
		callArgs: { funcName: 'onSuperClicked', args: ['toolbar'] },
	},

	{
		payloadExpected: {
			action: 'formatted',
			actionSubject: 'text',
			actionSubjectId: 'subscript',
		},
		callArgs: { funcName: 'onSubClicked', args: ['toolbar'] },
	},

	{
		payloadExpected: {
			action: 'inserted',
			actionSubject: 'document',
			actionSubjectId: 'status',
		},
		callArgs: { funcName: 'insertNode', args: ['status'] },
	},

	{
		payloadExpected: {
			action: 'formatted',
			actionSubject: 'text',
			actionSubjectId: 'heading',
		},
		callArgs: {
			funcName: 'onBlockSelected',
			args: ['heading1', 'toolbar'],
		},
	},

	{
		payloadExpected: {
			action: 'inserted',
			actionSubject: 'document',
			actionSubjectId: 'link',
		},
		callArgs: {
			funcName: 'onLinkUpdate',
			args: ['test-link-title', 'https://test.link.url', 'toolbar'],
		},
	},

	{
		payloadExpected: {
			action: 'formatted',
			actionSubject: 'text',
			actionSubjectId: 'blockQuote',
		},
		callArgs: {
			funcName: 'insertBlockType',
			args: ['blockquote', 'insertMenu'],
		},
	},

	{
		payloadExpected: {
			action: 'inserted',
			actionSubject: 'document',
			actionSubjectId: 'codeBlock',
		},
		callArgs: {
			funcName: 'insertBlockType',
			args: ['codeblock', 'insertMenu'],
		},
	},

	{
		payloadExpected: {
			action: 'inserted',
			actionSubject: 'document',
			actionSubjectId: 'panel',
		},
		callArgs: {
			funcName: 'insertBlockType',
			args: ['panel', 'insertMenu'],
		},
	},

	{
		payloadExpected: {
			action: 'inserted',
			actionSubject: 'document',
			actionSubjectId: 'action',
		},
		callArgs: {
			funcName: 'insertBlockType',
			args: ['action', 'insertMenu', 'test-action-list-id', 'test-action-item-id'],
		},
	},

	{
		payloadExpected: {
			action: 'inserted',
			actionSubject: 'document',
			actionSubjectId: 'decision',
		},
		callArgs: {
			funcName: 'insertBlockType',
			args: ['decision', 'insertMenu', 'test-decision-list-id', 'test-decision-item-id'],
		},
	},
].forEach(({ callArgs: { funcName, args }, payloadExpected }, index) => {
	test.describe(`${index} - when the ${funcName} is called`, () => {
		test('should match the expected payload', async ({ bridge }) => {
			await bridge.doCall({
				funcName,
				args,
			});
			const trackEvents = await bridge.trackEvents();

			expect(trackEvents).toEqual(
				expect.arrayContaining([
					expect.objectContaining({
						...payloadExpected,
						attributes: expect.objectContaining({
							appearance: 'mobile',
						}),
					}),
				]),
			);
		});
	});
});
