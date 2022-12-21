/** @jsx   jsx */
import { FC, useEffect, useState, useMemo } from 'react';
import { useIntl } from 'react-intl-next';
import { jsx } from '@emotion/react';

import { ResourcedEmoji } from '@atlaskit/emoji/element';
import { EmojiProvider } from '@atlaskit/emoji/resource';
import Avatar from '@atlaskit/avatar/Avatar';
import Spinner from '@atlaskit/spinner';
import { useTabPanel } from '@atlaskit/tabs';

import { i18n } from '../../shared';
import { ReactionSummary } from '../../types';

import {
  reactionViewStyle,
  userListStyle,
  userStyle,
  centerSpinner,
} from './styles';

export interface ReactionViewProps {
  /**
   * Selected reaction to get user data from
   */
  reaction: ReactionSummary;
  /**
   * Current emoji selected in the reactions dialog
   */
  selectedEmojiId: string;
  /**
   * Provider for loading emojis
   */
  emojiProvider: Promise<EmojiProvider>;
}

export const ReactionView: FC<ReactionViewProps> = ({
  selectedEmojiId,
  emojiProvider,
  reaction,
}) => {
  const intl = useIntl();
  const [emojiName, setEmojiName] = useState<string>('');

  useEffect(() => {
    (async () => {
      const provider = await emojiProvider;
      const emoji = await provider.findByEmojiId({
        shortName: '',
        id: selectedEmojiId,
      });
      if (emoji && emoji.name) {
        setEmojiName(emoji.name);
      }
    })();
  }, [emojiProvider, selectedEmojiId]);

  const alphabeticalNames = useMemo(() => {
    const reactionObj = reaction;

    return (
      reactionObj.users?.sort((a, b) =>
        a.displayName.localeCompare(b.displayName),
      ) || []
    );
  }, [reaction]);

  const tabPanelAttributes = useTabPanel();

  return (
    <div css={reactionViewStyle} {...tabPanelAttributes}>
      <p>
        <ResourcedEmoji
          emojiProvider={emojiProvider}
          emojiId={{ id: selectedEmojiId, shortName: '' }}
          fitToHeight={24}
        />
        {intl.formatMessage(i18n.messages.emojiName, { emojiName })}
      </p>
      {alphabeticalNames.length === 0 ? (
        <div css={centerSpinner}>
          <Spinner size="large" />
        </div>
      ) : (
        <ul css={userListStyle}>
          {alphabeticalNames.map((user) => {
            const profile = user.profilePicture?.path;
            return (
              <li css={userStyle} key={user.id}>
                <Avatar size="large" src={profile} />
                <span>{user.displayName}</span>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
};
