/**@jsx jsx */
import { jsx } from '@emotion/react';
import { FormattedMessage, useIntl } from 'react-intl-next';
import { messages } from '@atlaskit/media-ui';
import {
  largeAvatarImageStyles,
  predefinedAvatarViewWrapperStyles,
} from './styles';
import { type Avatar } from '../avatar-list';

import ArrowLeftIcon from '@atlaskit/icon/glyph/arrow-left';
import Button from '@atlaskit/button/standard-button';

export interface PredefinedAvatarViewProps {
  avatars: Array<Avatar>;
  onGoBack?: () => void;
  onAvatarSelected: (avatar: Avatar) => void;
  selectedAvatar?: Avatar;
  predefinedAvatarsText?: string;
  selectAvatarLabel?: string;
}

export const PredefinedAvatarView = ({
  avatars = [],
  onAvatarSelected,
  selectedAvatar,
  onGoBack,
  predefinedAvatarsText,
  selectAvatarLabel,
}: PredefinedAvatarViewProps) => {
  const intl = useIntl();

  const createOnItemClickHandler = (avatar: Avatar) => {
    return () => {
      if (onAvatarSelected) {
        onAvatarSelected(avatar);
      }
    };
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
				{/**
				 * The alt is intentionally empty to avoid double announement of screen reader
				 * see: https://www.loom.com/share/1c19ca856478460b9ab1b75cc599b122
				 */}
        <img css={largeAvatarImageStyles} src={avatar.dataURI} alt="" />
      </label>
    );
  });

  return (
    <div
      css={predefinedAvatarViewWrapperStyles}
      id="predefined-avatar-view-wrapper"
    >
{/* eslint-disable-next-line @atlaskit/ui-styling-standard/no-classname-prop -- Ignored via go/DSP-18766  */}
      <div className="header">
        <Button
          aria-label={intl.formatMessage(messages.avatar_picker_back_btn_label)}
// eslint-disable-next-line @atlaskit/ui-styling-standard/no-classname-prop -- Ignored via go/DSP-18766
          className="back-button"
          iconAfter={<ArrowLeftIcon label="" />}
          onClick={onGoBack}
        />
{/* eslint-disable-next-line @atlaskit/ui-styling-standard/no-classname-prop -- Ignored via go/DSP-18766  */}
        <h2 className="description">
          {predefinedAvatarsText || (
            <FormattedMessage {...messages.default_avatars} />
          )}
        </h2>
      </div>
      <div
        role="radiogroup"
        aria-label={
          selectAvatarLabel || intl.formatMessage(messages.select_an_avatar)
        }
// eslint-disable-next-line @atlaskit/ui-styling-standard/no-classname-prop -- Ignored via go/DSP-18766
        className="body"
      >
        {cards}
      </div>
    </div>
  );
};
