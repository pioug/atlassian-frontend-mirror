import { LinkMetaStep } from '@atlaskit/adf-schema/steps';
import { TableSortStep } from '@atlaskit/custom-steps';
import { ACTION } from '@atlaskit/editor-common/analytics';
import { getLinkMetadataFromTransaction } from '@atlaskit/editor-common/card';
import { isLinkMark, pmHistoryPluginKey } from '@atlaskit/editor-common/utils';
import type { Mark } from '@atlaskit/editor-prosemirror/model';
import type {
  EditorState,
  ReadonlyTransaction,
  Transaction,
} from '@atlaskit/editor-prosemirror/state';
import {
  AddMarkStep,
  RemoveMarkStep,
} from '@atlaskit/editor-prosemirror/transform';

import { pluginKey } from '../pm-plugins/plugin-key';
import { getPluginState } from '../pm-plugins/util/state';
import type { Queue, Resolve } from '../types';

import type { CardPluginEvent, Entity } from './types';
import { EVENT, EVENT_SUBJECT } from './types';
import {
  appearanceForLink,
  areSameNodes,
  findAtPositions,
  findInNodeRange,
  getNodeContext,
  getNodeSubject,
} from './utils';

/**
 * Find the links, smartLinks, datasources that were changed in a transaction
 */
export const findChanged = (
  tr: Transaction | ReadonlyTransaction,
  state: EditorState,
) => {
  const schema = tr.doc.type.schema;
  const removed: Entity[] = [];
  const inserted: Entity[] = [];
  /**
   * Ideally we have the "before" and "after" states of the "entity"
   * being updated, but if the update is via a "queue for upgrade"
   * then we no longer have access to the "before" state, because the "before"
   * state was replaced with a blue link to be upgraded
   */
  const updated: (
    | {
        removed: Entity;
        inserted: Entity;
      }
    | {
        inserted: Entity;
        previous: { display?: string };
      }
  )[] = [];

  const queuedForUpgrade = isTransactionQueuedForUpgrade(tr);
  const isResolveReplace = isTransactionResolveReplace(tr);

  // History
  const historyMeta: unknown = tr.getMeta(pmHistoryPluginKey);
  const isUndo = isHistoryMeta(historyMeta) && historyMeta.redo === false;
  const isRedo = isHistoryMeta(historyMeta) && historyMeta.redo === true;

  const isUpdate = isUpdateTr(tr, isUndo || isRedo);

  for (let i = 0; i < tr.steps.length; i++) {
    const step = tr.steps[i];
    const stepMap = step.getMap();
    const removedInStep: Entity[] = [];
    const insertedInStep: Entity[] = [];
    const before = tr.docs[i] ?? tr.before;
    const after = tr.docs[i + 1] ?? tr.doc;

    /**
     * AddMarkStep and RemoveMarkSteps don't produce stepMap ranges
     * because there are no "changed tokens" only marks added/removed
     * So have to check these manually
     */
    if (step instanceof AddMarkStep) {
      const addMarkStep = step as AddMarkStep & {
        from: number;
        mark: Mark;
      };
      if (isLinkMark(addMarkStep.mark, schema)) {
        const node = after.nodeAt(addMarkStep.from);

        if (node) {
          /**
           * For url text pasted on plain text
           */
          insertedInStep.push({
            pos: addMarkStep.from,
            node,
            nodeContext: getNodeContext(after, addMarkStep.from),
          });
        }
      }
    }

    if (step instanceof RemoveMarkStep) {
      const removeMarkStep = step as RemoveMarkStep & {
        from: number;
        mark: Mark;
      };

      if (isLinkMark(removeMarkStep.mark, schema)) {
        const node = before.nodeAt(removeMarkStep.from);

        if (node) {
          removedInStep.push({
            pos: removeMarkStep.from,
            node,
            nodeContext: getNodeContext(before, removeMarkStep.from),
          });
        }
      }
    }

    stepMap.forEach((oldStart, oldEnd, newStart, newEnd) => {
      const before = tr.docs[i];
      const after = tr.docs[i + 1] ?? tr.doc;
      const removedInRange: Entity[] = [];
      const insertedInRange: Entity[] = [];

      // Removed
      removedInRange.push(
        ...findInNodeRange(
          before,
          oldStart,
          oldEnd,
          node => !!getNodeSubject(node),
        ),
      );
      // Inserted
      insertedInRange.push(
        ...findInNodeRange(
          after,
          newStart,
          newEnd,
          node => !!getNodeSubject(node),
        ),
      );

      removedInStep.push(...removedInRange);
      insertedInStep.push(...insertedInRange);
    });

    const omitRequestsForUpgrade = (links: Entity[]) => {
      if (!queuedForUpgrade) {
        return links;
      }
      /**
       * Skip/filter out links that have been queued, they will be tracked later
       */
      const queuedPositions = getQueuedPositions(tr);
      return links.filter(link => !queuedPositions.includes(link.pos));
    };

    /**
     * Skip "deletions" when the transaction is relating to
     * replacing links queued for upgrade to cards,
     * because the "deleted" link has not actually been
     * tracked as "created" yet
     */
    if (!isResolveReplace) {
      removed.push(...removedInStep);
    }
    inserted.push(...omitRequestsForUpgrade(insertedInStep));
  }

  /**
   * If there are no links changed but the transaction is a "resolve" action
   * Then this means we have resolved a link but it has failed to upgrade
   * We should track all resolved links as now being created
   */
  if (inserted.length === 0 && isResolveReplace) {
    const positions = getResolvePositions(tr, state);
    inserted.push(...findAtPositions(tr, positions));
  }

  if (!isUpdate) {
    const { inputMethod } = getLinkMetadataFromTransaction(tr);

    /**
     * If there is no identifiable input method, and the links inserted and removed appear to be the same,
     * then this transaction likely is not intended to be considered to be the insertion and removal of links
     */
    if (!inputMethod && areSameNodes(removed, inserted)) {
      return {
        removed: [],
        inserted: [],
        updated,
      };
    }

    return {
      removed,
      inserted,
      updated,
    };
  }

  const updateInserted = [];
  const updateRemoved = [];
  for (let i = 0; i < inserted.length; i++) {
    if (isResolveReplace) {
      const newLink = inserted[i];

      // what is the 2nd argument 'assoc = -1' doing here exactly?
      const mappedPos = tr.mapping.map(newLink.pos, -1);
      const previousDisplay = getResolveLinkPrevDisplay(state, mappedPos);

      updated.push({
        inserted: inserted[i],
        previous: {
          display: previousDisplay,
        },
      });

      continue;
    }

    if (inserted.length === removed.length) {
      const previousSubject = getNodeSubject(removed[i].node);
      const currentSubject = getNodeSubject(inserted[i].node);

      if (
        isDatasourceUpgrade(previousSubject, currentSubject) ||
        isDatasourceDowngrade(previousSubject, currentSubject)
      ) {
        updateInserted.push(inserted[i]);
        updateRemoved.push(removed[i]);
      } else {
        updated.push({
          removed: removed[i],
          inserted: inserted[i],
        });
      }
    }
  }

  return {
    inserted: updateInserted,
    removed: updateRemoved,
    updated,
  };
};

