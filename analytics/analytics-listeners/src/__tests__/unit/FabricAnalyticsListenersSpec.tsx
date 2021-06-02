import { mount, shallow } from 'enzyme';
import React from 'react';
import {
  createComponentWithAnalytics,
  DummyAtlaskitComponent,
  DummyElementsComponent,
  DummyMediaComponent,
  DummyNavigationComponent,
  DummyNotificationsComponent,
  DummyPeopleTeamsComponent,
  IncorrectEventType,
} from '../../../examples/helpers';
import AtlaskitListener from '../../atlaskit/AtlaskitListener';
import FabricElementsListener from '../../fabric/FabricElementsListener';
import FabricAnalyticsListeners from '../../FabricAnalyticsListeners';
import { LOG_LEVEL } from '../../helpers/logger';
import NavigationListener from '../../navigation/NavigationListener';
import PeopleTeamsAnalyticsListener from '../../peopleTeams/PeopleTeamsAnalyticsListener';
import { AnalyticsWebClient, FabricChannel } from '../../types';
import NotificationsAnalyticsListener from '../../notifications/NotificationsAnalyticsListener';

declare const global: any;

const DummyElementsCompWithAnalytics = createComponentWithAnalytics(
  FabricChannel.elements,
);
const DummyAtlaskitCompWithAnalytics = createComponentWithAnalytics(
  FabricChannel.atlaskit,
);
const DummyNavigationCompWithAnalytics = createComponentWithAnalytics(
  FabricChannel.navigation,
);
const DummyMediaCompWithAnalytics = createComponentWithAnalytics(
  FabricChannel.media,
);
const DummyPeopleTeamsCompWithAnalytics = createComponentWithAnalytics(
  FabricChannel.peopleTeams,
);
const DummyNotificationsCompWithAnalytics = createComponentWithAnalytics(
  FabricChannel.notifications,
);
const AtlaskitIncorrectEventType = IncorrectEventType(FabricChannel.atlaskit);

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
    (Reflect as any).deleteProperty(global.console, 'hasError');

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
        mount(
          // @ts-ignore
          <FabricAnalyticsListeners>
            <DummyElementsCompWithAnalytics onClick={compOnClick} />
          </FabricAnalyticsListeners>,
        ),
      ).not.toThrow();
    });

    it('should accept and handle a promise-like client', (done) => {
      const promiseLikeClient: Promise<AnalyticsWebClient> = {
        // @ts-ignore This violated type definition upgrade of @types/jest to v24.0.18 & ts-jest v24.1.0.
        //See BUILDTOOLS-210-clean: https://bitbucket.org/atlassian/atlaskit-mk-2/pull-requests/7178/buildtools-210-clean/diff
        then: jest.fn(() => promiseLikeClient),
        catch: jest.fn(() => done()),
        finally: jest.fn(() => promiseLikeClient),
        [Symbol.toStringTag]: '',
      };

      const compOnClick = jest.fn();
      const component = mount(
        <FabricAnalyticsListeners
          client={promiseLikeClient}
          logLevel={LOG_LEVEL.ERROR}
        >
          <DummyElementsCompWithAnalytics onClick={compOnClick} />
        </FabricAnalyticsListeners>,
      );

      const analyticsListener = component.find(FabricElementsListener);
      const dummyComponent = analyticsListener.find(DummyElementsComponent);
      expect(dummyComponent).toHaveLength(1);

      dummyComponent.simulate('click');
    });

    it('should not explode if something explodes in callback', () => {
      const promiseLikeClient = {
        sendUIEvent: jest.fn(() => {
          throw new Error('Boom!');
        }),
      };

      const compOnClick = jest.fn();
      const component = mount(
        <FabricAnalyticsListeners
          client={promiseLikeClient as any}
          logLevel={LOG_LEVEL.WARN}
        >
          <DummyElementsCompWithAnalytics onClick={compOnClick} />
        </FabricAnalyticsListeners>,
      );

      const analyticsListener = component.find(FabricElementsListener);
      const dummyComponent = analyticsListener.find(DummyElementsComponent);
      expect(dummyComponent).toHaveLength(1);

      dummyComponent.simulate('click');
    });

    it('should log an error when an invalid event type is captured and error logging is enabled', () => {
      const compOnClick = jest.fn();
      const component = mount(
        <FabricAnalyticsListeners
          client={analyticsWebClientMock}
          logLevel={LOG_LEVEL.ERROR}
        >
          <AtlaskitIncorrectEventType onClick={compOnClick} />
        </FabricAnalyticsListeners>,
      );

      const analyticsListener = component.find(FabricElementsListener);
      const dummyComponent = analyticsListener.find(DummyAtlaskitComponent);
      expect(dummyComponent).toHaveLength(1);

      dummyComponent.simulate('click');
      expect(global.console.error).toHaveBeenCalledTimes(1);
    });

    it('should render all listeners', () => {
      const component = shallow(
        <FabricAnalyticsListeners client={analyticsWebClientMock}>
          <div>Child</div>
        </FabricAnalyticsListeners>,
      );

      expect(component).toMatchSnapshot();
    });

    it('should render a FabricElementsListener', () => {
      const component = shallow(
        <FabricAnalyticsListeners client={analyticsWebClientMock}>
          <div>Child</div>
        </FabricAnalyticsListeners>,
      );

      const elementsListener = component.find(FabricElementsListener);

      expect(elementsListener).toHaveLength(1);
      expect(elementsListener.props()).toEqual(
        expect.objectContaining({
          client: analyticsWebClientMock,
        }),
      );
    });

    it('should render an AtlaskitListener', () => {
      const component = shallow(
        <FabricAnalyticsListeners client={analyticsWebClientMock}>
          <div>Child</div>
        </FabricAnalyticsListeners>,
      );

      const atlaskitListener = component.find(AtlaskitListener);

      expect(atlaskitListener).toHaveLength(1);
      expect(atlaskitListener.props()).toEqual(
        expect.objectContaining({
          client: analyticsWebClientMock,
        }),
      );
    });

    it('should render a NavigationListener', () => {
      const component = shallow(
        <FabricAnalyticsListeners client={analyticsWebClientMock}>
          <div>Child</div>
        </FabricAnalyticsListeners>,
      );

      const navigationListener = component.find(NavigationListener);

      expect(navigationListener).toHaveLength(1);
      expect(navigationListener.props()).toEqual(
        expect.objectContaining({
          client: analyticsWebClientMock,
        }),
      );
    });

    it('should exclude the AtlaskitListener if excludedChannels includes atlaskit', () => {
      const component = shallow(
        <FabricAnalyticsListeners
          client={analyticsWebClientMock}
          excludedChannels={[FabricChannel.atlaskit]}
        >
          <div>Child</div>
        </FabricAnalyticsListeners>,
      );

      const atlaskitListener = component.find(AtlaskitListener);

      expect(atlaskitListener).toHaveLength(0);

      const elementsListener = component.find(FabricElementsListener);
      expect(elementsListener).toHaveLength(1);
    });

    it('should exclude the ElementsListener if excludedChannels includes elements', () => {
      const component = shallow(
        <FabricAnalyticsListeners
          client={analyticsWebClientMock}
          excludedChannels={[FabricChannel.elements]}
        >
          <div>Child</div>
        </FabricAnalyticsListeners>,
      );

      const elementsListener = component.find(FabricElementsListener);

      expect(elementsListener).toHaveLength(0);

      const atlaskitListener = component.find(AtlaskitListener);
      expect(atlaskitListener).toHaveLength(1);
    });

    it('should exclude the NavigationListener if excludedChannels includes navigation', () => {
      const component = shallow(
        <FabricAnalyticsListeners
          client={analyticsWebClientMock}
          excludedChannels={[FabricChannel.navigation]}
        >
          <div>Child</div>
        </FabricAnalyticsListeners>,
      );

      const navigationListener = component.find(NavigationListener);

      expect(navigationListener).toHaveLength(0);

      const atlaskitListener = component.find(AtlaskitListener);
      expect(atlaskitListener).toHaveLength(1);

      const elementsListener = component.find(FabricElementsListener);
      expect(elementsListener).toHaveLength(1);
    });

    it('should exclude both atlaskit and elements listeners if excludedChannels includes both their channels', () => {
      const component = shallow(
        <FabricAnalyticsListeners
          client={analyticsWebClientMock}
          excludedChannels={[FabricChannel.elements, FabricChannel.atlaskit]}
        >
          <div>Child</div>
        </FabricAnalyticsListeners>,
      );

      const elementsListener = component.find(FabricElementsListener);

      expect(elementsListener).toHaveLength(0);

      const atlaskitListener = component.find(AtlaskitListener);
      expect(atlaskitListener).toHaveLength(0);

      expect(component.find('div').text()).toBe('Child');
    });

    it('should not exclude any listeners if excludeChannels is empty', () => {
      const component = shallow(
        <FabricAnalyticsListeners
          client={analyticsWebClientMock}
          excludedChannels={[]}
        >
          <div>Child</div>
        </FabricAnalyticsListeners>,
      );

      const elementsListener = component.find(FabricElementsListener);

      expect(elementsListener).toHaveLength(1);

      const atlaskitListener = component.find(AtlaskitListener);
      expect(atlaskitListener).toHaveLength(1);
    });
  });

  describe('<FabricElementsListener />', () => {
    it('should listen and fire a UI event with analyticsWebClient', () => {
      const compOnClick = jest.fn();
      const component = mount(
        <FabricAnalyticsListeners client={analyticsWebClientMock}>
          <DummyElementsCompWithAnalytics onClick={compOnClick} />
        </FabricAnalyticsListeners>,
      );

      const analyticsListener = component.find(FabricElementsListener);
      expect(analyticsListener.props()).toHaveProperty(
        'client',
        analyticsWebClientMock,
      );

      const dummyComponent = analyticsListener.find(DummyElementsComponent);
      expect(dummyComponent).toHaveLength(1);

      dummyComponent.simulate('click');

      expect(analyticsWebClientMock.sendUIEvent).toBeCalled();
    });

    it('should listen and fire a UI event with analyticsWebClient as Promise', (done) => {
      analyticsWebClientMock.sendUIEvent = jest.fn(() => {
        done();
      });

      const compOnClick = jest.fn();
      const component = mount(
        <FabricAnalyticsListeners
          client={Promise.resolve(analyticsWebClientMock)}
        >
          <DummyElementsCompWithAnalytics onClick={compOnClick} />
        </FabricAnalyticsListeners>,
      );

      const analyticsListener = component.find(FabricElementsListener);
      expect(analyticsListener.props()).toHaveProperty(
        'client',
        Promise.resolve(analyticsWebClientMock),
      );

      const dummyComponent = analyticsListener.find(DummyElementsComponent);
      expect(dummyComponent).toHaveLength(1);

      dummyComponent.simulate('click');
    });
  });

  describe('<AtlaskitListener />', () => {
    it('should listen and fire a UI event with analyticsWebClient', () => {
      const compOnClick = jest.fn();
      const component = mount(
        <FabricAnalyticsListeners client={analyticsWebClientMock}>
          <DummyAtlaskitCompWithAnalytics onClick={compOnClick} />
        </FabricAnalyticsListeners>,
      );

      const analyticsListener = component.find(AtlaskitListener);
      expect(analyticsListener.props()).toHaveProperty(
        'client',
        analyticsWebClientMock,
      );

      const dummyComponent = analyticsListener.find(DummyAtlaskitComponent);
      expect(dummyComponent).toHaveLength(1);

      dummyComponent.simulate('click');

      expect(analyticsWebClientMock.sendUIEvent).toBeCalled();
    });

    it('should listen and fire a UI event with analyticsWebClient as Promise', (done) => {
      analyticsWebClientMock.sendUIEvent = jest.fn(() => {
        done();
      });

      const compOnClick = jest.fn();
      const component = mount(
        <FabricAnalyticsListeners
          client={Promise.resolve(analyticsWebClientMock)}
        >
          <DummyAtlaskitCompWithAnalytics onClick={compOnClick} />
        </FabricAnalyticsListeners>,
      );

      const analyticsListener = component.find(FabricElementsListener);
      expect(analyticsListener.props()).toHaveProperty(
        'client',
        Promise.resolve(analyticsWebClientMock),
      );

      const dummyComponent = analyticsListener.find(DummyAtlaskitComponent);
      expect(dummyComponent).toHaveLength(1);

      dummyComponent.simulate('click');
    });
  });

  describe('<NavigationListener />', () => {
    it('should listen and fire a UI event with analyticsWebClient', () => {
      const compOnClick = jest.fn();
      const component = mount(
        <FabricAnalyticsListeners client={analyticsWebClientMock}>
          <DummyNavigationCompWithAnalytics onClick={compOnClick} />
        </FabricAnalyticsListeners>,
      );

      const analyticsListener = component.find(NavigationListener);
      expect(analyticsListener.props()).toHaveProperty(
        'client',
        analyticsWebClientMock,
      );

      const dummyComponent = analyticsListener.find(DummyNavigationComponent);
      expect(dummyComponent).toHaveLength(1);

      dummyComponent.simulate('click');

      expect(analyticsWebClientMock.sendUIEvent).toBeCalled();
    });

    it('should listen and fire a UI event with analyticsWebClient as Promise', (done) => {
      analyticsWebClientMock.sendUIEvent = jest.fn(() => {
        done();
      });

      const compOnClick = jest.fn();
      const component = mount(
        <FabricAnalyticsListeners
          client={Promise.resolve(analyticsWebClientMock)}
        >
          <DummyNavigationCompWithAnalytics onClick={compOnClick} />
        </FabricAnalyticsListeners>,
      );

      const analyticsListener = component.find(FabricElementsListener);
      expect(analyticsListener.props()).toHaveProperty(
        'client',
        Promise.resolve(analyticsWebClientMock),
      );

      const dummyComponent = analyticsListener.find(DummyNavigationComponent);
      expect(dummyComponent).toHaveLength(1);

      dummyComponent.simulate('click');
    });
  });

  describe('<MediaListener />', () => {
    it('should listen and fire a UI event with analyticsWebClient', () => {
      const compOnClick = jest.fn();
      const component = mount(
        <FabricAnalyticsListeners client={analyticsWebClientMock}>
          <DummyMediaCompWithAnalytics onClick={compOnClick} />
        </FabricAnalyticsListeners>,
      );

      const analyticsListener = component.find(NavigationListener);
      expect(analyticsListener.props()).toHaveProperty(
        'client',
        analyticsWebClientMock,
      );

      const dummyComponent = analyticsListener.find(DummyMediaComponent);
      expect(dummyComponent).toHaveLength(1);

      dummyComponent.simulate('click');

      expect(analyticsWebClientMock.sendUIEvent).toBeCalled();
    });

    it('should listen and fire a UI event with analyticsWebClient as Promise', (done) => {
      analyticsWebClientMock.sendUIEvent = jest.fn(() => {
        done();
      });

      const compOnClick = jest.fn();
      const component = mount(
        <FabricAnalyticsListeners
          client={Promise.resolve(analyticsWebClientMock)}
        >
          <DummyMediaCompWithAnalytics onClick={compOnClick} />
        </FabricAnalyticsListeners>,
      );

      const analyticsListener = component.find(FabricElementsListener);
      expect(analyticsListener.props()).toHaveProperty(
        'client',
        Promise.resolve(analyticsWebClientMock),
      );

      const dummyComponent = analyticsListener.find(DummyMediaComponent);
      expect(dummyComponent).toHaveLength(1);

      dummyComponent.simulate('click');
    });
  });

  describe('<PeopleTeamsAnalyticsListener />', () => {
    it('should listen and fire a UI event with analyticsWebClient', () => {
      const compOnClick = jest.fn();
      const component = mount(
        <FabricAnalyticsListeners client={analyticsWebClientMock}>
          <DummyPeopleTeamsCompWithAnalytics onClick={compOnClick} />
        </FabricAnalyticsListeners>,
      );

      const analyticsListener = component.find(PeopleTeamsAnalyticsListener);
      expect(analyticsListener.props()).toHaveProperty(
        'client',
        analyticsWebClientMock,
      );

      const dummyComponent = analyticsListener.find(DummyPeopleTeamsComponent);
      expect(dummyComponent).toHaveLength(1);

      dummyComponent.simulate('click');

      expect(analyticsWebClientMock.sendUIEvent).toBeCalled();
    });

    it('should listen and fire a UI event with analyticsWebClient as Promise', (done) => {
      analyticsWebClientMock.sendUIEvent = jest.fn(() => {
        done();
      });

      const compOnClick = jest.fn();
      const component = mount(
        <FabricAnalyticsListeners
          client={Promise.resolve(analyticsWebClientMock)}
        >
          <DummyPeopleTeamsCompWithAnalytics onClick={compOnClick} />
        </FabricAnalyticsListeners>,
      );

      const analyticsListener = component.find(PeopleTeamsAnalyticsListener);
      expect(analyticsListener.props()).toHaveProperty(
        'client',
        Promise.resolve(analyticsWebClientMock),
      );

      const dummyComponent = analyticsListener.find(DummyPeopleTeamsComponent);
      expect(dummyComponent).toHaveLength(1);

      dummyComponent.simulate('click');
    });
  });

  describe('<NotificationsAnalyticsListener />', () => {
    it('should listen and fire a UI event with analyticsWebClient', () => {
      const compOnClick = jest.fn();
      const component = mount(
        <FabricAnalyticsListeners client={analyticsWebClientMock}>
          <DummyNotificationsCompWithAnalytics onClick={compOnClick} />
        </FabricAnalyticsListeners>,
      );

      const analyticsListener = component.find(NotificationsAnalyticsListener);
      expect(analyticsListener.props()).toHaveProperty(
        'client',
        analyticsWebClientMock,
      );

      const dummyComponent = analyticsListener.find(
        DummyNotificationsComponent,
      );
      expect(dummyComponent).toHaveLength(1);

      dummyComponent.simulate('click');

      expect(analyticsWebClientMock.sendUIEvent).toBeCalled();
    });

    it('should listen and fire a UI event with analyticsWebClient as Promise', (done) => {
      analyticsWebClientMock.sendUIEvent = jest.fn(() => {
        done();
      });

      const compOnClick = jest.fn();
      const component = mount(
        <FabricAnalyticsListeners
          client={Promise.resolve(analyticsWebClientMock)}
        >
          <DummyNotificationsCompWithAnalytics onClick={compOnClick} />
        </FabricAnalyticsListeners>,
      );

      const analyticsListener = component.find(NotificationsAnalyticsListener);
      expect(analyticsListener.props()).toHaveProperty(
        'client',
        Promise.resolve(analyticsWebClientMock),
      );

      const dummyComponent = analyticsListener.find(
        DummyNotificationsComponent,
      );
      expect(dummyComponent).toHaveLength(1);

      dummyComponent.simulate('click');
    });
  });
});
