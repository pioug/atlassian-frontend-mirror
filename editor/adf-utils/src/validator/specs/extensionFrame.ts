export default {
	props: {
		type: { type: 'enum', values: ['extensionFrame'] },
		content: {
			type: 'array',
			items: [
				[
					'blockCard',
					'paragraph_with_no_marks',
					'mediaSingle_caption',
					'mediaSingle_full',
					'codeBlock_with_no_marks',
					'taskList',
					'bulletList',
					'orderedList',
					'heading_with_no_marks',
					'mediaGroup',
					'decisionList',
					'rule',
					'panel',
					'blockquote',
					'extension_with_marks',
					'embedCard',
					'table',
					'bodiedExtension_with_marks',
				],
			],
			minItems: 1,
		},
		marks: {
			type: 'array',
			items: [['dataConsumer', 'fragment']],
			optional: true,
		},
	},
};
