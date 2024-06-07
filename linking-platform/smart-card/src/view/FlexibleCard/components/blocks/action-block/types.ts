import type { Space } from '@atlaskit/primitives';

import type { BlockProps } from '../types';
import { type FlexibleUiActionName } from '../../../../../constants';

export type ActionBlockProps = {
	/**
	 * Callback once action is executed.
	 */
	onClick?: (name: FlexibleUiActionName) => void;
	/**
	 * Used to add space along the inline axis (typically horizontal).
	 */
	spaceInline?: Space;
} & BlockProps;
