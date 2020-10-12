jest.mock('../../../components/styles', () => ({
  getPopupStyles: jest.fn(),
}));

import React from 'react';
import { PopupSelect } from '@atlaskit/select';
import { shallowWithIntl } from 'enzyme-react-intl';
import { getPopupStyles } from '../../../components/styles';
import { PopupUserPickerWithoutAnalytics } from '../../../components/PopupUserPicker';
import { PopupUserPickerProps } from '../../../types';
import { getPopupProps } from '../../../components/popup';
import { PopupControl } from '../../../components/PopupControl';

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
        const component = shallowPopupUserPicker({ target });
        expect(component.prop('pickerProps')).toBeDefined();
        expect(JSON.stringify(component.prop('pickerProps'))).toEqual(
          JSON.stringify(getPopupProps(300, target, expect.any(Function))),
        );
      });

      it('should set the boundariesElement to viewport by default', () => {
        const target = jest.fn();
        const component = shallowPopupUserPicker({ target });
        expect(component.prop('pickerProps')).toBeDefined();
        expect(component.prop('pickerProps')).toHaveProperty(
          'popperProps.modifiers.preventOverflow',
          {
            boundariesElement: 'viewport',
          },
        );
      });

      it('should set custom boundariesElement if passed in', () => {
        const target = jest.fn();
        const boundariesElement = jest.fn() as any;
        const component = shallowPopupUserPicker({ target, boundariesElement });
        expect(component.prop('pickerProps')).toBeDefined();
        expect(component.prop('pickerProps')).toHaveProperty(
          'popperProps.modifiers.preventOverflow',
          {
            boundariesElement,
          },
        );
      });

      it('should set popupTitle if passed in', () => {
        const target = jest.fn();
        const popupTitle = 'Test';
        const component = shallowPopupUserPicker({ target, popupTitle });
        expect(component.prop('pickerProps')).toBeDefined();
        expect(component.prop('pickerProps')).toEqual(
          expect.objectContaining({ popupTitle }),
        );
      });
    });
  });
});
