import { bindAll } from 'bind-event-listener';

import {
  AdapterAPI,
  CleanupFn,
  DragInterface,
  ExternalDragType,
  Serializable,
} from '../internal-types';
import { makeAdapter } from '../make-adapter/make-adapter';
import { combine } from '../util/combine';
import { isEnteringWindow } from '../util/entering-and-leaving-the-window';

type CrossWindowResult = 'moved' | 'none';

const storage = (() => {
  const dataKey: string = 'private-pdnd-data';
  const resultKey: string = 'private-pdnd-result';

  function tryParse(raw: string | null): Serializable | null {
    if (raw == null) {
      return null;
    }
    try {
      return JSON.parse(raw);
    } catch (e) {
      // failed to parse
      return null;
    }
  }

  function setData(data: Serializable) {
    // clearing a result when we set data
    clearStorage();
    localStorage.setItem(dataKey, JSON.stringify(data));
  }

  function findData(): Serializable | null {
    return tryParse(localStorage.getItem(dataKey));
  }

  function setResult(result: CrossWindowResult) {
    localStorage.setItem(resultKey, result);
  }
  function findResult(): CrossWindowResult | null {
    const raw = localStorage.getItem(resultKey);
    if (raw == null) {
      return null;
    }

    // TODO: improve type
    return raw as any;
  }

  function clearStorage() {
    localStorage.removeItem(dataKey);
    localStorage.removeItem(resultKey);
  }

  return {
    clearStorage,
    setData,
    findData,
    setResult,
    findResult,
  };
})();

type CrossWindowDragType = ExternalDragType<
  'experimental-cross-window-element',
  'move',
  {
    data: Serializable;
  }
>;

const adapter = makeAdapter<CrossWindowDragType>({
  typeKey: 'experimental-cross-window-element',
  defaultDropEffect: 'move',
  mount(api: AdapterAPI<CrossWindowDragType>): CleanupFn {
    return combine(
      bindAll(window, [
        {
          type: 'dragenter',
          listener(event: DragEvent) {
            if (!api.canStart(event)) {
              return;
            }

            // already cancelled by something else
            if (event.defaultPrevented) {
              return;
            }

            if (!isEnteringWindow({ dragEnter: event })) {
              return;
            }

            // we only care about when the window is being first entered
            if (event.relatedTarget != null) {
              return null;
            }

            const data: Serializable | null = storage.findData();

            if (data == null) {
              return;
            }

            const dragInterface: DragInterface<CrossWindowDragType> = {
              key: 'experimental-cross-window-element',
              startedFrom: 'external',
              payload: { data },
            };
            api.start({ event, dragInterface });
          },
        },
        // always clear a external drag result from another window before a drag starts
        {
          type: 'dragstart',
          listener: storage.clearStorage,
          options: { capture: true },
        },
      ]),
      adapter.monitor({
        onDrop(payload) {
          const result: CrossWindowResult =
            payload.location.current.dropTargets.length > 0 ? 'moved' : 'none';
          storage.setResult(result);
        },
      }),
    );
  },
});

export function setCrossWindowData({ data }: { data: Serializable }): void {
  storage.setData(data);
}

export function extractCrossWindowResult(): CrossWindowResult | null {
  return storage.findResult();
}

export const dropTargetForCrossWindowElements = (
  args: Parameters<typeof adapter.dropTarget>[0],
) => {
  return combine(
    // at least one drop target required before we will start listening for cross element dragging
    adapter.registerUsage(),
    adapter.dropTarget(args),
  );
};

export const monitorForCrossWindowElements = adapter.monitor;
