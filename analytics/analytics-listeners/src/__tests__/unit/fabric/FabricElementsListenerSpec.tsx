import { FabricElementsAnalyticsContext } from '@atlaskit/analytics-namespaced-context';
import {
  AnalyticsContext,
  AnalyticsListener,
  withAnalyticsEvents,
  WithAnalyticsEventsProps,
} from '@atlaskit/analytics-next';
import { mount } from 'enzyme';
import React from 'react';
import {
  createComponentWithAnalytics,
  createComponentWithAttributesWithAnalytics,
  createTaggedComponentWithAnalytics,
  OwnProps,
} from '../../../../examples/helpers';
import FabricElementsListener, {
  ELEMENTS_TAG,
} from '../../../fabric/FabricElementsListener';
import Logger from '../../../helpers/logger';
import { AnalyticsWebClient, FabricChannel } from '../../../types';
import { createLoggerMock } from '../../_testUtils';

const DummyCompWithAttributesWithAnalytics = createComponentWithAttributesWithAnalytics(
  FabricChannel.elements,
);

const DummyElementsComp = createComponentWithAnalytics(FabricChannel.elements);
const DummyTaggedElementsComp = createTaggedComponentWithAnalytics(
  FabricChannel.elements,
  ELEMENTS_TAG,
);

