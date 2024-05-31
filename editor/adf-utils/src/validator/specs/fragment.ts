export default {
	props: {
		type: { type: 'enum', values: ['fragment'] },
		attrs: {
			props: {
				localId: { type: 'string', minLength: 1 },
				name: { type: 'string', optional: true },
			},
		},
	},
};
