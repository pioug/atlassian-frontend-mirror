import { IntlShape } from 'react-intl-next';

import { Command } from '../../../types';
import { messages } from '../messages';
import { IconCard } from './assets/card';
import { IconEmbed } from './assets/embed';
import { IconInline } from './assets/inline';
import { IconUrl } from './assets/url';
import { OptionConfig } from './types';
import { IconDropdownOptionProps } from './LinkToolbarIconDropdown';

const appearancePropsMap = {
  url: {
    title: messages.urlTitle,
    description: messages.urlDescription,
    icon: IconUrl,
  },
  inline: {
    title: messages.inlineTitle,
    description: messages.inlineDescription,
    icon: IconInline,
  },
  block: {
    title: messages.blockTitle,
    description: messages.blockDescription,
    icon: IconCard,
  },
  embed: {
    title: messages.embedTitle,
    description: messages.embedDescription,
    icon: IconEmbed,
  },
};

export const getIconDropdownOption = (
  intl: IntlShape,
  dispatchCommand: (command: Command) => void,
  { disabled, onClick, selected, appearance, testId, tooltip }: OptionConfig,
): IconDropdownOptionProps => {
  const { title, description, icon } = appearancePropsMap[appearance ?? 'url'];

  return {
    title: intl.formatMessage(title),
    description: intl.formatMessage(description),
    icon,
    onClick: () => dispatchCommand(onClick),
    selected: Boolean(selected),
    disabled: Boolean(disabled),
    tooltipContent: tooltip,
    testId,
  };
};
