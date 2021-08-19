import {
  ExtensionAPI,
  TransformBefore,
  TransformAfter,
} from '@atlaskit/editor-common/extensions';
import { ADFEntity } from '@atlaskit/adf-utils';
import { Node as PMNode, NodeType, Fragment, Mark } from 'prosemirror-model';
import type { EditorView } from 'prosemirror-view';
import {
  insertMacroFromMacroBrowser,
  MacroProvider,
  MacroState,
} from '../macro';
import { pluginKey as macroPluginKey } from '../macro/plugin-key';
import { setEditingContextToContextPanel } from './commands';
import { findNodePosWithLocalId, getSelectedExtension } from './utils';
import {
  addAnalytics,
  ACTION,
  ACTION_SUBJECT,
  ACTION_SUBJECT_ID,
  EVENT_TYPE,
  INPUT_METHOD,
  AnalyticsEventPayload,
} from '../analytics';
import { getNodeTypesReferenced, getDataConsumerMark } from './utils';
import { setTextSelection } from 'prosemirror-utils';

interface EditInLegacyMacroBrowserArgs {
  view: EditorView;
  macroProvider?: MacroProvider;
}
export const getEditInLegacyMacroBrowser = ({
  view,
  macroProvider,
}: EditInLegacyMacroBrowserArgs) => {
  return () => {
    if (!view) {
      throw new Error(`Missing view. Can't update without EditorView`);
    }
    if (!macroProvider) {
      throw new Error(
        `Missing macroProvider. Can't use the macro browser for updates`,
      );
    }

    const nodeWithPos = getSelectedExtension(view.state, true);

    if (!nodeWithPos) {
      throw new Error(`Missing nodeWithPos. Can't determine position of node`);
    }

    insertMacroFromMacroBrowser(macroProvider, nodeWithPos.node, true)(view);
  };
};

interface CreateExtensionAPIOptions {
  editorView: EditorView;
  editInLegacyMacroBrowser?: () => void;
}

const extensionAPICallPayload = (
  functionName: string,
): AnalyticsEventPayload => ({
  action: ACTION.INVOKED,
  actionSubject: ACTION_SUBJECT.EXTENSION,
  actionSubjectId: ACTION_SUBJECT_ID.EXTENSION_API,
  attributes: {
    functionName,
  },
  eventType: EVENT_TYPE.TRACK,
});

export const createExtensionAPI = (
  options: CreateExtensionAPIOptions,
): ExtensionAPI => {
  const doc = {
    insertAfter: (localId: string, adf: ADFEntity) => {
      const { editorView } = options;
      const { dispatch } = editorView;

      // Be extra cautious since 3rd party devs can use regular JS without type safety
      if (typeof localId !== 'string' || localId === '') {
        throw new Error(`insertAfter(): Invalid localId '${localId}'.`);
      }
      if (typeof adf !== 'object' || Array.isArray(adf)) {
        throw new Error(`insertAfter(): Invalid ADF given.`);
      }

      // Find the node + position matching the given ID
      const { state } = editorView;
      const nodePos = findNodePosWithLocalId(state, localId);

      if (!nodePos) {
        throw new Error(
          `insertAfter(): Could not find node with ID '${localId}'.`,
        );
      }

      // Validate the given ADF
      const { tr, schema } = state;
      const nodeType: NodeType | undefined = schema.nodes[adf.type];

      if (!nodeType) {
        throw new Error(`insertAfter(): Invalid ADF type '${adf.type}'.`);
      }

      const fragment = Fragment.fromJSON(schema, adf.content);
      const marks = (adf.marks || []).map((markEntity) =>
        Mark.fromJSON(schema, markEntity),
      );
      const newNode = nodeType?.createChecked(adf.attrs, fragment, marks);

      if (!newNode) {
        throw new Error(
          'insertAfter(): Could not create a node for given ADFEntity.',
        );
      }

      tr.insert(nodePos.pos + nodePos.node.nodeSize, newNode);

      // Validate if the document is valid at this point
      try {
        tr.doc.check();
      } catch (err) {
        throw new Error(
          `insertAfter(): The given ADFEntity cannot be inserted in the current position.\n${err}`,
        );
      }

      // Analytics - tracking the api call
      const apiCallPayload: AnalyticsEventPayload = extensionAPICallPayload(
        'insertAfter',
      );
      addAnalytics(state, tr, apiCallPayload);

      // Analytics - tracking node types added
      const nodesAdded: PMNode[] = [newNode];

      newNode.descendants((node: PMNode) => {
        nodesAdded.push(node);
        return true;
      });

      nodesAdded.forEach((node) => {
        const { extensionKey, extensionType } = node.attrs;
        const dataConsumerMark = getDataConsumerMark(node);
        const stringIds: string[] =
          dataConsumerMark?.attrs.sources.map((sourceId: string) => sourceId) ||
          [];

        const hasReferentiality = !!dataConsumerMark;
        const nodeTypesReferenced = hasReferentiality
          ? getNodeTypesReferenced(stringIds, state)
          : undefined;

        // fire off analytics for this ADF
        const payload: AnalyticsEventPayload = {
          action: ACTION.INSERTED,
          actionSubject: ACTION_SUBJECT.DOCUMENT,
          attributes: {
            nodeType: node.type.name,
            inputMethod: INPUT_METHOD.EXTENSION_API,
            hasReferentiality,
            nodeTypesReferenced,
            layout: node.attrs.layout,
            extensionType,
            extensionKey,
          },
          eventType: EVENT_TYPE.TRACK,
        };

        addAnalytics(state, tr, payload);
      });
      dispatch(tr);
    },
    scrollTo: (localId: string) => {
      const { editorView } = options;
      const { dispatch } = editorView;

      // Be extra cautious since 3rd party devs can use regular JS without type safety
      if (typeof localId !== 'string' || localId === '') {
        throw new Error(`scrollTo(): Invalid localId '${localId}'.`);
      }

      // Find the node + position matching the given ID
      const { state } = editorView;
      const nodePos = findNodePosWithLocalId(state, localId);

      if (!nodePos) {
        throw new Error(
          `scrollTo(): Could not find node with ID '${localId}'.`,
        );
      }

      // Analytics - tracking the api call
      const apiCallPayload: AnalyticsEventPayload = extensionAPICallPayload(
        'scrollTo',
      );

      let { tr } = state;
      tr = addAnalytics(state, tr, apiCallPayload);
      tr = setTextSelection(nodePos.pos)(tr);
      tr = tr.scrollIntoView();
      dispatch(tr);
    },
  };

  return {
    editInContextPanel: (
      transformBefore: TransformBefore,
      transformAfter: TransformAfter,
    ) => {
      const { editorView } = options;

      setEditingContextToContextPanel(transformBefore, transformAfter)(
        editorView.state,
        editorView.dispatch,
        editorView,
      );
    },

    _editInLegacyMacroBrowser: () => {
      const { editorView } = options;
      let editInLegacy = options.editInLegacyMacroBrowser;

      if (!editInLegacy) {
        const macroState: MacroState = macroPluginKey.getState(
          editorView.state,
        );

        editInLegacy = getEditInLegacyMacroBrowser({
          view: options.editorView,
          macroProvider: macroState?.macroProvider || undefined,
        });
      }

      editInLegacy();
    },

    doc,
  };
};
