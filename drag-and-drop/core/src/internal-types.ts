export type CleanupFn = () => void;

/**
 * Information about a drop target
 */
export type DropTargetRecord = {
  /**
   * The element the drop target is attached to
   */
  element: Element;
  // using 'symbol' allows us to create uniquely typed keys / values
  /**
   * Data associated with the drop target
   *
   * (Collected by `getData()`)
   */
  data: Record<string | symbol, unknown>;
  /**
   * The drop effect for the drop target
   *
   * (Collected by `getDropEffect()`)
   */
  dropEffect: DataTransfer['dropEffect'];
  /**
   * Whether or not the drop target is sticky
   *
   * (Collected by `getIsSticky()`)
   */
  sticky: boolean;
};

export type Position = { x: number; y: number };

export type Serializable = {
  [key: string]: number | string | Serializable | Serializable[];
};

export type InternalDragType<
  Key extends string,
  DefaultDropEffect extends DataTransfer['dropEffect'],
  Payload extends Record<string, unknown>
> = {
  key: Key;
  defaultDropEffect: DefaultDropEffect;
  startedFrom: 'internal';
  payload: Payload;
};

export type ExternalDragType<
  Key extends string,
  DefaultDropEffect extends DataTransfer['dropEffect'],
  Payload extends Record<string, unknown>
> = {
  key: Key;
  startedFrom: 'external';
  defaultDropEffect: DefaultDropEffect;
  payload: Payload;
};

export type DragInterface<
  DragType extends AllDragTypes
> = DragType extends ExternalDragType<
  string,
  DataTransfer['dropEffect'],
  Record<string, unknown>
>
  ? // External drag types might need to refresh their source
    // during the `"drop"` event
    // `event.dataTransfer?.items` is only available in `"drop"`
    Omit<DragType, 'defaultDropEffect'> & {
      getDropPayload?: (event: DragEvent) => DragType['payload'];
    }
  : Omit<DragType, 'defaultDropEffect'>;

export type AllDragTypes =
  | InternalDragType<
      string,
      DataTransfer['dropEffect'],
      Record<string, unknown>
    >
  | ExternalDragType<
      string,
      DataTransfer['dropEffect'],
      Record<string, unknown>
    >;

export type SourceCanStartArgs = {
  event: DragEvent;
  input: Input;
};

export type AdapterAPI<DragType extends AllDragTypes> = {
  canStart: (event: DragEvent) => boolean;
  start: (args: {
    event: DragEvent;
    dragInterface: DragInterface<DragType>;
  }) => void;
};

export type Input = {
  altKey: boolean;
  button: number;
  buttons: number;
  ctrlKey: boolean;
  metaKey: boolean;
  shiftKey: boolean;

  // coordinates
  clientX: number;
  clientY: number;
  pageX: number;
  pageY: number;
};

export type DragLocation = {
  input: Input;
  dropTargets: DropTargetRecord[];
};

export type DragLocationHistory = {
  /**
   * Where the drag operation started
   */
  initial: DragLocation;
  /**
   * Where the user currently is
   */
  current: DragLocation;
  /**
   * Where the user was previously.
   *
   * `previous` is particularly useful for `onDropTargetChange`
   * (and the derived `onDragEnter` and `onDragLeave`)
   * as you can know what the delta of the change
   */
  previous: Pick<DragLocation, 'dropTargets'>;
};

/**
 * The common data that is provided to all events
 */
export type BaseEventPayload<DragType extends AllDragTypes> = {
  /**
   * Location history for the drag operation
   */
  location: DragLocationHistory;
  /**
   * Data associated with the entity that is being dragged
   */
  source: DragType['payload'];
};

export type EventPayloadMap<DragType extends AllDragTypes> = {
  /**
   * Drag is about to start.
   * Make changes you want to see in the drag preview
   *
   * _Drag previews are not generated for external drag sources (eg files)_
   */
  onGenerateDragPreview: BaseEventPayload<DragType> & {
    /**
     * Allows you to use the native `setDragImage` function if you want
     * Although, we recommend using alternative techniques (see element adapter docs)
     */
    nativeSetDragImage: DataTransfer['setDragImage'] | null;
  };
  /**
   * A drag operation has started. You can make changes to the DOM and those changes won't be reflected in your _drag preview_
   */
  onDragStart: BaseEventPayload<DragType>;
  /**
   * A throttled update of where the the user is currently dragging. Useful if you want to create a high fidelity experience such as drawing.
   */
  onDrag: BaseEventPayload<DragType>;
  /**
   * The `onDropTargetChange` event fires when the `dropTarget` hierarchy changes during a drag.
   */
  onDropTargetChange: BaseEventPayload<DragType>;
  /**
   * The `onDrop` event occurs when a user has finished a drag and drop operation.
   * The `onDrop` event will fire when the drag operation finishes, regardless of how the drag operation finished
   * (eg due to an explicit drop, the drag being canceled, recovering from an error and so on). On the web platform
   * we cannot distinguish between dropping on no drop targets and an explicit cancel, so we do not publish any
   * information about _how_ the drag ended, only that it ended.
   *
   * The `location.current` property will accurately contain the final drop targets.
   */
  onDrop: BaseEventPayload<DragType>;
};

