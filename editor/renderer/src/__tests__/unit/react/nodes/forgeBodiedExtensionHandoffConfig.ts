import { mockExp } from '@atlassian/experiment-test-utils/mock-exp';

import {
	getForgeBodiedExtensionHandoffMode,
	FORGE_BODIED_EXTENSION_BRIDGE_READY_KEYS,
} from '../../../../react/nodes/forgeBodiedExtensionHandoffConfig';

const auraKey = Array.from(FORGE_BODIED_EXTENSION_BRIDGE_READY_KEYS)[0];
const options = {
	extensionType: 'com.atlassian.ecosystem',
	extensionKey: 'scroll-ignore',
	localId: 'macro',
	isInline: () => false,
};

it.each([false, true])('preserves the existing Aura cohort (%s)', (isEnabled) => {
	mockExp('cc_aura_table_filter_cls', { isEnabled });
	expect(getForgeBodiedExtensionHandoffMode({ ...options, extensionKey: auraKey })).toBe(
		isEnabled ? 'release-on-bridge-ready' : undefined,
	);
	expect(getForgeBodiedExtensionHandoffMode(options)).toBeUndefined();
});

it.each([false, true])(
	'preserves Aura policy when a host also selects the instance (%s)',
	(isEnabled) => {
		mockExp('cc_aura_table_filter_cls', { isEnabled });
		expect(
			getForgeBodiedExtensionHandoffMode({
				...options,
				extensionKey: auraKey,
				preserveUntilReadyInstances: new Map([['macro', auraKey]]),
			}),
		).toBe(isEnabled ? 'release-on-bridge-ready' : undefined);
	},
);

it.each([{ localId: undefined }, { localId: 'different' }, { extensionKey: 'different' }])(
	'declines instances that do not match the selected identity %j',
	(change) => {
		expect(
			getForgeBodiedExtensionHandoffMode({
				...options,
				preserveUntilReadyInstances: new Map([['macro', 'scroll-ignore']]),
				...change,
			}),
		).toBeUndefined();
	},
);

it.each([{ localId: undefined }, { extensionType: 'com.atlassian.confluence.macro.core' }, {}])(
	'does not evaluate inline layout for an unrelated instance %j',
	(change) => {
		const isInline = jest.fn(() => false);
		expect(getForgeBodiedExtensionHandoffMode({ ...options, ...change, isInline })).toBeUndefined();
		expect(isInline).not.toHaveBeenCalled();
	},
);

it.each([false, true])('checks Aura inline layout even in cohort %s', (isEnabled) => {
	mockExp('cc_aura_table_filter_cls', { isEnabled });
	const isInline = jest.fn(() => false);
	expect(getForgeBodiedExtensionHandoffMode({ ...options, extensionKey: auraKey, isInline })).toBe(
		isEnabled ? 'release-on-bridge-ready' : undefined,
	);
	expect(isInline).toHaveBeenCalledTimes(1);
});

it('uses the selected release policy without re-evaluating host eligibility', () => {
	const isInline = jest.fn(() => true);
	expect(
		getForgeBodiedExtensionHandoffMode({
			...options,
			extensionType: 'com.atlassian.confluence.macro.core',
			isInline,
			preserveUntilReadyInstances: new Map([['macro', 'scroll-ignore']]),
		}),
	).toBe('preserve-until-ready');
	expect(isInline).not.toHaveBeenCalled();
});

it.each([{ extensionType: 'com.atlassian.confluence.macro.core' }, { isInline: () => true }])(
	'preserves Aura eligibility checks %j',
	(change) => {
		expect(
			getForgeBodiedExtensionHandoffMode({ ...options, extensionKey: auraKey, ...change }),
		).toBeUndefined();
	},
);
