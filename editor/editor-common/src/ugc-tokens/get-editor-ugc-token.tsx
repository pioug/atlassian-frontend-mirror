import { fg } from '@atlaskit/platform-feature-flags';

import {
	type EditorUGCTokens,
	editorUGCTokens,
	editorUGCTokensModernized,
	editorUGCTokensRefreshed,
} from './editor-ugc-token-names';

function editorUGCToken<T extends keyof EditorUGCTokens>(path: T) {
	let tokens;
	if (fg('platform_editor_typography_ugc')) {
		// eslint-disable-next-line @atlaskit/platform/ensure-feature-flag-prefix
		if (
			fg('platform-dst-jira-web-fonts') ||
			fg('confluence_typography_refreshed') ||
			fg('atlas_editor_typography_refreshed')
		) {
			tokens = editorUGCTokensRefreshed;
		} else {
			tokens = editorUGCTokensModernized;
		}
	} else {
		tokens = editorUGCTokens;
	}
	return tokens[path];
}

export default editorUGCToken;
