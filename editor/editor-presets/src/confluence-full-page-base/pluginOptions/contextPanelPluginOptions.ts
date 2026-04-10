import type { ContextPanelPluginOptions } from '@atlaskit/editor-plugin-context-panel';
import { fg } from '@atlaskit/platform-feature-flags';

interface Props {
	options:
		| {
				objectSideBar: ContextPanelPluginOptions['objectSideBar'];
		  }
		| undefined;
}

export function contextPanelPluginOptions({
	options,
}: Props): ContextPanelPluginOptions | undefined {
	if (!options) {
		return undefined;
	}

	return (
		// SECTION: From confluence/next/packages/editor-presets/src/full-page/useFullPageEditorPreset.ts
		// If object-sidebar is not enabled, then we don't need to pass the contextPanelOptions
		// eslint-disable-next-line @atlaskit/platform/no-preconditioning
		fg('confluence_frontend_content_wrapper') && fg('platform_editor_ai_object_sidebar_injection')
			? {
					objectSideBar: options.objectSideBar,
				}
			: undefined
		// END SECTION
	);
}
