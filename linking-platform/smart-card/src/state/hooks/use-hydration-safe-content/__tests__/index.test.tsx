import React, { Profiler } from 'react';

import { act, renderHook } from '@testing-library/react';
import { hydrateRoot } from 'react-dom/client';
import { renderToString } from 'react-dom/server';

import { SmartCardProvider } from '@atlaskit/link-provider/smart-card-provider';
import type { ProductType } from '@atlaskit/linking-common/types';

import useHydrationSafeContent from '../index';

const Probe = ({ isEligible }: { isEligible?: boolean }) => {
	const shouldUseHydrationSafeContent = useHydrationSafeContent(isEligible);
	return <span>{shouldUseHydrationSafeContent ? 'hydration fallback' : 'client content'}</span>;
};

describe.each<ProductType | undefined>(['CONFLUENCE', 'JSW', 'JSM', 'ATLAS', undefined])(
	'useHydrationSafeContent in %s',
	(product) => {
		const Wrapper = ({ children }: { children: React.ReactNode }) => (
			<SmartCardProvider product={product}>{children}</SmartCardProvider>
		);

		it('uses client content on client-only mounts and rerenders', () => {
			const { result, rerender } = renderHook(() => useHydrationSafeContent(), {
				wrapper: Wrapper,
			});
			expect(result.current).toBe(false);
			rerender();
			expect(result.current).toBe(false);
		});

		it.each([true, false, undefined])('hydrates with eligibility: %s', async (isEligible) => {
			const useFallback = product === 'CONFLUENCE' && isEligible !== false;
			const phases: string[] = [];
			const onRecoverableError = jest.fn();
			const content = (
				<Wrapper>
					<Profiler id="hydration-content" onRender={(_, phase) => phases.push(phase)}>
						<Probe isEligible={isEligible} />
					</Profiler>
				</Wrapper>
			);
			const container = document.createElement('div');
			let root: ReturnType<typeof hydrateRoot> | undefined;
			try {
				container.innerHTML = renderToString(content);
				expect(container.textContent).toBe(useFallback ? 'hydration fallback' : 'client content');
				const serverElement = container.querySelector('span');
				await act(async () => {
					root = hydrateRoot(container, content, { onRecoverableError });
				});
				expect(container.textContent).toBe('client content');
				expect(container.querySelector('span')).toBe(serverElement);
				expect(onRecoverableError).not.toHaveBeenCalled();
				// Only eligible Confluence content needs a second commit to reveal browser-dependent content.
				expect(phases).toEqual(useFallback ? ['mount', 'update'] : ['mount']);
			} finally {
				act(() => root?.unmount());
			}
		});
	},
);

it('keeps control content without a SmartCardProvider', () => {
	expect(renderToString(<Probe />)).toBe('<span>client content</span>');
	const { result } = renderHook(() => useHydrationSafeContent());
	expect(result.current).toBe(false);
});

it('inherits the Confluence product through a nested SmartCardProvider', () => {
	const content = (
		<SmartCardProvider product="CONFLUENCE">
			<SmartCardProvider>
				<Probe />
			</SmartCardProvider>
		</SmartCardProvider>
	);
	expect(renderToString(content)).toBe('<span>hydration fallback</span>');
});
