export default {
	props: {
		type: { type: 'enum', values: ['border'] },
		attrs: {
			props: {
				size: { type: 'number', minimum: 1, maximum: 3 },
				color: {
					type: 'string',
					pattern: '^#[0-9a-fA-F]{8}$|^#[0-9a-fA-F]{6}$',
				},
			},
		},
	},
};
