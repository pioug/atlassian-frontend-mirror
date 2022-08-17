import {
  AllDragTypes,
  AllEvents,
  CleanupFn,
  EventPayloadMap,
} from '../internal-types';
import { combine } from '../util/combine';

type Keys<Obj extends Record<string, unknown>> = (keyof Obj)[];

function getKeys<Obj extends Record<string, unknown>>(obj: Obj): Keys<Obj> {
  return Object.keys(obj);
}

export function makeMonitor<DragType extends AllDragTypes>() {
  const registry: {
    [EventName in keyof AllEvents<DragType>]: Set<
      AllEvents<DragType>[EventName]
    >;
  } = {
    onGenerateDragPreview: new Set(),
    onDragStart: new Set(),
    onDropTargetChange: new Set(),
    onDrag: new Set(),
    onDrop: new Set(),
  };

  function monitorForConsumers(obj: Partial<AllEvents<DragType>>): CleanupFn {
    const cleanups = getKeys(obj).map(eventName => {
      // creating a unique reference for each function so that
      // any new calls to monitor will not override existing ones
      function listener(payload: EventPayloadMap<DragType>[typeof eventName]) {
        obj[eventName]?.(
          // I cannot seem to get the types right here.
          // TS doesn't seem to like that one event can need `nativeSetDragImage`
          // @ts-expect-error
          payload,
        );
      }

      registry[eventName].add(listener);

      return function cleanup() {
        registry[eventName].delete(listener);
      };
    });

    return combine(...cleanups);
  }

  function dispatchEvent<EventName extends keyof EventPayloadMap<DragType>>({
    eventName,
    payload,
  }: {
    eventName: EventName;
    payload: EventPayloadMap<DragType>[EventName];
  }) {
    // This line does not work in TS 4.2
    // It does work in TS 4.7
    // @ts-expect-error
    registry[eventName].forEach(listener => listener(payload));
  }

  return {
    dispatchEvent,
    monitorForConsumers,
  };
}
