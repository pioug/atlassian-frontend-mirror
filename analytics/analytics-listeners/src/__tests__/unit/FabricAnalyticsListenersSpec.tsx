import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';
import { createComponentWithAnalytics, IncorrectEventType } from '../../../examples/helpers';
import FabricAnalyticsListeners from '../../FabricAnalyticsListeners';
import { LOG_LEVEL } from '../../helpers/logger';
import { type AnalyticsWebClient, FabricChannel } from '../../types';

declare const global: any;

const DummyElementsCompWithAnalytics = createComponentWithAnalytics(FabricChannel.elements);
const DummyAtlaskitCompWithAnalytics = createComponentWithAnalytics(FabricChannel.atlaskit);
const DummyNavigationCompWithAnalytics = createComponentWithAnalytics(FabricChannel.navigation);
const DummyMediaCompWithAnalytics = createComponentWithAnalytics(FabricChannel.media);
const DummyPeopleTeamsCompWithAnalytics = createComponentWithAnalytics(FabricChannel.peopleTeams);
const DummyNotificationsCompWithAnalytics = createComponentWithAnalytics(
	FabricChannel.notifications,
);
const DummyCrossFlowCompWithAnalytics = createComponentWithAnalytics(FabricChannel.crossFlow);
const DummyPostOfficeCompWithAnalytics = createComponentWithAnalytics(FabricChannel.postOffice);
const DummyAIMateCompWithAnalytics = createComponentWithAnalytics(FabricChannel.aiMate);
const DummyAVPCompWithAnalytics = createComponentWithAnalytics(FabricChannel.avp);
const AtlaskitIncorrectEventType = IncorrectEventType(FabricChannel.atlaskit);
const DummyOmniChannelCompWithAnalytics = createComponentWithAnalytics(FabricChannel.omniChannel);

