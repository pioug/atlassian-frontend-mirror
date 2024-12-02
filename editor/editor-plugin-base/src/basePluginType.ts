import type {
	BrowserFreezetracking,
	InputTracking,
	NextEditorPlugin,
	OptionalPlugin,
} from '@atlaskit/editor-common/types';
import type { ContextIdentifierPlugin } from '@atlaskit/editor-plugin-context-identifier';
import type { FeatureFlagsPlugin } from '@atlaskit/editor-plugin-feature-flags';

import { type setKeyboardHeight } from './editor-commands/set-keyboard-height';
import type { ScrollGutterPluginOptions } from './pm-plugins/scroll-gutter/plugin';

export interface BasePluginOptions {
	allowScrollGutter?: ScrollGutterPluginOptions;
	allowInlineCursorTarget?: boolean;
	/**
	 * @deprecated do not use
	 */
	inputTracking?: InputTracking;
	/**
	 * @deprecated do not use
	 */
	browserFreezeTracking?: BrowserFreezetracking;
}

export type BasePluginState = {
	/** Current height of keyboard (+ custom toolbar) in iOS app */
	keyboardHeight: number | undefined;
};

export type BasePlugin = NextEditorPlugin<
	'base',
	{
		pluginConfiguration: BasePluginOptions | undefined;
		dependencies: [OptionalPlugin<FeatureFlagsPlugin>, OptionalPlugin<ContextIdentifierPlugin>];
		sharedState: BasePluginState;
		actions: {
			setKeyboardHeight: typeof setKeyboardHeight;
		};
	}
>;
