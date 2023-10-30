import type {
  AllDragTypes,
  Input,
} from '@atlaskit/pragmatic-drag-and-drop/types';

export type ElementGetFeedbackArgs<DragType extends AllDragTypes> = {
  /**
   * The users _current_ input
   */
  input: Input;
  /**
   * The data associated with the entity being dragged
   */
  source: DragType['payload'];
  /**
   * The element trying to be scrolled
   */
  element: Element;
};

export type WindowGetFeedbackArgs<DragType extends AllDragTypes> = Omit<
  ElementGetFeedbackArgs<DragType>,
  'element'
>;

export type Spacing = {
  top: number;
  right: number;
  bottom: number;
  left: number;
};

export type Edge = keyof Spacing;

export type EngagementHistoryEntry = {
  timeOfEngagementStart: number;
};

type BaseConfig = {
  startHitboxAtPercentageRemainingOfElement: Spacing;
  maxScrollAtPercentageRemainingOfHitbox: Spacing;
  maxPixelScrollPerSecond: number;
  timeDampeningDurationMs: number;
  maxMainAxisHitboxSize: number;
};

export type ScrollContainerConfig = BaseConfig;

export type ElementAutoScrollArgs<DragType extends AllDragTypes> = {
  element: Element;
  canScroll?: (args: ElementGetFeedbackArgs<DragType>) => boolean;
  // We are not currently enabling per item configuration
};

export type WindowAutoScrollArgs<DragType extends AllDragTypes> = {
  canScroll?: (args: WindowGetFeedbackArgs<DragType>) => boolean;
  // We are not currently enabling per item configuration
};

export type Side = 'start' | 'end';
export type Axis = 'vertical' | 'horizontal';
