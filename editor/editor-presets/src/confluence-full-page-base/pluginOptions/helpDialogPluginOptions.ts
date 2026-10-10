import type { HelpDialogPluginOptions } from '@atlaskit/editor-plugin-help-dialog/helpDialogPluginType';

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
	return options;
}
