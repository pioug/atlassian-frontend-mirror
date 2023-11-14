import type {
  ExtensionAPI,
  TransformBefore,
  TransformAfter,
} from '@atlaskit/editor-common/extensions';
import { validator } from '@atlaskit/adf-utils/validator';
import { JSONTransformer } from '@atlaskit/editor-json-transformer';
import type { ADFEntity, ADFEntityMark } from '@atlaskit/adf-utils/types';
import type {
  Node as PMNode,
  NodeType,
  Schema as PMSchema,
} from '@atlaskit/editor-prosemirror/model';
import { Fragment, Mark } from '@atlaskit/editor-prosemirror/model';
import type { EditorView } from '@atlaskit/editor-prosemirror/view';
import { NodeSelection, Selection } from '@atlaskit/editor-prosemirror/state';
import type { MacroProvider } from '@atlaskit/editor-common/provider-factory';
import { insertMacroFromMacroBrowser } from './pm-plugins/macro/actions';
import { pluginKey as macroPluginKey } from './pm-plugins/macro/plugin-key';
import { nodeToJSON } from '@atlaskit/editor-common/utils';

import { setEditingContextToContextPanel } from './commands';
import {
  findNodePosWithLocalId,
  getDataConsumerMark,
  getNodeTypesReferenced,
  getSelectedExtension,
} from './utils';
import type {
  AnalyticsEventPayload,
  EditorAnalyticsAPI,
} from '@atlaskit/editor-common/analytics';
import {
  ACTION,
  ACTION_SUBJECT,
  ACTION_SUBJECT_ID,
  EVENT_TYPE,
  INPUT_METHOD,
} from '@atlaskit/editor-common/analytics';
import type { NodeWithPos } from '@atlaskit/editor-prosemirror/utils';
import { setTextSelection } from '@atlaskit/editor-prosemirror/utils';
import type { ApplyChangeHandler } from '@atlaskit/editor-plugin-context-panel';
import type { CreateExtensionAPI } from '@atlaskit/editor-plugin-extension';

interface EditInLegacyMacroBrowserArgs {
  view: EditorView;
  editorAnalyticsAPI: EditorAnalyticsAPI | undefined;
  macroProvider?: MacroProvider;
}
export const getEditInLegacyMacroBrowser = ({
  view,
  macroProvider,
  editorAnalyticsAPI,
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

    insertMacroFromMacroBrowser(editorAnalyticsAPI)(
      macroProvider,
      nodeWithPos.node,
      true,
    )(view);
  };
};

