import React from 'react';
import { FormattedMessage, useIntl } from 'react-intl-next';
import { messages } from '../i18n';
import { ToolTipContentWithKeymap } from './ToolTipContentWithKeymap';
import { backspace } from '../../util/keymaps';
import VisuallyHidden from '@atlaskit/visually-hidden';
import { EmojiDescription } from '../../types';

export const DeletableEmojiTooltipContent = () => {
  const { formatMessage } = useIntl();
  return (
    <ToolTipContentWithKeymap
      description={formatMessage(messages.deleteEmojiTooltip)}
      keymap={backspace}
    />
  );
};

export const DeletableEmojiTooltipContentForScreenReader = ({
  emoji,
}: {
  emoji: EmojiDescription;
}) => {
  return (
    <VisuallyHidden id={`screenreader-emoji-${emoji.id!}`}>
      <FormattedMessage
        {...messages.deleteEmojiTooltipForScreenreader}
        values={{ shortName: emoji.shortName }}
      />
    </VisuallyHidden>
  );
};
