import { IntlShape } from 'react-intl-next';

import { Command } from '../../../types';
import { messages } from '../messages';
import { IconCard } from './assets/card';
import { IconEmbed } from './assets/embed';
import { IconInline } from './assets/inline';
import { IconUrl } from './assets/url';
import { OptionConfig } from './types';
import { ButtonOptionProps } from './LinkToolbarButtonGroup';

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
