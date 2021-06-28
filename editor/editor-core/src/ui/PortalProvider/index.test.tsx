jest.mock('react-dom', () => ({
  ...jest.requireActual<Object>('react-dom'),
  unmountComponentAtNode: jest.fn(),
}));

import React from 'react';
import { unmountComponentAtNode } from 'react-dom';
import { mount } from 'enzyme';
import {
  AnalyticsListener,
  useAnalyticsEvents,
} from '@atlaskit/analytics-next';
import { PortalProvider, PortalRenderer, PortalProviderAPI } from './';
import { ContextAdapter } from '../../nodeviews/context-adapter';
const Component = () => <div className="component">My component</div>;
const Component2 = () => {
  const { createAnalyticsEvent } = useAnalyticsEvents();
  const event = createAnalyticsEvent({});
  event.fire('portalprovidertest');
  return <div>Component 2</div>;
};
const ComponentWithAnalytics = () => <Component2 />;

describe('PortalProvider', () => {
  let portalProviderAPI: PortalProviderAPI;
  let wrapper: any;
  let place: HTMLElement;
  let place2: HTMLElement;
  let handleAnalyticsEvent: any;
  let handleAnalyticsEventFromContext: any;

  const initPortalProvider = () => {
    handleAnalyticsEvent = jest.fn();
    handleAnalyticsEventFromContext = jest.fn();
    wrapper = mount(
      <AnalyticsListener
        channel="portalprovidertest"
        onEvent={handleAnalyticsEventFromContext}
      >
        <ContextAdapter>
          <PortalProvider
            onAnalyticsEvent={handleAnalyticsEvent}
            useAnalyticsContext={true}
            render={(api) => {
              portalProviderAPI = api;
              return <PortalRenderer portalProviderAPI={api} />;
            }}
          />
        </ContextAdapter>
      </AnalyticsListener>,
    );

    portalProviderAPI!.render(Component, place);
    wrapper.update();
  };

  beforeEach(() => {
    jest.resetAllMocks();
    place = document.body.appendChild(document.createElement('div'));
    place.classList.add('place');
    place2 = document.body.appendChild(document.createElement('div'));
    place2.classList.add('place2');
    initPortalProvider();
  });

  afterEach(() => {
    place.parentNode!.removeChild(place);
    place2.parentNode!.removeChild(place2);
  });

  it('should render a component successfully', () => {
    expect(mount(<Component />).html()).toEqual(place.innerHTML);
  });

  it('should render several components successfully', () => {
    portalProviderAPI!.render(Component, place2);
    wrapper.update();
    const component = mount(<Component />);
    expect(component.html()).toEqual(place.innerHTML);
    expect(component.html()).toEqual(place2.innerHTML);
  });

  it('should destroy a component successfully', () => {
    portalProviderAPI!.remove(place);
    wrapper.update();

    expect(unmountComponentAtNode).toBeCalledWith(place);
  });

  describe('React throws an error while unmounting child component', () => {
    const error = new Error('Something happened...');

    beforeEach(() => {
      (unmountComponentAtNode as jest.Mock).mockImplementation(() => {
        throw error;
      });
    });

    it('should not throw error', () => {
      expect(() => portalProviderAPI!.remove(place)).not.toThrowError();
    });

    it('should fire analytics if React throws an error when unmounting', () => {
      portalProviderAPI!.remove(place);

      expect(handleAnalyticsEvent).toHaveBeenCalledWith({
        payload: {
          action: 'failedToUnmount',
          actionSubject: 'editor',
          actionSubjectId: 'reactNodeView',
          attributes: {
            error,
            domNodes: { container: 'place', child: 'component' },
          },
          eventType: 'operational',
        },
      });
    });
  });

  it('should propogate events up from child component', () => {
    portalProviderAPI.render(ComponentWithAnalytics, place);
    wrapper.update();
    expect(handleAnalyticsEventFromContext).toBeCalledTimes(1);
  });
});
