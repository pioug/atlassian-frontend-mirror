import { type MutableRefObject } from 'react';

import { type IntlShape } from 'react-intl';

import { Plugin, PluginKey } from '@atlaskit/editor-prosemirror/state';
import { type Jast, JastBuilder } from '@atlaskit/jql-ast';

import { getNodeText } from '../../utils/document-text/getNodeText';
import JQLEditorErrorStrategy from './JQLEditorErrorStrategy';

export const JQLAstPluginKey: any = new PluginKey<Jast>('jql-ast-plugin');

const jqlAstPlugin = (intlRef: MutableRefObject<IntlShape>): Plugin<Jast> => {
	const jastBuilder = new JastBuilder().setErrorHandler(new JQLEditorErrorStrategy(intlRef));

	return new Plugin<Jast>({
		key: JQLAstPluginKey,
		state: {
			init: (_, { doc }) => {
				return jastBuilder.build(getNodeText(doc, 0, doc.content.size));
			},
			apply: (tr, value, oldState): Jast => {
				const text = getNodeText(tr.doc, 0, tr.doc.content.size);
				const oldText = getNodeText(oldState.doc, 0, oldState.doc.content.size);
				// Only update the AST if textContent has changed
				return text !== oldText ? jastBuilder.build(text) : value;
			},
		},
	});
};

export default jqlAstPlugin;
