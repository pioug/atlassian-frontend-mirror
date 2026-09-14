import { validator } from '../../validator';

describe('divider validation', () => {
	let validate: ReturnType<typeof validator>;

	beforeEach(() => {
		validate = validator(undefined, undefined, { stage0: true });
	});

	it('validates a root bodiedRule with content, attributes, and a breakout mark', () => {
		expect(() =>
			validate({
				type: 'doc',
				version: 1,
				content: [
					{
						type: 'bodiedRule',
						attrs: { localId: 'divider-local-id' },
						content: [
							{
								type: 'paragraph',
								attrs: { localId: 'paragraph-local-id' },
								content: [{ type: 'text', text: 'Divider label' }],
							},
						],
						marks: [{ type: 'breakout', attrs: { mode: 'wide', width: 760 } }],
					},
				],
			}),
		).not.toThrow();
	});

	it('validates attribute-bearing rule nodes in Stage-0', () => {
		expect(() =>
			validate({
				type: 'doc',
				version: 1,
				content: [
					{
						type: 'rule',
						attrs: {
							color: '#E2483D',
							localId: 'rule-local-id',
							style: 'dashed',
							weight: 3,
						},
					},
				],
			}),
		).not.toThrow();
	});
});
