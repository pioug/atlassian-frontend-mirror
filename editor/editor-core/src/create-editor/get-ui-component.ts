import type { EditorAppearance } from '@atlaskit/editor-common/types';

import type { EditorAppearanceComponentProps } from '../types';
import Chromeless from '../ui/Appearance/Chromeless';
import { CommentEditorWithIntl as Comment } from '../ui/Appearance/Comment/Comment';
import { FullPageEditor as FullPage } from '../ui/Appearance/FullPage/FullPage';

type ReturnType = React.ComponentType<
	// Can't compute editor api at run time
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	React.PropsWithChildren<EditorAppearanceComponentProps<any[]>>
>;

export default function getUiComponent(appearance: EditorAppearance): ReturnType {
	appearance = appearance || 'comment';

	switch (appearance) {
		case 'full-page':
		case 'full-width':
		case 'max':
			return FullPage;
		case 'chromeless':
			return Chromeless;
		case 'comment':
			return Comment;
		default:
			throw new Error(`Appearance '${appearance}' is not supported by the editor.`);
	}
}
