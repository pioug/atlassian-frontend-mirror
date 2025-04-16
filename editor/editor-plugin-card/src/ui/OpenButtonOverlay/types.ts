import { EditorAppearance } from '@atlaskit/editor-common/types';

export type OpenButtonOverlayProps = React.HTMLAttributes<HTMLSpanElement> & {
	isVisible?: boolean;
	url: string;
	editorAppearance?: EditorAppearance;
};