describe('<FabricAnalyticsListeners />', () => {
	let analyticsWebClientMock: AnalyticsWebClient;
	const hasError = jest.fn();

	beforeEach(() => {
		analyticsWebClientMock = {
			sendUIEvent: jest.fn(),
			sendOperationalEvent: jest.fn(),
			sendTrackEvent: jest.fn(),
			sendScreenEvent: jest.fn(),
		};
		jest.spyOn(global.console, 'error');
		jest.spyOn(global.console, 'warn');

		Object.defineProperty(global.console, 'hasError', {
			value: hasError,
		});
	});

	afterEach(() => {
		global.console.warn.mockRestore();
		global.console.error.mockRestore();
		// @ts-ignore
		Reflect.deleteProperty(global.console, 'hasError');

		analyticsWebClientMock = {
			sendUIEvent: jest.fn(),
			sendOperationalEvent: jest.fn(),
			sendTrackEvent: jest.fn(),
			sendScreenEvent: jest.fn(),
		};
	});

	describe('FabricAnalyticsListener', () => {
		it('should not throw an error when no client is provided', () => {
			const compOnClick = jest.fn();
			expect(() =>
				render(
					// @ts-ignore
					<FabricAnalyticsListeners>
						<DummyElementsCompWithAnalytics onClick={compOnClick} />
					</FabricAnalyticsListeners>,
				),
			).not.toThrow();
		});

		it('should accept and handle a promise-like client', async () => {
			const promiseLikeClient: Promise<AnalyticsWebClient> = {
				// @ts-ignore This violated type definition upgrade of @types/jest to v24.0.18 & ts-jest v24.1.0.
				//See BUILDTOOLS-210-clean: https://bitbucket.org/atlassian/atlaskit-mk-2/pull-requests/7178/buildtools-210-clean/diff
				then: jest.fn(() => promiseLikeClient),
				catch: jest.fn(),
				finally: jest.fn(() => promiseLikeClient),
				[Symbol.toStringTag]: '',
			};

			const compOnClick = jest.fn();
			render(
				<FabricAnalyticsListeners client={promiseLikeClient} logLevel={LOG_LEVEL.ERROR}>
					<DummyElementsCompWithAnalytics onClick={compOnClick} />
				</FabricAnalyticsListeners>,
			);

			const dummyComponent = screen.getByRole('button', { name: 'fabric-elements' });
			expect(dummyComponent).toBeInTheDocument();

			await fireEvent.click(dummyComponent);
		});

		it('should not explode if something explodes in callback', () => {
			const promiseLikeClient = {
				sendUIEvent: jest.fn(() => {
					throw new Error('Boom!');
				}),
			};

			const compOnClick = jest.fn();
			render(
				<FabricAnalyticsListeners client={promiseLikeClient as any} logLevel={LOG_LEVEL.WARN}>
					<DummyElementsCompWithAnalytics onClick={compOnClick} />
				</FabricAnalyticsListeners>,
			);

			const dummyComponent = screen.getByRole('button', { name: 'fabric-elements' });
			expect(dummyComponent).toBeInTheDocument();

			fireEvent.click(dummyComponent);
		});

		it('should log an error when an invalid event type is captured and error logging is enabled', () => {
			const compOnClick = jest.fn();
			render(
				<FabricAnalyticsListeners client={analyticsWebClientMock} logLevel={LOG_LEVEL.ERROR}>
					<AtlaskitIncorrectEventType onClick={compOnClick} />
				</FabricAnalyticsListeners>,
			);

			const dummyComponent = screen.getByRole('button', { name: 'atlaskit' });
			expect(dummyComponent).toBeInTheDocument();

			fireEvent.click(dummyComponent);
			expect(global.console.error).toHaveBeenCalledTimes(1);
		});

		it('should render all listeners', () => {
			render(
				<FabricAnalyticsListeners client={analyticsWebClientMock}>
					<div>Child</div>
				</FabricAnalyticsListeners>,
			);

			expect(screen.getByText('Child')).toBeInTheDocument();
		});

		it('should render a FabricElementsListener', () => {
			render(
				<FabricAnalyticsListeners client={analyticsWebClientMock}>
					<DummyElementsCompWithAnalytics onClick={() => {}} />
				</FabricAnalyticsListeners>,
			);

			const dummyComponent = screen.getByRole('button', { name: 'fabric-elements' });
			expect(dummyComponent).toBeInTheDocument();
		});

		it('should render an AtlaskitListener', () => {
			render(
				<FabricAnalyticsListeners client={analyticsWebClientMock}>
					<DummyAtlaskitCompWithAnalytics onClick={() => {}} />
				</FabricAnalyticsListeners>,
			);

			const dummyComponent = screen.getByRole('button', { name: 'atlaskit' });
			expect(dummyComponent).toBeInTheDocument();
		});

		it('should render a NavigationListener', () => {
			render(
				<FabricAnalyticsListeners client={analyticsWebClientMock}>
					<DummyNavigationCompWithAnalytics onClick={() => {}} />
				</FabricAnalyticsListeners>,
			);

			const dummyComponent = screen.getByRole('button', { name: 'navigation' });
			expect(dummyComponent).toBeInTheDocument();
		});

		it('should render a PostOfficeListener', () => {
			render(
				<FabricAnalyticsListeners client={analyticsWebClientMock}>
					<DummyPostOfficeCompWithAnalytics onClick={() => {}} />
				</FabricAnalyticsListeners>,
			);

			const dummyComponent = screen.getByRole('button', { name: 'postOffice' });
			expect(dummyComponent).toBeInTheDocument();
		});

		it('should exclude the AtlaskitListener if excludedChannels includes atlaskit', () => {
			render(
				<FabricAnalyticsListeners
					client={analyticsWebClientMock}
					excludedChannels={[FabricChannel.atlaskit]}
				>
					<DummyElementsCompWithAnalytics onClick={() => {}} />
					<DummyAtlaskitCompWithAnalytics onClick={() => {}} />
				</FabricAnalyticsListeners>,
			);

			const dummyElementsComponent = screen.getByRole('button', { name: 'fabric-elements' });
			expect(dummyElementsComponent).toBeInTheDocument();

			const dummyAtlaskitComponent = screen.queryByRole('dummy-atlaskit');
			expect(dummyAtlaskitComponent).not.toBeInTheDocument();
		});

		it('should exclude the ElementsListener if excludedChannels includes elements', () => {
			render(
				<FabricAnalyticsListeners
					client={analyticsWebClientMock}
					excludedChannels={[FabricChannel.elements]}
				>
					<DummyElementsCompWithAnalytics onClick={() => {}} />
					<DummyAtlaskitCompWithAnalytics onClick={() => {}} />
				</FabricAnalyticsListeners>,
			);

			const dummyAtlaskitComponent = screen.getByRole('button', { name: 'atlaskit' });
			expect(dummyAtlaskitComponent).toBeInTheDocument();

			const dummyElementsComponent = screen.queryByRole('fabric-elements');
			expect(dummyElementsComponent).not.toBeInTheDocument();
		});

		it('should exclude the NavigationListener if excludedChannels includes navigation', () => {
			render(
				<FabricAnalyticsListeners
					client={analyticsWebClientMock}
					excludedChannels={[FabricChannel.navigation]}
				>
					<DummyNavigationCompWithAnalytics onClick={() => {}} />
					<DummyAtlaskitCompWithAnalytics onClick={() => {}} />
					<DummyElementsCompWithAnalytics onClick={() => {}} />
				</FabricAnalyticsListeners>,
			);

			const dummyAtlaskitComponent = screen.getByRole('button', { name: 'atlaskit' });
			expect(dummyAtlaskitComponent).toBeInTheDocument();

			const dummyElementsComponent = screen.getByRole('button', { name: 'fabric-elements' });
			expect(dummyElementsComponent).toBeInTheDocument();

			const dummyNavigationComponent = screen.queryByRole('dummy-navigation');
			expect(dummyNavigationComponent).not.toBeInTheDocument();
		});

		it('should exclude both atlaskit and elements listeners if excludedChannels includes both their channels', () => {
			render(
				<FabricAnalyticsListeners
					client={analyticsWebClientMock}
					excludedChannels={[FabricChannel.elements, FabricChannel.atlaskit]}
				>
					<DummyElementsCompWithAnalytics onClick={() => {}} />
					<DummyAtlaskitCompWithAnalytics onClick={() => {}} />
					<div>Child</div>
				</FabricAnalyticsListeners>,
			);

			const dummyElementsComponent = screen.queryByRole('fabric-elements');
			expect(dummyElementsComponent).not.toBeInTheDocument();

			const dummyAtlaskitComponent = screen.queryByRole('dummy-atlaskit');
			expect(dummyAtlaskitComponent).not.toBeInTheDocument();

			expect(screen.getByText('Child')).toBeInTheDocument();
		});

		it('should not exclude any listeners if excludeChannels is empty', () => {
			render(
				<FabricAnalyticsListeners client={analyticsWebClientMock} excludedChannels={[]}>
					<DummyElementsCompWithAnalytics onClick={() => {}} />
					<DummyAtlaskitCompWithAnalytics onClick={() => {}} />
				</FabricAnalyticsListeners>,
			);

			const dummyElementsComponent = screen.getByRole('button', { name: 'fabric-elements' });
			expect(dummyElementsComponent).toBeInTheDocument();

			const dummyAtlaskitComponent = screen.getByRole('button', { name: 'atlaskit' });
			expect(dummyAtlaskitComponent).toBeInTheDocument();
		});
	});

	describe('<FabricElementsListener />', () => {
		it('should listen and fire a UI event with analyticsWebClient', async () => {
			const compOnClick = jest.fn();
			render(
				<FabricAnalyticsListeners client={analyticsWebClientMock}>
					<DummyElementsCompWithAnalytics onClick={compOnClick} />
				</FabricAnalyticsListeners>,
			);

			const dummyComponent = screen.getByRole('button', { name: 'fabric-elements' });
			expect(dummyComponent).toBeInTheDocument();

			await fireEvent.click(dummyComponent);

			expect(analyticsWebClientMock.sendUIEvent).toBeCalled();
		});

		it('should listen and fire a UI event with analyticsWebClient as Promise', async () => {
			analyticsWebClientMock.sendUIEvent = jest.fn();

			const compOnClick = jest.fn();
			render(
				<FabricAnalyticsListeners client={Promise.resolve(analyticsWebClientMock)}>
					<DummyElementsCompWithAnalytics onClick={compOnClick} />
				</FabricAnalyticsListeners>,
			);

			const dummyComponent = screen.getByRole('button', { name: 'fabric-elements' });
			expect(dummyComponent).toBeInTheDocument();

			await fireEvent.click(dummyComponent);

			expect(analyticsWebClientMock.sendUIEvent).toBeCalled();
		});
	});

	describe('<AtlaskitListener />', () => {
		it('should listen and fire a UI event with analyticsWebClient', async () => {
			const compOnClick = jest.fn();
			render(
				<FabricAnalyticsListeners client={analyticsWebClientMock}>
					<DummyAtlaskitCompWithAnalytics onClick={compOnClick} />
				</FabricAnalyticsListeners>,
			);

			const dummyComponent = screen.getByRole('button', { name: 'atlaskit' });
			expect(dummyComponent).toBeInTheDocument();

			await fireEvent.click(dummyComponent);

			expect(analyticsWebClientMock.sendUIEvent).toBeCalled();
		});

		it('should listen and fire a UI event with analyticsWebClient as Promise', async () => {
			analyticsWebClientMock.sendUIEvent = jest.fn();

			const compOnClick = jest.fn();
			render(
				<FabricAnalyticsListeners client={Promise.resolve(analyticsWebClientMock)}>
					<DummyAtlaskitCompWithAnalytics onClick={compOnClick} />
				</FabricAnalyticsListeners>,
			);

			const dummyComponent = screen.getByRole('button', { name: 'atlaskit' });
			expect(dummyComponent).toBeInTheDocument();

			await fireEvent.click(dummyComponent);

			expect(analyticsWebClientMock.sendUIEvent).toBeCalled();
		});
	});

	describe('<NavigationListener />', () => {
		it('should listen and fire a UI event with analyticsWebClient', async () => {
			const compOnClick = jest.fn();
			render(
				<FabricAnalyticsListeners client={analyticsWebClientMock}>
					<DummyNavigationCompWithAnalytics onClick={compOnClick} />
				</FabricAnalyticsListeners>,
			);

			const dummyComponent = screen.getByRole('button', { name: 'navigation' });
			expect(dummyComponent).toBeInTheDocument();

			await fireEvent.click(dummyComponent);

			expect(analyticsWebClientMock.sendUIEvent).toBeCalled();
		});

		it('should listen and fire a UI event with analyticsWebClient as Promise', async () => {
			analyticsWebClientMock.sendUIEvent = jest.fn();

			const compOnClick = jest.fn();
			render(
				<FabricAnalyticsListeners client={Promise.resolve(analyticsWebClientMock)}>
					<DummyNavigationCompWithAnalytics onClick={compOnClick} />
				</FabricAnalyticsListeners>,
			);

			const dummyComponent = screen.getByRole('button', { name: 'navigation' });
			expect(dummyComponent).toBeInTheDocument();

			await fireEvent.click(dummyComponent);

			expect(analyticsWebClientMock.sendUIEvent).toBeCalled();
		});
	});

	describe('<MediaListener />', () => {
		it('should listen and fire a UI event with analyticsWebClient', async () => {
			const compOnClick = jest.fn();
			render(
				<FabricAnalyticsListeners client={analyticsWebClientMock}>
					<DummyMediaCompWithAnalytics onClick={compOnClick} />
				</FabricAnalyticsListeners>,
			);

			const dummyComponent = screen.getByRole('button', { name: 'media' });
			expect(dummyComponent).toBeInTheDocument();

			await fireEvent.click(dummyComponent);

			expect(analyticsWebClientMock.sendUIEvent).toBeCalled();
		});

		it('should listen and fire a UI event with analyticsWebClient as Promise', async () => {
			analyticsWebClientMock.sendUIEvent = jest.fn();

			const compOnClick = jest.fn();
			render(
				<FabricAnalyticsListeners client={Promise.resolve(analyticsWebClientMock)}>
					<DummyMediaCompWithAnalytics onClick={compOnClick} />
				</FabricAnalyticsListeners>,
			);

			const dummyComponent = screen.getByRole('button', { name: 'media' });
			expect(dummyComponent).toBeInTheDocument();

			await fireEvent.click(dummyComponent);

			expect(analyticsWebClientMock.sendUIEvent).toBeCalled();
		});
	});

	describe('<PeopleTeamsAnalyticsListener />', () => {
		it('should listen and fire a UI event with analyticsWebClient', async () => {
			const compOnClick = jest.fn();
			render(
				<FabricAnalyticsListeners client={analyticsWebClientMock}>
					<DummyPeopleTeamsCompWithAnalytics onClick={compOnClick} />
				</FabricAnalyticsListeners>,
			);

			const dummyComponent = screen.getByRole('button', { name: 'peopleTeams' });
			expect(dummyComponent).toBeInTheDocument();

			await fireEvent.click(dummyComponent);

			expect(analyticsWebClientMock.sendUIEvent).toBeCalled();
		});

		it('should listen and fire a UI event with analyticsWebClient as Promise', async () => {
			analyticsWebClientMock.sendUIEvent = jest.fn();

			const compOnClick = jest.fn();
			render(
				<FabricAnalyticsListeners client={Promise.resolve(analyticsWebClientMock)}>
					<DummyPeopleTeamsCompWithAnalytics onClick={compOnClick} />
				</FabricAnalyticsListeners>,
			);

			const dummyComponent = screen.getByRole('button', { name: 'peopleTeams' });
			expect(dummyComponent).toBeInTheDocument();

			await fireEvent.click(dummyComponent);

			expect(analyticsWebClientMock.sendUIEvent).toBeCalled();
		});
	});

	describe('<NotificationsAnalyticsListener />', () => {
		it('should listen and fire a UI event with analyticsWebClient', async () => {
			const compOnClick = jest.fn();
			render(
				<FabricAnalyticsListeners client={analyticsWebClientMock}>
					<DummyNotificationsCompWithAnalytics onClick={compOnClick} />
				</FabricAnalyticsListeners>,
			);

			const dummyComponent = screen.getByRole('button', { name: 'notifications' });
			expect(dummyComponent).toBeInTheDocument();

			await fireEvent.click(dummyComponent);

			expect(analyticsWebClientMock.sendUIEvent).toBeCalled();
		});

		it('should listen and fire a UI event with analyticsWebClient as Promise', async () => {
			analyticsWebClientMock.sendUIEvent = jest.fn();

			const compOnClick = jest.fn();
			render(
				<FabricAnalyticsListeners client={Promise.resolve(analyticsWebClientMock)}>
					<DummyNotificationsCompWithAnalytics onClick={compOnClick} />
				</FabricAnalyticsListeners>,
			);

			const dummyComponent = screen.getByRole('button', { name: 'notifications' });
			expect(dummyComponent).toBeInTheDocument();

			await fireEvent.click(dummyComponent);

			expect(analyticsWebClientMock.sendUIEvent).toBeCalled();
		});
	});

	describe('<CrossFlowAnalyticsListener />', () => {
		it('should listen and fire a UI event with analyticsWebClient', async () => {
			const compOnClick = jest.fn();
			render(
				<FabricAnalyticsListeners client={analyticsWebClientMock}>
					<DummyCrossFlowCompWithAnalytics onClick={compOnClick} />
				</FabricAnalyticsListeners>,
			);

			const dummyComponent = screen.getByRole('button', { name: 'crossFlow' });
			expect(dummyComponent).toBeInTheDocument();

			await fireEvent.click(dummyComponent);

			expect(analyticsWebClientMock.sendUIEvent).toBeCalled();
		});

		it('should listen and fire a UI event with analyticsWebClient as Promise', async () => {
			analyticsWebClientMock.sendUIEvent = jest.fn();

			const compOnClick = jest.fn();
			render(
				<FabricAnalyticsListeners client={Promise.resolve(analyticsWebClientMock)}>
					<DummyCrossFlowCompWithAnalytics onClick={compOnClick} />
				</FabricAnalyticsListeners>,
			);

			const dummyComponent = screen.getByRole('button', { name: 'crossFlow' });
			expect(dummyComponent).toBeInTheDocument();

			await fireEvent.click(dummyComponent);

			expect(analyticsWebClientMock.sendUIEvent).toBeCalled();
		});
	});

	describe('<PostOfficeAnalyticsListener />', () => {
		it('should listen and fire a UI event with analyticsWebClient', async () => {
			const compOnClick = jest.fn();
			render(
				<FabricAnalyticsListeners client={analyticsWebClientMock}>
					<DummyPostOfficeCompWithAnalytics onClick={compOnClick} />
				</FabricAnalyticsListeners>,
			);

			const dummyComponent = screen.getByRole('button', { name: 'postOffice' });
			expect(dummyComponent).toBeInTheDocument();

			await fireEvent.click(dummyComponent);

			expect(analyticsWebClientMock.sendUIEvent).toBeCalled();
		});

		it('should listen and fire a UI event with analyticsWebClient as Promise', async () => {
			analyticsWebClientMock.sendUIEvent = jest.fn();

			const compOnClick = jest.fn();
			render(
				<FabricAnalyticsListeners client={Promise.resolve(analyticsWebClientMock)}>
					<DummyPostOfficeCompWithAnalytics onClick={compOnClick} />
				</FabricAnalyticsListeners>,
			);

			const dummyComponent = screen.getByRole('button', { name: 'postOffice' });
			expect(dummyComponent).toBeInTheDocument();

			await fireEvent.click(dummyComponent);

			expect(analyticsWebClientMock.sendUIEvent).toBeCalled();
		});
	});

	describe('<AIMateAnalyticsListener />', () => {
		it('should listen and fire a UI event with analyticsWebClient', async () => {
			const compOnClick = jest.fn();
			render(
				<FabricAnalyticsListeners client={analyticsWebClientMock}>
					<DummyAIMateCompWithAnalytics onClick={compOnClick} />
				</FabricAnalyticsListeners>,
			);

			const dummyComponent = screen.getByRole('button', { name: 'aiMate' });
			expect(dummyComponent).toBeInTheDocument();

			await fireEvent.click(dummyComponent);

			expect(analyticsWebClientMock.sendUIEvent).toBeCalled();
		});

		it('should listen and fire a UI event with analyticsWebClient as Promise', async () => {
			analyticsWebClientMock.sendUIEvent = jest.fn();

			const compOnClick = jest.fn();
			render(
				<FabricAnalyticsListeners client={Promise.resolve(analyticsWebClientMock)}>
					<DummyAIMateCompWithAnalytics onClick={compOnClick} />
				</FabricAnalyticsListeners>,
			);

			const dummyComponent = screen.getByRole('button', { name: 'aiMate' });
			expect(dummyComponent).toBeInTheDocument();

			await fireEvent.click(dummyComponent);

			expect(analyticsWebClientMock.sendUIEvent).toBeCalled();
		});
	});

	describe('<AVPAnalyticsListener />', () => {
		it('should listen and fire a UI event with analyticsWebClient', async () => {
			const compOnClick = jest.fn();
			render(
				<FabricAnalyticsListeners client={analyticsWebClientMock}>
					<DummyAVPCompWithAnalytics onClick={compOnClick} />
				</FabricAnalyticsListeners>,
			);

			const dummyComponent = screen.getByRole('button', { name: 'avp' });
			expect(dummyComponent).toBeInTheDocument();

			await fireEvent.click(dummyComponent);

			expect(analyticsWebClientMock.sendUIEvent).toBeCalled();
		});

		it('should listen and fire a UI event with analyticsWebClient as Promise', async () => {
			analyticsWebClientMock.sendUIEvent = jest.fn();

			const compOnClick = jest.fn();
			render(
				<FabricAnalyticsListeners client={Promise.resolve(analyticsWebClientMock)}>
					<DummyAVPCompWithAnalytics onClick={compOnClick} />
				</FabricAnalyticsListeners>,
			);

			const dummyComponent = screen.getByRole('button', { name: 'avp' });
			expect(dummyComponent).toBeInTheDocument();

			await fireEvent.click(dummyComponent);

			expect(analyticsWebClientMock.sendUIEvent).toBeCalled();
		});
	});

	describe('<OmniChannelAnalyticsListener />', () => {
		it('should listen and fire a UI event with analyticsWebClient', async () => {
			const compOnClick = jest.fn();
			render(
				<FabricAnalyticsListeners client={analyticsWebClientMock}>
					<DummyOmniChannelCompWithAnalytics onClick={compOnClick} />
				</FabricAnalyticsListeners>,
			);

			const dummyComponent = screen.getByRole('button', { name: 'omniChannel' });
			expect(dummyComponent).toBeInTheDocument();

			await fireEvent.click(dummyComponent);

			expect(analyticsWebClientMock.sendUIEvent).toBeCalled();
		});

		it('should listen and fire a UI event with analyticsWebClient as Promise', async () => {
			analyticsWebClientMock.sendUIEvent = jest.fn();

			const compOnClick = jest.fn();
			render(
				<FabricAnalyticsListeners client={Promise.resolve(analyticsWebClientMock)}>
					<DummyOmniChannelCompWithAnalytics onClick={compOnClick} />
				</FabricAnalyticsListeners>,
			);

			const dummyComponent = screen.getByRole('button', { name: 'omniChannel' });
			expect(dummyComponent).toBeInTheDocument();

			await fireEvent.click(dummyComponent);

			expect(analyticsWebClientMock.sendUIEvent).toBeCalled();
		});
	});
});
