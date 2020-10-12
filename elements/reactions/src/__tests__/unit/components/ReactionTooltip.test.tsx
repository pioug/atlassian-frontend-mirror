import Tooltip from '@atlaskit/tooltip';
import { mount } from 'enzyme';
import React from 'react';
import { ReactionTooltip } from '../../../components/ReactionTooltip';
import { ReactionSummary } from '../../../types/ReactionSummary';

describe('ReactionTooltip', () => {
  const reaction: ReactionSummary = {
    ari: 'reaction-id',
    containerAri: 'conteiner-id',
    emojiId: 'emoji-id',
    count: 10,
    reacted: false,
    users: [
      {
        id: 'user-1',
        displayName: 'User 1',
      },
      {
        id: 'user-2',
        displayName: 'User 2',
      },
      {
        id: 'user-3',
        displayName: 'User 3',
      },
      {
        id: 'user-4',
        displayName: 'User 4',
      },
      {
        id: 'user-5',
        displayName: 'User 5',
      },
      {
        id: 'user-6',
        displayName: 'User 6',
      },
      {
        id: 'user-7',
        displayName: 'User 7',
      },
    ],
  };

  const mountReactionTooltip = (
    reactionSummary: ReactionSummary = reaction,
    emojiName: string = 'emoji name',
  ) =>
    mount(
      <ReactionTooltip reaction={reactionSummary} emojiName={emojiName}>
        <div id="content">content</div>
      </ReactionTooltip>,
    );

  it('should render tooltip', () => {
    const wrapper = mountReactionTooltip();

    expect(wrapper.find(Tooltip).prop('position')).toEqual('bottom');
    const tooltipContent = mount(wrapper.find(Tooltip).prop('content') as any);

    const labels = tooltipContent.find('span');
    expect(labels).toHaveLength(2);
    expect(labels.at(0).text()).toEqual('emoji name');
    expect(labels.at(1).text()).toEqual('+2...');

    const userNames = tooltipContent.find('li');
    expect(userNames).toHaveLength(5);
    expect(userNames.at(0).text()).toEqual('User 1');
    expect(userNames.at(1).text()).toEqual('User 2');
    expect(userNames.at(2).text()).toEqual('User 3');
    expect(userNames.at(3).text()).toEqual('User 4');
    expect(userNames.at(4).text()).toEqual('User 5');
  });

  it('should not render footer with fewer users than the limit', () => {
    const wrapper = mountReactionTooltip({
      ...reaction,
      users: reaction.users!.slice(0, 2),
    });

    const tooltipContent = mount(wrapper.find(Tooltip).prop('content') as any);

    const labels = tooltipContent.find('span');
    expect(labels).toHaveLength(1);
    expect(labels.at(0).text()).toEqual('emoji name');

    const userNames = tooltipContent.find('li');
    expect(userNames).toHaveLength(2);
    expect(userNames.at(0).text()).toEqual('User 1');
    expect(userNames.at(1).text()).toEqual('User 2');
  });

  it('should not render emoji name', () => {
    const wrapper = mountReactionTooltip(reaction, '');

    const tooltipContent = mount(wrapper.find(Tooltip).prop('content') as any);

    const labels = tooltipContent.find('span');
    expect(labels).toHaveLength(1);
    expect(labels.at(0).text()).toEqual('+2...');
  });
});
