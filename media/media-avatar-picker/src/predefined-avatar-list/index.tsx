/**@jsx jsx */
import { jsx } from '@emotion/react';

import { AvatarList, Avatar } from '../avatar-list';

import EditorMoreIcon from '@atlaskit/icon/glyph/editor/more';
import Button from '@atlaskit/button/standard-button';
import { predefinedAvatarsWrapperStyles } from './styles';
import { useIntl } from 'react-intl-next';
import { messages } from '@atlaskit/media-ui';

export interface PredefinedAvatarListProps {
  avatars: Array<Avatar>;
  selectedAvatar?: Avatar;
  onShowMore?: () => void;
  onAvatarSelected: (avatar: Avatar) => void;
  selectAvatarLabel?: string;
}

export const PredefinedAvatarList = ({
  avatars = [],
  selectedAvatar,
  onShowMore,
  onAvatarSelected,
  selectAvatarLabel,
}: PredefinedAvatarListProps) => {
  const intl = useIntl();

  return (
    <div css={predefinedAvatarsWrapperStyles} id="predefined-avatar-wrapper">
      <AvatarList
        avatars={avatars}
        selectedAvatar={selectedAvatar}
        onItemClick={onAvatarSelected}
        selectAvatarLabel={selectAvatarLabel}
      />
      <Button
        aria-label={intl.formatMessage(messages.show_more_avatars_btn_label)}
        className="show-more-button"
        appearance="subtle"
        iconAfter={<EditorMoreIcon label="" size="large" />}
        onClick={onShowMore}
      />
    </div>
  );
};
