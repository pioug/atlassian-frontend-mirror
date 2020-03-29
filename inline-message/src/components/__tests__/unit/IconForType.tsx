import React from 'react';
import { shallow } from 'enzyme';
import WarningIcon from '@atlaskit/icon/glyph/warning';
import CheckCircleIcon from '@atlaskit/icon/glyph/check-circle';
import InfoIcon from '@atlaskit/icon/glyph/info';
import ErrorIcon from '@atlaskit/icon/glyph/error';
import IconForType from '../../IconForType';
import IconWrapper from '../../IconForType/styledIconForType';

describe('IconForType component', () => {
  describe('props', () => {
    // These will be updated once we have the actual icons.
    // See https://ecosystem.atlassian.net/browse/AK-1416
    describe('type', () => {
      it('connectivity type produces connectivity icon', () => {
        const wrapper = shallow(
          <IconForType isHovered={false} isOpen={false} type="connectivity" />,
        );
        expect(wrapper.find(WarningIcon).length).toBeGreaterThan(0);
        expect(wrapper.find(IconWrapper).prop('appearance')).toBe(
          'connectivity',
        );
      });
      it('confirmation type produces confirmation icon', () => {
        const wrapper = shallow(
          <IconForType isHovered={false} isOpen={false} type="confirmation" />,
        );
        expect(wrapper.find(CheckCircleIcon).length).toBeGreaterThan(0);
        expect(wrapper.find(IconWrapper).prop('appearance')).toBe(
          'confirmation',
        );
      });
      it('info type produces info icon', () => {
        const wrapper = shallow(
          <IconForType isHovered={false} isOpen={false} type="info" />,
        );
        expect(wrapper.find(InfoIcon).length).toBeGreaterThan(0);
        expect(wrapper.find(IconWrapper).prop('appearance')).toBe('info');
      });
      it('warning type produces warning icon', () => {
        const wrapper = shallow(
          <IconForType isHovered={false} isOpen={false} type="warning" />,
        );
        expect(wrapper.find(WarningIcon).length).toBeGreaterThan(0);
        expect(wrapper.find(IconWrapper).prop('appearance')).toBe('warning');
      });
      it('error type produces error icon', () => {
        const wrapper = shallow(
          <IconForType isHovered={false} isOpen={false} type="error" />,
        );
        expect(wrapper.find(ErrorIcon).length).toBeGreaterThan(0);
        expect(wrapper.find(IconWrapper).prop('appearance')).toBe('error');
      });
    });
  });
});
