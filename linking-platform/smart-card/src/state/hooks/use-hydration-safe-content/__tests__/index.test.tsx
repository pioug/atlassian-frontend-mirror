import React, { Profiler } from 'react';

import { act, renderHook } from '@testing-library/react';
import { hydrateRoot } from 'react-dom/client';
import { renderToString } from 'react-dom/server';

import { mockExpDisabled } from '@atlassian/experiment-test-utils/mock-exp-disabled';
import { mockExpEnabled } from '@atlassian/experiment-test-utils/mock-exp-enabled';
import { wasExperimentExposed } from '@atlassian/experiment-test-utils/was-experiment-exposed';

import useHydrationSafeContent from '../index';

const EXPERIMENT = 'platform_sl_hydration_safe_content';

const Probe = ({ isEligible }: { isEligible?: boolean }) => {
	const shouldUseHydrationSafeContent = useHydrationSafeContent(isEligible);
	return <span>{shouldUseHydrationSafeContent ? 'hydration fallback' : 'client content'}</span>;
};

describe.each([true, false])('hydration content experiment enabled: %s', (enabled) => {
	beforeEach(() => {
		if (enabled) {
			mockExpEnabled(EXPERIMENT);
		} else {
			mockExpDisabled(EXPERIMENT);
		}
	});

	it('does not expose client-only mounts or rerenders', () => {
		const { result, rerender } = renderHook(() => useHydrationSafeContent());
		expect(result.current).toBe(false);
		rerender();
		expect(result.current).toBe(false);
		expect(wasExperimentExposed(EXPERIMENT)).toBe(false);
	});

	it.each([true, false])('hydrates with eligibility: %s', async (isEligible) => {
		const phases: string[] = [];
		const onRecoverableError = jest.fn();
		const content = (
			<Profiler id="hydration-content" onRender={(_, phase) => phases.push(phase)}>
				<Probe isEligible={isEligible} />
			</Profiler>
		);
		const container = document.createElement('div');
		let root: ReturnType<typeof hydrateRoot> | undefined;
		try {
			container.innerHTML = renderToString(content);
			expect(container.textContent).toBe(
				enabled && isEligible ? 'hydration fallback' : 'client content',
			);
			const serverElement = container.querySelector('span');
			await act(async () => {
				root = hydrateRoot(container, content, { onRecoverableError });
			});
			expect(container.textContent).toBe('client content');
			expect(container.querySelector('span')).toBe(serverElement);
			expect(onRecoverableError).not.toHaveBeenCalled();
			expect(wasExperimentExposed(EXPERIMENT)).toBe(isEligible);
			// Only treatment needs a second commit to reveal browser-dependent content.
			expect(phases).toEqual(enabled && isEligible ? ['mount', 'update'] : ['mount']);
		} finally {
			act(() => root?.unmount());
		}
	});
});
