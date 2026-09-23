import type { SelectionMarkerPluginOptions } from '@atlaskit/editor-plugin-selection-marker';

interface Props {
	options: {
		__livePage: boolean;
	};
}

export function selectionMarkerPluginOptions({ options }: Props): SelectionMarkerPluginOptions {
	// SECTION: From confluence/next/packages/editor-presets/src/full-page/createFullPageEditorPreset.ts `.add(['selectionMarkerPlugin', ...])`
	return {
		hideCursorOnInit: true,
	};
	// END SECTION
}
