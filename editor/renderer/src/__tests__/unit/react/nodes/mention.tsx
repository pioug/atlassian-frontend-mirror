import React from 'react';
import { mountWithIntl } from '@atlaskit/editor-test-helpers/enzyme-next';
import { ResourcedMention } from '@atlaskit/mention/element';
import MentionNode from '../../../../react/nodes/mention';
import { EventHandlers, MentionEventHandler } from '@atlaskit/editor-common/ui';
import { Mention } from '@atlaskit/editor-common/mention';

const mentionHandler: MentionEventHandler = (_mentionId, _text, _event?) => {};

describe('Renderer - React/Nodes/Mention', () => {
  it('should render UI mention component', () => {
    const mention = mountWithIntl(
      <MentionNode id="abcd-abcd-abcd" text="@Oscar Wallhult" />,
    );
    expect(mention.find(Mention)).toHaveLength(1);
    mention.unmount();
  });

  it('should render with access level if prop exists', () => {
    const mention = mountWithIntl(
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

    const mention = mountWithIntl(
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