/**
 * List of actions to be considered link "updates"
 */
const UPDATE_ACTIONS: string[] = [ACTION.CHANGED_TYPE, ACTION.UPDATED];

/**
 * Returns true if the transaction has LinkMetaSteps that indicate the transaction is
 * intended to be perceived as an update to links, rather than insertion+deletion
 */
const isUpdateTr = (
  tr: Transaction | ReadonlyTransaction,
  isUndoOrRedo: boolean,
) => {
  return !!tr.steps.find(step => {
    if (!(step instanceof LinkMetaStep)) {
      return false;
    }

    const { action, cardAction } = step.getMetadata();

    /**
     * Undo of a resolve step should be considered an update
     * because the user is choosing to update the url back to the un-upgraded display
     */
    if (cardAction === 'RESOLVE' && isUndoOrRedo) {
      return true;
    }

    if (!action) {
      return false;
    }

    return UPDATE_ACTIONS.includes(action);
  });
};

const hasType = (pluginMeta: unknown): pluginMeta is { type: unknown } => {
  return (
    typeof pluginMeta === 'object' &&
    pluginMeta !== null &&
    'type' in pluginMeta
  );
};

const isTransactionQueuedForUpgrade = (
  tr: Transaction | ReadonlyTransaction,
) => {
  const pluginMeta = tr.getMeta(pluginKey);

  return isMetadataQueue(pluginMeta);
};

const isMetadataQueue = (metaData: unknown): metaData is Queue => {
  return hasType(metaData) && metaData.type === 'QUEUE';
};

const isTransactionResolveReplace = (tr: Transaction | ReadonlyTransaction) => {
  const pluginMeta = tr.getMeta(pluginKey);

  return isMetadataResolve(pluginMeta);
};

