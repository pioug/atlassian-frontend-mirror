import React from 'react';
import { FormattedMessage } from 'react-intl-next';
import AddIcon from '@atlaskit/icon/glyph/add';
import InviteItem, {
  INVITE_ITEM_DESCRIPTION,
} from '../../../../../plugins/mentions/ui/InviteItem';
import { messages } from '../../../../../plugins/mentions/messages';
import { mountWithIntl } from '@atlaskit/editor-test-helpers/enzyme';

const mentionItemSelector = `div[data-id="${INVITE_ITEM_DESCRIPTION.id}"]`;

describe('@atlaskit/editor-core/ui/InviteItem', () => {
  let inviteItem: any;

  afterEach(() => {
    if (inviteItem && inviteItem.length) {
      inviteItem.unmount();
    }
  });

  it('should render invite item', () => {
    inviteItem = mountWithIntl(<InviteItem productName="jira" selected />);

    expect(inviteItem.length).toBe(1);
    expect(inviteItem.find(AddIcon).length).toBe(1);
    expect(
      inviteItem
        .find("div[data-testid='name-section']")
        .find(FormattedMessage)
        .at(0)
        .props(),
    ).toEqual({
      ...messages.inviteItemTitle,
      values: {
        userRole: 'basic',
        productName: expect.any(Object),
      },
    });
  });
  it('should pass the value of userRole, "Jira" and "Confluence" into title based on the value of props.userRole and props.product', () => {
    inviteItem = mountWithIntl(<InviteItem productName="jira" />);

    expect(
      inviteItem
        .find("div[data-testid='name-section']")
        .find(FormattedMessage)
        .at(0)
        .props(),
    ).toEqual({
      ...messages.inviteItemTitle,
      values: expect.objectContaining({
        userRole: 'basic',
        productName: expect.any(Object),
      }),
    });

    expect(
      inviteItem
        .find("span[data-testid='capitalized-message']")
        .prop('children'),
    ).toEqual('jira');

    inviteItem.setProps({ userRole: 'admin', productName: 'confluence' });

    expect(
      inviteItem
        .find("div[data-testid='name-section']")
        .find(FormattedMessage)
        .at(0)
        .props(),
    ).toMatchObject({
      ...messages.inviteItemTitle,
      values: expect.objectContaining({
        userRole: 'admin',
        productName: expect.any(Object),
      }),
    });

    expect(
      inviteItem
        .find("span[data-testid='capitalized-message']")
        .prop('children'),
    ).toEqual('confluence');
  });
  it('should call props.onMount if provided', () => {
    const mockOnMount = jest.fn();
    inviteItem = mountWithIntl(
      <InviteItem productName="jira" onMount={mockOnMount} />,
    );
    expect(mockOnMount).toBeCalled();
  });
  it('should call props.onMouseEnter when mouse entered', () => {
    const mockOnMouseEnter = jest.fn();
    inviteItem = mountWithIntl(
      <InviteItem productName="jira" onMouseEnter={mockOnMouseEnter} />,
    );

    inviteItem.find(mentionItemSelector).simulate('mouseEnter');

    expect(mockOnMouseEnter).toBeCalledWith(
      INVITE_ITEM_DESCRIPTION,
      expect.any(Object),
    );
  });
  it('should call props.onSelection when mouse clicked', () => {
    const mockOnSelection = jest.fn();
    const mockLeftClickEvent = { button: 0 };
    inviteItem = mountWithIntl(
      <InviteItem productName="jira" onSelection={mockOnSelection} />,
    );

    inviteItem
      .find(mentionItemSelector)
      .simulate('mouseDown', mockLeftClickEvent);

    expect(mockOnSelection).toBeCalledWith(
      INVITE_ITEM_DESCRIPTION,
      expect.objectContaining(mockLeftClickEvent),
    );
  });
});
