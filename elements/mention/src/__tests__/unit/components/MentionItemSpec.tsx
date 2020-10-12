import { mountWithIntl } from '@atlaskit/editor-test-helpers';
import LockCircleIcon from '@atlaskit/icon/glyph/lock-circle';
import { ReactWrapper } from 'enzyme';
import React from 'react';
import MentionItem from '../../../components/MentionItem';
import { Props, State } from '../../../components/MentionList';
import { MentionDescription } from '../../../types';

const mentionWithNickname = {
  id: '0',
  name: 'Raina Halper',
  mentionName: 'Caprice',
  nickname: 'Carolyn',
  avatarUrl: '',
};

const mentionWithoutNickname = {
  id: '1',
  name: 'Kaitlyn Prouty',
  mentionName: 'Fidela',
  avatarUrl: '',
};

function setupMentionItem(
  mention: MentionDescription,
  props?: Props,
): ReactWrapper<Props, State> {
  return mountWithIntl(
    <MentionItem mention={mention} onSelection={props && props.onSelection} />,
  );
}

describe('MentionItem', () => {
  it('should display @-nickname if nickname is present', () => {
    const component = setupMentionItem(mentionWithNickname);
    expect(component.html()).toContain(`@${mentionWithNickname.nickname}`);
  });

  it('should not display @-name if nickname is not present', () => {
    const component = setupMentionItem(mentionWithoutNickname);
    expect(component.html()).not.toContain('@');
  });

  it('should display access restriction if accessLevel is not CONTAINER', () => {
    const component = setupMentionItem({
      id: '1',
      name: 'Kaitlyn Prouty',
      mentionName: 'Fidela',
      avatarUrl: '',
      accessLevel: 'SITE',
    });
    expect(component.find(LockCircleIcon)).toHaveLength(1);
  });

  it('should not display access restriction if accessLevel is CONTAINER', () => {
    const component = setupMentionItem({
      id: '1',
      name: 'Kaitlyn Prouty',
      mentionName: 'Fidela',
      avatarUrl: '',
      accessLevel: 'CONTAINER',
    });
    expect(component.find(LockCircleIcon)).toHaveLength(0);
  });

  it('should not display access restriction if no accessLevel data', () => {
    const component = setupMentionItem({
      id: '1',
      name: 'Kaitlyn Prouty',
      mentionName: 'Fidela',
      avatarUrl: '',
    });
    expect(component.find(LockCircleIcon)).toHaveLength(0);
  });
});
