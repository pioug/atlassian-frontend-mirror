import { type FunctionComponent } from 'react';

import { Fragment, Slice } from '@atlaskit/editor-prosemirror/model';
import { type EditorState, TextSelection } from '@atlaskit/editor-prosemirror/state';
import { type EditorView } from '@atlaskit/editor-prosemirror/view';
import { isListOperator } from '@atlaskit/jql-ast';

import { type PortalActions } from '../../ui/jql-editor-portal-provider/types';
import getDocumentPosition from '../common/get-document-position';
import { type PluginKeymap } from '../common/plugin-keymap';
import ReactPluginView from '../common/react-plugin-view';

import Autocomplete from './components/autocomplete';
import { type AutocompleteProps, type SelectableAutocompleteOption } from './components/types';
import { AUTOCOMPLETE_PLUGIN_NAME, JQLAutocompletePluginKey } from './constants';

/**
 * Returns whether an opening parenthesis should be automatically inserted for this option (e.g. after a list operator)
 */
const shouldInsertOpeningParenthesis = ({
	type,
	context,
	isListFunction,
}: SelectableAutocompleteOption) => {
	if (type === 'value' || type === 'function' || type === 'keyword') {
		const operator = context?.operator;
		if (operator && isListOperator(operator) && !context?.isList && !isListFunction) {
			return true;
		}
	}

	return false;
};

export default class AutocompletePluginView extends ReactPluginView<AutocompleteProps> {
	private readonly view: EditorView;
	private readonly keymap: PluginKeymap;
	private readonly enableRichInlineNodes: boolean;

	constructor(
		view: EditorView,
		keymap: PluginKeymap,
		portalActions: PortalActions,
		enableRichInlineNodes: boolean,
	) {
		super(portalActions, AUTOCOMPLETE_PLUGIN_NAME, 'main');
		this.view = view;
		this.keymap = keymap;
		this.enableRichInlineNodes = enableRichInlineNodes;
	}

	getComponent = (): FunctionComponent<AutocompleteProps> => {
		return Autocomplete;
	};

	getInitialComponentProps = (): AutocompleteProps => {
		return {
			keymap: this.keymap,
			onClick: this.onReplaceSuggestion,
		};
	};

	isSameState(state: EditorState, prevState: EditorState) {
		return prevState.doc.eq(state.doc) && prevState.selection.eq(state.selection);
	}

	onReplaceSuggestion = (option: SelectableAutocompleteOption) => {
		const [from, to] = option.replacePosition;

		const transaction = this.view.state.tr;

		transaction.setMeta(JQLAutocompletePluginKey, true);

		// Request query hydration if we are inserting a user node
		if (this.enableRichInlineNodes && option.type === 'value' && option.valueType === 'user') {
			transaction.setMeta('hydrate', true);
		}

		const documentFrom = getDocumentPosition(transaction.doc, from);
		const documentTo = getDocumentPosition(transaction.doc, to);

		// Change current selection to the mapped replace position
		transaction.setSelection(TextSelection.create(transaction.doc, documentTo, documentFrom));

		// Replace selected range with the selected autocomplete option
		transaction.replaceSelection(this.getSliceForSuggestion(option));

		this.view.focus();
		this.view.dispatch(transaction);
	};

	getSliceForSuggestion = (option: SelectableAutocompleteOption): Slice => {
		const { value, name, nameOnRichInlineNode, valueType, context } = option;

		const nodes = [];

		if (shouldInsertOpeningParenthesis(option)) {
			nodes.push(this.view.state.schema.text('('));
		}

		const textContent = this.view.state.schema.text(value);

		if (!this.enableRichInlineNodes) {
			nodes.push(textContent);
		} else {
			switch (valueType) {
				case 'user': {
					const attributes = {
						type: 'user',
						id: value,
						name: nameOnRichInlineNode ?? name,
						fieldName: context?.field,
					};
					nodes.push(this.view.state.schema.nodes.user.create(attributes, textContent));
					break;
				}
				default: {
					nodes.push(textContent);
					break;
				}
			}
		}

		return new Slice(Fragment.from(nodes), 0, 0);
	};
}
