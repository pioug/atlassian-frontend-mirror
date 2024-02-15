import { MutableRefObject } from 'react';

import { IntlShape } from 'react-intl-next';

import {
  EditorState,
  Plugin,
  PluginKey,
} from '@atlaskit/editor-prosemirror/state';
import { Jast, JastBuilder } from '@atlaskit/jql-ast';

import { getNodeText } from '../../utils/document-text';

import JQLEditorErrorStrategy from './JQLEditorErrorStrategy';

const JQLAstPluginKey = new PluginKey<Jast>('jql-ast-plugin');

export const getJastFromState = (state: EditorState): Jast => {
  const jast = JQLAstPluginKey.getState(state);
  // This should never happen as the JQLAstPlugin will always be configured but we'll handle this case anyway to keep TS happy.
  if (jast == null) {
    // eslint-disable-next-line no-console
    console.error(
      'Unable to get state from the JQLAstPlugin as it has not been configured.',
    );
    return {
      query: undefined,
      represents: '',
      errors: [],
    };
  }

  return jast;
};

const jqlAstPlugin = (intlRef: MutableRefObject<IntlShape>) => {
  const jastBuilder = new JastBuilder().setErrorHandler(
    new JQLEditorErrorStrategy(intlRef),
  );

  return new Plugin<Jast>({
    key: JQLAstPluginKey,
    state: {
      init: (_, { doc }) => {
        return jastBuilder.build(getNodeText(doc, 0, doc.content.size));
      },
      // @ts-ignore
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
