import type { EditorView } from '@atlaskit/editor-prosemirror/view';

import type { EditorAnalyticsAPI } from '../../analytics';

export type HoverLinkOverlayProps = React.HTMLAttributes<HTMLSpanElement> & {
	isVisible?: boolean;
	url: string;
	editorAnalyticsApi?: EditorAnalyticsAPI;
	view?: EditorView;
	onClick?: (event: React.MouseEvent<HTMLAnchorElement>) => void;
	showPanelButton?: boolean;
	compactPadding?: boolean;
};
