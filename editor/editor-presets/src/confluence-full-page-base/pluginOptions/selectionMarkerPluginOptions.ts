import type { SelectionMarkerPluginOptions } from '@atlaskit/editor-plugin-selection-marker';
import { expValEquals } from '@atlaskit/tmp-editor-statsig/exp-val-equals';

interface Props {
	options: {
		__livePage: boolean;
	};
}

export function selectionMarkerPluginOptions({ options }: Props): SelectionMarkerPluginOptions {
	// SECTION: From confluence/next/packages/editor-presets/src/full-page/createFullPageEditorPreset.ts `.add(['selectionMarkerPlugin', ...])`
	return {
		hideCursorOnInit:
			options.__livePage ||
			expValEquals('platform_editor_no_cursor_on_edit_page_init', 'isEnabled', true),
	};
	// END SECTION
}