export type AllEvents<DragType extends AllDragTypes> = {
  [EventName in keyof EventPayloadMap<DragType>]: (
    args: EventPayloadMap<DragType>[EventName],
  ) => void;
};

export type MonitorCanMonitorArgs<DragType extends AllDragTypes> = {
  /**
   * The users `initial` drag location
   */
  initial: DragLocation;
  /**
   * The data associated with the entity being dragged
   */
  source: DragType['payload'];
};

export type MonitorArgs<DragType extends AllDragTypes> = Partial<
  AllEvents<DragType>
> & {
  canMonitor?: (args: MonitorCanMonitorArgs<DragType>) => boolean;
};

export type DropTargetGetFeedbackArgs<DragType extends AllDragTypes> = {
  /**
   * The users _current_ input
   */
  input: Input;
  /**
   * The data associated with the entity being dragged
   */
  source: DragType['payload'];
  /**
   * This drop target's element
   */
  element: Element;
};

export type DropTargetLocalizedData = {
  /**
   * A convenance pointer to this drop targets values
   */
  self: DropTargetRecord;
};

/**
 * Mapping event names to the payloads for those events
 */
export type DropTargetEventPayloadMap<DragType extends AllDragTypes> = {
  [EventName in keyof EventPayloadMap<DragType>]: EventPayloadMap<
    DragType
  >[EventName] &
    DropTargetLocalizedData;
} & {
  /**
   * Derived from the `onDropTargetChange` event
   * (`onDragEnter` is not it's own event that bubbles)
   *
   * `onDragEnter` is fired when _this_ drop target is entered into
   * and not when any child drop targets change
   */
  onDragEnter: EventPayloadMap<DragType>['onDropTargetChange'] &
    DropTargetLocalizedData;
  /**
   * Derived from the `onDropTargetChange` event
   * (`onDragLeave` is not it's own event that bubbles)
   *
   * `onDragLeave` is fired when _this_ drop target is exited from
   * and not when any child drop targets change
   */
  onDragLeave: EventPayloadMap<DragType>['onDropTargetChange'] &
    DropTargetLocalizedData;
};

export type DropTargetArgs<DragType extends AllDragTypes> = {
  /**
   * The `element` that you want to attach drop target behaviour to.
   * The `element` is the unique _key_ for a drop target
   */
  element: Element;
  /**
   * A function that returns `data` you want to attach to the drop target.
   * `getData()` is called _repeatedly_ while the user is dragging over the drop target in order to power addons
   */
  getData?: (
    args: DropTargetGetFeedbackArgs<DragType>,
  ) => Record<string | symbol, unknown>;
  /**
   * Used to conditionally block dropping.
   * By default a drop target can be dropped on.
   *
   * Return `false` if you want to block a drop.
   *
   * `canDrop()` is called _repeatedly_ while a drop target
   * is being dragged over to allow you to dynamically
   * change your mind as to whether a drop target can be
   * dropped on.
   */
  canDrop?: (args: DropTargetGetFeedbackArgs<DragType>) => boolean;
  /**
   * Optionally provide a _drop effect_ to be applied when
   * this drop target is the innermost drop target being dragged over
   */
  getDropEffect?: (
    args: DropTargetGetFeedbackArgs<DragType>,
  ) => DataTransfer['dropEffect'];
  /**
   * Return `true` if you want your drop target to hold onto
   * selection after the user is no longer dragging over this drop target.
   *
   * Stickiness defaults to `false`
   *
   * _For more details about the stickiness algorithm please refer to the docs_
   */
  getIsSticky?: (args: DropTargetGetFeedbackArgs<DragType>) => boolean;
} & {
  [EventName in keyof DropTargetEventPayloadMap<DragType>]?: (
    args: DropTargetEventPayloadMap<DragType>[EventName],
  ) => void;
};

export type DropTargetAPI<DragType extends AllDragTypes> = {
  dropTargetForConsumers: (args: DropTargetArgs<DragType>) => CleanupFn;
  dispatchEvent: <EventName extends keyof EventPayloadMap<DragType>>(args: {
    eventName: EventName;
    payload: EventPayloadMap<DragType>[EventName];
  }) => void;
  getIsOver: (args: {
    source: DragType['payload'];
    target: EventTarget | null;
    input: Input;
    current: DropTargetRecord[];
  }) => DropTargetRecord[];
};
