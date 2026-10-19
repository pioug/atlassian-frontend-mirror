import React from 'react';

import { act, render } from '@testing-library/react';

import { useXpcRendererHandoff } from '../src/useXpcRendererHandoff';
import { createXpcDefaultDestinationRegistry } from '../src/xpcDefaultDestinationRegistry';
import { XpcDestinationResolver } from '../src/xpcDestinationResolver';
import {
	XpcNavigationObservation,
	type XpcNavigationReporter,
} from '../src/xpcNavigationObservation';
import { XpcNavigationProvider } from '../src/xpcNavigationProvider';
import { XpcSourceProvider } from '../src/xpcSourceProvider';

const studioSource = {
	product: XpcDestinationResolver.createProductId('studio'),
};
const surfaces = {
	native: XpcNavigationObservation.createSurface('studio-root'),
	renderer: XpcNavigationObservation.createSurface('studio-rovo'),
};

describe('XpcNavigationProvider', () => {
	beforeEach(() => {
		jest.useFakeTimers();
	});

	afterEach(() => {
		document.body.replaceChildren();
		jest.useRealTimers();
	});

	it('installs native capture and reports one XPIS-bearing initial arrival', async () => {
		const reporter: XpcNavigationReporter = {
			reportArrival: jest.fn(),
			reportDeparture: jest.fn(),
		};
		const { container, unmount } = render(
			<XpcNavigationProvider
				baseUrl="https://studio.atlassian.com"
				initialArrivalUrl="https://studio.atlassian.com/?xpis=opaque"
				registry={createXpcDefaultDestinationRegistry()}
				reporter={reporter}
				root={document}
				source={studioSource}
				surfaces={surfaces}
			/>,
		);
		const anchor = document.createElement('a');
		anchor.href = 'https://example.atlassian.net/wiki/spaces/TEST';
		anchor.textContent = 'Open Confluence';
		document.body.append(anchor);

		act(() => {
			anchor.dispatchEvent(
				new MouseEvent('auxclick', { bubbles: true, button: 1, cancelable: true }),
			);
			jest.runOnlyPendingTimers();
		});

		expect(reporter.reportArrival).toHaveBeenCalledTimes(1);
		expect(reporter.reportDeparture).toHaveBeenCalledTimes(1);
		await expect(container).toBeAccessible();

		unmount();
		act(() => {
			anchor.dispatchEvent(
				new MouseEvent('auxclick', { bubbles: true, button: 1, cancelable: true }),
			);
		});
		expect(reporter.reportDeparture).toHaveBeenCalledTimes(1);
	});

	it('lets the renderer final sink claim a prevented native candidate', () => {
		const reporter: XpcNavigationReporter = {
			reportDeparture: jest.fn(),
		};
		const RendererLink = () => {
			const observe = useXpcRendererHandoff();
			return (
				<a
					href="https://example.atlassian.net/wiki/spaces/TEST"
					onClick={(event) => {
						event.preventDefault();
						observe({
							event: event.nativeEvent,
							handoffOutcome: 'accepted',
							url: event.currentTarget.href,
						});
					}}
				>
					Open Confluence
				</a>
			);
		};
		const { getByRole } = render(
			<XpcNavigationProvider
				baseUrl="https://studio.atlassian.com"
				registry={createXpcDefaultDestinationRegistry()}
				reporter={reporter}
				root={document}
				source={studioSource}
				surfaces={surfaces}
			>
				<RendererLink />
			</XpcNavigationProvider>,
		);

		act(() => {
			getByRole('link').click();
			jest.runOnlyPendingTimers();
		});

		expect(reporter.reportDeparture).toHaveBeenCalledTimes(1);
		expect(reporter.reportDeparture).toHaveBeenCalledWith(
			expect.objectContaining({
				captureMethod: 'rendererFinalSink',
				sourceProduct: 'studio',
				surface: 'studio-rovo',
			}),
		);
	});

	it('allows a nested controlled source to refine final-sink attribution', () => {
		const reporter: XpcNavigationReporter = {
			reportDeparture: jest.fn(),
		};
		const RendererButton = () => {
			const observe = useXpcRendererHandoff();
			return (
				<button
					type="button"
					onClick={() =>
						observe({
							handoffOutcome: 'accepted',
							url: 'https://example.atlassian.net/wiki/spaces/TEST',
						})
					}
				>
					Open Confluence
				</button>
			);
		};

		const { getByRole } = render(
			<XpcNavigationProvider
				baseUrl="https://studio.atlassian.com"
				registry={createXpcDefaultDestinationRegistry()}
				reporter={reporter}
				root={document}
				source={studioSource}
				surfaces={surfaces}
			>
				<XpcSourceProvider
					source={{ subProduct: XpcDestinationResolver.createSubProductId('agents') }}
				>
					<RendererButton />
				</XpcSourceProvider>
			</XpcNavigationProvider>,
		);

		act(() => {
			getByRole('button').click();
		});

		expect(reporter.reportDeparture).toHaveBeenCalledWith(
			expect.objectContaining({
				sourceProduct: 'studio',
				sourceSubProduct: 'agents',
			}),
		);
	});
});
