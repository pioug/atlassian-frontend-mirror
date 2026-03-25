/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import React from 'react';

import { jsx } from '@compiled/react';

import { cssMap } from '@atlaskit/css';
import { token } from '@atlaskit/tokens';

import { type TPopupSurfaceProps } from './types';

const styles = cssMap({
	root: {
		backgroundColor: token('elevation.surface.overlay'),
		borderRadius: token('radius.small', '3px'),
		boxShadow: token('elevation.shadow.overlay'),
		overflow: 'auto',
	},
});

/**
 * Optional styled wrapper for popup content.
 *
 * Adds default visual styling (background, border-radius, box-shadow)
 * using design tokens. Consumers who want fully custom styling
 * should use `Popup.Content` without wrapping in `PopupSurface`.
 *
 * Exposed as `Popup.Surface` on the compound component.
 */
export function PopupSurface({ children }: TPopupSurfaceProps): React.ReactElement {
	return <div css={styles.root}>{children}</div>;
}
