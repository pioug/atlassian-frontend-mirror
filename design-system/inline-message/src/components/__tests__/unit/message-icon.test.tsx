import React from 'react';

import { matchers } from '@emotion/jest';
import { render, screen } from '@testing-library/react';

import { typesMapping } from '../../../constants';
import MessageIcon from '../../message-icon';

expect.extend(matchers);

describe('MessageIcon component', () => {
  describe('props', () => {
    // These will be updated once we have the actual icons.
    // See https://ecosystem.atlassian.net/browse/AK-1416
    describe('type', () => {
      it('connectivity type produces connectivity icon', () => {
        render(<MessageIcon isOpen={false} appearance="connectivity" />);

        expect(screen.getByRole('presentation')).toBeInTheDocument();
        expect(
          screen.getByLabelText(typesMapping.connectivity.defaultLabel),
        ).toBeInTheDocument();
      });

      it('confirmation appearance produces confirmation icon', () => {
        render(<MessageIcon isOpen={false} appearance="confirmation" />);

        expect(screen.getByRole('presentation')).toBeInTheDocument();
        expect(
          screen.getByLabelText(typesMapping.confirmation.defaultLabel),
        ).toBeInTheDocument();
      });

      it('info appearance produces info icon', () => {
        render(<MessageIcon isOpen={false} appearance="info" />);

        expect(screen.getByRole('presentation')).toBeInTheDocument();
        expect(
          screen.getByLabelText(typesMapping.info.defaultLabel),
        ).toBeInTheDocument();
      });

      it('warning appearance produces warning icon', () => {
        render(<MessageIcon isOpen={false} appearance="warning" />);

        expect(screen.getByRole('presentation')).toBeInTheDocument();
        expect(
          screen.getByLabelText(typesMapping.warning.defaultLabel),
        ).toBeInTheDocument();
      });

      it('error appearance produces error icon', () => {
        render(<MessageIcon isOpen={false} appearance="error" />);

        expect(screen.getByRole('presentation')).toBeInTheDocument();
        expect(
          screen.getByLabelText(typesMapping.error.defaultLabel),
        ).toBeInTheDocument();
      });
    });

    describe('label', () => {
      describe('default labels', () => {
        (
          ['connectivity', 'confirmation', 'info', 'warning', 'error'] as const
        ).forEach((appearance) => {
          it(`should set defaultLabel for icon with type = ${appearance}`, () => {
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

    describe('isOpen', () => {
      it('should apply iconColorStyles if isOpen prop is true', () => {
        const { container } = render(
          <MessageIcon appearance="info" isOpen={true} />,
        );

        expect(container.querySelector('span')).toHaveStyleRule(
          'color',
          'var(--icon-accent-color)',
        );
      });

      it('should not apply iconColorStyles if isOpen prop is false', () => {
        const { container } = render(
          <MessageIcon appearance="info" isOpen={false} />,
        );

        expect(container.querySelector('span')).toHaveStyleRule(
          'color',
          'var(--icon-color)',
        );
      });
    });
  });
});
