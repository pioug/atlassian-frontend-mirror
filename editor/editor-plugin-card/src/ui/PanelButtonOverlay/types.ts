import type { EditorAppearance } from '@atlaskit/editor-common/types';

export type PanelButtonOverlayProps = React.HTMLAttributes<HTMLSpanElement> & {
	isVisible?: boolean;
	editorAppearance?: EditorAppearance;
	onClick?: () => void;
};
