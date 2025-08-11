jest.mock('react-lazily-render', () => ({
	__esModule: true,
	default: (props: any) => {
		return props.content;
	},
}));

import React from 'react';
import type { ReactWrapper } from 'enzyme';
import type { RendererProps } from '../../../ui/renderer-props';
import Renderer from '../../../ui/Renderer';
import { IntlProvider } from 'react-intl-next';
import { render, waitFor, screen } from '@testing-library/react';
import { SmartCardProvider } from '@atlaskit/link-provider';
import { cardClient } from '@atlaskit/media-integration-test-helpers';

const initialDoc = {
	version: 1,
	type: 'doc',
	content: [
		{
			type: 'paragraph',
			content: [
				{
					type: 'inlineCard',
					attrs: {
						url: 'https://inlineCardTestUrl',
					},
				},
			],
		},
		{
			type: 'paragraph',
			content: [],
		},
	],
};

const mockIntersectionObserver = () => {
	class MockIntersectionObserver implements IntersectionObserver {
		readonly root!: Element | null;
		readonly rootMargin!: string;
		readonly thresholds!: ReadonlyArray<number>;

		constructor(public callback: IntersectionObserverCallback) {}

		observe(_element: HTMLElement) {
			const entries = [{ isIntersecting: true }] as IntersectionObserverEntry[];
			this.callback(entries, this);
		}
		disconnect = jest.fn();
		takeRecords = jest.fn();
		unobserve = jest.fn();
	}

	Object.defineProperty(window, 'IntersectionObserver', {
		writable: true,
		configurable: true,
		value: MockIntersectionObserver,
	});
};

describe('@atlaskit/renderer/event-handlers', () => {
	let renderer: ReactWrapper;

	const initRendererTestingLibrary = (doc: any, props: Partial<RendererProps> = {}) => {
		const finalProps: RendererProps = {
			document: doc,
			...props,
		};
		return render(
			<IntlProvider locale="en">
				<SmartCardProvider client={cardClient}>
					<Renderer {...finalProps} />
				</SmartCardProvider>
			</IntlProvider>,
		);
	};

	beforeAll(() => {
		mockIntersectionObserver();
	});

	afterEach(() => {
		// @ts-ignore - TS2454 TypeScript 5.9.2 upgrade
		if (renderer && renderer.length) {
			renderer.unmount();
		}
	});

	// Ignored via go/ees007
	// eslint-disable-next-line @atlaskit/editor/enforce-todo-comment-format
	// FIXME: Jest 29 upgrade - this test suite is failing when running with flag IS_REACT_18
	describe.skip('with all handlers present', () => {
		it('should fire SmartCardEventClickHandler when clicking on a smart card', async () => {
			const mockOnUnhandledClickHandler = jest.fn();
			const mockMentionEventHandlers = jest.fn();
			const mockCardEventClickHandler = jest.fn();
			const mockLinkEventClickHandler = jest.fn();
			const mockSmartCardEventClickHandler = jest.fn();
			initRendererTestingLibrary(initialDoc, {
				eventHandlers: {
					onUnhandledClick: mockOnUnhandledClickHandler,
					mention: {
						onClick: mockMentionEventHandlers,
						onMouseEnter: mockMentionEventHandlers,
						onMouseLeave: mockMentionEventHandlers,
					},
					media: {
						onClick: mockCardEventClickHandler,
					},
					link: {
						onClick: mockLinkEventClickHandler,
					},
					smartCard: {
						onClick: mockSmartCardEventClickHandler,
					},
				},
			});
			const smartCard = await waitFor(() => screen.findByTestId('inline-card-resolving-view'));

			smartCard.click();

			expect(mockSmartCardEventClickHandler).toBeCalledTimes(1);

			// No other handler should be called
			expect(mockOnUnhandledClickHandler).toBeCalledTimes(0);
			expect(mockLinkEventClickHandler).toBeCalledTimes(0);
			expect(mockMentionEventHandlers).toBeCalledTimes(0);
			expect(mockCardEventClickHandler).toBeCalledTimes(0);
		});
	});

	// Ignored via go/ees007
	// eslint-disable-next-line @atlaskit/editor/enforce-todo-comment-format
	// FIXME: Jest 29 upgrade - this test suite is failing when running with flag IS_REACT_18
	describe.skip('with only the desired handler and unhandled mock present', () => {
		it('should fire SmartCardEventClickHandler when clicking on a smart card', async () => {
			const mockOnUnhandledClickHandler = jest.fn();
			const mockMentionEventHandlers = jest.fn();
			const mockCardEventClickHandler = jest.fn();
			const mockLinkEventClickHandler = jest.fn();
			const mockSmartCardEventClickHandler = jest.fn();
			const { findByTestId } = initRendererTestingLibrary(initialDoc, {
				eventHandlers: {
					onUnhandledClick: mockOnUnhandledClickHandler,
					smartCard: {
						onClick: mockSmartCardEventClickHandler,
					},
				},
			});

			const smartCard = await findByTestId('inline-card-resolved-view');

			smartCard.click();

			expect(mockSmartCardEventClickHandler).toBeCalledTimes(1);

			// No other handler should be called
			expect(mockOnUnhandledClickHandler).toBeCalledTimes(0);
			expect(mockLinkEventClickHandler).toBeCalledTimes(0);
			expect(mockMentionEventHandlers).toBeCalledTimes(0);
			expect(mockCardEventClickHandler).toBeCalledTimes(0);
		});
	});
});
