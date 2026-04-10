import type { LoomPluginOptions, RenderButton } from '@atlaskit/editor-plugin-loom';
import { fg } from '@atlaskit/platform-feature-flags';

interface Props {
	options: {
		renderButton: RenderButton;
	};
}

export function loomPluginOptions({ options }: Props): LoomPluginOptions {
	return {
		// SECTION: From confluence/next/packages/loom-editor-utils/src/hooks/useLoomPluginOptions.tsx
		renderButton: options.renderButton,
		shouldShowToolbarButton: fg('confluence_frontend_content_wrapper') ? false : undefined,
		// END SECTION
	};
}
