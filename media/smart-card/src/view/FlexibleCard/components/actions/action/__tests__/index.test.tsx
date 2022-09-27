import React from 'react';
import { css } from '@emotion/core';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import Action from '../index';
import userEvent from '@testing-library/user-event';
import { SmartLinkSize } from '../../../../../../constants';
import TestIcon from '@atlaskit/icon/glyph/activity';

describe('Action', () => {
  let user: ReturnType<typeof userEvent.setup>;

  beforeEach(() => {
    user = userEvent.setup();
  });

  const testId = 'smart-action';

  it('renders action', async () => {
    const { findByTestId } = render(
      <Action onClick={() => {}} testId={testId} />,
    );
    const element = await findByTestId(testId);
    expect(element).not.toBeNull();
  });

  it('does not render action without onClick', async () => {
    // @ts-ignore Ignore to perform the test.
    const { queryByTestId } = render(<Action testId={testId} />);
    const element = queryByTestId(testId);
    expect(element).toBeNull();
  });

  describe('as button', () => {
    it('renders action with some text', async () => {
      const text = 'spaghetti';
      const { findByTestId } = render(
        <Action onClick={() => {}} content={text} testId={testId} />,
      );

      const element = await findByTestId(testId);

      expect(element).toBeTruthy();
      expect(element.textContent).toBe('spaghetti');
    });

    it('calls onClick when button is clicked', async () => {
      const text = 'spaghetti';
      const mockOnClick = jest.fn();
      const { findByTestId } = render(
        <Action onClick={mockOnClick} content={text} testId={testId} />,
      );

      const element = await findByTestId(testId);

      expect(element).toBeTruthy();
      expect(element.textContent).toBe('spaghetti');

      await user.click(element);
      expect(mockOnClick).toHaveBeenCalled();
    });

    describe('size', () => {
      it.each([
        [SmartLinkSize.XLarge, '1.5rem'],
        [SmartLinkSize.Large, '1.5rem'],
        [SmartLinkSize.Medium, '1rem'],
        [SmartLinkSize.Small, '1rem'],
      ])(
        'renders action in %s size',
        async (size: SmartLinkSize, expectedSize: string) => {
          const testIcon = <TestIcon label="test" />;
          const { findByTestId } = render(
            <Action
              onClick={() => {}}
              size={size}
              testId={testId}
              icon={testIcon}
            />,
          );

          const element = await findByTestId(`${testId}-icon`);

          expect(element).toHaveStyleDeclaration('height', expectedSize);
          expect(element).toHaveStyleDeclaration('width', expectedSize);
        },
      );
    });

    it('renders with override css', async () => {
      const overrideCss = css`
        font-style: italic;
      `;
      const testId = 'css';
      const { findByTestId } = await render(
        <Action
          content="spaghetti"
          onClick={() => {}}
          overrideCss={overrideCss}
          testId={testId}
        />,
      );
      const action = await findByTestId(`${testId}-button-wrapper`);
      expect(action).toHaveStyleDeclaration('font-style', 'italic');
    });

    it('does not propagate click event to parent container', async () => {
      const containerOnClick = jest.fn();
      const actionOnClick = jest.fn();
      const { findByTestId } = render(
        <div onClick={containerOnClick}>
          <Action onClick={actionOnClick} content="Click!" />,
        </div>,
      );

      const element = await findByTestId(testId);
      await user.click(element);

      expect(actionOnClick).toHaveBeenCalledTimes(1);
      expect(containerOnClick).not.toHaveBeenCalled();
    });
  });

  describe('as dropdown item', () => {
    it('renders action', async () => {
      const text = 'spaghetti';
      const { findByTestId } = render(
        <Action asDropDownItem={true} onClick={() => {}} content={text} />,
      );

      const element = await findByTestId(testId);

      expect(element).toBeTruthy();
      expect(element.textContent).toBe('spaghetti');
    });

    it('calls onClick when dropdown item is clicked', async () => {
      const text = 'spaghetti';
      const onClick = jest.fn();
      const { findByTestId } = render(
        <Action asDropDownItem={true} onClick={onClick} content={text} />,
      );

      const element = await findByTestId(testId);

      expect(element).toBeTruthy();
      expect(element.textContent).toBe(text);

      await user.click(element);
      expect(onClick).toHaveBeenCalled();
    });

    it('does not propagate click event to parent container', async () => {
      const containerOnClick = jest.fn();
      const actionOnClick = jest.fn();
      const { findByTestId } = render(
        <div onClick={containerOnClick}>
          <Action
            asDropDownItem={true}
            onClick={actionOnClick}
            content="Click!"
          />
          ,
        </div>,
      );

      const element = await findByTestId(testId);
      await user.click(element);

      expect(actionOnClick).toHaveBeenCalledTimes(1);
      expect(containerOnClick).not.toHaveBeenCalled();
    });
  });
});
