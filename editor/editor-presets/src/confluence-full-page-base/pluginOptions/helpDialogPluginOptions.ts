import type { HelpDialogPluginOptions } from '@atlaskit/editor-plugin-help-dialog';
import { editorExperiment } from '@atlaskit/tmp-editor-statsig/experiments';

// Added aiEnabled to the options type to match the extended structure
interface Props {
	options:
		| {
				aiEnabled?: boolean;
				imageUploadProviderExists?: boolean;
		  }
		| never;
}

export function helpDialogPluginOptions({ options }: Props): HelpDialogPluginOptions {
	if (editorExperiment('platform_editor_ai_quickstart_command', true)) {
		return options;
	}
	return false;
}
