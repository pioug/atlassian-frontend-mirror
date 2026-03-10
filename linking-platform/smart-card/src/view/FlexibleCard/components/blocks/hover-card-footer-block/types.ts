import type { ActionName } from '../../../../../constants';
import { type BlockProps } from '../types';

export type ResolvedHoverCardFooterBlockProps = {
	/**
	 * Allows hiding of the resources provider
	 */
	hideProvider?: boolean;
	/**
	 * Called when a footer action is clicked. Actions are derived from context (CopyLink, Preview, Automation).
	 */
	onActionClick?: (actionId: string | ActionName) => void;
} & BlockProps;
