import {
  isPerformanceAPIAvailable,
  startMeasure,
  stopMeasure,
} from '@atlaskit/editor-common';
import { TransactionTracking } from '../../types/performance-tracking';
import { getTimeSince } from './get-performance-timing';

export const EVENT_NAME_STATE_APPLY = `🦉 EditorView::state::apply`;
export const EVENT_NAME_UPDATE_STATE = `🦉 EditorView::updateState`;
export const EVENT_NAME_VIEW_STATE_UPDATED = `🦉 EditorView::onEditorViewStateUpdated`;
export const EVENT_NAME_ON_CHANGE = `🦉 ReactEditorView::onChange`;
export const EVENT_NAME_DISPATCH_TRANSACTION = `🦉 ReactEditorView::dispatchTransaction`;

export const DEFAULT_USE_PERFORMANCE_MARK = false;
const DEFAULT_SAMPLING_RATE = 100;

const noop = () => {};
interface MeasureHelpers {
  startMeasure: (measureName: string) => void;
  stopMeasure: (
    measureName: string,
    onMeasureComplete?: (duration: number, startTime: number) => void,
  ) => void;
}

interface SimpleEntry {
  name: string;
  duration: number;
  startTime: number;
}

type MeasureListener = (entry: SimpleEntry) => void;

export class TransactionTracker {
  // Counter so we can rate limit the transaction performance tracking
  private dispatchCallCounter = 0;

  // A map containing the time which measurement starts
  private readonly measureMap = new Map<string, number>();

  private readonly measureListeners: MeasureListener[] = [];

  public addMeasureListener(listener: MeasureListener) {
    this.measureListeners.push(listener);
  }

  public removeMeasureListener(listener: MeasureListener) {
    const index = this.measureListeners.indexOf(listener);

    if (index > -1) {
      this.measureListeners.splice(index, 1);
    }
  }

  public shouldTrackTransaction(options: TransactionTracking): boolean {
    const {
      enabled: trackingEnabled,
      samplingRate = DEFAULT_SAMPLING_RATE,
    } = options;
    return trackingEnabled && this.dispatchCallCounter === samplingRate;
  }

  public bumpDispatchCounter = (options: TransactionTracking) => {
    const {
      enabled: trackingEnabled,
      samplingRate = DEFAULT_SAMPLING_RATE,
    } = options;

    if (trackingEnabled) {
      if (this.dispatchCallCounter >= samplingRate) {
        this.dispatchCallCounter = 0;
      }

      this.dispatchCallCounter++;
    }

    return this.dispatchCallCounter;
  };

  public getMeasureHelpers = (options: TransactionTracking): MeasureHelpers => {
    const { usePerformanceMarks = DEFAULT_USE_PERFORMANCE_MARK } = options;

    if (!this.shouldTrackTransaction(options)) {
      return {
        startMeasure: noop,
        stopMeasure: noop,
      };
    }

    return {
      startMeasure: usePerformanceMarks
        ? startMeasure
        : this.startMeasureSimple,
      stopMeasure: usePerformanceMarks ? stopMeasure : this.stopMeasureSimple,
    };
  };

  private startMeasureSimple = (measureName: string) => {
    if (!isPerformanceAPIAvailable()) {
      return;
    }

    this.measureMap.set(measureName, performance.now());
  };

  private stopMeasureSimple = (
    measureName: string,
    onMeasureComplete?: (duration: number, startTime: number) => void,
  ) => {
    if (!isPerformanceAPIAvailable()) {
      return;
    }

    const startTime = this.measureMap.get(measureName);

    if (startTime) {
      const duration = getTimeSince(startTime);
      this.measureMap.delete(measureName);

      if (onMeasureComplete) {
        onMeasureComplete(duration, startTime);
      }

      // Call each subscribed listener
      this.measureListeners.forEach((listener) =>
        listener({ name: measureName, duration, startTime }),
      );
    }
  };
}
