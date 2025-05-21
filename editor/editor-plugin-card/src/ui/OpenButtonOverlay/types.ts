import type { EditorAnalyticsAPI } from '@atlaskit/editor-common/analytics';
import type { EditorAppearance } from '@atlaskit/editor-common/types';
import type { EditorView } from '@atlaskit/editor-prosemirror/view';

export type OpenButtonOverlayProps = React.HTMLAttributes<HTMLSpanElement> & {
	isVisible?: boolean;
	url: string;
	editorAppearance?: EditorAppearance;
	editorAnalyticsApi?: EditorAnalyticsAPI;
	view?: EditorView;
};
