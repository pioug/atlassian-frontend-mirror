import { Transaction, Selection } from 'prosemirror-state';
import { Decoration, DecorationSet } from 'prosemirror-view';
import { Step, ReplaceStep } from 'prosemirror-transform';

import {
  CollabParticipant,
  CollabEventConnectionData,
  CollabEventPresenceData,
  CollabEventTelepointerData,
} from './types';
import { Participants, ReadOnlyParticipants } from './participants';
import {
  findPointers,
  createTelepointers,
  getPositionOfTelepointer,
} from './utils';

const isReplaceStep = (step: Step) => step instanceof ReplaceStep;

export const TELEPOINTER_DIM_CLASS = 'telepointer-dim';

/**
 * Returns position where it's possible to place a decoration.
 */
const getValidPos = (tr: Transaction, pos: number) => {
  const resolvedPos = tr.doc.resolve(pos);
  const backwardSelection = Selection.findFrom(resolvedPos, -1, true);
  // if there's no correct cursor position before the `pos`, we try to find it after the `pos`
  const forwardSelection = Selection.findFrom(resolvedPos, 1, true);
  return backwardSelection
    ? backwardSelection.from
    : forwardSelection
    ? forwardSelection.from
    : pos;
};
export class PluginState {
  private decorationSet: DecorationSet;
  private participants: Participants;
  // eslint-disable-next-line no-console
  private onError = (error: Error) => console.error(error);
  private sid?: string;
  public isReady: boolean;

  get decorations() {
    return this.decorationSet;
  }

  get activeParticipants() {
    return this.participants as ReadOnlyParticipants;
  }

  get sessionId() {
    return this.sid;
  }

  constructor(
    decorations: DecorationSet,
    participants: Participants,
    sessionId?: string,
    collabInitalised: boolean = false,
    onError?: (err: Error) => void,
  ) {
    this.decorationSet = decorations;
    this.participants = participants;
    this.sid = sessionId;
    this.isReady = collabInitalised;
    this.onError = onError || this.onError;
  }

  getInitial(sessionId: string) {
    const participant = this.participants.get(sessionId);
    return participant ? participant.name.substring(0, 1).toUpperCase() : 'X';
  }

  apply(tr: Transaction) {
    let { participants, sid, isReady } = this;

    const presenceData = tr.getMeta('presence') as CollabEventPresenceData;
    const telepointerData = tr.getMeta(
      'telepointer',
    ) as CollabEventTelepointerData;
    const sessionIdData = tr.getMeta('sessionId') as CollabEventConnectionData;
    let collabInitialised = tr.getMeta('collabInitialised');

    if (typeof collabInitialised !== 'boolean') {
      collabInitialised = isReady;
    }

    if (sessionIdData) {
      sid = sessionIdData.sid;
    }

    let add: Decoration[] = [];
    let remove: Decoration[] = [];

    if (presenceData) {
      const {
        joined = [] as CollabParticipant[],
        left = [] as { sessionId: string }[],
      } = presenceData;

      participants = participants.remove(left.map((i) => i.sessionId));
      participants = participants.add(joined);

      // Remove telepointers for users that left
      left.forEach((i) => {
        const pointers = findPointers(i.sessionId, this.decorationSet);
        if (pointers) {
          remove = remove.concat(pointers);
        }
      });
    }

    if (telepointerData) {
      const { sessionId } = telepointerData;
      if (participants.get(sessionId) && sessionId !== sid) {
        const oldPointers = findPointers(
          telepointerData.sessionId,
          this.decorationSet,
        );

        if (oldPointers) {
          remove = remove.concat(oldPointers);
        }

        const { anchor, head } = telepointerData.selection;
        const rawFrom = anchor < head ? anchor : head;
        const rawTo = anchor >= head ? anchor : head;
        const isSelection = rawTo - rawFrom > 0;

        let from = 1;
        let to = 1;

        try {
          from = getValidPos(
            tr,
            isSelection ? Math.max(rawFrom - 1, 0) : rawFrom,
          );
          to = isSelection ? getValidPos(tr, rawTo) : from;
        } catch (err) {
          this.onError(err);
        }

        add = add.concat(
          createTelepointers(
            from,
            to,
            sessionId,
            isSelection,
            this.getInitial(sessionId),
          ),
        );
      }
    }

    if (tr.docChanged) {
      // Adjust decoration positions to changes made by the transaction
      try {
        this.decorationSet = this.decorationSet.map(tr.mapping, tr.doc, {
          // Reapplies decorators those got removed by the state change
          onRemove: (spec) => {
            if (spec.pointer && spec.pointer.sessionId) {
              const step = tr.steps.filter(isReplaceStep)[0];
              if (step) {
                const { sessionId } = spec.pointer;
                const {
                  slice: {
                    content: { size },
                  },
                  from,
                } = step as any;
                const pos = getValidPos(
                  tr,
                  size
                    ? Math.min(from + size, tr.doc.nodeSize - 3)
                    : Math.max(from, 1),
                );

                add = add.concat(
                  createTelepointers(
                    pos,
                    pos,
                    sessionId,
                    false,
                    this.getInitial(sessionId),
                  ),
                );
              }
            }
          },
        });
      } catch (err) {
        this.onError(err);
      }

      // Remove any selection decoration within the change range,
      // takes care of the issue when after pasting we end up with a dead selection
      tr.steps.filter(isReplaceStep).forEach((s) => {
        const { from, to } = s as any;
        this.decorationSet.find(from, to).forEach((deco: any) => {
          // `type` is private, `from` and `to` are public in latest version
          // `from` != `to` means it's a selection
          if (deco.from !== deco.to) {
            remove.push(deco);
          }
        });
      });
    }

    const { selection } = tr;
    this.decorationSet.find().forEach((deco: any) => {
      if (deco.type.toDOM) {
        const hasTelepointerDimClass = deco.type.toDOM.classList.contains(
          TELEPOINTER_DIM_CLASS,
        );

        if (deco.from === selection.from && deco.to === selection.to) {
          if (!hasTelepointerDimClass) {
            deco.type.toDOM.classList.add(TELEPOINTER_DIM_CLASS);
          }

          deco.type.side = -1;
        } else {
          if (hasTelepointerDimClass) {
            deco.type.toDOM.classList.remove(TELEPOINTER_DIM_CLASS);
          }
          deco.type.side = 0;
        }
      }
    });

    if (remove.length) {
      this.decorationSet = this.decorationSet.remove(remove);
    }

    if (add.length) {
      this.decorationSet = this.decorationSet.add(tr.doc, add);
    }

    // This piece needs to be after the decorationSet adjustments,
    // otherwise it's always one step behind where the cursor is
    if (telepointerData) {
      const { sessionId } = telepointerData;
      if (participants.get(sessionId)) {
        const positionForScroll = getPositionOfTelepointer(
          sessionId,
          this.decorationSet,
        );
        if (positionForScroll) {
          participants = participants.updateCursorPos(
            sessionId,
            positionForScroll,
          );
        }
      }
    }

    const nextState = new PluginState(
      this.decorationSet,
      participants,
      sid,
      collabInitialised,
    );

    return PluginState.eq(nextState, this) ? this : nextState;
  }

  static eq(a: PluginState, b: PluginState): boolean {
    return (
      a.participants === b.participants &&
      a.sessionId === b.sessionId &&
      a.isReady === b.isReady
    );
  }

  static init(config: any) {
    const { doc, onError } = config;
    return new PluginState(
      DecorationSet.create(doc, []),
      new Participants(),
      undefined,
      undefined,
      onError,
    );
  }
}
