import type { Space } from '@atlaskit/primitives/compiled';

import { type FlexibleUiActionName } from '../../../../../constants';
import type { BlockProps } from '../types';

export type ActionBlockProps = {
	/**
	 * Hides the AI Summary action.
	 * To be replaced after the 3P Auth Rovo experiment with a better solution to determine whether to show the AI Summary action or not.
	 */
	hideAISummaryAction?: boolean;
	/**
	 * Callback once action is executed.
	 */
	onClick?: (name: FlexibleUiActionName) => void;
	/**
	 * Used to add space along the inline axis (typically horizontal).
	 */
	spaceInline?: Space;
} & BlockProps;
