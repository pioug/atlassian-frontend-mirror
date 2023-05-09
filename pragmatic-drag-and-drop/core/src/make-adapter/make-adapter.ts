import {
  AdapterAPI,
  AllDragTypes,
  CleanupFn,
  DragInterface,
  EventPayloadMap,
} from '../internal-types';
import { lifecycle } from '../ledger/lifecycle-manager';
import { register } from '../ledger/usage-ledger';

import { makeDropTarget } from './make-drop-target';
import { makeMonitor } from './make-monitor';

export function makeAdapter<DragType extends AllDragTypes>({
  typeKey,
  mount,
  dispatchEventToSource,
  defaultDropEffect,
}: {
  typeKey: DragType['key'];
  mount: (api: AdapterAPI<DragType>) => CleanupFn;
  defaultDropEffect: DragType['defaultDropEffect'];
  dispatchEventToSource?: <
    EventName extends keyof EventPayloadMap<DragType>,
  >(args: {
    eventName: EventName;
    payload: EventPayloadMap<DragType>[EventName];
  }) => void;
}) {
  const monitorAPI = makeMonitor<DragType>();
  const dropTargetAPI = makeDropTarget({
    typeKey,
    defaultDropEffect: defaultDropEffect,
  });

  function dispatchEvent<
    EventName extends keyof EventPayloadMap<DragType>,
  >(args: {
    eventName: EventName;
    payload: EventPayloadMap<DragType>[EventName];
  }) {
    // 1. forward the event to source
    dispatchEventToSource?.(args);

    // 2. forward the event to relevant dropTargets
    dropTargetAPI.dispatchEvent(args);

    // 3. forward event to monitors
    monitorAPI.dispatchEvent(args);
  }

  function start({
    event,
    dragInterface,
  }: {
    event: DragEvent;
    dragInterface: DragInterface<DragType>;
  }) {
    lifecycle.start({
      event,
      dragInterface,
      getDropTargetsOver: dropTargetAPI.getIsOver,
      dispatchEvent,
    });
  }

  function registerUsage(): CleanupFn {
    function mountAdapter(): CleanupFn {
      const api: AdapterAPI<DragType> = {
        canStart: lifecycle.canStart,
        start,
      };
      return mount(api);
    }

    return register({ typeKey, mount: mountAdapter });
  }

  return {
    registerUsage,
    dropTarget: dropTargetAPI.dropTargetForConsumers,
    monitor: monitorAPI.monitorForConsumers,
  };
}
