import React from 'react';
import { render, waitForElement } from '@testing-library/react';
import { IntlProvider } from 'react-intl-next';
import '@testing-library/jest-dom/extend-expect';
import userEvent from '@testing-library/user-event';
import ActionGroup from '..';
import { ActionName } from '../../../../../../constants';
import { ActionItem } from '../../types';

describe('ActionGroup', () => {
  const testId = 'smart-element-test';

  const setup = (itemsCount: number) => {
    const makeActionItem: (_: any, i: number) => ActionItem = (_, i) => ({
      onClick: jest.fn(),
      name: ActionName.DeleteAction,
      testId: `${testId}-${i + 1}`,
      hideContent: false,
      hideIcon: false,
    });
    const items = Array(itemsCount).fill(null).map(makeActionItem);

    return render(
      <IntlProvider locale="en">
        <ActionGroup items={items} />
      </IntlProvider>,
    );
  };

  describe('when there is just one action item', () => {
    it('renders action group', async () => {
      const { container } = setup(1);

      const actionGroup = await waitForElement(() => container.firstChild);

      expect(actionGroup).toBeTruthy();
      expect(actionGroup?.textContent).toMatch('Delete');
    });

    it('should not render ellipse button', async () => {
      const { queryByTestId } = setup(1);
      expect(queryByTestId('action-group-more-button')).toBeNull();
    });
  });

  describe('when there is 2 actions', () => {
    it('should render both actions as a buttons', async () => {
      const { getByTestId } = setup(2);
      const element1 = await waitForElement(() =>
        getByTestId('smart-element-test-1'),
      );
      expect(element1).toBeDefined();
      const element2 = await waitForElement(() =>
        getByTestId('smart-element-test-2'),
      );
      expect(element2).toBeDefined();
    });

    it('should not render ellipse button', async () => {
      const { queryByTestId } = setup(2);
      expect(queryByTestId('action-group-more-button')).toBeNull();
    });
  });

  describe('when there is more then 2 actions', () => {
    it('should render only first action item as a button', async () => {
      const { getByTestId, queryByTestId } = setup(3);
      const element = await waitForElement(() =>
        getByTestId('smart-element-test-1'),
      );
      expect(element).toBeDefined();
      expect(queryByTestId('smart-element-test-2')).toBeNull();
      expect(queryByTestId('smart-element-test-3')).toBeNull();
    });

    it('should render ellipse button for all but first actions', async () => {
      const { getByTestId } = setup(3);
      const element = await waitForElement(() =>
        getByTestId('action-group-more-button'),
      );
      expect(element).toBeDefined();
    });

    it('should render rest of the actions when more buttons clicked', async () => {
      const { getByTestId } = setup(3);
      const moreButton = await waitForElement(() =>
        getByTestId('action-group-more-button'),
      );
      userEvent.click(moreButton);

      const secondActionElement = await waitForElement(() =>
        getByTestId('smart-element-test-2'),
      );
      expect(secondActionElement).toBeDefined();
      expect(secondActionElement?.textContent).toMatch('Delete');

      const thirdActionElement = await waitForElement(() =>
        getByTestId('smart-element-test-2'),
      );
      expect(thirdActionElement).toBeDefined();
      expect(thirdActionElement?.textContent).toMatch('Delete');
    });
  });
});
