import React from 'react';
import { ReactWrapper } from 'enzyme';
import Button from '@atlaskit/button';
import FieldRange from '@atlaskit/field-range';
import { mountWithIntlContext } from '@atlaskit/media-test-helpers';
import * as colors from '@atlaskit/theme/colors';

import { Toolbar, ToolbarProps, ToolbarState } from '../toolbar';
import { ToolButton } from '../buttons/toolButton';
import { ColorButton } from '../popups/colorButton';
import { ColorPopup } from '../popups/colorPopup';
import { ShapePopup } from '../popups/shapePopup';
import { LineWidthPopup } from '../popups/lineWidthPopup';

import { ANALYTICS_MEDIA_CHANNEL, Tool } from '../../../../common';

function simulateClickOnTool(
  component: ReactWrapper<ToolbarProps, ToolbarState>,
  tool: Tool,
) {
  component
    .find(ToolButton)
    .findWhere(n => n.prop('tool') === tool)
    .simulate('click');
}

function simulateClickOnShapePopup(
  component: ReactWrapper<ToolbarProps, ToolbarState>,
  tool: Tool,
) {
  component
    .find(ShapePopup)
    .find(Button)
    .simulate('click');

  component.update();

  component
    .find(ShapePopup)
    .find(Button)
    .findWhere(n => n.key() === tool)
    .simulate('click');
}

function simulateClickOnColorPopup(
  component: ReactWrapper<ToolbarProps, ToolbarState>,
  color: string,
) {
  component
    .find(ColorPopup)
    .find(Button)
    .simulate('click');

  component.update();

  component
    .find(ColorPopup)
    .find(ColorButton)
    .findWhere(n => n.prop('color') === color)
    .simulate('click');
}

function simulateChangeOnLineWidthPopup(
  component: ReactWrapper<ToolbarProps, ToolbarState>,
  value: string,
) {
  component
    .find(LineWidthPopup)
    .find(Button)
    .simulate('click');

  component.update();

  component
    .find(LineWidthPopup)
    .find(FieldRange)
    .simulate('change', { target: { value } });
}

describe('<Toolbar />', () => {
  function setup() {
    const formatMessage = jest
      .fn()
      .mockImplementation((message: any) => message.defaultMessage);
    const fakeIntl: any = { formatMessage };
    const fakeAnalyticsEventFire = jest.fn();
    const fakeCreateAnalyticsEvent = jest
      .fn()
      .mockImplementation(() => ({ fire: fakeAnalyticsEventFire }));

    const component = mountWithIntlContext<ToolbarProps, ToolbarState>(
      <Toolbar
        color="red"
        tool="arrow"
        lineWidth={1}
        onSave={jest.fn()}
        onCancel={jest.fn()}
        onToolChanged={jest.fn()}
        onColorChanged={jest.fn()}
        onLineWidthChanged={jest.fn()}
        intl={fakeIntl}
        createAnalyticsEvent={fakeCreateAnalyticsEvent}
      />,
    );

    return {
      formatMessage,
      component,
      fakeCreateAnalyticsEvent,
      fakeAnalyticsEventFire,
    };
  }

  [
    { tool: 'arrow', simulateClick: simulateClickOnTool },
    { tool: 'text', simulateClick: simulateClickOnTool },
    { tool: 'brush', simulateClick: simulateClickOnTool },
    { tool: 'blur', simulateClick: simulateClickOnTool },
    { tool: 'rectangle', simulateClick: simulateClickOnShapePopup },
    { tool: 'oval', simulateClick: simulateClickOnShapePopup },
    { tool: 'line', simulateClick: simulateClickOnShapePopup },
  ].forEach(({ tool, simulateClick }) =>
    it(`should emit analytics when picking ${tool} tool`, () => {
      const {
        component,
        fakeCreateAnalyticsEvent,
        fakeAnalyticsEventFire,
      } = setup();

      simulateClick(component, tool as Tool);

      expect(fakeCreateAnalyticsEvent).toHaveBeenCalledTimes(1);
      expect(fakeCreateAnalyticsEvent).toBeCalledWith(
        expect.objectContaining({
          eventType: 'ui',
          action: 'selected',
          actionSubject: 'annotation',
          actionSubjectId: tool,
        }),
      );
      expect(fakeAnalyticsEventFire).toHaveBeenLastCalledWith(
        ANALYTICS_MEDIA_CHANNEL,
      );
    }),
  );

  it(`should emit analytics when picking color`, () => {
    const {
      component,
      fakeCreateAnalyticsEvent,
      fakeAnalyticsEventFire,
    } = setup();

    simulateClickOnColorPopup(component, colors.R300);

    expect(fakeCreateAnalyticsEvent).toHaveBeenCalledTimes(1);
    expect(fakeCreateAnalyticsEvent).toBeCalledWith(
      expect.objectContaining({
        eventType: 'ui',
        action: 'selected',
        actionSubject: 'annotation',
        actionSubjectId: 'colour',
        attributes: { color: colors.R300 },
      }),
    );
    expect(fakeAnalyticsEventFire).toHaveBeenLastCalledWith(
      ANALYTICS_MEDIA_CHANNEL,
    );
  });

  it(`should emit analytics when changing line width`, () => {
    const {
      component,
      fakeCreateAnalyticsEvent,
      fakeAnalyticsEventFire,
    } = setup();

    simulateChangeOnLineWidthPopup(component, '5');

    expect(fakeCreateAnalyticsEvent).toHaveBeenCalledTimes(1);
    expect(fakeCreateAnalyticsEvent).toBeCalledWith(
      expect.objectContaining({
        eventType: 'ui',
        action: 'selected',
        actionSubject: 'annotation',
        actionSubjectId: 'size',
        attributes: { lineWidth: 5 },
      }),
    );
    expect(fakeAnalyticsEventFire).toHaveBeenLastCalledWith(
      ANALYTICS_MEDIA_CHANNEL,
    );
  });
});
