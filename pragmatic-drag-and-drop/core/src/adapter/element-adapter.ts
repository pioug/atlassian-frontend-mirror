import { bind } from 'bind-event-listener';

import {
  AdapterAPI,
  AllEvents,
  BaseEventPayload,
  CleanupFn,
  DragInterface,
  DropTargetEventPayloadMap,
  EventPayloadMap,
  Input,
  InternalDragType,
  MonitorCanMonitorArgs,
} from '../internal-types';
import { makeAdapter } from '../make-adapter/make-adapter';
import { addAttribute } from '../util/add-attribute';
import { combine } from '../util/combine';
import { getInput } from '../util/get-input';

type ElementDragType = InternalDragType<
  'element',
  'move',
  {
    element: HTMLElement;
    dragHandle: Element | null;
    data: Record<string, unknown>;
  }
>;

type GetFeedbackArgs = {
  /**
   * The user input as a drag is trying to start (the `initial` input)
   */
  input: Input;
  /**
   * The `draggable` element
   */
  element: HTMLElement;
  /**
   * The `dragHandle` element for the `draggable`
   */
  dragHandle: Element | null;
};

type DraggableArgs = {
  /** The `HTMLElement` that you want to attach draggable behaviour to.
   * `element` is our unique _key_ for a draggable.
   * `element` is a `HTMLElement` as only a `HTMLElement`
   * can have a "draggable" attribute
   */
  element: HTMLElement;
  /** The part of a draggable `element` that you want to use to control the dragging of the whole `element` */
  dragHandle?: Element;
  /** Conditionally allow a drag to occur */
  canDrag?: (args: GetFeedbackArgs) => boolean;
  /** Used to attach data to a drag operation. Called once just before the drag starts */
  getInitialData?: (args: GetFeedbackArgs) => Record<string, unknown>;
} & Partial<AllEvents<ElementDragType>>;

const draggableRegistry = new WeakMap<HTMLElement, DraggableArgs>();

function addToRegistry(args: DraggableArgs): CleanupFn {
  draggableRegistry.set(args.element, args);

  return function cleanup() {
    draggableRegistry.delete(args.element);
  };
}

const adapter = makeAdapter<ElementDragType>({
  typeKey: 'element',
  defaultDropEffect: 'move',
  mount(api: AdapterAPI<ElementDragType>): CleanupFn {
    return bind(window, {
      type: 'dragstart',
      listener(event: DragEvent) {
        if (!api.canStart(event)) {
          return;
        }
        // the closest parent that is a draggable element will be marked as
        // the `event.target` for the event
        const target: EventTarget | null = event.target;

        // this source is only for elements
        // Note: only HTMLElements can have the "draggable" attribute
        if (!(target instanceof HTMLElement)) {
          return null;
        }

        // see if the thing being dragged is owned by us
        const entry: DraggableArgs | undefined = draggableRegistry.get(target);

        // no matching element found
        // → dragging an element with `draggable="true"` that is not controlled by us
        if (!entry) {
          return null;
        }

        const input: Input = getInput(event);

        const feedback: GetFeedbackArgs = {
          element: entry.element,
          dragHandle: entry.dragHandle ?? null,
          input,
        };

        // Check: does the draggable want to allow dragging?
        if (entry.canDrag && !entry.canDrag(feedback)) {
          // cancel drag operation if we cannot drag
          event.preventDefault();
          return null;
        }

        // Check: is there a drag handle and is the user using it?
        if (entry.dragHandle) {
          const over = document.elementFromPoint(input.clientX, input.clientY);

          // if we are not dragging from the drag handle (or something inside the drag handle)
          // then we will cancel the active drag
          if (!entry.dragHandle.contains(over)) {
            event.preventDefault();
            return null;
          }
        }

        // Must set any media type for iOS15 to work
        // Doing this will fail in firefox though, so we
        // wrap the operation in a try/catch
        try {
          event.dataTransfer?.setData('application/vnd.pdnd', '');
        } catch (e) {}

        const payload: ElementDragType['payload'] = {
          element: entry.element,
          dragHandle: entry.dragHandle ?? null,
          data: entry.getInitialData?.(feedback) ?? {},
        };

        const makeDragType: DragInterface<ElementDragType> = {
          key: 'element',
          startedFrom: 'internal',
          payload,
        };
        api.start({ event, dragInterface: makeDragType });
      },
    });
  },
  dispatchEventToSource: <
    EventName extends keyof EventPayloadMap<ElementDragType>,
  >({
    eventName,
    payload,
  }: {
    eventName: EventName;
    payload: EventPayloadMap<ElementDragType>[EventName];
  }) => {
    // During a drag operation, a draggable can be:
    // - remounted with different functions
    // - removed completely
    // So we need to get the latest entry from the registry in order
    // to call the latest event functions

    draggableRegistry.get(payload.source.element)?.[eventName]?.(
      // I cannot seem to get the types right here.
      // TS doesn't seem to like that one event can need `nativeSetDragImage`
      // @ts-expect-error
      payload,
    );
  },
});

export const dropTargetForElements = adapter.dropTarget;
export const monitorForElements = adapter.monitor;

export function draggable(args: DraggableArgs): CleanupFn {
  // Guardrail: warn if the drag handle is not contained in draggable element
  if (process.env.NODE_ENV !== 'production') {
    if (args.dragHandle && !args.element.contains(args.dragHandle)) {
      // eslint-disable-next-line no-console
      console.warn(
        'Drag handle element must be contained in draggable element',
        { element: args.element, dragHandle: args.dragHandle },
      );
    }
  }
  // Guardrail: warn if the draggable element is already registered
  if (process.env.NODE_ENV !== 'production') {
    const existing = draggableRegistry.get(args.element);
    if (existing) {
      // eslint-disable-next-line no-console
      console.warn(
        'You have already registered a `draggable` on the same element',
        { existing, proposed: args },
      );
    }
  }

  return combine(
    // making the draggable register the adapter rather than drop targets
    // this is because you *must* have a draggable element to start a drag
    // but you _might_ not have any drop targets immediately
    // (You might create drop targets async)
    adapter.registerUsage(),
    addToRegistry(args),
    addAttribute(args.element, { attribute: 'draggable', value: 'true' }),
  );
}

export type ElementEventBasePayload = BaseEventPayload<ElementDragType>;
export type ElementEventPayloadMap = EventPayloadMap<ElementDragType>;

export type ElementDropTargetEventPayloadMap =
  DropTargetEventPayloadMap<ElementDragType>;
export type ElementMonitorCanMonitorArgs =
  MonitorCanMonitorArgs<ElementDragType>;