interface CreateExtensionAPIOptions {
  editorView: EditorView;
  applyChange: ApplyChangeHandler | undefined;
  editorAnalyticsAPI: EditorAnalyticsAPI | undefined;
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

export const createExtensionAPI: CreateExtensionAPI = (
  options: CreateExtensionAPIOptions,
) => {
  const {
    editorView: {
      state: { schema },
    },
    editorAnalyticsAPI,
  } = options;
  const nodes = Object.keys(schema.nodes);
  const marks = Object.keys(schema.marks);
  const validate = validator(nodes, marks, { allowPrivateAttributes: true });

  /**
   * Finds the node and its position by `localId`. Throws if the node could not be found.
   *
   * @returns {NodeWithPos}
   */
  const ensureNodePosByLocalId = (
    localId: string,
    { opName }: { opName: string },
  ): NodeWithPos => {
    // Be extra cautious since 3rd party devs can use regular JS without type safety
    if (typeof localId !== 'string' || localId === '') {
      throw new Error(`${opName}(): Invalid localId '${localId}'.`);
    }

    // Find the node + position matching the given ID
    const {
      editorView: { state },
    } = options;
    const nodePos = findNodePosWithLocalId(state, localId);

    if (!nodePos) {
      throw new Error(`${opName}(): Could not find node with ID '${localId}'.`);
    }

    return nodePos;
  };

  const doc: ExtensionAPI['doc'] = {
    insertAfter: (
      localId: string,
      adf: ADFEntity,
      opt?: { allowSelectionToNewNode?: boolean },
    ) => {
      try {
        validate(adf);
      } catch (e) {
        throw new Error(`insertAfter(): Invalid ADF given.`);
      }

      const nodePos = ensureNodePosByLocalId(localId, {
        opName: 'insertAfter',
      });

      const { editorView } = options;
      const { dispatch, state } = editorView;

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

      const insertPosition = nodePos.pos + nodePos.node.nodeSize;
      tr.insert(insertPosition, newNode);

      // Validate if the document is valid at this point
      try {
        tr.doc.check();
      } catch (err) {
        throw new Error(
          `insertAfter(): The given ADFEntity cannot be inserted in the current position.\n${err}`,
        );
      }

      // Analytics - tracking the api call
      const apiCallPayload: AnalyticsEventPayload =
        extensionAPICallPayload('insertAfter');
      editorAnalyticsAPI?.attachAnalyticsEvent(apiCallPayload)(tr);

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

        editorAnalyticsAPI?.attachAnalyticsEvent(payload)(tr);
      });
      if (opt && opt.allowSelectionToNewNode) {
        tr.setSelection(new NodeSelection(tr.doc.resolve(insertPosition)));
      }
      dispatch(tr);
    },
    scrollTo: (localId: string) => {
      const nodePos = ensureNodePosByLocalId(localId, { opName: 'scrollTo' });

      // Analytics - tracking the api call
      const apiCallPayload: AnalyticsEventPayload =
        extensionAPICallPayload('scrollTo');

      const {
        editorView: { dispatch, state },
      } = options;
      let { tr } = state;
      editorAnalyticsAPI?.attachAnalyticsEvent(apiCallPayload)(tr);
      tr = setTextSelection(nodePos.pos)(tr);
      tr = tr.scrollIntoView();
      dispatch(tr);
    },
    update: (localId, mutationCallback) => {
      const { node, pos } = ensureNodePosByLocalId(localId, {
        opName: 'update',
      });

      const {
        editorView: { dispatch, state },
      } = options;
      const { tr, schema } = state;

      const changedValues = mutationCallback({
        content: nodeToJSON(node).content,
        attrs: node.attrs,
        marks: node.marks.map((pmMark) => ({
          type: pmMark.type.name,
          attrs: pmMark.attrs,
        })),
      });

      const ensureValidMark = (mark: ADFEntityMark) => {
        if (typeof mark !== 'object' || Array.isArray(mark)) {
          throw new Error(`update(): Invalid mark given.`);
        }
        const { parent } = state.doc.resolve(pos);
        // Ensure that the given mark is present in the schema
        const markType = (schema as PMSchema).marks[mark.type];

        if (!markType) {
          throw new Error(`update(): Invalid ADF mark type '${mark.type}'.`);
        }
        if (!parent.type.allowsMarkType(markType)) {
          throw new Error(
            `update(): Parent of type '${parent.type.name}' does not allow marks of type '${mark.type}'.`,
          );
        }

        return { mark: markType, attrs: mark.attrs };
      };

      const newMarks = changedValues.hasOwnProperty('marks')
        ? changedValues.marks
            ?.map(ensureValidMark)
            .map(({ mark, attrs }) => mark.create(attrs))
        : node.marks;
      const newContent = changedValues.hasOwnProperty('content')
        ? Fragment.fromJSON(schema, changedValues.content)
        : node.content;
      const newAttrs = changedValues.hasOwnProperty('attrs')
        ? changedValues.attrs
        : node.attrs;

      // Validate if the new attributes, content and marks result in a valid node and adf.
      try {
        const newNode = node.type.createChecked(newAttrs, newContent, newMarks);
        const newNodeAdf = new JSONTransformer().encodeNode(newNode);
        validate(newNodeAdf);

        tr.replaceWith(pos, pos + node.nodeSize, newNode);

        // Keep selection if content does not change
        if (newContent === node.content) {
          tr.setSelection(Selection.fromJSON(tr.doc, state.selection.toJSON()));
        }
      } catch (err) {
        throw new Error(
          `update(): The given ADFEntity cannot be inserted in the current position.\n${err}`,
        );
      }

      // Analytics - tracking the api call
      const apiCallPayload: AnalyticsEventPayload =
        extensionAPICallPayload('update');
      editorAnalyticsAPI?.attachAnalyticsEvent(apiCallPayload)(tr);

      dispatch(tr);
    },
  };

  return {
    editInContextPanel: (
      transformBefore: TransformBefore,
      transformAfter: TransformAfter,
    ) => {
      const { editorView } = options;

      setEditingContextToContextPanel(
        transformBefore,
        transformAfter,
        options.applyChange,
      )(editorView.state, editorView.dispatch, editorView);
    },

    _editInLegacyMacroBrowser: () => {
      const { editorView } = options;
      let editInLegacy = options.editInLegacyMacroBrowser;

      if (!editInLegacy) {
        const macroState = macroPluginKey.getState(editorView.state);

        editInLegacy = getEditInLegacyMacroBrowser({
          view: options.editorView,
          macroProvider: macroState?.macroProvider || undefined,
          editorAnalyticsAPI,
        });
      }

      editInLegacy();
    },

    doc,
  };
};
