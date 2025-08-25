import type { EditorView } from '@atlaskit/editor-prosemirror/view';

import type { EditorAnalyticsAPI } from '../../analytics';

export type HoverLinkOverlayProps = React.HTMLAttributes<HTMLSpanElement> & {
	compactPadding?: boolean;
	editorAnalyticsApi?: EditorAnalyticsAPI;
	isVisible?: boolean;
	onClick?: (event: React.MouseEvent<HTMLAnchorElement>) => void;
	showPanelButton?: boolean;
	showPanelButtonIcon?: 'panel' | 'modal';
	url: string;
	view?: EditorView;
};
