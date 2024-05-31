import React from 'react';
import type { ReactWrapper } from 'enzyme';
import type { Props } from '../../../ui/Renderer';
import Renderer from '../../../ui/Renderer';
import { IntlProvider } from 'react-intl-next';
import { render } from '@testing-library/react';
import { exampleMediaFeatureFlags, fakeMediaClient } from '@atlaskit/media-test-helpers';
import initialDoc from '../../__fixtures__/event-handlers.adf.json';
import { MediaClientContext } from '@atlaskit/media-client-react';

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
	let renderer: ReactWrapper;

	const initRendererTestingLibrary = (doc: any, props: Partial<Props> = {}) => {
		const finalProps: Props = {
			document: doc,
			media: {
				allowLinking: true,
				featureFlags: exampleMediaFeatureFlags,
			},
			...props,
		};
		return render(
			<IntlProvider locale="en">
				<MediaClientContext.Provider value={fakeMediaClient()}>
					<Renderer {...finalProps} />
				</MediaClientContext.Provider>
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

	afterEach(() => {
		if (renderer && renderer.length) {
			renderer.unmount();
		}
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

			expect(mockOnUnhandledClickHandler).toBeCalledTimes(1);

			// No other handler should be called
			expect(mockLinkEventClickHandler).toBeCalledTimes(0);
			expect(mockMentionEventHandlers).toBeCalledTimes(0);
			expect(mockCardEventClickHandler).toBeCalledTimes(0);
			expect(mockSmartCardEventClickHandler).toBeCalledTimes(0);
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

			expect(mockMentionEventHandlers).toBeCalledTimes(1);

			// No other handler should be called
			expect(mockLinkEventClickHandler).toBeCalledTimes(0);
			expect(mockCardEventClickHandler).toBeCalledTimes(0);
			expect(mockSmartCardEventClickHandler).toBeCalledTimes(0);
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

			expect(mockLinkEventClickHandler).toBeCalledTimes(1);

			// No other handler should be called
			expect(mockOnUnhandledClickHandler).toBeCalledTimes(0);
			expect(mockMentionEventHandlers).toBeCalledTimes(0);
			expect(mockCardEventClickHandler).toBeCalledTimes(0);
			expect(mockSmartCardEventClickHandler).toBeCalledTimes(0);
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
			expect(mockCardEventClickHandler).toBeCalledTimes(1);

			// No other handler should be called
			expect(mockOnUnhandledClickHandler).toBeCalledTimes(0);
			expect(mockLinkEventClickHandler).toBeCalledTimes(0);
			expect(mockMentionEventHandlers).toBeCalledTimes(0);
			expect(mockSmartCardEventClickHandler).toBeCalledTimes(0);
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

			expect(mockOnUnhandledClickHandler).toBeCalledTimes(1);
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

			expect(mockLinkEventClickHandler).toBeCalledTimes(1);

			expect(mockOnUnhandledClickHandler).toBeCalledTimes(0);
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

			expect(mockMentionEventHandlers).toBeCalledTimes(1);
		});
	});
});