const isMetadataResolve = (metaData: unknown): metaData is Resolve => {
  return hasType(metaData) && metaData.type === 'RESOLVE';
};

const isHistoryMeta = (meta: unknown): meta is { redo: unknown } => {
  return typeof meta === 'object' && meta !== null && 'redo' in meta;
};

const getQueuedPositions = (tr: Transaction | ReadonlyTransaction) => {
  const pluginMeta: unknown = tr.getMeta(pluginKey);

  if (!isMetadataQueue(pluginMeta)) {
    return [];
  }

  return pluginMeta.requests.map(({ pos }) => pos);
};

const getResolvePositions = (
  tr: Transaction | ReadonlyTransaction,
  state: EditorState,
) => {
  const cardState = getPluginState(state);
  if (!cardState) {
    return [];
  }

  const pluginMeta: unknown = tr.getMeta(pluginKey);

  if (!isMetadataResolve(pluginMeta)) {
    return [];
  }

  return cardState.requests
    .filter(request => request.url === pluginMeta.url)
    .map(request => request.pos);
};

const getResolveLinkPrevDisplay = (state: EditorState, pos: number) => {
  const cardState = getPluginState(state);
  if (!cardState) {
    return undefined;
  }

  return cardState.requests.find(request => request.pos === pos)
    ?.previousAppearance;
};

const isDatasourceDowngrade = (
  previousSubject: EVENT_SUBJECT | null,
  currentSubject: EVENT_SUBJECT | null,
) =>
  previousSubject === EVENT_SUBJECT.DATASOURCE &&
  currentSubject === EVENT_SUBJECT.LINK;

const isDatasourceUpgrade = (
  previousSubject: EVENT_SUBJECT | null,
  currentSubject: EVENT_SUBJECT | null,
) =>
  previousSubject === EVENT_SUBJECT.LINK &&
  currentSubject === EVENT_SUBJECT.DATASOURCE;

export function eventsFromTransaction(
  tr: ReadonlyTransaction,
  state: EditorState,
): CardPluginEvent[] {
  const events: CardPluginEvent[] = [];
  try {
    /**
     * Skip transactions sent by collab (identified by 'isRemote' key)
     * Skip entire document replace steps
     * We are only concerned with transactions performed on the document directly by the user
     */
    const isRemote: unknown = tr.getMeta('isRemote');
    const isReplaceDocument: unknown = tr.getMeta('replaceDocument');
    const isTableSort = tr.steps.find(step => step instanceof TableSortStep);

    if (isRemote || isReplaceDocument || isTableSort) {
      return events;
    }

    const historyMeta: unknown = tr.getMeta(pmHistoryPluginKey);
    const isUndo = isHistoryMeta(historyMeta) && historyMeta.redo === false;
    const isRedo = isHistoryMeta(historyMeta) && historyMeta.redo === true;

    /**
     * Retrieve metadata from the LinkMetaStep(s) in the transaction
     */
    const { action, inputMethod, sourceEvent } =
      getLinkMetadataFromTransaction(tr);

    const { removed, inserted, updated } = findChanged(tr, state);

    const MAX_LINK_EVENTS = 50;
    if (
      [removed, inserted, updated].some(arr => arr.length > MAX_LINK_EVENTS)
    ) {
      return [];
    }

    for (let i = 0; i < updated.length; i++) {
      const update = updated[i];
      const { inserted } = update;
      const { node, nodeContext } = inserted;
      const subject = getNodeSubject(node);

      /**
       * Not great, wish we had the previous node but we never stored it
       */
      const previousDisplay =
        'removed' in update
          ? appearanceForLink(update.removed.node)
          : update.previous.display ?? 'unknown';

      if (subject) {
        events.push({
          event: EVENT.UPDATED,
          subject,
          data: {
            node,
            nodeContext,
            action,
            inputMethod,
            sourceEvent,
            isUndo,
            isRedo,
            previousDisplay,
          },
        });
      }
    }

    const pushEvents = (
      entities: Entity[],
      event: EVENT.CREATED | EVENT.DELETED,
    ) => {
      for (let i = 0; i < entities.length; i++) {
        const { node, nodeContext } = entities[i];
        const subject = getNodeSubject(node);

        if (subject) {
          events.push({
            event,
            subject,
            data: {
              node,
              nodeContext,
              action,
              inputMethod,
              sourceEvent,
              isUndo,
              isRedo,
            },
          });
        }
      }
    };

    pushEvents(removed, EVENT.DELETED);
    pushEvents(inserted, EVENT.CREATED);

    return events;
  } catch (err: unknown) {
    return events;
  }
}
