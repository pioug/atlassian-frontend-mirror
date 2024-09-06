export type { HelpDialogPlugin, HelpDialogSharedState } from './types';
export { helpDialogPlugin } from './plugin';
// DO NOT COPY DISABLING THIS RULE. We are disabling it for a special existing case.
// This will be shortly removed. Reach out to #cc-editor-lego if you have issues.
// eslint-disable-next-line @atlaskit/editor/only-export-plugin
export {
	/**
	 * @deprecated DO NOT USE, it is only available to maintain an existing deprecated API
	 */
	openHelpCommand as deprecatedOpenHelpCommand,
} from './commands';
