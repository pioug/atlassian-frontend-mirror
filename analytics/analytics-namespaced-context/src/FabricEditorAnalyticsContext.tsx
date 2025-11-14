import { type FunctionComponent } from 'react';
import createNamespaceContext, { type Props } from './helper/createNamespaceContext';

export const EDITOR_CONTEXT = 'fabricEditorCtx';

export enum EDITOR_APPEARANCE_CONTEXT {
	FIXED_WIDTH = 'fixedWidth',
	FULL_WIDTH = 'fullWidth',
	COMMENT = 'comment',
	CHROMELESS = 'chromeless',
	MOBILE = 'mobile',
	MAX = 'max',
}

type FabricEditorAnalyticsContextProps = Props & {
	data: {
		appearance: EDITOR_APPEARANCE_CONTEXT | undefined;
		componentName: 'renderer' | 'editorCore';
		editorSessionId: string;
		packageName: string;
		packageVersion: string;
	};
};

export const FabricEditorAnalyticsContext: FunctionComponent<FabricEditorAnalyticsContextProps> =
	createNamespaceContext<FabricEditorAnalyticsContextProps>(
		EDITOR_CONTEXT,
		'FabricEditorAnalyticsContext',
	);
