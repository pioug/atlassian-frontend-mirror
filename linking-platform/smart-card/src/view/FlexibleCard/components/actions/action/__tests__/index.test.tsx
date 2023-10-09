import React from 'react';
import { css } from '@emotion/react';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import Action from '../index';
import userEvent from '@testing-library/user-event';
import { SmartLinkSize } from '../../../../../../constants';
import TestIcon from '@atlaskit/icon/glyph/activity';
import { ffTest } from '@atlassian/feature-flags-test-utils';

describe('Action', () => {
  let user: ReturnType<typeof userEvent.setup>;

  beforeEach(() => {
    user = userEvent.setup();
  });

  const testId = 'smart-action';

  describe('renders action', () => {
    ffTest('platform.linking-platform.smart-card.follow-button', async () => {
      const { findByTestId } = render(
        <Action onClick={() => {}} testId={testId} />,
      );
      const element = await findByTestId(testId);
      expect(element).not.toBeNull();
    });
  });

  it('does not render action without onClick', async () => {
    // @ts-ignore Ignore to perform the test.
    const { queryByTestId } = render(<Action testId={testId} />);
    const element = queryByTestId(testId);
    expect(element).toBeNull();
  });

  describe('as button', () => {
    describe('renders action with some text', () => {
      ffTest('platform.linking-platform.smart-card.follow-button', async () => {
        const text = 'spaghetti';
        const { findByTestId } = render(
          <Action onClick={() => {}} content={text} testId={testId} />,
        );

        const element = await findByTestId(testId);

        expect(element).toBeTruthy();
        expect(element.textContent).toBe('spaghetti');
      });
    });

    describe('calls onClick when button is clicked', () => {
      ffTest('platform.linking-platform.smart-card.follow-button', async () => {
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
    });

    describe('size', () => {
      describe.each([
        [SmartLinkSize.XLarge, '1.5rem'],
        [SmartLinkSize.Large, '1.5rem'],
        [SmartLinkSize.Medium, '1rem'],
        [SmartLinkSize.Small, '1rem'],
      ])(
        'renders action in %s size',
        (size: SmartLinkSize, expectedSize: string) => {
          ffTest(
            'platform.linking-platform.smart-card.follow-button',
            async () => {
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
        },
      );
    });

    describe('renders with override css', () => {
      ffTest('platform.linking-platform.smart-card.follow-button', async () => {
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
    });

    describe('does not call onClick on loading', () => {
      ffTest(
        'platform.linking-platform.smart-card.follow-button',
        async () => {
          const onClick = jest.fn();
          const { findByTestId } = render(
            <Action isLoading={true} onClick={onClick} testId={testId} />,
          );
          const element = await findByTestId(testId);
          await user.click(element);

          expect(onClick).not.toHaveBeenCalled();
        },
        async () => {
          const onClick = jest.fn();
          const { findByTestId } = render(
            <Action isLoading={true} onClick={onClick} testId={testId} />,
          );
          const element = await findByTestId(testId);
          await user.click(element);

          // There is nothing preventing onClick on existing button as there is no concept of loading state
          expect(onClick).toHaveBeenCalled();
        },
      );
    });

    it('does not call onClick when button is disabled', async () => {
      const onClick = jest.fn();
      const { findByTestId } = render(
        <Action isDisabled={true} onClick={onClick} testId={testId} />,
      );
      const element = await findByTestId(testId);
      await user.click(element);

      expect(onClick).not.toHaveBeenCalled();
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

    it('does not call onClick on loading', async () => {
      const onClick = jest.fn();
      const { findByTestId } = render(
        <Action
          asDropDownItem={true}
          content="spaghetti"
          isLoading={true}
          onClick={onClick}
        />,
      );

      const element = await findByTestId(testId);
      await user.click(element);

      expect(onClick).not.toHaveBeenCalled();
    });
  });
});
