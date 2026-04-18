import type { Space } from '@atlaskit/primitives/compiled';

import { type FlexibleUiActionName } from '../../../../../constants';
import type { BlockProps } from '../types';

export type ActionBlockProps = {
	/**
	 * Whether platform_sl_3p_auth_rovo_action or rovogrowth-640-inline-action-nudge-exp experiment value is ON for current runtime
	 */
	isAny3pRovoActionsExperimentOn?: boolean;
	/**
	 * Callback once action is executed.
	 */
	onClick?: (name: FlexibleUiActionName) => void;
	/**
	 * Used to add space along the inline axis (typically horizontal).
	 */
	spaceInline?: Space;
} & BlockProps;
