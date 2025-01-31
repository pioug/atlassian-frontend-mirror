import type { Space } from '@atlaskit/primitives/compiled';

import { type FlexibleUiActionName } from '../../../../../constants';
import type { BlockProps } from '../types';

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
