import type { EditorAppearance, EditorAppearanceComponentProps } from '../types';
import Chromeless from '../ui/Appearance/Chromeless';
import Comment from '../ui/Appearance/Comment';
import FullPage from '../ui/Appearance/FullPage';

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
			return FullPage;
		case 'chromeless':
			return Chromeless;
		case 'comment':
			return Comment;
		default:
			throw new Error(`Appearance '${appearance}' is not supported by the editor.`);
	}
}
