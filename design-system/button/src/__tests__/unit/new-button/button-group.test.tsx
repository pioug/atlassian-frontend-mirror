import React from 'react';

import { render, screen } from '@testing-library/react';

import ButtonGroup from '../../../containers/button-group';
import variants from '../../../utils/variants';

const testId = 'button-group';
const button1TestId = 'button-1';
const referenceButtonTestId = 'button-reference';

describe('Button Group', () => {
  it('renders the `testId` prop to a data attribute', () => {
    render(<ButtonGroup testId={testId} />);

    const buttonGroup = screen.getByTestId(testId);

    expect(buttonGroup).toHaveAttribute('data-testid', testId);
  });

  it('does not add a test ID data attribute when `testId` prop is undefined', () => {
    render(<ButtonGroup>Button Group</ButtonGroup>);

    const buttonGroup = screen.getByText('Button Group');

    expect(buttonGroup).not.toHaveAttribute('data-testid');
  });

  variants.forEach(async ({ name, Component }) => {
    describe(`${name} variant`, () => {
      it('applies a shared `appearance` prop to contained buttons', () => {
        const appearance = 'danger';
        render(
          <>
            {/* Render a reference button outside the ButtonGroup so we can compare the resulting `className` */}
            <Component testId={referenceButtonTestId} appearance={appearance}>
              Reference button
            </Component>
            <ButtonGroup testId={testId} appearance={appearance}>
              <Component testId={button1TestId}>Button 1</Component>
              <Component>Button 2</Component>
            </ButtonGroup>
          </>,
        );
        const referenceButton = screen.getByTestId(referenceButtonTestId);
        const button = screen.getByTestId(button1TestId);

        expect(button).toHaveClass(referenceButton.className);
      });

      it('does not allow individual buttons to override a shared `appearance` prop', () => {
        const appearance = 'danger';
        render(
          <>
            {/* Render a reference button outside the ButtonGroup so we can compare the resulting `className` */}
            <Component testId={referenceButtonTestId} appearance={appearance}>
              Reference button
            </Component>
            <ButtonGroup testId={testId} appearance={appearance}>
              <Component testId={button1TestId} appearance="primary">
                Button 1
              </Component>
              <Component>Button 2</Component>
            </ButtonGroup>
          </>,
        );
        const referenceButton = screen.getByTestId(referenceButtonTestId);
        const button = screen.getByTestId(button1TestId);

        expect(button).toHaveClass(referenceButton.className);
      });
    });
  });
});
