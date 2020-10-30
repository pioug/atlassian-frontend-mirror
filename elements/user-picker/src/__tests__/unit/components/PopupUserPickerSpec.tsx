jest.mock('../../../components/styles', () => ({
  getPopupStyles: jest.fn(),
}));

import React from 'react';
import find from 'lodash/find';
import { PopupSelect } from '@atlaskit/select';
import { shallowWithIntl } from 'enzyme-react-intl';
import { getPopupStyles } from '../../../components/styles';
import { PopupUserPickerWithoutAnalytics } from '../../../components/PopupUserPicker';
import { PopupUserPickerProps } from '../../../types';
import { getPopupProps } from '../../../components/popup';
import { PopupControl } from '../../../components/PopupControl';

const defaultProps: Partial<PopupUserPickerProps> = {
  boundariesElement: 'viewport',
  width: 300,
  isMulti: false,
  offset: [0, 0],
  placement: 'auto',
  rootBoundary: 'viewport',
  shouldFlip: true,
};

describe('PopupUserPicker', () => {
  const shallowPopupUserPicker = (props: Partial<PopupUserPickerProps> = {}) =>
    shallowWithIntl(
      <PopupUserPickerWithoutAnalytics
        fieldId="test"
        target={jest.fn()}
        {...props}
      />,
    );

  describe('PopupUserPicker', () => {
    it('should use PopupSelect', () => {
      const component = shallowPopupUserPicker().dive();
      const select = component.find(PopupSelect);
      expect(select).toHaveLength(1);
      expect(getPopupStyles).toHaveBeenCalledWith(300, false, false);
    });

    it('should set width', () => {
      shallowPopupUserPicker({ width: 500 });
      expect(getPopupStyles).toHaveBeenCalledWith(500, false, false);
    });

    it('should add custom Control if popupTitle is passed in', () => {
      const component = shallowPopupUserPicker({ popupTitle: 'title' });
      expect(component.prop('components')).toEqual(
        expect.objectContaining({
          Control: PopupControl,
        }),
      );
    });

    it('should not add custom Control if no popupTitle passed in', () => {
      const component = shallowPopupUserPicker();
      expect(component.prop('components')).toBeDefined();
      expect(component.prop('components')).not.toEqual(
        expect.objectContaining({
          Control: expect.any(Function),
        }),
      );
    });

    describe('popup pickerProps', () => {
      it('should pass popup props as pickerProps', () => {
        const target = jest.fn();
        const component = shallowPopupUserPicker({ ...defaultProps, target });
        expect(component.prop('pickerProps')).toBeDefined();
        expect(JSON.stringify(component.prop('pickerProps'))).toEqual(
          JSON.stringify(
            getPopupProps(
              300,
              target,
              expect.any(Function),
              defaultProps.boundariesElement,
              defaultProps.offset,
              defaultProps.placement,
              defaultProps.rootBoundary,
              defaultProps.shouldFlip,
            ),
          ),
        );
      });

      it('should set the boundariesElement to viewport by default', () => {
        const target = jest.fn();
        const component = shallowPopupUserPicker({ ...defaultProps, target });
        expect(component.prop('pickerProps')).toBeDefined();
        expect(
          find(component.prop('pickerProps').popperProps.modifiers, {
            name: 'preventOverflow',
          }),
        ).toHaveProperty('options', {
          boundary: 'viewport',
          rootBoundary: 'viewport',
        });
      });

      it('should set custom boundariesElement and rootBoundary if passed in', () => {
        const target = jest.fn();
        const boundariesElement = jest.fn() as any;
        const rootBoundary = jest.fn() as any;
        const component = shallowPopupUserPicker({
          ...defaultProps,
          target,
          boundariesElement,
          rootBoundary,
        });
        expect(component.prop('pickerProps')).toBeDefined();
        expect(
          find(component.prop('pickerProps').popperProps.modifiers, {
            name: 'preventOverflow',
          }),
        ).toHaveProperty('options', {
          boundary: boundariesElement,
          rootBoundary: rootBoundary,
        });
      });

      it('should set offset to [0,0] by default', () => {
        const component = shallowPopupUserPicker({
          ...defaultProps,
        });
        expect(component.prop('pickerProps')).toBeDefined();
        expect(
          find(component.prop('pickerProps').popperProps.modifiers, {
            name: 'offset',
          }),
        ).toHaveProperty('options', {
          offset: [0, 0],
        });
      });

      it('should set offset to custom if passed in', () => {
        const offset: [number, number] = [1, 1];
        const component = shallowPopupUserPicker({
          ...defaultProps,
          offset,
        });
        expect(component.prop('pickerProps')).toBeDefined();
        expect(
          find(component.prop('pickerProps').popperProps.modifiers, {
            name: 'offset',
          }),
        ).toHaveProperty('options', {
          offset,
        });
      });

      it('should set shouldFlip to true by default', () => {
        const component = shallowPopupUserPicker({
          ...defaultProps,
        });
        expect(component.prop('pickerProps')).toBeDefined();
        expect(
          find(component.prop('pickerProps').popperProps.modifiers, {
            name: 'flip',
          }),
        ).toEqual({
          name: 'flip',
          enabled: true,
        });
      });

      it('should set shouldFlip to false if set', () => {
        const component = shallowPopupUserPicker({
          ...defaultProps,
          shouldFlip: false,
        });
        expect(component.prop('pickerProps')).toBeDefined();
        expect(
          find(component.prop('pickerProps').popperProps.modifiers, {
            name: 'flip',
          }),
        ).toEqual({
          name: 'flip',
          enabled: false,
        });
      });

      it('should set popupTitle if passed in', () => {
        const target = jest.fn();
        const popupTitle = 'Test';
        const component = shallowPopupUserPicker({
          ...defaultProps,
          target,
          popupTitle,
        });
        expect(component.prop('pickerProps')).toBeDefined();
        expect(component.prop('pickerProps')).toEqual(
          expect.objectContaining({ popupTitle }),
        );
      });
    });
  });
});
