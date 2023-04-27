import React from 'react';

import { render, fireEvent, waitFor, screen } from '@testing-library/react';

import FieldBase, { FieldBaseStateless } from '../..';

const onFocus = () => {};
const onBlur = () => {};

const testId = 'field-base';
const contentTestId = 'field-base-content';
const dialogTestId = 'field-base-dialog';

// Stub window.cancelAnimationFrame, so Popper (used in Layer) doesn't error when accessing it.
const animStub = window.cancelAnimationFrame;
beforeEach(() => {
  window.cancelAnimationFrame = () => {};
});

afterEach(() => {
  window.cancelAnimationFrame = animStub;
});

describe('FieldBase', () => {
  it('should render a content', () => {
    render(
      <FieldBaseStateless onFocus={onFocus} onBlur={onBlur} testId={testId} />,
    );

    expect(screen.getByTestId(contentTestId)).toBeInTheDocument();
  });

  describe('isReadOnly prop = true', () => {
    it('should render with the readOnly prop', async () => {
      render(
        <FieldBaseStateless
          onFocus={onFocus}
          onBlur={onBlur}
          testId={testId}
          isReadOnly
          isFocused={false}
        />,
      );

      await waitFor(() =>
        expect(screen.getByTestId(contentTestId)).toHaveAttribute('readonly'),
      );
    });
  });

  describe('isFocused prop', () => {
    it('should apply focused styles if set to true', () => {
      render(
        <FieldBaseStateless
          onFocus={onFocus}
          onBlur={onBlur}
          testId={testId}
          isFocused
        />,
      );

      expect(screen.getByTestId(contentTestId)).toHaveStyle(
        'background-color: rgb(255, 255, 255)',
      );
    });

    it('should not apply focused styles if set to false', () => {
      render(
        <FieldBaseStateless
          onFocus={onFocus}
          onBlur={onBlur}
          testId={testId}
          isFocused={false}
        />,
      );

      expect(screen.getByTestId(contentTestId)).toHaveStyle(
        'background-color: rgb(250, 251, 252)',
      );
    });
  });

  describe('isPaddingDisabled prop', () => {
    it('should apply disabled padding styles if set to true', () => {
      render(
        <FieldBaseStateless
          onFocus={onFocus}
          onBlur={onBlur}
          testId={testId}
          isPaddingDisabled
        />,
      );

      expect(screen.getByTestId(contentTestId)).toHaveStyle('padding: 0px');
    });

    it('should not apply disabled padding styles if set to false', () => {
      render(
        <FieldBaseStateless
          onFocus={onFocus}
          onBlur={onBlur}
          testId={testId}
          isPaddingDisabled={false}
        />,
      );

      expect(screen.getByTestId(contentTestId)).toHaveStyle('padding: 6px 6px');
    });
  });

  describe('isInvalid prop', () => {
    it('should render with the isFocused styles and not the isInvalid styles', () => {
      render(
        <FieldBaseStateless
          onFocus={onFocus}
          onBlur={onBlur}
          testId={testId}
          isInvalid
        />,
      );

      expect(screen.getByTestId(contentTestId)).toHaveStyle(
        'background-color: rgb(250, 251, 252)',
      );
    });

    it('should render the warning icon', () => {
      render(
        <FieldBaseStateless
          onFocus={onFocus}
          onBlur={onBlur}
          testId={testId}
          isInvalid
        />,
      );

      expect(screen.getByLabelText('warning')).toBeInTheDocument();
    });
  });

  describe('isDisabled prop', () => {
    it('should apply disabled styles if set to true', () => {
      render(
        <FieldBaseStateless
          onFocus={onFocus}
          onBlur={onBlur}
          isDisabled
          isInvalid
          testId={testId}
        />,
      );

      expect(screen.getByTestId(contentTestId)).toHaveStyle(
        'pointer-events: none',
      );
      expect(screen.getByTestId(contentTestId)).toHaveStyle(
        'background-color: rgb(244, 245, 247)',
      );
    });
  });

  describe('isDisabled prop = true AND isInvalid prop = true', () => {
    it('should not render the warning icon', () => {
      render(
        <FieldBaseStateless
          onFocus={onFocus}
          onBlur={onBlur}
          isDisabled
          isInvalid
          testId={testId}
        />,
      );

      expect(screen.queryByLabelText('warning')).not.toBeInTheDocument();
    });
  });

  describe('invalidMessage prop', () => {
    it('should be reflected in the inline dialog content', () => {
      const stringContent = 'invalid msg content';
      render(
        <FieldBaseStateless
          onFocus={onFocus}
          onBlur={onBlur}
          invalidMessage={stringContent}
          isDialogOpen
          testId={testId}
        />,
      );

      expect(screen.getByTestId(dialogTestId)).toBeInTheDocument();
      expect(screen.getByText(stringContent)).toBeInTheDocument();
    });
  });

  describe('isFocused prop = true AND isInvalid prop = true', () => {
    it('should render with the isFocused styles and not the isInvalid styles', () => {
      render(
        <FieldBaseStateless
          onFocus={onFocus}
          onBlur={onBlur}
          isFocused
          isInvalid
          testId={testId}
        />,
      );

      expect(screen.getByTestId(contentTestId)).toHaveStyle(
        'background-color: rgb(255, 255, 255)',
      );
    });
  });

  describe('isCompact prop', () => {
    it('should apply compact styles if set to true', () => {
      render(
        <FieldBaseStateless
          onFocus={onFocus}
          onBlur={onBlur}
          isCompact
          testId={testId}
        />,
      );

      expect(screen.getByTestId(contentTestId)).toHaveStyle(
        `line-height: ${16 / 14}`,
      );
    });

    it('should not apply compact styles if set to false', () => {
      render(
        <FieldBaseStateless
          onFocus={onFocus}
          onBlur={onBlur}
          isCompact={false}
          testId={testId}
        />,
      );

      expect(screen.getByTestId(contentTestId)).toHaveStyle(
        `line-height: ${20 / 14}`,
      );
    });
  });

  describe('isDialogOpen prop', () => {
    it('should render dialog if invalidMessage prop is provided', () => {
      render(
        <FieldBaseStateless
          onFocus={onFocus}
          onBlur={onBlur}
          isDialogOpen
          invalidMessage="test"
          testId={testId}
        />,
      );

      expect(screen.getByTestId(dialogTestId)).toBeInTheDocument();
    });

    it('should not render dialog if invalidMessage prop is not provided', () => {
      render(
        <FieldBaseStateless
          onFocus={onFocus}
          onBlur={onBlur}
          isDialogOpen
          testId={testId}
        />,
      );

      expect(screen.queryByTestId(dialogTestId)).not.toBeInTheDocument();
    });

    it('should not render dialog if set to false', () => {
      render(
        <FieldBaseStateless
          onFocus={onFocus}
          onBlur={onBlur}
          isDialogOpen={false}
          testId={testId}
          invalidMessage="test"
        />,
      );

      expect(screen.queryByTestId(dialogTestId)).not.toBeInTheDocument();
    });
  });

  describe('appearance', () => {
    it('should render the content with the subtle attribute', () => {
      render(
        <FieldBaseStateless
          onFocus={onFocus}
          onBlur={onBlur}
          testId={testId}
          appearance="subtle"
        />,
      );

      expect(screen.getByTestId(contentTestId)).toHaveStyle(
        `background-color: transparent`,
      );
    });
  });

  describe('shouldReset', () => {
    it('should call onBlur when set', () => {
      const onBlurSpy = jest.fn();
      const { rerender } = render(
        <FieldBaseStateless onFocus={onFocus} onBlur={onBlurSpy} />,
      );

      rerender(
        <FieldBaseStateless onFocus={onFocus} onBlur={onBlurSpy} shouldReset />,
      );

      expect(onBlurSpy).toHaveBeenCalled();
    });
  });

  describe('isLoading', () => {
    it('should render Spinner', () => {
      const { rerender } = render(
        <FieldBaseStateless onFocus={onFocus} onBlur={onBlur} isLoading />,
      );

      expect(screen.queryByTestId('field-base-spinner')).toBeInTheDocument();

      rerender(
        <FieldBaseStateless
          onFocus={onFocus}
          onBlur={onBlur}
          isLoading={false}
        />,
      );

      expect(
        screen.queryByTestId('field-base-spinner'),
      ).not.toBeInTheDocument();
    });

    describe('and isInvalid', () => {
      it('should not render Spinner', () => {
        render(
          <FieldBaseStateless
            onFocus={onFocus}
            onBlur={onBlur}
            isLoading
            isInvalid
          />,
        );

        expect(
          screen.queryByTestId('field-base-spinner'),
        ).not.toBeInTheDocument();
        expect(screen.getByLabelText('warning')).toBeInTheDocument();
      });
    });
  });

  describe('focus behaviour', () => {
    it('should call onFocus', async () => {
      const onFocusSpy = jest.fn();
      render(
        <FieldBaseStateless
          onFocus={onFocusSpy}
          onBlur={onBlur}
          testId={testId}
        />,
      );

      await fireEvent.focus(screen.getByTestId(contentTestId));

      expect(onFocusSpy).toHaveBeenCalledTimes(1);
    });

    it('should call onBlur', async () => {
      const onBlurSpy = jest.fn();
      render(
        <FieldBaseStateless
          onFocus={onFocus}
          onBlur={onBlurSpy}
          testId={testId}
        />,
      );

      await fireEvent.blur(screen.getByTestId(contentTestId));

      expect(onBlurSpy).toHaveBeenCalledTimes(1);
    });
  });

  describe('smart component', () => {
    beforeEach(() => {
      jest.useFakeTimers();
    });

    afterEach(() => {
      jest.useRealTimers();
    });

    it('should call onFocus handler', async () => {
      const onFocusSpy = jest.fn();
      render(
        <FieldBase onFocus={onFocusSpy} onBlur={onBlur} testId={testId} />,
      );

      await fireEvent.focus(screen.getByTestId(contentTestId));

      expect(onFocusSpy).toHaveBeenCalledTimes(1);
    });

    it('should call onBlur handler', async () => {
      const onBlurSpy = jest.fn();
      render(
        <FieldBase onFocus={onFocus} onBlur={onBlurSpy} testId={testId} />,
      );

      await fireEvent.blur(screen.getByTestId(contentTestId));

      jest.runOnlyPendingTimers();
      expect(onBlurSpy).toHaveBeenCalledTimes(1);
    });

    it('should close the dialog when focus goes away from both the element and the dialog', async () => {
      const invalidMessage = <div className="errorMessage">foo</div>;
      render(
        <FieldBase isInvalid invalidMessage={invalidMessage} testId={testId} />,
      );

      expect(screen.queryByTestId(dialogTestId)).toBe(null);
      await fireEvent.focus(screen.queryByTestId(contentTestId)); // open the dialog
      expect(screen.queryByTestId(dialogTestId)).not.toBe(null);

      await fireEvent.focus(screen.queryByText('foo'));
      await fireEvent.blur(screen.queryByText('foo'));
      await fireEvent.blur(screen.queryByTestId(contentTestId));

      jest.runTimersToTime(10);

      expect(screen.queryByTestId(dialogTestId)).toBe(null);
    });

    it('should retain focus when blur and focus happen one by one', async () => {
      render(<FieldBase onFocus={onFocus} onBlur={onBlur} testId={testId} />);

      const contentContainer = screen.getByTestId(contentTestId);

      await fireEvent.blur(contentContainer); // this should be robust enough to handle even two
      // "blur" events, one by one (faced it in the browser)
      await fireEvent.blur(contentContainer);
      await fireEvent.focus(contentContainer);

      await jest.runTimersToTime(10);

      expect(contentContainer).toHaveStyle(
        'background-color: rgb(255, 255, 255)',
      );
    });
  });
});
