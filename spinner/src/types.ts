export type Func = () => void;

export type SpinnerSizes =
  | 'xsmall'
  | 'small'
  | 'medium'
  | 'large'
  | 'xlarge'
  | number;

export type SpinnerProps = {
  /** Time in milliseconds after component mount before spinner is visible. */
  delay: number;
  /** Set the spinner color to white, for use in dark-themed UIs. */
  invertColor: boolean;
  /** Handler for once the spinner has completed its outro animation */
  onComplete: Func;
  /** Size of the spinner. */
  size: SpinnerSizes;
  /** Whether the process is complete and the spinner should leave */
  isCompleting: boolean;
  /** A `testId` prop is provided for specified elements, which is a unique string that appears as a data attribute `data-testid` in the rendered code, serving as a hook for automated tests */
  testId?: string;
};

export type SpinnerPhases = 'DELAY' | 'ENTER' | 'IDLE' | 'LEAVE' | '';

export type SpinnerState = {
  phase: SpinnerPhases;
};
