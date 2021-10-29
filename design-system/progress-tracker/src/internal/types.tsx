import type { ProgressTrackerStageRenderProp, Stage } from '../types';

export interface ProgressTrackerStageProps {
  /**
   * stage data passed to each `ProgressTrackerStage` component
   */
  item: Stage;
  /**
   * render prop to specify how to render components
   */
  render: ProgressTrackerStageRenderProp;
  /**
   * An internal hook applied to key elements for automated testing
   */
  testId?: string;
  /**
   * delay before transitioning in ms
   */
  transitionDelay: number;
  /**
   * speed at which to transition in ms
   */
  transitionSpeed: number;
  /**
   * interface of easing for transition
   */
  transitionEasing: string;
}
