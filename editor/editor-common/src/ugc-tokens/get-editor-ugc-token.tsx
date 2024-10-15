import {
	type EditorUGCTokens,
	editorUGCTokens,
	editorUGCTokensModernized,
	editorUGCTokensRefreshed,
} from './editor-ugc-token-names';

function editorUGCToken<T extends keyof EditorUGCTokens>(
	path: T,
	typographyTheme:
		| 'typography'
		| 'typography-adg3'
		| 'typography-modernized'
		| 'typography-refreshed'
		| undefined,
) {
	let token: string;

	switch (typographyTheme) {
		case 'typography-modernized':
			token = editorUGCTokensModernized[path];
			break;
		case 'typography-refreshed':
			token = editorUGCTokensRefreshed[path];
			break;
		default:
			token = editorUGCTokens[path];
			break;
	}

	return token;
}

export default editorUGCToken;
