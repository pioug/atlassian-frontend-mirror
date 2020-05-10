import { Step } from 'prosemirror-transform';
import { findParentNode } from 'prosemirror-utils';
import { CellSelection } from 'prosemirror-tables';
import { EditorState, NodeSelection, Transaction } from 'prosemirror-state';
import { CreateUIAnalyticsEvent } from '@atlaskit/analytics-next';
import { InputRuleWithHandler } from '../../utils/input-rules';
import { GapCursorSelection, Side } from '../gap-cursor/selection';
import { AnalyticsStep } from './analytics-step';
import { editorAnalyticsChannel } from './consts';
import {
  AnalyticsEventPayloadWithChannel,
  AnalyticsEventPayload,
  ACTION,
  ACTION_SUBJECT,
} from './types';
import { SELECTION_TYPE, SELECTION_POSITION } from './types/utils';
import { analyticsPluginKey } from './plugin-key';
import { HigherOrderCommand } from '../../types/command';

function getAnalyticsState(
  editorState: EditorState,
): CreateUIAnalyticsEvent | null | undefined {
  const pluginState = analyticsPluginKey.getState(editorState);
  return pluginState
    ? (pluginState.createAnalyticsEvent as
        | CreateUIAnalyticsEvent
        | null
        | undefined)
    : undefined;
}

export function getStateContext(
  state: EditorState,
  payload: AnalyticsEventPayload,
): AnalyticsEventPayload {
  if (
    payload.action === ACTION.INSERTED &&
    payload.actionSubject === ACTION_SUBJECT.DOCUMENT &&
    payload.attributes
  ) {
    const { type, position } = getSelectionType(state);
    payload.attributes.selectionType = type;
    if (position) {
      payload.attributes.selectionPosition = position;
    }
    payload.attributes.insertLocation = findInsertLocation(state);
  }

  return payload;
}

export function getSelectionType(
  state: EditorState,
): { type: SELECTION_TYPE; position?: SELECTION_POSITION } {
  const { selection } = state;
  let type: SELECTION_TYPE;
  let position: SELECTION_POSITION | undefined;

  if (selection instanceof GapCursorSelection) {
    type = SELECTION_TYPE.GAP_CURSOR;
    position =
      selection.side === Side.LEFT
        ? SELECTION_POSITION.LEFT
        : SELECTION_POSITION.RIGHT;
  } else if (selection instanceof CellSelection) {
    type = SELECTION_TYPE.CELL;
  } else if (selection instanceof NodeSelection) {
    type = SELECTION_TYPE.NODE;
  } else if (selection.from !== selection.to) {
    type = SELECTION_TYPE.RANGED;
  } else {
    type = SELECTION_TYPE.CURSOR;
    const { from, $from } = selection;
    if (from === $from.start()) {
      position = SELECTION_POSITION.START;
    } else if (from === $from.end()) {
      position = SELECTION_POSITION.END;
    } else {
      position = SELECTION_POSITION.MIDDLE;
    }
  }

  return {
    type,
    position,
  };
}

export function findInsertLocation(state: EditorState): string {
  const { selection } = state;
  if (selection instanceof NodeSelection) {
    return selection.node.type.name;
  }

  if (selection instanceof CellSelection) {
    return state.schema.nodes.table.name;
  }

  // Text selection
  const parentNodeInfo = findParentNode(
    node => node.type !== state.schema.nodes.paragraph,
  )(state.selection);

  return parentNodeInfo ? parentNodeInfo.node.type.name : state.doc.type.name;
}

export function addAnalytics(
  state: EditorState,
  tr: Transaction,
  payload: AnalyticsEventPayload,
  channel: string = editorAnalyticsChannel,
): Transaction {
  const createAnalyticsEvent = getAnalyticsState(state);
  payload = getStateContext(state, payload);

  if (createAnalyticsEvent) {
    const { storedMarks } = tr;
    tr.step(
      new AnalyticsStep(
        createAnalyticsEvent,
        [
          {
            payload,
            channel,
          },
        ],
        tr.selection.$from.pos, // We need to create the step based on a position, this prevent split history for relative changes.
      ),
    );
    // When you add a new step all the storedMarks are removed it
    if (storedMarks) {
      tr.setStoredMarks(storedMarks);
    }
  }

  return tr;
}

export type AnalyticsEventPayloadCallback = (
  state: EditorState,
) => AnalyticsEventPayload | undefined;

export function withAnalytics(
  payload: AnalyticsEventPayload | AnalyticsEventPayloadCallback,
  channel?: string,
): HigherOrderCommand {
  return command => (state, dispatch, view) =>
    command(
      state,
      tr => {
        if (dispatch) {
          if (payload instanceof Function) {
            const dynamicPayload = payload(state);
            if (dynamicPayload) {
              dispatch(addAnalytics(state, tr, dynamicPayload, channel));
            }
          } else {
            dispatch(addAnalytics(state, tr, payload, channel));
          }
        }
      },
      view,
    );
}

export function ruleWithAnalytics(
  getPayload: (
    state: EditorState,
    match: string[],
    start: number,
    end: number,
  ) => AnalyticsEventPayload,
) {
  return (rule: InputRuleWithHandler) => {
    // Monkey patching handler to add analytics
    const handler = rule.handler;

    rule.handler = (
      state: EditorState,
      match,
      start,
      end,
    ): Transaction<any> | null => {
      let tr = handler(state, match, start, end);

      if (tr) {
        const payload = getPayload(state, match, start, end);
        tr = addAnalytics(state, tr, payload);
      }
      return tr;
    };
    return rule;
  };
}

export function getAnalyticsEventsFromTransaction(
  tr: Transaction,
): AnalyticsEventPayloadWithChannel[] {
  return (tr.steps as Step[])
    .filter<AnalyticsStep>(
      (step: Step): step is AnalyticsStep => step instanceof AnalyticsStep,
    )
    .reduce<AnalyticsEventPayloadWithChannel[]>(
      (acc, step) => [...acc, ...step.analyticsEvents],
      [],
    );
}
