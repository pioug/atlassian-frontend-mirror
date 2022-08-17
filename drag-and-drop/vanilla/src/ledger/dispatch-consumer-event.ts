import rafSchd from 'raf-schd';

import {
  AllDragTypes,
  DragLocationHistory,
  EventPayloadMap,
} from '../internal-types';

const scheduleOnDrag = rafSchd((fn: () => void) => fn());

const dragStart = (() => {
  let scheduled: { frameId: number; fn: () => void } | null = null;

  function schedule(fn: () => void) {
    const frameId = requestAnimationFrame(() => {
      scheduled = null;
      fn();
    });
    scheduled = {
      frameId: frameId,
      fn,
    };
  }
  function flush() {
    if (scheduled) {
      cancelAnimationFrame(scheduled.frameId);
      scheduled.fn();
      scheduled = null;
    }
  }

  return { schedule, flush };
})();

export function makeDispatch<DragType extends AllDragTypes>({
  source,
  dispatchEvent,
}: {
  source: DragType['payload'];
  dispatchEvent: <EventName extends keyof EventPayloadMap<DragType>>(args: {
    eventName: EventName;
    payload: EventPayloadMap<DragType>[EventName];
  }) => void;
}) {
  const dispatch = {
    start({
      location,
      nativeSetDragImage,
    }: {
      location: DragLocationHistory;
      nativeSetDragImage: DataTransfer['setDragImage'] | null;
    }) {
      dispatchEvent({
        eventName: 'onGenerateDragPreview',
        payload: {
          source,
          location,
          nativeSetDragImage,
        },
      });
      dragStart.schedule(() => {
        dispatchEvent({
          eventName: 'onDragStart',
          payload: {
            source,
            location,
          },
        });
      });
    },
    dragUpdate({ location }: { location: DragLocationHistory }) {
      dragStart.flush();
      scheduleOnDrag.cancel();
      dispatchEvent({
        eventName: 'onDropTargetChange',
        payload: {
          source,
          location,
        },
      });
    },
    drag({ location }: { location: DragLocationHistory }) {
      scheduleOnDrag(() => {
        dragStart.flush();
        dispatchEvent({
          eventName: 'onDrag',
          payload: {
            source,
            location,
          },
        });
      });
    },
    drop({
      location,
      updatedExternalPayload: updatedSourcePayload,
    }: {
      location: DragLocationHistory;
      /** When dragging from an external source, we need to collect the
          drag source information again as it is often only available during
          the "drop" event */
      updatedExternalPayload: DragType['payload'] | null;
    }) {
      dragStart.flush();
      scheduleOnDrag.cancel();
      dispatchEvent({
        eventName: 'onDrop',
        payload: {
          source: updatedSourcePayload ?? source,
          location,
        },
      });
    },
  };
  return dispatch;
}
