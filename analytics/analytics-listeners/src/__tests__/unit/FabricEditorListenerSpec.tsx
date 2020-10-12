import { AnalyticsListener } from '@atlaskit/analytics-next';
import { mount } from 'enzyme';
import React from 'react';
import {
  createComponentWithAnalytics,
  createTaggedComponentWithAnalytics,
  OwnProps,
} from '../../../examples/helpers';
import FabricEditorListener, {
  EDITOR_TAG,
  LEGACY_EDITOR_TAG,
} from '../../fabric/FabricEditorListener';
import Logger from '../../helpers/logger';
import { AnalyticsWebClient, FabricChannel } from '../../types';
import { createLoggerMock } from '../_testUtils';

const DummyEditorComponent = createComponentWithAnalytics(FabricChannel.editor);
const DummyTaggedEditorComponent = createTaggedComponentWithAnalytics(
  FabricChannel.editor,
  EDITOR_TAG,
);

describe('<FabricEditorsListener />', () => {
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
      <FabricEditorListener client={analyticsWebClientMock} logger={loggerMock}>
        <Component onClick={compOnClick} />
      </FabricEditorListener>,
    );

    const analyticsListener = component.find(AnalyticsListener);
    expect(analyticsListener.props()).toHaveProperty(
      'channel',
      FabricChannel.editor,
    );

    const dummy = analyticsListener.find('#dummy');
    dummy.simulate('click');

    expect(analyticsWebClientMock.sendUIEvent).toBeCalledWith(expectedEvent);
  };

  describe('Listen and fire an UI event with analyticsWebClient', () => {
    it('should fire event with editor tag', () => {
      fireAndVerifySentEvent(DummyEditorComponent, {
        action: 'someAction',
        actionSubject: 'someComponent',
        source: 'unknown',
        tags: [EDITOR_TAG, LEGACY_EDITOR_TAG],
      });
    });

    it('should fire event without duplicating the tag', () => {
      fireAndVerifySentEvent(DummyTaggedEditorComponent, {
        action: 'someAction',
        actionSubject: 'someComponent',
        source: 'unknown',
        tags: [EDITOR_TAG, 'foo', LEGACY_EDITOR_TAG],
      });
    });
  });
});
