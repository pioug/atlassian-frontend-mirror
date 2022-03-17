import Tooltip from '@atlaskit/tooltip';
import React from 'react';
import { mountWithIntl } from '@atlaskit/editor-test-helpers/enzyme';
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

  const renderReactionTooltip = (
    reactionSummary: ReactionSummary = reaction,
    emojiName: string = 'emoji name',
  ) => (
    <ReactionTooltip reaction={reactionSummary} emojiName={emojiName}>
      <div id="content">content</div>
    </ReactionTooltip>
  );
  it('should render tooltip', () => {
    const wrapper = mountWithIntl(renderReactionTooltip());

    expect(wrapper.find(Tooltip).prop('position')).toEqual('bottom');
    const tooltipContent = mountWithIntl(
      wrapper.find(Tooltip).prop('content') as any,
    );

    const tooltipLines = tooltipContent.find('li');
    expect(tooltipLines).toHaveLength(7);
    expect(tooltipLines.at(0).text()).toEqual('emoji name');
    expect(tooltipLines.at(1).text()).toEqual('User 1');
    expect(tooltipLines.at(2).text()).toEqual('User 2');
    expect(tooltipLines.at(3).text()).toEqual('User 3');
    expect(tooltipLines.at(4).text()).toEqual('User 4');
    expect(tooltipLines.at(5).text()).toEqual('User 5');
    expect(tooltipLines.at(6).text()).toEqual('and 2 others');
  });

  it('should not render footer with fewer users than the limit', () => {
    const wrapper = mountWithIntl(
      renderReactionTooltip({
        ...reaction,
        users: reaction.users!.slice(0, 2),
      }),
    );

    const tooltipContent = mountWithIntl(
      wrapper.find(Tooltip).prop('content') as any,
    );

    const tooltipLines = tooltipContent.find('li');
    expect(tooltipLines).toHaveLength(3);
    expect(tooltipLines.at(0).text()).toEqual('emoji name');
    expect(tooltipLines.at(1).text()).toEqual('User 1');
    expect(tooltipLines.at(2).text()).toEqual('User 2');
  });

  it('should not render emoji name', () => {
    const wrapper = mountWithIntl(renderReactionTooltip(reaction, ''));

    const tooltipContent = mountWithIntl(
      wrapper.find(Tooltip).prop('content') as any,
    );

    const tooltipLines = tooltipContent.find('li');
    expect(tooltipLines).toHaveLength(6);
    expect(tooltipLines.at(0).text()).toEqual('User 1');
    expect(tooltipLines.at(5).text()).toEqual('and 2 others');
  });
});
