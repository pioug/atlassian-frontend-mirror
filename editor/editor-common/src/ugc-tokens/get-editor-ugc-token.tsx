import { fg } from '@atlaskit/platform-feature-flags';

import {
	type EditorUGCTokens,
	editorUGCTokens,
	editorUGCTokensRefreshed,
} from './editor-ugc-token-names';

function editorUGCToken<T extends keyof EditorUGCTokens>(path: T) {
	let tokens;
	if (fg('platform_editor_typography_ugc')) {
		tokens = editorUGCTokensRefreshed;
	} else {
		tokens = editorUGCTokens;
	}
	return tokens[path];
}

export default editorUGCToken;
