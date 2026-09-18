import React, { act } from 'react';

import type { RenderResult } from '@testing-library/react';
import { createRoot, type Root } from 'react-dom/client';
import { IntlProvider } from 'react-intl';

import type { GasPurePayload, GasPureScreenEventPayload } from '@atlaskit/analytics-gas-types';
import FabricAnalyticsListeners from '@atlaskit/analytics-listeners/FabricAnalyticsListeners';
import type { AnalyticsWebClient } from '@atlaskit/analytics-listeners/types';
// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import { analyticsClient } from '@atlaskit/editor-test-helpers/analytics-client-mock';
import { render } from '@atlassian/testing-library';

export const renderWithIntl = (component: React.ReactNode): RenderResult => {
	return render(<IntlProvider locale="en">{component}</IntlProvider>);
};

export const setupMultipleRendersTestHelper = (): {
	expectAnalyticsEventAfterNthRenders: (
		Component: (props: any) => JSX.Element,
		timesToRender: number,
		propsToChange: any[],
		eventExpectation: any,
		done: jest.DoneCallback,
	) => void;
	renderNthTimes: (
		Component: (props: any) => JSX.Element,
		timesToRender: number,
		propsToChange: any[],
		WrapperComponent?: (props: any) => JSX.Element,
	) => void;
} => {
	let container: HTMLElement | null = null;
	let root: Root;

	beforeEach(() => {
		// setup a DOM element as Renderer render target
		container = document.createElement('div');
		document.body.appendChild(container);
		root = createRoot(container);
	});

	afterEach(() => {
		// cleanup on exiting
		act(() => {
			root.unmount();
		});
		if (container) {
			container.remove();
			container = null;
		}
	});

	const renderNthTimes = (
		Component: (props: any) => JSX.Element,
		timesToRender: number,
		propsToChange: any[],
		WrapperComponent?: (props: any) => JSX.Element,
	): void => {
		const propsToChangeReversed = propsToChange.reverse();
		while (timesToRender > 0) {
			act(() => {
				const changingProps = propsToChangeReversed[timesToRender - 1];
				if (WrapperComponent) {
					root.render(
						<WrapperComponent>
							<Component {...changingProps} />
						</WrapperComponent>,
					);
				} else {
					root.render(<Component {...changingProps} />);
				}
			});
			timesToRender--;
		}
	};

	const expectAnalyticsEventAfterNthRenders = (
		Component: (props: any) => JSX.Element,
		timesToRender: number,
		propsToChange: any[],
		eventExpectation: any,
		done: jest.DoneCallback,
	): void => {
		const mockAnalyticsClient = (done: jest.DoneCallback): AnalyticsWebClient => {
			const analyticsEventHandler = (event: GasPurePayload | GasPureScreenEventPayload) => {
				expect(event).toEqual(eventExpectation);
				done();
			};
			return analyticsClient(analyticsEventHandler);
		};

		const WrapperComponent = ({ children }: { children: React.ReactNode }) => (
			<FabricAnalyticsListeners client={mockAnalyticsClient(done)}>
				{children}
			</FabricAnalyticsListeners>
		);

		renderNthTimes(Component, timesToRender, propsToChange, WrapperComponent);
	};

	return { renderNthTimes, expectAnalyticsEventAfterNthRenders };
};
