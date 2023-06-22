jest.mock('react-dom', () => ({
  ...jest.requireActual<Object>('react-dom'),
  unmountComponentAtNode: jest.fn(),
}));

import React from 'react';

import { render } from '@testing-library/react';
import { unmountComponentAtNode } from 'react-dom';

import {
  AnalyticsListener,
  useAnalyticsEvents,
} from '@atlaskit/analytics-next';
import { renderWithIntl } from '@atlaskit/editor-test-helpers/rtl';

// eslint-disable-next-line
import { ContextAdapter } from '../../../../editor-core/src/nodeviews/context-adapter';

import { PortalProvider, PortalProviderAPI, PortalRenderer } from './index';
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
    wrapper = renderWithIntl(
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
    const { container } = render(<Component />);
    expect(container.innerHTML).toEqual(place.innerHTML);
  });

  it('should render several components successfully', () => {
    portalProviderAPI!.render(Component, place2);
    const { container } = render(<Component />);
    expect(container.innerHTML).toEqual(place.innerHTML);
    expect(container.innerHTML).toEqual(place2.innerHTML);
  });

  it('should destroy a component successfully', () => {
    portalProviderAPI!.remove(place);
    wrapper.rerender();

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
    expect(handleAnalyticsEventFromContext).toBeCalledTimes(1);
  });
});
