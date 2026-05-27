import { fg } from '@atlaskit/platform-feature-flags';
import { expValEqualsNoExposure } from '@atlaskit/tmp-editor-statsig/exp-val-equals-no-exposure';

export const isMarkdownCompatibleToolbarEnabled = (): boolean =>
	expValEqualsNoExposure('cc-markdown-mode', 'isEnabled', true) &&
	fg('platform_editor_markdown_compatible_toolbar');
