import React from 'react';

import { render } from '@testing-library/react';
import { IntlProvider } from 'react-intl';

import { MockMediaClientProvider } from '@atlaskit/editor-test-helpers/media-client-mock';
import { exampleMediaFeatureFlags } from '@atlaskit/media-test-helpers';

import { Renderer } from '../../../entry-points/renderer-default';
import type { RendererProps } from '../../../ui/renderer-props';
import initialDoc from '../../__fixtures__/event-handlers.adf.json';

jest.mock('react-lazily-render', () => {
	let isOnRenderCalled = false;
	return {
		__esModule: true,
		default: (props: any) => {
			if (!isOnRenderCalled) {
				props.onRender();
				isOnRenderCalled = true;
			}

			return props.content;
		},
	};
});

describe('@atlaskit/renderer/event-handlers', () => {
	const initRendererTestingLibrary = (doc: any, props: Partial<RendererProps> = {}) => {
		const finalProps: RendererProps = {
			document: doc,
			media: {
				allowLinking: true,
				featureFlags: exampleMediaFeatureFlags,
			},
			...props,
		};
		return render(
			<IntlProvider locale="en">
				<MockMediaClientProvider>
					<Renderer {...finalProps} />
				</MockMediaClientProvider>
			</IntlProvider>,
		);
	};

	beforeAll(() => {
		// getSelection().toString() is returning an object when it should return an empty string
		// without selection. TS ignore is due to an empty string being an incorrect return type
		// for getSelection(), however .toString() is the only method called on this return value, see
		// packages/editor/renderer/src/ui/Renderer/index.tsx

		// @ts-ignore
		window.getSelection = () => {
			return '';
		};
	});

	describe('with all handlers present', () => {
		it('should fire onUnhandledClick when clicking on paragraph text', async () => {
			const mockOnUnhandledClickHandler = jest.fn();
			const mockMentionEventHandlers = jest.fn();
			const mockCardEventClickHandler = jest.fn();
			const mockLinkEventClickHandler = jest.fn();
			const mockSmartCardEventClickHandler = jest.fn();
			const { findByText } = initRendererTestingLibrary(initialDoc, {
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

			const link = await findByText('justaparagraph');

			link.click();

			expect(mockOnUnhandledClickHandler).toHaveBeenCalledTimes(1);

			// No other handler should be called
			expect(mockLinkEventClickHandler).toHaveBeenCalledTimes(0);
			expect(mockMentionEventHandlers).toHaveBeenCalledTimes(0);
			expect(mockCardEventClickHandler).toHaveBeenCalledTimes(0);
			expect(mockSmartCardEventClickHandler).toHaveBeenCalledTimes(0);

			await expect(document.body).toBeAccessible();
		});
		it('should fire MentionEventHandlers when clicking on a mention', async () => {
			const mockOnUnhandledClickHandler = jest.fn();
			const mockMentionEventHandlers = jest.fn();
			const mockCardEventClickHandler = jest.fn();
			const mockLinkEventClickHandler = jest.fn();
			const mockSmartCardEventClickHandler = jest.fn();
			const { findByText } = initRendererTestingLibrary(initialDoc, {
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

			const mention = await findByText('@Carolyn');

			mention.click();

			expect(mockMentionEventHandlers).toHaveBeenCalledTimes(1);

			// No other handler should be called
			expect(mockLinkEventClickHandler).toHaveBeenCalledTimes(0);
			expect(mockCardEventClickHandler).toHaveBeenCalledTimes(0);
			expect(mockSmartCardEventClickHandler).toHaveBeenCalledTimes(0);

			await expect(document.body).toBeAccessible();
		});

		it('should fire LinkEventClickHandler on link click but not onUnhandledClick', async () => {
			const mockOnUnhandledClickHandler = jest.fn();
			const mockMentionEventHandlers = jest.fn();
			const mockCardEventClickHandler = jest.fn();
			const mockLinkEventClickHandler = jest.fn();
			const mockSmartCardEventClickHandler = jest.fn();
			const { findByText } = initRendererTestingLibrary(initialDoc, {
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

			const link = await findByText('justalink');

			link.click();

			expect(mockLinkEventClickHandler).toHaveBeenCalledTimes(1);

			// No other handler should be called
			expect(mockOnUnhandledClickHandler).toHaveBeenCalledTimes(0);
			expect(mockMentionEventHandlers).toHaveBeenCalledTimes(0);
			expect(mockCardEventClickHandler).toHaveBeenCalledTimes(0);
			expect(mockSmartCardEventClickHandler).toHaveBeenCalledTimes(0);

			await expect(document.body).toBeAccessible();
		});

		it('should fire CardEventClickHandler when clicking on a media card', async () => {
			const mockOnUnhandledClickHandler = jest.fn();
			const mockMentionEventHandlers = jest.fn();
			const mockCardEventClickHandler = jest.fn();
			const mockLinkEventClickHandler = jest.fn();
			const mockSmartCardEventClickHandler = jest.fn();
			const { findByTestId } = initRendererTestingLibrary(initialDoc, {
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
			const mediaCard = await findByTestId('media-file-card-view');

			mediaCard.click();
			expect(mockCardEventClickHandler).toHaveBeenCalledTimes(1);

			// No other handler should be called
			expect(mockOnUnhandledClickHandler).toHaveBeenCalledTimes(0);
			expect(mockLinkEventClickHandler).toHaveBeenCalledTimes(0);
			expect(mockMentionEventHandlers).toHaveBeenCalledTimes(0);
			expect(mockSmartCardEventClickHandler).toHaveBeenCalledTimes(0);

			await expect(document.body).toBeAccessible();
		});
	});

	describe('with only the desired handler and unhandled mock present', () => {
		it('should fire onUnhandledClick when clicking on paragraph text', async () => {
			const mockOnUnhandledClickHandler = jest.fn();
			const { findByText } = initRendererTestingLibrary(initialDoc, {
				eventHandlers: {
					onUnhandledClick: mockOnUnhandledClickHandler,
				},
			});

			const link = await findByText('justaparagraph');

			link.click();

			expect(mockOnUnhandledClickHandler).toHaveBeenCalledTimes(1);

			await expect(document.body).toBeAccessible();
		});

		it('should fire LinkEventClickHandler on link click but not onUnhandledClick', async () => {
			const mockOnUnhandledClickHandler = jest.fn();
			const mockLinkEventClickHandler = jest.fn();
			const { findByText } = initRendererTestingLibrary(initialDoc, {
				eventHandlers: {
					onUnhandledClick: mockOnUnhandledClickHandler,
					link: {
						onClick: mockLinkEventClickHandler,
					},
				},
			});

			const link = await findByText('justalink');

			link.click();

			expect(mockLinkEventClickHandler).toHaveBeenCalledTimes(1);

			expect(mockOnUnhandledClickHandler).toHaveBeenCalledTimes(0);

			await expect(document.body).toBeAccessible();
		});

		it('should fire MentionEventHandlers when clicking on a mention', async () => {
			const mockOnUnhandledClickHandler = jest.fn();
			const mockMentionEventHandlers = jest.fn();
			const { findByText } = initRendererTestingLibrary(initialDoc, {
				eventHandlers: {
					onUnhandledClick: mockOnUnhandledClickHandler,
					mention: {
						onClick: mockMentionEventHandlers,
						onMouseEnter: mockMentionEventHandlers,
						onMouseLeave: mockMentionEventHandlers,
					},
				},
			});

			const mention = await findByText('@Carolyn');

			mention.click();

			expect(mockMentionEventHandlers).toHaveBeenCalledTimes(1);

			await expect(document.body).toBeAccessible();
		});
	});
});
