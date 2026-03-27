import { fg } from '@atlaskit/platform-feature-flags';

import { editorUGCTokens, editorUGCTokensRefreshed } from './editor-ugc-token-names';
import type { EditorUGCTokens } from './editor-ugc-token-names';

function editorUGCToken<T extends keyof EditorUGCTokens>(path: T): EditorUGCTokens[T] {
	let tokens;
	if (fg('platform_editor_typography_ugc')) {
		tokens = editorUGCTokensRefreshed;
	} else {
		tokens = editorUGCTokens;
	}
	return tokens[path];
}

export default editorUGCToken;
