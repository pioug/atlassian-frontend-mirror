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
	| 'imageGenerationMediaInsert';

export type AICreditCheck = { featureName: EditorAICreditFeatureName };
export type AICreditStatus =
	| { isBlocked: false }
	| { isBlocked: true; renderCustomContent: () => ReactNode };
/** Supply a synchronous cached decision. Promise typing remains temporarily for legacy consumers. */
export type GetAICreditStatus = (
	context: AICreditCheck,
) => AICreditStatus | Promise<AICreditStatus>;
