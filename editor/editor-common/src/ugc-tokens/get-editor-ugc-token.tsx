import { editorUGCTokensRefreshed } from './editor-ugc-token-names';
import type { EditorUGCTokens } from './editor-ugc-token-names';

function editorUGCToken<T extends keyof EditorUGCTokens>(path: T): EditorUGCTokens[T] {
	return editorUGCTokensRefreshed[path];
}

export default editorUGCToken;
