import { AnalyticsListener as AnalyticsListenerNext } from '@atlaskit/analytics-next';
// These imports are not included in the manifest file to avoid circular package dependencies blocking our Typescript and bundling tooling
// Commented due to HOT-111922
// import { type ConcurrentExperience } from '@atlaskit/ufo';
import FocusRing from '@atlaskit/focus-ring';
import React from 'react';
import Mention, { ANALYTICS_HOVER_DELAY } from '../../../components/Mention';
import ResourcedMention from '../../../components/Mention/ResourcedMention';
import { ELEMENTS_CHANNEL } from '../../../_constants';
import { IntlProvider } from 'react-intl-next';
import { MentionType, MentionNameStatus } from '../../../types';
import MentionResource, { type MentionProvider } from '../../../api/MentionResource';
import { type MentionNameResolver } from '../../../api/MentionNameResolver';
import {
	mockMentionData as mentionData,
	mockMentionProvider as mentionProvider,
} from '../_test-helpers';
import { screen, render, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

const packageName = process.env._PACKAGE_NAME_ as string;

const createPayload = (actionSubject: string, action: string) => ({
	payload: {
		action,
		actionSubject,
		attributes: {
			packageName,
			packageVersion: expect.any(String),
			componentName: 'mention',
			accessLevel: 'CONTAINER',
			isSpecial: false,
			userId: mentionData.id,
		},
		eventType: 'ui',
	},
});

const mockUfoStart = jest.fn();
const mockUfoSuccess = jest.fn();
const mockUfoFailure = jest.fn();
jest.mock('@atlaskit/ufo', () => {
	const actualModule = jest.requireActual('@atlaskit/ufo');

	class MockConcurrentExperience {
		experienceId: string;
		constructor(experienceId: string) {
			this.experienceId = experienceId;
		}

		getInstance(id: string) {
			return {
				start: mockUfoStart,
				success: mockUfoSuccess,
				failure: mockUfoFailure,
			};
		}
	}

	return {
		__esModule: true,
		...actualModule,
		ConcurrentExperience: MockConcurrentExperience,
	};
});

jest.mock('@atlaskit/focus-ring', () => ({
	__esModule: true,
	default: jest.fn(),
}));

// QS-5280 - Upgrade @atlaskit/mention to React 18
// Without this wrapper we get a "change to react wasn't wrapped in act" as soon as we render <Mention /> with no other action
// This is an old component doing some funky things internally with MessagesIntlProvider and the ufoExperience wrapper via getInstance
// This helper makes these tests much easier to work with due to the waitFor
const renderWait = async (children: React.ReactNode) => {
	const renderReturn = render(<IntlProvider locale="en">{children}</IntlProvider>);
	await waitFor(async () => {
		expect(renderReturn.container.querySelector(`[data-mention-type]`)).toBeInTheDocument();
	});
	return renderReturn;
};

describe('<Mention />', () => {
	beforeEach(() => {
		jest.useFakeTimers();

		(FocusRing as jest.Mock).mockImplementation(
			(props: { children: React.ReactElement }) => props.children,
		);
	});

	afterEach(() => {
		jest.useRealTimers();
		jest.clearAllMocks();
	});

	describe('Mention', () => {
		it('should render based on mention data', async () => {
			await renderWait(<Mention {...mentionData} />);

			expect(screen.getByText(mentionData.text)).toBeInTheDocument();
		});

		it('should render a default lozenge if no accessLevel data and is not being mentioned', async () => {
			const { container } = await renderWait(<Mention {...mentionData} />);
			const item = container.querySelector(`[data-mention-type="${MentionType.DEFAULT}"]`);
			expect(item).toBeInTheDocument();
		});

		it('should render a default lozenge if the user has CONTAINER permissions but is not being mentioned', async () => {
			const { container } = await renderWait(
				<Mention {...mentionData} accessLevel={'CONTAINER'} />,
			);
			const item = container.querySelector(`[data-mention-type="${MentionType.DEFAULT}"]`);
			expect(item).toBeInTheDocument();
		});

		it('should add a highlighted lozenge if `isHighlighted` is set to true', async () => {
			const { container } = await renderWait(<Mention {...mentionData} isHighlighted={true} />);
			const item = container.querySelector(`[data-mention-type="${MentionType.SELF}"]`);
			expect(item).toBeInTheDocument();
		});

		it('should render a restricted style lozenge if the user has NONE permissions', async () => {
			const { container } = await renderWait(<Mention {...mentionData} accessLevel={'NONE'} />);
			const item = container.querySelector(`[data-mention-type="${MentionType.RESTRICTED}"]`);
			expect(item).toBeInTheDocument();
		});

		it('should render a unrestricted style lozenge if the user has CONTAINER permissions', async () => {
			const { container } = await renderWait(
				<Mention {...mentionData} accessLevel={'CONTAINER'} />,
			);
			const item = container.querySelector(`[data-mention-type="${MentionType.DEFAULT}"]`);
			expect(item).toBeInTheDocument();
		});

		it('should render a unrestricted style lozenge if the user has CONTAINER permissions', async () => {
			const { container } = await renderWait(
				<Mention {...mentionData} accessLevel={'APPLICATION'} />,
			);
			const item = container.querySelector(`[data-mention-type="${MentionType.DEFAULT}"]`);
			expect(item).toBeInTheDocument();
		});

		it('should not display a tooltip if no accessLevel data', async () => {
			const { container } = await renderWait(<Mention {...mentionData} />);
			const item = container.querySelector(`[data-mention-tooltip="false"`);
			expect(item).toBeInTheDocument();
		});

		it('should display tooltip if mentioned user does not have container permission', async () => {
			const { container } = await renderWait(<Mention {...mentionData} accessLevel="NONE" />);
			const item = container.querySelector(`[data-mention-tooltip="true"`);
			expect(item).toBeInTheDocument();
		});

		it('should not display tooltip if mention is highlighted', async () => {
			const { container } = await renderWait(<Mention {...mentionData} isHighlighted={true} />);
			const item = container.querySelector(`[data-mention-tooltip="false"`);
			expect(item).toBeInTheDocument();
		});

		it('should dispatch onClick-event', async () => {
			const user = userEvent.setup();
			const spy = jest.fn();

			await renderWait(<Mention {...mentionData} isHighlighted={true} onClick={spy} />);

			await waitFor(async () => {
				const trigger = await screen.findByText(mentionData.text);
				await user.click(trigger);
			});

			expect(spy).toHaveBeenCalled();
			expect(spy).toHaveBeenLastCalledWith(
				mentionData.id,
				mentionData.text,
				expect.anything(),
				expect.anything(),
			);
		});

		it('should dispatch lozenge.select analytics onClick-event', async () => {
			const user = userEvent.setup();
			const analyticsNextHandlerSpy = jest.fn();

			await renderWait(
				<AnalyticsListenerNext onEvent={analyticsNextHandlerSpy} channel={ELEMENTS_CHANNEL}>
					<Mention {...mentionData} accessLevel={'CONTAINER'} />
				</AnalyticsListenerNext>,
			);

			await waitFor(async () => {
				const trigger = await screen.findByText(mentionData.text);
				await user.click(trigger);
			});

			expect(analyticsNextHandlerSpy).toHaveBeenCalled();
			expect(analyticsNextHandlerSpy).toHaveBeenCalledWith(
				expect.objectContaining(createPayload('mention', 'selected')),
				ELEMENTS_CHANNEL,
			);
		});

		it('should dispatch onMouseEnter-event', async () => {
			const user = userEvent.setup();
			const spy = jest.fn();

			await renderWait(<Mention {...mentionData} isHighlighted={true} onMouseEnter={spy} />);

			await waitFor(async () => {
				const trigger = await screen.findByText(mentionData.text);
				await user.hover(trigger);
			});

			expect(spy).toHaveBeenCalledWith(mentionData.id, mentionData.text, expect.anything());
		});

		it('should dispatch onMouseLeave-event', async () => {
			const user = userEvent.setup();
			const spy = jest.fn();

			await renderWait(<Mention {...mentionData} isHighlighted={true} onMouseLeave={spy} />);

			await waitFor(async () => {
				const trigger = await screen.findByText(mentionData.text);
				await user.hover(trigger);
				await user.unhover(trigger);
			});

			expect(spy).toHaveBeenCalledWith(mentionData.id, mentionData.text, expect.anything());
		});

		it('should dispatch lozenge.hover analytics event if hover delay is greater than the threshold', async () => {
			const user = userEvent.setup();
			const analyticsNextHandlerSpy = jest.fn();

			await renderWait(
				<AnalyticsListenerNext onEvent={analyticsNextHandlerSpy} channel={ELEMENTS_CHANNEL}>
					<Mention {...mentionData} accessLevel={'CONTAINER'} />
				</AnalyticsListenerNext>,
			);

			await waitFor(async () => {
				const trigger = await screen.findByText(mentionData.text);
				await user.hover(trigger);
			});

			jest.advanceTimersByTime(ANALYTICS_HOVER_DELAY);

			expect(analyticsNextHandlerSpy).toHaveBeenCalledWith(
				expect.objectContaining(createPayload('mention', 'hovered')),
				ELEMENTS_CHANNEL,
			);
		});

		it('should not dispatch lozenge.hover analytics event for a hover delay bellow the threshold', async () => {
			const user = userEvent.setup();
			const analyticsNextHandlerSpy = jest.fn();

			await renderWait(
				<AnalyticsListenerNext onEvent={analyticsNextHandlerSpy} channel={ELEMENTS_CHANNEL}>
					<Mention {...mentionData} accessLevel={'CONTAINER'} />
				</AnalyticsListenerNext>,
			);

			await waitFor(async () => {
				const trigger = await screen.findByText(mentionData.text);
				await user.hover(trigger);
			});

			jest.advanceTimersByTime(ANALYTICS_HOVER_DELAY / 5);

			await waitFor(async () => {
				const trigger = screen.getByText(mentionData.text);
				await user.unhover(trigger);
			});

			// to make sure the clearTimeout removed the scheduled task
			jest.advanceTimersByTime(ANALYTICS_HOVER_DELAY);

			expect(analyticsNextHandlerSpy).not.toHaveBeenCalled();
		});

		it('should render a stateless mention component with correct data attributes', async () => {
			const { container } = await renderWait(<Mention {...mentionData} accessLevel="NONE" />);

			// flush promises to load async components
			await new Promise(setImmediate);
			// mention.update();

			const mentionById = container.querySelector(`[data-mention-id="${mentionData.id}"]`);
			expect(mentionById).toBeInTheDocument();

			const mentionByAccessLevel = container.querySelector(`[data-access-level="NONE"]`);
			expect(mentionByAccessLevel).toBeInTheDocument();
		});

		it('should have spell check disabled', async () => {
			await renderWait(<Mention {...mentionData} />);

			const mention = screen.getByTestId(`mention-${mentionData.id}`);
			expect(mention.getAttribute('spellcheck')).toEqual('false');
		});

		it('should render @... if no text attribute is supplied', async () => {
			await renderWait(<Mention {...mentionData} text="" />);

			expect(screen.getByText('@...')).toBeInTheDocument();
		});

		describe('UFO metrics', () => {
			beforeEach(() => {
				mockUfoStart.mockReset();
				mockUfoSuccess.mockReset();
				mockUfoFailure.mockReset();
			});

			it('should send a UFO success metric when mounted successfully', async () => {
				await renderWait(<Mention {...mentionData} text="" />);

				expect(mockUfoStart).toHaveBeenCalled();
				expect(mockUfoSuccess).toHaveBeenCalled();
			});

			it('should send a UFO failure metric when mount fails', async () => {
				// Mock one the things rendered by @atlaskit/mention, so we can simulate a mount error
				(FocusRing as jest.Mock).mockImplementation(() => {
					throw new Error('FocusRing Exception');
				});

				render(
					<IntlProvider locale="en">
						<Mention {...mentionData} text="" />
					</IntlProvider>,
				);

				expect(mockUfoStart).toHaveBeenCalled();
				expect(mockUfoFailure).toHaveBeenCalled();
			});
		});
	});

	describe('ResourcedMention', () => {
		let resolvingMentionProvider: Promise<MentionProvider>;
		let mentionNameResolver: MentionNameResolver;
		beforeEach(() => {
			mentionNameResolver = {
				lookupName: jest.fn(),
				cacheName: jest.fn(),
			} as MentionNameResolver;
			resolvingMentionProvider = Promise.resolve(
				new MentionResource({
					url: 'dummyurl',
					mentionNameResolver,
				}),
			);
		});

		afterEach(() => {
			jest.clearAllMocks();
		});

		it('should render a stateless mention component based on mention data', async () => {
			await renderWait(<ResourcedMention {...mentionData} mentionProvider={mentionProvider()} />);

			expect(screen.getByText(mentionData.text)).toBeInTheDocument();
		});

		it('should render a mention and use supplied mention name even if resolving provider', async () => {
			await renderWait(
				<ResourcedMention {...mentionData} mentionProvider={resolvingMentionProvider} />,
			);

			expect(screen.getByText(mentionData.text)).toBeInTheDocument();
			expect(mentionNameResolver.lookupName).toHaveBeenCalledTimes(0);
		});

		it('prefers text from prop over mention resolver', async () => {
			const resolvedProps = {
				id: '1',
				name: 'resolved name',
				status: MentionNameStatus.OK,
			};
			(mentionNameResolver.lookupName as any as jest.SpyInstance).mockReturnValue(resolvedProps);
			const mentionProps = {
				id: '1',
				text: '',
			};
			const { container, rerender } = await renderWait(
				<ResourcedMention {...mentionProps} mentionProvider={resolvingMentionProvider} />,
			);

			expect(mentionNameResolver.lookupName).toHaveBeenCalledTimes(1);
			const firstMention = container.querySelector(`[data-mention-type]`);
			expect(firstMention).toHaveTextContent(`@${resolvedProps.name}`);

			(mentionNameResolver.lookupName as any as jest.SpyInstance).mockClear();
			rerender(
				<IntlProvider locale="en">
					<ResourcedMention {...mentionData} mentionProvider={resolvingMentionProvider} />
				</IntlProvider>,
			);

			expect(mentionNameResolver.lookupName).toHaveBeenCalledTimes(0);
			const reRenderFirstMention = container.querySelector(`[data-mention-type]`);
			expect(reRenderFirstMention).toHaveTextContent(mentionData.text);
		});

		it('should render a highlighted stateless mention component if mentionProvider.shouldHighlightMention returns true', async () => {
			const { container } = await renderWait(
				<ResourcedMention id="oscar" text="@Oscar Wallhult" mentionProvider={mentionProvider()} />,
			);

			await waitFor(async () => {
				const item = container.querySelector(`[data-mention-type="${MentionType.SELF}"]`);
				expect(item).toBeInTheDocument();
			});
		});

		it('should not render highlighted mention component if there is no mentionProvider', async () => {
			const { container } = await renderWait(
				<ResourcedMention id="oscar" text="@Oscar Wallhult" />,
			);

			await waitFor(async () => {
				const item = container.querySelector(`[data-mention-type="${MentionType.DEFAULT}"]`);
				expect(item).toBeInTheDocument();
			});
		});

		it('should dispatch onClick-event', async () => {
			const user = userEvent.setup();
			const spy = jest.fn();

			await renderWait(
				<ResourcedMention {...mentionData} mentionProvider={mentionProvider()} onClick={spy} />,
			);

			await waitFor(async () => {
				const trigger = await screen.findByText(mentionData.text);
				await user.click(trigger);
			});

			expect(spy).toHaveBeenCalled();
			expect(spy).toHaveBeenLastCalledWith(
				mentionData.id,
				mentionData.text,
				expect.anything(),
				expect.anything(),
			);
		});

		it('should dispatch onMouseEnter-event', async () => {
			const user = userEvent.setup();
			const spy = jest.fn();

			await renderWait(
				<ResourcedMention
					{...mentionData}
					mentionProvider={mentionProvider()}
					onMouseEnter={spy}
				/>,
			);

			await waitFor(async () => {
				const trigger = await screen.findByText(mentionData.text);
				await user.hover(trigger);
			});

			expect(spy).toHaveBeenCalled();
			expect(spy).toHaveBeenLastCalledWith(mentionData.id, mentionData.text, expect.anything());
		});

		it('should dispatch onMouseLeave-event', async () => {
			const user = userEvent.setup();
			const spy = jest.fn();

			await renderWait(
				<ResourcedMention
					{...mentionData}
					mentionProvider={mentionProvider()}
					onMouseLeave={spy}
				/>,
			);

			await waitFor(async () => {
				const trigger = await screen.findByText(mentionData.text);
				await user.hover(trigger);
				await user.unhover(trigger);
			});

			expect(spy).toHaveBeenCalled();
			expect(spy).toHaveBeenLastCalledWith(mentionData.id, mentionData.text, expect.anything());
		});

		describe('resolving mention name', () => {
			it('should render a mention and use the resolving provider to lookup the name (string result)', async () => {
				(mentionNameResolver.lookupName as any as jest.SpyInstance).mockReturnValue({
					id: '123',
					name: 'cheese',
					status: MentionNameStatus.OK,
				});
				const { container } = await renderWait(
					<ResourcedMention {...mentionData} text="" mentionProvider={resolvingMentionProvider} />,
				);
				expect(mentionNameResolver.lookupName).toHaveBeenCalledTimes(1);
				const firstMention = container.querySelector(`[data-mention-type]`);
				expect(firstMention).toHaveTextContent('@cheese');
			});

			it('should render a mention and use the resolving provider to lookup the name (string result, unknown)', async () => {
				(mentionNameResolver.lookupName as any as jest.SpyInstance).mockReturnValue({
					id: mentionData.id,
					status: MentionNameStatus.UNKNOWN,
				});
				const { container } = await renderWait(
					<ResourcedMention
						id={mentionData.id}
						text=""
						mentionProvider={resolvingMentionProvider}
					/>,
				);
				expect(mentionNameResolver.lookupName).toHaveBeenCalledTimes(1);
				const firstMention = container.querySelector(`[data-mention-type]`);
				expect(firstMention).toHaveTextContent('@Unknown user -ABCD');
			});

			it('should render a mention and use the resolving provider to lookup the name (string result, service error)', async () => {
				(mentionNameResolver.lookupName as any as jest.SpyInstance).mockReturnValue({
					id: mentionData.id,
					status: MentionNameStatus.SERVICE_ERROR,
				});
				const { container } = await renderWait(
					<ResourcedMention id="123" text="" mentionProvider={resolvingMentionProvider} />,
				);
				expect(mentionNameResolver.lookupName).toHaveBeenCalledTimes(1);
				const firstMention = container.querySelector(`[data-mention-type]`);
				expect(firstMention).toHaveTextContent('@Unknown user 123');
			});

			it('should render a mention and use the resolving provider to lookup the name (Promise result)', async () => {
				(mentionNameResolver.lookupName as any as jest.SpyInstance).mockReturnValue(
					Promise.resolve({
						id: mentionData.id,
						name: 'bacon',
						status: MentionNameStatus.OK,
					}),
				);
				const { container } = await renderWait(
					<ResourcedMention {...mentionData} text="" mentionProvider={resolvingMentionProvider} />,
				);
				expect(mentionNameResolver.lookupName).toHaveBeenCalledTimes(1);
				const firstMention = container.querySelector(`[data-mention-type]`);
				expect(firstMention).toHaveTextContent('@bacon');
			});

			it('should render a mention and use the resolving provider to lookup the name (Promise result, unknown)', async () => {
				(mentionNameResolver.lookupName as any as jest.SpyInstance).mockReturnValue(
					Promise.resolve({
						id: mentionData.id,
						status: MentionNameStatus.UNKNOWN,
					}),
				);
				const { container } = await renderWait(
					<ResourcedMention {...mentionData} text="" mentionProvider={resolvingMentionProvider} />,
				);
				expect(mentionNameResolver.lookupName).toHaveBeenCalledTimes(1);
				const firstMention = container.querySelector(`[data-mention-type]`);
				expect(firstMention).toHaveTextContent('@Unknown user -ABCD');
			});

			it('should render a mention and use the resolving provider to lookup the name (Promise result, service error)', async () => {
				(mentionNameResolver.lookupName as any as jest.SpyInstance).mockReturnValue(
					Promise.resolve({
						id: mentionData.id,
						status: MentionNameStatus.SERVICE_ERROR,
					}),
				);
				const { container } = await renderWait(
					<ResourcedMention id="" text="" mentionProvider={resolvingMentionProvider} />,
				);
				expect(mentionNameResolver.lookupName).toHaveBeenCalledTimes(1);
				const firstMention = container.querySelector(`[data-mention-type]`);
				expect(firstMention).toHaveTextContent('@Unknown user');
			});
		});
	});
});
