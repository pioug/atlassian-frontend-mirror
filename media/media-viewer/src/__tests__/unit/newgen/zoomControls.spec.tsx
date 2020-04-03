import React from 'react';
import { mount } from 'enzyme';
import Button from '@atlaskit/button';
import {
  ZoomControlsBase,
  ZoomControlsProps,
} from '../../../newgen/zoomControls';
import { ZoomLevelIndicator } from '../../../newgen/styled';
import { ZoomLevel } from '../../../newgen/domain/zoomLevel';
import {
  name as packageName,
  version as packageVersion,
} from '../../../version.json';
import { fakeIntl } from '@atlaskit/media-test-helpers';

describe('Zooming', () => {
  describe('<ZoomControls />', () => {
    const setupBase = (props?: Partial<ZoomControlsProps>) => {
      const onChange = jest.fn();
      const createAnalyticsEventSpy = jest.fn();
      createAnalyticsEventSpy.mockReturnValue({ fire: jest.fn() });

      const component = mount(
        <ZoomControlsBase
          createAnalyticsEvent={createAnalyticsEventSpy}
          zoomLevel={new ZoomLevel(1)}
          onChange={onChange}
          intl={fakeIntl}
          {...props}
        />,
      );

      return {
        onChange,
        component,
        createAnalyticsEventSpy,
      };
    };

    it('should increase and decrease zoom', () => {
      const { component, onChange } = setupBase();
      const zoomLevel = new ZoomLevel(1);

      component
        .find(Button)
        .first()
        .simulate('click');
      expect(onChange).lastCalledWith(zoomLevel.zoomOut());
      component
        .find(Button)
        .last()
        .simulate('click');
      expect(onChange).lastCalledWith(zoomLevel.zoomIn());
    });

    it('should not allow zooming above upper limit', () => {
      const { component, onChange } = setupBase({
        zoomLevel: new ZoomLevel(1).fullyZoomIn(),
      });
      component
        .find(Button)
        .last()
        .simulate('click');
      expect(onChange).not.toBeCalled();
    });

    it('should not allow zooming below lower limit', () => {
      const { component, onChange } = setupBase({
        zoomLevel: new ZoomLevel(1).fullyZoomOut(),
      });
      component
        .find(Button)
        .first()
        .simulate('click');
      expect(onChange).not.toBeCalled();
    });

    describe('zoom level indicator', () => {
      it('shows 100% zoom level', () => {
        const { component } = setupBase();
        expect(component.find(ZoomLevelIndicator).text()).toEqual('100 %');
      });
    });

    describe('analytics', () => {
      const analyticsBaseAttributes = {
        componentName: 'media-viewer',
        packageName,
        packageVersion,
      };

      it('triggers analytics events on zoom Out', () => {
        const { component, createAnalyticsEventSpy } = setupBase();
        component
          .find(Button)
          .first()
          .simulate('click');

        expect(createAnalyticsEventSpy).toHaveBeenCalledWith({
          eventType: 'ui',
          action: 'clicked',
          actionSubject: 'button',
          actionSubjectId: 'zoomOut',
          attributes: {
            zoomScale: 0.48,
            ...analyticsBaseAttributes,
          },
        });
      });

      it('triggers analytics events on zoom in', () => {
        const { component, createAnalyticsEventSpy } = setupBase();
        component
          .find(Button)
          .last()
          .simulate('click');

        expect(createAnalyticsEventSpy).toHaveBeenCalledWith({
          eventType: 'ui',
          action: 'clicked',
          actionSubject: 'button',
          actionSubjectId: 'zoomIn',
          attributes: {
            zoomScale: 1.5,
            ...analyticsBaseAttributes,
          },
        });
      });
    });
  });
});
