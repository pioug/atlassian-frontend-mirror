import { getTimeSince } from '../../../utils/performance/get-performance-timing';
import {
  getAnalyticsEventSeverity,
  SEVERITY,
} from '@atlaskit/editor-common/utils';

interface Opts {
  dispatchAverage?: (
    data: { mean: number; median: number; sampleSize: number },
    severity: SEVERITY,
  ) => void;
  dispatchSample?: (sample: number, severity: SEVERITY) => void;
  onSampleStart?: () => void;
  onSampleEnd?: (
    time: number,
    info: { isSlow: boolean; severity: SEVERITY },
  ) => void;
  onSlowInput?: (time: number) => void;
  samplingRate: number;
  slowThreshold: number;
  normalThreshold: number;
  degradedThreshold: number;
}

export default class InputLatencyTracker {
  private samples: number[] = [];
  private total: number = 0;
  private currentStart: number | null;
  private samplingRate: Opts['samplingRate'];
  private slowThreshold: Opts['slowThreshold'];
  private normalThreshold: Opts['normalThreshold'];
  private degradedThreshold: Opts['degradedThreshold'];
  private dispatchAverage: Opts['dispatchAverage'];
  private dispatchSample: Opts['dispatchSample'];
  private onSampleStart: Opts['onSampleStart'];
  private onSampleEnd: Opts['onSampleEnd'];
  private onSlowInput: Opts['onSlowInput'];

  constructor({
    samplingRate,
    slowThreshold,
    normalThreshold,
    degradedThreshold,
    dispatchAverage,
    dispatchSample,
    onSampleStart,
    onSampleEnd,
    onSlowInput,
  }: Opts) {
    this.currentStart = null;
    this.samplingRate = samplingRate;
    this.slowThreshold = slowThreshold;
    this.normalThreshold = normalThreshold;
    this.degradedThreshold = degradedThreshold;
    this.dispatchAverage = dispatchAverage;
    this.dispatchSample = dispatchSample;
    this.onSampleStart = onSampleStart;
    this.onSampleEnd = onSampleEnd;
    this.onSlowInput = onSlowInput;
  }

  start() {
    this.currentStart = performance.now();

    if (this.samples.length + 1 === this.samplingRate) {
      this.onSampleStart?.();
    }
  }

  end() {
    if (this.currentStart === null) {
      return;
    }

    let isSlow = false;
    const time = getTimeSince(this.currentStart);
    this.push(time);

    if (time > this.slowThreshold) {
      this.onSlowInput?.(time);
      isSlow = true;
    }

    if (this.samples.length === this.samplingRate) {
      this.flush();
      this.onSampleEnd?.(time, { isSlow, severity: this.severity(time) });
    }
  }

  flush() {
    if (this.samples.length === 0) {
      return;
    }

    this.dispatch();

    this.samples = [];
    this.total = 0;
  }

  private dispatch() {
    this.dispatchSample?.(this.getLast(), this.severity(this.getLast()));
    // cache
    const median = this.getMedian();
    this.dispatchAverage?.(
      { mean: this.getMean(), median, sampleSize: this.samples.length },
      this.severity(median),
    );
  }

  private push(latency: number) {
    this.samples.push(latency);
    this.total += latency;
  }

  private severity(time: number) {
    return getAnalyticsEventSeverity(
      time,
      this.normalThreshold,
      this.degradedThreshold,
    );
  }

  private getLast() {
    return this.samples[this.samples.length - 1];
  }

  private getMean() {
    return this.total / this.samples.length;
  }

  private getMedian() {
    if (this.samples.length === 1) {
      return this.samples[0];
    }

    this.samples.sort((a, b) => a - b);

    const middle = (this.samples.length + 1) / 2;
    const floorMiddle = Math.floor(middle);
    const remainder = middle % floorMiddle;

    if (remainder === 0) {
      return this.samples[middle - 1];
    }

    const left = this.samples[floorMiddle - 1];
    const right = this.samples[floorMiddle];

    return (left + right) / 2;
  }
}
