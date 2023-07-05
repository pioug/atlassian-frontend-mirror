import { IntlShape } from 'react-intl-next';

import { cardMessages as messages } from '../messages';
import type { Command } from '../types';

import type { ButtonOptionProps } from './LinkToolbarButtonGroup';
import type { OptionConfig } from './types';
import { IconCard } from './ui/assets/card';
import { IconEmbed } from './ui/assets/embed';
import { IconInline } from './ui/assets/inline';
import { IconUrl } from './ui/assets/url';

const appearancePropsMap = {
  url: {
    title: messages.urlTitle,
    icon: IconUrl,
  },
  inline: {
    title: messages.inlineTitle,
    icon: IconInline,
  },
  block: {
    title: messages.blockTitle,
    icon: IconCard,
  },
  embed: {
    title: messages.embedTitle,
    icon: IconEmbed,
  },
};

export const getButtonGroupOption = (
  intl: IntlShape,
  dispatchCommand: (command: Command) => void,
  { disabled, onClick, selected, appearance, testId, tooltip }: OptionConfig,
): ButtonOptionProps => {
  const { title, icon } = appearancePropsMap[appearance ?? 'url'];

  return {
    title: intl.formatMessage(title),
    icon,
    onClick: () => dispatchCommand(onClick),
    disabled: Boolean(disabled),
    tooltipContent: tooltip || null,
    testId,
    selected,
  };
};
