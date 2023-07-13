/* eslint-disable jsx-a11y/label-has-associated-control */
import React from 'react';

import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { Label } from '../..';

const user = userEvent.setup();

const testLabel = 'test label';
const testId = 'label';
const innerTestId = 'label-inner';

describe('ak-field-base', () => {
  describe('Label', () => {
    describe('by default', () => {
      it('should render a label element', () => {
        render(<Label label={testLabel} testId={testId} />);

        expect(screen.getByTestId(innerTestId)).toBeInTheDocument();
        expect(screen.getByText(testLabel)).toBeInTheDocument();
      });
    });

    describe('hideLabel prop', () => {
      it('should hide label if set to true', () => {
        render(<Label label={testLabel} isLabelHidden testId={testId} />);

        expect(screen.getByTestId(innerTestId)).toHaveStyle('display: none');
      });

      it('should show label if set to false', () => {
        render(
          <Label label={testLabel} isLabelHidden={false} testId={testId} />,
        );

        expect(screen.getByTestId(innerTestId)).toBeVisible();
      });
    });

    describe('required prop', () => {
      it('should append an asterisk to the content if set to true', () => {
        render(<Label label={testLabel} isRequired />);

        expect(screen.getByText('*')).toBeInTheDocument();
      });

      it('should not append an asterisk to the content if set to false', () => {
        render(<Label label={testLabel} isRequired={false} />);

        expect(screen.queryByText('*')).not.toBeInTheDocument();
      });
    });

    describe('appearance prop', () => {
      it('should be "default" appearance by default', () => {
        render(<Label label={testLabel} testId={testId} />);

        expect(screen.getByTestId(innerTestId)).toHaveStyle(
          'padding: 20px 0px 4px 0px',
        );
      });

      it('should set specified appearance', () => {
        render(
          <Label label={testLabel} testId={testId} appearance="inline-edit" />,
        );

        expect(screen.getByTestId(innerTestId)).toHaveStyle(
          'padding: 8px 0px 0px 8px',
        );
      });
    });

    describe('isFirstChild prop', () => {
      it('should apply firstChild style if set to true', () => {
        render(<Label label={testLabel} testId={testId} isFirstChild />);

        expect(screen.getByTestId(innerTestId)).toHaveStyle(
          'padding: 4px 0px 4px 0px',
        );
      });

      it('should not apply firstChild style if set to false', () => {
        render(
          <Label label={testLabel} testId={testId} isFirstChild={false} />,
        );

        expect(screen.getByTestId(innerTestId)).toHaveStyle(
          'padding: 20px 0px 4px 0px',
        );
      });
    });

    describe('isDisabled prop', () => {
      it('should apply disabled style if set to true', () => {
        render(<Label label={testLabel} testId={testId} isDisabled />);

        expect(screen.getByTestId(innerTestId)).toHaveStyle(
          'color: rgb(179, 186, 197)',
        );
      });

      it('should not apply disabled style if set to false', () => {
        render(<Label label={testLabel} testId={testId} isDisabled={false} />);

        expect(screen.getByTestId(innerTestId)).toHaveStyle(
          'color: rgb(107, 119, 140)',
        );
      });
    });

    describe('htmlFor prop', () => {
      it('should apply htmlFor to the label wrapper', () => {
        render(
          <Label
            label={testLabel}
            testId={testId}
            isDisabled
            htmlFor="element-id"
          />,
        );

        expect(screen.getByTestId(testId)).toHaveAttribute('for', 'element-id');
      });
    });

    describe('onClick prop', () => {
      it('should fire handler when the span is clicked', async () => {
        const handler = jest.fn();
        // Labels generally shouldn't have click handlers, as it's a
        // noninteractive element. This is left as legacy because of the way this
        // component is structured and the age of the package.
        // TODO: Determine if this functionality should be deprecated/removed (DSP-11467)
        // eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-noninteractive-element-interactions
        render(<Label label={testLabel} testId={testId} onClick={handler} />);

        await user.click(screen.getByText(testLabel));

        expect(handler).toHaveBeenCalledTimes(1);
      });
    });

    describe('children', () => {
      it('should render any children passed to it', () => {
        render(
          <Label label={testLabel} isLabelHidden>
            <div>child</div>
          </Label>,
        );

        expect(screen.getByText('child')).toBeInTheDocument();
      });
    });
  });
});
