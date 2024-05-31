export default [
	'inlineExtension',
	{
		props: {
			marks: {
				type: 'array',
				items: [['dataConsumer', 'fragment']],
				optional: true,
			},
		},
	},
];
