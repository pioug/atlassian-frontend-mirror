import { applyPackageReadinessGate, mergeOverrides } from '../merge-overrides';

describe('mergeOverrides', () => {
	it('lets overrides win per symbol', () => {
		const generated = {
			'@atlaskit/avatar': {
				'': {
					Presence: {
						name: 'Presence',
						type: 'component' as const,
						voltCompliant: false,
						consumersMigrated: false,
					},
				},
			},
		};
		const overrides = {
			'@atlaskit/avatar': {
				'': {
					Presence: {
						'entry-point': '/presence',
						name: 'Presence',
						type: 'component' as const,
						voltCompliant: true,
					},
				},
			},
		};

		expect(mergeOverrides(generated, overrides)['@atlaskit/avatar'][''].Presence).toEqual({
			'entry-point': '/presence',
			name: 'Presence',
			type: 'component',
			voltCompliant: true,
			consumersMigrated: false,
		});
	});
});

describe('applyPackageReadinessGate', () => {
	it('forces voltCompliant false when package is not Stage 1 and stamps consumersMigrated', () => {
		const config = {
			'@atlaskit/button': {
				'': {
					default: {
						'entry-point': '/button',
						name: 'Button',
						type: 'component' as const,
						voltCompliant: true,
						consumersMigrated: true,
					},
				},
			},
			'@atlaskit/flag': {
				'': {
					default: {
						'entry-point': '/flag',
						name: 'Flag',
						type: 'component' as const,
						voltCompliant: true,
						consumersMigrated: false,
					},
				},
			},
			'@atlaskit/spinner': {
				'': {
					default: {
						'entry-point': '/spinner',
						name: 'Spinner',
						type: 'component' as const,
						voltCompliant: true,
						consumersMigrated: false,
					},
				},
			},
		};

		const gated = applyPackageReadinessGate(config, {
			'@atlaskit/button': { voltCompliant: false, consumersMigrated: false },
			'@atlaskit/flag': { voltCompliant: true, consumersMigrated: false },
			'@atlaskit/spinner': { voltCompliant: true, consumersMigrated: true },
		});

		expect(gated['@atlaskit/button'][''].default).toMatchObject({
			'entry-point': '/button',
			voltCompliant: false,
			consumersMigrated: false,
		});
		expect(gated['@atlaskit/flag'][''].default).toMatchObject({
			'entry-point': '/flag',
			voltCompliant: true,
			consumersMigrated: false,
		});
		expect(gated['@atlaskit/spinner'][''].default).toMatchObject({
			'entry-point': '/spinner',
			voltCompliant: true,
			consumersMigrated: true,
		});
	});

	it('preserves per-symbol voltCompliant:false overrides on Stage 1 packages', () => {
		const config = {
			'@atlaskit/tokens': {
				'': {
					token: {
						name: 'token',
						type: 'value' as const,
						voltCompliant: false,
						consumersMigrated: false,
					},
				},
			},
		};

		const gated = applyPackageReadinessGate(config, {
			'@atlaskit/tokens': { voltCompliant: true, consumersMigrated: false },
		});

		expect(gated['@atlaskit/tokens'][''].token.voltCompliant).toBe(false);
	});
});
