export default {
	props: {
		type: { type: 'enum', values: ['blockCard'] },
		attrs: [
			{
				props: {
					url: { type: 'string', validatorFn: 'safeUrl', optional: true },
					datasource: {
						props: {
							id: { type: 'string' },
							parameters: { type: 'object' },
							views: {
								type: 'array',
								items: [
									{
										props: {
											type: { type: 'string' },
											properties: { type: 'object', optional: true },
										},
									},
								],
								minItems: 1,
							},
						},
					},
					width: { type: 'number', optional: true },
					layout: {
						type: 'enum',
						values: [
							'wide',
							'full-width',
							'center',
							'wrap-right',
							'wrap-left',
							'align-end',
							'align-start',
						],
						optional: true,
					},
				},
			},
			{ props: { url: { type: 'string', validatorFn: 'safeUrl' } } },
			{ props: { data: { type: 'object' } } },
		],
	},
	required: ['attrs'],
};
