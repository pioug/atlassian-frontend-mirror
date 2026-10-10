import type {
	NextEditorPlugin,
	OptionalPlugin,
} from '@atlaskit/editor-common/types/next-editor-plugin';
import type {
	BrowserFreezetracking,
	InputTracking,
} from '@atlaskit/editor-common/types/performance-tracking';
import type { ContextIdentifierPlugin } from '@atlaskit/editor-plugin-context-identifier/contextIdentifierPluginType';
import type { FeatureFlagsPlugin } from '@atlaskit/editor-plugin-feature-flags/featureFlagsPluginType';
import type { Node as PMNode } from '@atlaskit/editor-prosemirror/model';
import type { Transaction } from '@atlaskit/editor-prosemirror/state';

import type { setKeyboardHeight } from './editor-commands/set-keyboard-height';
import type { ScrollGutterPluginOptions } from './pm-plugins/scroll-gutter/plugin';

export interface BasePluginOptions {
	allowInlineCursorTarget?: boolean;
	allowScrollGutter?: ScrollGutterPluginOptions;
	// eslint-disable-next-line @repo/internal/deprecations/deprecation-ticket-required -- Ignored via go/ED-25883
	/**
	 * @deprecated do not use
	 */
	browserFreezeTracking?: BrowserFreezetracking;
	// eslint-disable-next-line @repo/internal/deprecations/deprecation-ticket-required -- Ignored via go/ED-25883
	/**
	 * @deprecated do not use
	 */
	inputTracking?: InputTracking;
}

export type BasePluginState = {
	allowScrollGutter?: ScrollGutterPluginOptions;
	/** Current height of keyboard (+ custom toolbar) in iOS app */
	keyboardHeight: number | undefined;
};

export type BasePlugin = NextEditorPlugin<
	'base',
	{
		actions: {
			registerMarks: (callback: Callback) => void;
			resolveMarks: (from: number, to: number, tr: Transaction) => void;
			setKeyboardHeight: typeof setKeyboardHeight;
		};
		dependencies: [OptionalPlugin<FeatureFlagsPlugin>, OptionalPlugin<ContextIdentifierPlugin>];
		pluginConfiguration: BasePluginOptions | undefined;
		sharedState: BasePluginState;
	}
>;

export type Callback = ({
	node,
	tr,
	pos,
	from,
	to,
}: {
	from: number;
	node: PMNode;
	pos: number;
	to: number;
	tr: Transaction;
}) => void;
