/** @jsx jsx */
import React, { Fragment } from 'react';
import { jsx } from '@emotion/react';
import { formatShortcut, Keymap } from '../../util/keymaps';
import { tooltipShortcutStyle } from './styles';

export const ToolTipContentWithKeymap = React.memo(
  ({
    description,
    shortcutOverride,
    keymap,
  }: {
    description?: string | React.ReactNode;
    keymap?: Keymap;
    shortcutOverride?: string;
  }) => {
    const shortcut = shortcutOverride || (keymap && formatShortcut(keymap));
    return shortcut || description ? (
      <Fragment>
        {description}
        {shortcut && description && '\u00A0'}
        {shortcut && <span css={tooltipShortcutStyle}>{shortcut}</span>}
      </Fragment>
    ) : null;
  },
);
