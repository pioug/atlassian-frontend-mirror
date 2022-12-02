import React from 'react';
import { ActionName, SmartLinkStatus } from '../../../../../../constants';
import { FlexibleUiContext } from '../../../../../../state/flexible-ui-context';
import context from '../../../../../../__fixtures__/flexible-ui-data-context';
import { render } from '@testing-library/react';
import { FooterBlockProps } from '../../../../../FlexibleCard/components/blocks/footer-block/types';
import { IntlProvider } from 'react-intl-next';
import BlockCardFooter from '../index';
import { ActionItem } from '../../../../../FlexibleCard/components/blocks/types';
import userEvent from '@testing-library/user-event';

describe('Footer', () => {
  const testIdBase = 'some-test-id';
  const renderFooterBlock = (props?: FooterBlockProps) => {
    return render(
      <IntlProvider locale="en">
        <FlexibleUiContext.Provider value={context}>
          <BlockCardFooter status={props?.status} {...props} />
        </FlexibleUiContext.Provider>
      </IntlProvider>,
    );
  };

  it.each([
    [SmartLinkStatus.Forbidden],
    [SmartLinkStatus.Errored],
    [SmartLinkStatus.NotFound],
    [SmartLinkStatus.Unauthorized],
    [SmartLinkStatus.Pending],
    [SmartLinkStatus.Resolving],
    [SmartLinkStatus.Resolved],
    [SmartLinkStatus.Fallback],
  ])(
    'should render footer block when status is %s',
    (status: SmartLinkStatus) => {
      const { container } = renderFooterBlock({ status });
      expect(container).toBeDefined();
    },
  );

  it('should render provider', async () => {
    const { findByTestId } = renderFooterBlock({
      testId: testIdBase,
      status: SmartLinkStatus.Errored,
    });
    const provider = await findByTestId(`${testIdBase}-provider`);
    expect(provider).toBeDefined();
    const providerLabel = await findByTestId(`${testIdBase}-provider-label`);
    expect(providerLabel.textContent).toBe('Confluence');
  });

  it('should not render actions when array is empty', () => {
    const { queryByTestId } = renderFooterBlock({
      testId: testIdBase,
      actions: [],
      status: SmartLinkStatus.Errored,
    });

    const actionsElementGroup = queryByTestId('smart-element-group-actions');
    expect(actionsElementGroup).toBeNull();
  });

  it('should render provided actions', async () => {
    const user = userEvent.setup();
    const actionItem: ActionItem = {
      testId: 'some-delete-actionItem-test-id',
      name: ActionName.DeleteAction,
      onClick: jest.fn(),
    };
    const { findByTestId } = renderFooterBlock({
      testId: testIdBase,
      actions: [actionItem],
      status: SmartLinkStatus.Errored,
    });

    const actionsElementGroup = await findByTestId(
      'smart-element-group-actions',
    );
    expect(actionsElementGroup).toBeDefined();

    const deleteAction = await findByTestId('some-delete-actionItem-test-id');
    expect(deleteAction).toBeDefined();
    expect(deleteAction.textContent).toBe('Delete');

    await user.click(deleteAction);
    expect(actionItem.onClick).toHaveBeenCalled();
  });
});
