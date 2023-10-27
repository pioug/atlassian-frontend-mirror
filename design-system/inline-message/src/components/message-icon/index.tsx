/** @jsx jsx */
import type { CSSProperties, FC } from 'react';

import { css, jsx } from '@emotion/react';

import { B100, B400, G300, P300, R400, Y300 } from '@atlaskit/theme/colors';
import { themed, useGlobalTheme } from '@atlaskit/theme/components';
import { token } from '@atlaskit/tokens';

import { typesMapping } from '../../constants';
import type { IconAppearance } from '../../types';

interface MessageIconProps {
  appearance: IconAppearance;
  isOpen: boolean;
  label?: string;
}

const iconColor = themed('appearance', {
  connectivity: {
    light: token('color.icon.brand', B400),
    dark: token('color.icon.brand', B100),
  },
  confirmation: {
    light: token('color.icon.success', G300),
    dark: token('color.icon.success', G300),
  },
  info: {
    light: token('color.icon.discovery', P300),
    dark: token('color.icon.discovery', P300),
  },
  warning: {
    light: token('color.icon.warning', Y300),
    dark: token('color.icon.warning', Y300),
  },
  error: {
    light: token('color.icon.danger', R400),
    dark: token('color.icon.danger', R400),
  },
});

const iconWrapperStyles = css({
  display: 'flex',
  alignItems: 'center',
  flex: '0 0 auto',
  color: 'var(--icon-color)',
});

const iconColorStyles = css({
  color: 'var(--icon-accent-color)',
});

/**
 * __Selected icon__
 *
 * The selected icon is used as the primary interactive element for the dialog.
 * Can be used with or without supporting text.
 */
const SelectedIcon: FC<MessageIconProps> = ({ appearance, isOpen, label }) => {
  const {
    [appearance]: { icon: Icon, defaultLabel },
  } = typesMapping;

  const theme = useGlobalTheme();

  return (
    <span
      data-ds--inline-message--icon
      style={
        { '--icon-color': iconColor({ appearance, theme }) } as CSSProperties
      }
      css={[iconWrapperStyles, isOpen && iconColorStyles]}
    >
      <Icon
        testId="inline-message-icon"
        label={label || defaultLabel}
        size="medium"
      />
    </span>
  );
};

export default SelectedIcon;
