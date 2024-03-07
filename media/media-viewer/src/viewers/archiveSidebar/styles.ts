import { token } from '@atlaskit/tokens';
import { DN500 } from '@atlaskit/theme/colors';

export const ArchiveSideBarWidth = 300;

export const itemStyle = {
  backgroundColor: `${token('color.background.neutral.subtle', '#101214')}`,
  fill: `${token('color.icon.success', '#101214')}`,
  color: `${token('color.text', DN500)}`,
  ':hover': {
    backgroundColor: `${token(
      'color.background.neutral.subtle.hovered',
      '#A1BDD914',
    )}`,
    color: `${token('color.text', DN500)}`,
  },
  ':active': {
    backgroundColor: `${token(
      'color.background.neutral.subtle.pressed',
      '#A6C5E229',
    )}`,
    color: `${token('color.text', DN500)}`,
  },
};
