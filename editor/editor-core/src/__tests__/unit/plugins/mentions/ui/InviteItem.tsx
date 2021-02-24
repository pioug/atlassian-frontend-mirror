import { mount } from 'enzyme';
import React from 'react';
import { FormattedMessage } from 'react-intl';
import AddIcon from '@atlaskit/icon/glyph/add';
import { N300 } from '@atlaskit/theme/colors';
import InviteItem, {
  INVITE_ITEM_DESCRIPTION,
} from '../../../../../plugins/mentions/ui/InviteItem';
import {
  CapitalizedStyle,
  MentionItemStyle,
  NameSectionStyle,
} from '../../../../../plugins/mentions/ui/InviteItem/styles';
import { messages } from '../../../../../plugins/mentions/messages';

describe('@atlaskit/editor-core/ui/InviteItem', () => {
  let inviteItem: any;

  afterEach(() => {
    if (inviteItem && inviteItem.length) {
      inviteItem.unmount();
    }
  });

  it('should render invite item', () => {
    inviteItem = mount(<InviteItem productName="jira" selected />);

    expect(inviteItem.length).toBe(1);
    expect(inviteItem.find(MentionItemStyle).prop('selected')).toBe(true);
    expect(inviteItem.find(MentionItemStyle).prop('data-id')).toBe(
      INVITE_ITEM_DESCRIPTION.id,
    );
    expect(inviteItem.find(AddIcon).length).toBe(1);
    expect(inviteItem.find(AddIcon).prop('primaryColor')).toBe(N300);
    expect(
      inviteItem.find(NameSectionStyle).find(FormattedMessage).at(0).props(),
    ).toEqual({
      ...messages.inviteItemTitle,
      values: {
        userRole: 'basic',
        productName: expect.any(Object),
      },
    });
  });
  it('should pass the value of userRole, "Jira" and "Confluence" into title based on the value of props.userRole and props.product', () => {
    inviteItem = mount(<InviteItem productName="jira" />);

    expect(
      inviteItem.find(NameSectionStyle).find(FormattedMessage).at(0).props(),
    ).toEqual({
      ...messages.inviteItemTitle,
      values: expect.objectContaining({
        userRole: 'basic',
        productName: expect.any(Object),
      }),
    });

    expect(inviteItem.find(CapitalizedStyle).prop('children')).toEqual('jira');

    inviteItem.setProps({ userRole: 'admin', productName: 'confluence' });

    expect(
      inviteItem.find(NameSectionStyle).find(FormattedMessage).at(0).props(),
    ).toMatchObject({
      ...messages.inviteItemTitle,
      values: expect.objectContaining({
        userRole: 'admin',
        productName: expect.any(Object),
      }),
    });

    expect(inviteItem.find(CapitalizedStyle).prop('children')).toEqual(
      'confluence',
    );
  });
  it('should call props.onMount if provided', () => {
    const mockOnMount = jest.fn();
    inviteItem = mount(<InviteItem productName="jira" onMount={mockOnMount} />);
    expect(mockOnMount).toBeCalled();
  });
  it('should call props.onMouseEnter when mouse entered', () => {
    const mockOnMouseEnter = jest.fn();
    inviteItem = mount(
      <InviteItem productName="jira" onMouseEnter={mockOnMouseEnter} />,
    );

    inviteItem.find(MentionItemStyle).simulate('mouseEnter');

    expect(mockOnMouseEnter).toBeCalledWith(
      INVITE_ITEM_DESCRIPTION,
      expect.any(Object),
    );
  });
  it('should call props.onSelection when mouse clicked', () => {
    const mockOnSelection = jest.fn();
    const mockLeftClickEvent = { button: 0 };
    inviteItem = mount(
      <InviteItem productName="jira" onSelection={mockOnSelection} />,
    );

    inviteItem.find(MentionItemStyle).simulate('mouseDown', mockLeftClickEvent);

    expect(mockOnSelection).toBeCalledWith(
      INVITE_ITEM_DESCRIPTION,
      expect.objectContaining(mockLeftClickEvent),
    );
  });
});
