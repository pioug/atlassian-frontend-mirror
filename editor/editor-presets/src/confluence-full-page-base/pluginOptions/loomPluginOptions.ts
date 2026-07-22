import type { LoomPluginOptions, RenderButton } from '@atlaskit/editor-plugin-loom';

interface Props {
	options: {
		renderButton: RenderButton;
	};
}

export function loomPluginOptions({ options }: Props): LoomPluginOptions {
	return {
		// SECTION: From confluence/next/packages/loom-editor-utils/src/hooks/useLoomPluginOptions.tsx
		renderButton: options.renderButton,
		shouldShowToolbarButton: false,
		// END SECTION
	};
}
