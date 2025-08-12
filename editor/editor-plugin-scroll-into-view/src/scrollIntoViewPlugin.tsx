import { SafePlugin } from '@atlaskit/editor-common/safe-plugin';
import type { Transaction } from '@atlaskit/editor-prosemirror/state';
import { PluginKey } from '@atlaskit/editor-prosemirror/state';
import { ReplaceStep, ReplaceAroundStep } from '@atlaskit/editor-prosemirror/transform';
import { fg } from '@atlaskit/platform-feature-flags';
import { TEXT_INPUT_RULE_TRANSACTION_KEY } from '@atlaskit/prosemirror-input-rules';

import type { ScrollIntoViewPlugin } from './scrollIntoViewPluginType';

/**
 * Plugin to scroll the user's selection into view whenever the user updates
 * the document eg. inserting, deleting, formatting
 *
 * Behaviour is on by default, can be explicitly opted out of for a transaction by
 * setting scrollIntoView=false meta
 * We ignore collab transactions, appended transactions, transactions without steps,
 * transactions with addToHistory=false meta and typeahead trigger transactions
 */

export const scrollIntoViewPluginKey = new PluginKey('scrollIntoViewPlugin');

type TransactionWithScroll = Transaction & { scrolledIntoView: boolean };

/**
 * Determines if a transaction contains changes that should trigger scrolling into view.
 * This includes:
 * - Specific step types (Replace, ReplaceAround)
 */
const hasRelevantChanges = (tr: TransactionWithScroll) => {
	// Check if there are any steps that modified the document
	if (!tr.docChanged) {
		return false;
	}

	// Look for specific types of steps that should trigger scrolling
	const hasRelevantStep = tr.steps.some(
		(step) => step instanceof ReplaceStep || step instanceof ReplaceAroundStep,
	);

	return hasRelevantStep;
};

const createPlugin = () =>
	new SafePlugin({
		key: scrollIntoViewPluginKey,
		appendTransaction: (transactions, _oldState, newState) => {
			if (!transactions.length) {
				return;
			}

			const tr = transactions[0] as TransactionWithScroll;

			if (
				(hasRelevantChanges(tr) || tr.storedMarksSet) &&
				!tr.scrolledIntoView &&
				tr.getMeta('scrollIntoView') !== false &&
				// ignore anything we would not want to undo
				// this covers things like autofixing layouts, hovering table rows/cols
				tr.getMeta('addToHistory') !== false &&
				// ignore collab changes from another user
				!tr.getMeta('isRemote') &&
				// ignore any transaction coming from the input text rule plugin
				!tr.getMeta(TEXT_INPUT_RULE_TRANSACTION_KEY) &&
				// ignore appended transactions as they should be treated as side effects
				(!fg('platform_editor_skip_scroll_into_view_appended_tr') ||
					tr.getMeta('appendedTransaction') === undefined)
			) {
				return newState.tr.scrollIntoView();
			}
		},
	});

export const scrollIntoViewPlugin: ScrollIntoViewPlugin = () => ({
	name: 'scrollIntoView',
	pmPlugins() {
		return [{ name: 'scrollIntoView', plugin: () => createPlugin() }];
	},
});