describe('<FabricElementsListener />', () => {
  let analyticsWebClientMock: AnalyticsWebClient;
  let loggerMock: Logger;

  beforeEach(() => {
    analyticsWebClientMock = {
      sendUIEvent: jest.fn(),
      sendOperationalEvent: jest.fn(),
      sendTrackEvent: jest.fn(),
      sendScreenEvent: jest.fn(),
    };
    loggerMock = createLoggerMock();
  });

  const fireAndVerifySentEvent = (
    Component: React.ComponentType<OwnProps>,
    expectedEvent: any,
  ) => {
    const compOnClick = jest.fn();
    const component = mount(
      <FabricElementsListener
        client={analyticsWebClientMock}
        logger={loggerMock}
      >
        <Component onClick={compOnClick} />
      </FabricElementsListener>,
    );

    const analyticsListener = component.find(AnalyticsListener);
    expect(analyticsListener.props()).toHaveProperty(
      'channel',
      FabricChannel.elements,
    );

    const dummy = analyticsListener.find('#dummy');
    dummy.simulate('click');

    expect(analyticsWebClientMock.sendUIEvent).toBeCalledWith(expectedEvent);
  };

  describe('Listen and fire an UI event with analyticsWebClient', () => {
    it('should fire event with elements tag', () => {
      fireAndVerifySentEvent(DummyElementsComp, {
        action: 'someAction',
        actionSubject: 'someComponent',
        source: 'unknown',
        tags: [ELEMENTS_TAG],
      });
    });

    it('should fire event without duplicating the tag', () => {
      fireAndVerifySentEvent(DummyTaggedElementsComp, {
        action: 'someAction',
        actionSubject: 'someComponent',
        source: 'unknown',
        tags: [ELEMENTS_TAG, 'foo'],
      });
    });

    it('should fire event with context merged into the attributes', () => {
      const component = mount(
        <FabricElementsListener
          client={analyticsWebClientMock}
          logger={loggerMock}
        >
          <FabricElementsAnalyticsContext
            data={{ issueId: 100, greeting: 'hello' }}
          >
            <AnalyticsContext data={{ issueId: 200, msg: 'boo' }}>
              <FabricElementsAnalyticsContext data={{ issueId: 300 }}>
                <DummyCompWithAttributesWithAnalytics onClick={jest.fn()} />
              </FabricElementsAnalyticsContext>
            </AnalyticsContext>
          </FabricElementsAnalyticsContext>
        </FabricElementsListener>,
      );

      const analyticsListener = component.find(AnalyticsListener);
      const dummy = analyticsListener.find('#dummy');
      dummy.simulate('click');

      // note: AnalyticsContext data should not be in propagated in the attributes, only FabricElementsAnalyticsContext
      expect(analyticsWebClientMock.sendUIEvent).toBeCalledWith(
        expect.objectContaining({
          action: 'someAction',
          actionSubject: 'someComponent',
          source: 'unknown',
          attributes: {
            packageName: '@atlaskit/foo',
            packageVersion: '1.0.0',
            componentName: 'foo',
            fooBar: 'yay',
            greeting: 'hello',
            issueId: 300, // right most object attribute wins the conflict
          },
          tags: [ELEMENTS_TAG],
        }),
      );
    });

    describe('with source from context', () => {
      class DummyComponent extends React.Component<WithAnalyticsEventsProps> {
        render() {
          return (
            <div
              onClick={() =>
                this.props.createAnalyticsEvent &&
                this.props
                  .createAnalyticsEvent({
                    action: 'some-action',
                    actionSubject: 'some-component',
                    eventType: 'ui',
                  })
                  .fire(FabricChannel.elements)
              }
            />
          );
        }
      }

      const DummyComponentWithAnalytics: React.ComponentType<{}> = withAnalyticsEvents(
        {},
      )(DummyComponent);

      it('should fire event with source from the context', () => {
        const component = mount(
          <AnalyticsContext data={{ source: 'jira-issue' }}>
            <FabricElementsListener
              client={analyticsWebClientMock}
              logger={loggerMock}
            >
              <DummyComponentWithAnalytics />
            </FabricElementsListener>
          </AnalyticsContext>,
        );

        component.find(DummyComponent).find('div').simulate('click');

        expect(analyticsWebClientMock.sendUIEvent).toBeCalledWith(
          expect.objectContaining({
            action: 'some-action',
            actionSubject: 'some-component',
            source: 'jira-issue',
          }),
        );
      });

      it('should fire event with source and attributes from context', () => {
        const component = mount(
          <AnalyticsContext data={{ source: 'jira-issue' }}>
            <FabricElementsListener
              client={analyticsWebClientMock}
              logger={loggerMock}
            >
              <FabricElementsAnalyticsContext data={{ ari: 'some-ari' }}>
                <DummyComponentWithAnalytics />
              </FabricElementsAnalyticsContext>
            </FabricElementsListener>
          </AnalyticsContext>,
        );

        component.find(DummyComponent).find('div').simulate('click');

        expect(analyticsWebClientMock.sendUIEvent).toBeCalledWith(
          expect.objectContaining({
            action: 'some-action',
            actionSubject: 'some-component',
            source: 'jira-issue',
            attributes: expect.objectContaining({
              ari: 'some-ari',
            }),
          }),
        );
      });

      it('should use nearest context', () => {
        const component = mount(
          <AnalyticsContext data={{ source: 'jira' }}>
            <AnalyticsContext data={{ source: 'issue' }}>
              <FabricElementsListener
                client={analyticsWebClientMock}
                logger={loggerMock}
              >
                <DummyComponentWithAnalytics />
              </FabricElementsListener>
            </AnalyticsContext>
          </AnalyticsContext>,
        );

        component.find(DummyComponent).find('div').simulate('click');

        expect(analyticsWebClientMock.sendUIEvent).toBeCalledWith(
          expect.objectContaining({
            action: 'some-action',
            actionSubject: 'some-component',
            source: 'issue',
          }),
        );
      });

      it('should use more specific context', () => {
        const component = mount(
          <FabricElementsListener
            client={analyticsWebClientMock}
            logger={loggerMock}
          >
            <AnalyticsContext data={{ source: 'jira' }}>
              <AnalyticsContext data={{ source: 'issue' }}>
                <DummyComponentWithAnalytics />
              </AnalyticsContext>
            </AnalyticsContext>
          </FabricElementsListener>,
        );

        component.find(DummyComponent).find('div').simulate('click');

        expect(analyticsWebClientMock.sendUIEvent).toBeCalledWith(
          expect.objectContaining({
            action: 'some-action',
            actionSubject: 'some-component',
            source: 'issue',
          }),
        );
      });

      it('should set unknown when no source is provided', () => {
        const component = mount(
          <FabricElementsListener
            client={analyticsWebClientMock}
            logger={loggerMock}
          >
            <FabricElementsAnalyticsContext data={{ ari: 'some-ari' }}>
              <DummyComponentWithAnalytics />
            </FabricElementsAnalyticsContext>
          </FabricElementsListener>,
        );

        component.find(DummyComponent).find('div').simulate('click');

        expect(analyticsWebClientMock.sendUIEvent).toBeCalledWith(
          expect.objectContaining({
            action: 'some-action',
            actionSubject: 'some-component',
            source: 'unknown',
            attributes: expect.objectContaining({
              ari: 'some-ari',
            }),
          }),
        );
      });
    });
  });
});
