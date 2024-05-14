/** @jsx jsx */
import { jsx } from '@emotion/react';
import { useIntl } from 'react-intl-next';
import { messages } from '@atlaskit/media-ui';
import { avatarListWrapperStyles, smallAvatarImageStyles } from './styles';

export interface Avatar {
  dataURI: string;
  name?: string;
}

export interface AvatarListProps {
  avatars: Array<Avatar>;
  onItemClick?: (avatar: Avatar) => void;
  selectedAvatar?: Avatar;
  selectAvatarLabel?: string;
}

export const AvatarList = ({
  avatars = [],
  selectedAvatar,
  onItemClick,
  selectAvatarLabel,
}: AvatarListProps) => {
  const intl = useIntl();

  const createOnItemClickHandler = (avatar: Avatar) => () => {
    if (onItemClick) {
      onItemClick(avatar);
    }
  };

  const cards = avatars.map((avatar, idx) => {
    const elementKey = `predefined-avatar-${idx}`;
    return (
      <label key={elementKey}>
        <input
          type="radio"
          name="avatar"
          value={avatar.dataURI}
          aria-label={avatar.name || undefined}
          checked={avatar === selectedAvatar}
          onChange={createOnItemClickHandler(avatar)}
        />
        <img css={smallAvatarImageStyles} src={avatar.dataURI} alt="" />
      </label>
    );
  });

  return (
    <div
      role="radiogroup"
      aria-label={
        selectAvatarLabel || intl.formatMessage(messages.select_an_avatar)
      }
      css={avatarListWrapperStyles}
    >
      {cards}
    </div>
  );
};
