import React from 'react';

import { render } from '@testing-library/react';
import { mount } from 'enzyme';

import CheckCircleIcon from '@atlaskit/icon/glyph/check-circle';
import ErrorIcon from '@atlaskit/icon/glyph/error';
import InfoIcon from '@atlaskit/icon/glyph/info';
import WarningIcon from '@atlaskit/icon/glyph/warning';

import MessageIcon from '../../message-icon';

describe('MessageIcon component', () => {
  describe('props', () => {
    // These will be updated once we have the actual icons.
    // See https://ecosystem.atlassian.net/browse/AK-1416
    describe('type', () => {
      it('connectivity type produces connectivity icon', () => {
        const wrapper = mount(
          <MessageIcon isOpen={false} appearance="connectivity" />,
        );
        expect(wrapper.find(WarningIcon).length).toBeGreaterThan(0);
      });
      it('confirmation appearance produces confirmation icon', () => {
        const wrapper = mount(
          <MessageIcon isOpen={false} appearance="confirmation" />,
        );
        expect(wrapper.find(CheckCircleIcon).length).toBeGreaterThan(0);
      });
      it('info appearance produces info icon', () => {
        const wrapper = mount(<MessageIcon isOpen={false} appearance="info" />);
        expect(wrapper.find(InfoIcon).length).toBeGreaterThan(0);
      });
      it('warning appearance produces warning icon', () => {
        const wrapper = mount(
          <MessageIcon isOpen={false} appearance="warning" />,
        );
        expect(wrapper.find(WarningIcon).length).toBeGreaterThan(0);
      });
      it('error appearance produces error icon', () => {
        const wrapper = mount(
          <MessageIcon isOpen={false} appearance="error" />,
        );
        expect(wrapper.find(ErrorIcon).length).toBeGreaterThan(0);
      });
    });

    describe('label', () => {
      describe('default labels', () => {
        ([
          'connectivity',
          'confirmation',
          'info',
          'warning',
          'error',
        ] as const).forEach((appearance) => {
          it(`should set defaultLabel for icon wiht type = ${appearance}`, () => {
            const { getByTestId } = render(
              <MessageIcon isOpen={false} appearance={appearance} />,
            );

            const icon = getByTestId('inline-message-icon');
            expect(icon.getAttribute('aria-label')).toBe(
              `${appearance} inline message`,
            );
          });
        });
      });

      it('should set received label as aria-label of icon', () => {
        const { getByTestId } = render(
          <MessageIcon
            isOpen={false}
            appearance="connectivity"
            label="test label"
          />,
        );

        const icon = getByTestId('inline-message-icon');
        expect(icon.getAttribute('aria-label')).toBe('test label');
      });
    });
  });
});
