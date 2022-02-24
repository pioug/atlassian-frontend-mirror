import React from 'react';
import { ActionName, SmartLinkStatus } from '../../../../../../constants';
import { FlexibleUiContext } from '../../../../../../state/flexible-ui-context';
import context from '../../../../../../__fixtures__/flexible-ui-data-context';
import { render, waitForElement } from '@testing-library/react';
import { FooterBlockProps } from '../types';
import { IntlProvider } from 'react-intl-next';
import FooterBlock from '../index';
import { ActionItem } from '../../types';
import userEvent from '@testing-library/user-event';

describe('FooterBlock', () => {
  const testIdBase = 'some-test-id';
  const renderFooterBlock = (props?: FooterBlockProps) => {
    return render(
      <IntlProvider locale="en">
        <FlexibleUiContext.Provider value={context}>
          <FooterBlock status={SmartLinkStatus.Resolved} {...props} />
        </FlexibleUiContext.Provider>
      </IntlProvider>,
    );
  };

  it('should render non-empty block when status is resolved', () => {
    const { container } = renderFooterBlock();
    expect(container.children.length).toBeGreaterThan(0);
  });

  it.each([
    [SmartLinkStatus.Resolving],
    [SmartLinkStatus.Forbidden],
    [SmartLinkStatus.Errored],
    [SmartLinkStatus.NotFound],
    [SmartLinkStatus.Unauthorized],
    [SmartLinkStatus.Fallback],
  ])('should render null when status is %s', (status: SmartLinkStatus) => {
    const { container } = renderFooterBlock({ status });
    expect(container.children.length).toEqual(0);
  });

  it('should render resolved view block with custom testId', async () => {
    const { getByTestId } = renderFooterBlock({ testId: testIdBase });
    const block = await waitForElement(() =>
      getByTestId(`${testIdBase}-resolved-view`),
    );
    expect(block).toBeDefined();
  });

  it('should render resolved view block with default testId', async () => {
    const { getByTestId } = renderFooterBlock();
    const block = await waitForElement(() =>
      getByTestId(`smart-footer-block-resolved-view`),
    );
    expect(block).toBeDefined();
  });

  it('should render provider', async () => {
    const { getByTestId } = renderFooterBlock({ testId: testIdBase });
    const provider = await waitForElement(() =>
      getByTestId(`${testIdBase}-provider`),
    );
    expect(provider).toBeDefined();
    expect(provider.textContent).toBe('Confluence');
  });

  it('should not render actions when array is empty', () => {
    const { queryByTestId } = renderFooterBlock({
      testId: testIdBase,
      actions: [],
    });

    const actionsElementGroup = queryByTestId('smart-element-group-actions');
    expect(actionsElementGroup).toBeNull();
  });

  it('should render provided actions', async () => {
    const actionItem: ActionItem = {
      testId: 'some-delete-actionItem-test-id',
      name: ActionName.DeleteAction,
      onClick: jest.fn(),
    };
    const { getByTestId } = renderFooterBlock({
      testId: testIdBase,
      actions: [actionItem],
    });

    const actionsElementGroup = await waitForElement(() =>
      getByTestId('smart-element-group-actions'),
    );
    expect(actionsElementGroup).toBeDefined();

    const deleteAction = await waitForElement(() =>
      getByTestId('some-delete-actionItem-test-id'),
    );
    expect(deleteAction).toBeDefined();
    expect(deleteAction.textContent).toBe('Delete');

    userEvent.click(deleteAction);
    expect(actionItem.onClick).toHaveBeenCalled();
  });
});
