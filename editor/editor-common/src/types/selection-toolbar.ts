import type { IntlShape } from 'react-intl-next';

import type { EditorState } from '@atlaskit/editor-prosemirror/state';

import type { ProviderFactory } from '../provider-factory';

import type { Command } from './command';
import type { FloatingToolbarItem } from './floating-toolbar';
export type SelectionToolbarGroup = {
	/**
	 * by default these will be added in the order the plugin adds them
	 * To override this a rank can be provided
	 */
	rank?: number;
	items: Array<FloatingToolbarItem<Command>>;
};
/**
 * The selection toolbar is a floating toolbar that is displayed for
 * range selections when any plugins return a selection toolbar group with
 * items.
 */
export type SelectionToolbarHandler = (
	state: EditorState,
	intl: IntlShape,
	providerFactory: ProviderFactory,
) => SelectionToolbarGroup | undefined;
