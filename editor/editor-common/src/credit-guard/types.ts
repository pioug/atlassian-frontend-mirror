import type { ReactNode } from 'react';

export type EditorAICreditFeatureName =
	| 'blockMenu-askRovo'
	| 'selectionToolbar-askRovo'
	| 'selectionToolbar-remix'
	| 'commentEditor-askRovo'
	| 'quickInsert-askRovo'
	| 'elementBrowser-askRovo'
	| 'panelFloatingToolbar-remix'
	| 'primaryToolbar-write'
	| 'mediaFloatingToolbar-editImage'
	| 'tableFloatingToolbar-remix'
	| 'smartLinkFloatingToolbar-askRovo'
	| 'codeBlockFloatingToolbar-remix'
	| 'imageGenerationMediaInsert'
	| 'blockControls-remix';

export type AICreditCheck = { featureName: EditorAICreditFeatureName };
export type AICreditStatus =
	| { isBlocked: false }
	| { isBlocked: true; renderCustomContent: () => ReactNode };
/** Supply a synchronous cached decision. Promise typing remains temporarily for legacy consumers. */
export type GetAICreditStatus = (
	context: AICreditCheck,
) => AICreditStatus | Promise<AICreditStatus>;

/** Product-owned credit decisions, optionally invalidated without rebuilding an Editor preset. */
export type EditorAICreditStatusProvider = {
	/**
	 * Supply a synchronous cached product decision. The entry point identifies the requested
	 * feature; products own rollout policy, analytics attribution, and blocked content.
	 * Unavailable or legacy Promise decisions fail open. Omit to preserve existing behavior.
	 */
	getAICreditStatus?: GetAICreditStatus;
	/**
	 * Optional notification that cached decisions changed. Consumers synchronously re-read
	 * getAICreditStatus. Products own the subscription and return an unsubscribe function.
	 * Omit for action-time checks that need no live updates.
	 */
	subscribeToAICreditStatus?: (onChange: () => void) => () => void;
};
