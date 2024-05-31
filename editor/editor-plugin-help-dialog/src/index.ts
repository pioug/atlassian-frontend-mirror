export type { HelpDialogPlugin, HelpDialogSharedState } from './types';
export { helpDialogPlugin } from './plugin';
export {
	/**
	 * @deprecated DO NOT USE, it is only available to maintain an existing deprecated API
	 */
	openHelpCommand as deprecatedOpenHelpCommand,
} from './commands';
