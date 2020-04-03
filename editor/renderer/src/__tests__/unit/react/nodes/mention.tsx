import React from 'react';
import { mount } from 'enzyme';
import { ResourcedMention } from '@atlaskit/mention/element';
import MentionNode from '../../../../react/nodes/mention';
import {
  Mention,
  EventHandlers,
  MentionEventHandler,
} from '@atlaskit/editor-common';

const mentionHandler: MentionEventHandler = (_mentionId, _text, _event?) => {};

describe('Renderer - React/Nodes/Mention', () => {
  it('should render UI mention component', () => {
    const mention = mount(
      <MentionNode id="abcd-abcd-abcd" text="@Oscar Wallhult" />,
    );
    expect(mention.find(Mention)).toHaveLength(1);
    mention.unmount();
  });

  it('should render with access level if prop exists', () => {
    const mention = mount(
      <MentionNode
        id="abcd-abcd-abcd"
        text="@Oscar Wallhult"
        accessLevel="APPLICATION"
      />,
    );
    expect(mention.find(Mention).prop('accessLevel')).toEqual('APPLICATION');
    mention.unmount();
  });

  it('should pass event handlers into resourced mention', () => {
    const eventHandlers: EventHandlers = {
      mention: {
        onClick: mentionHandler,
        onMouseEnter: mentionHandler,
        onMouseLeave: mentionHandler,
      },
    };

    const mention = mount(
      <MentionNode
        id="abcd-abcd-abcd"
        text="@Oscar Wallhult"
        eventHandlers={eventHandlers}
      />,
    );
    const resourcedMention = mention.find(ResourcedMention);

    expect(resourcedMention.prop('onClick')).toEqual(mentionHandler);
    mention.unmount();
  });
});
