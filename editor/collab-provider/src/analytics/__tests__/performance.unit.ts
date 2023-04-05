import AnalyticsHelper from '../analytics-helper';
import type { AnalyticsWebClient } from '@atlaskit/analytics-listeners';

import {
  startMeasure,
  stopMeasure,
  MEASURE_NAME,
  isPerformanceAPIAvailable,
  measureMap,
} from '../performance';

describe('isPerformanceAPIAvailable', () => {
  it('should return true after defining methods', () => {
    expect(isPerformanceAPIAvailable()).toEqual(false);
    performance.clearMeasures = jest.fn();
    performance.clearMarks = jest.fn();
    performance.getEntriesByName = jest.fn(() => []);
    performance.getEntriesByType = jest.fn(() => []);
    expect(isPerformanceAPIAvailable()).toEqual(true);
  });
});

describe('Performance unit tests', () => {
  const fakeError = new Error();
  const sendErrorEventSpy = jest.spyOn(
    AnalyticsHelper.prototype,
    'sendErrorEvent',
  );
  const fakeAnalyticsWebClient: AnalyticsWebClient = {
    sendOperationalEvent: jest.fn(),
    sendScreenEvent: jest.fn(),
    sendTrackEvent: jest.fn(),
    sendUIEvent: jest.fn(),
  };
  const fakeDocumentAri =
    'ari:cloud:confluence:a436116f-02ce-4520-8fbb-7301462a1674:page/1731046230';
  let analyticsHelper: AnalyticsHelper;

  beforeEach(() => {
    performance.clearMeasures = jest.fn();
    performance.clearMarks = jest.fn();
    performance.getEntriesByName = jest.fn(() => []);
    performance.getEntriesByType = jest.fn(() => []);

    expect(isPerformanceAPIAvailable()).toEqual(true);

    analyticsHelper = new AnalyticsHelper(
      fakeDocumentAri,
      fakeAnalyticsWebClient,
    );
  });

  afterEach(jest.resetAllMocks);

  it('should sucessfully return a measurement', () => {
    // startMeasure
    const measureName = MEASURE_NAME.SOCKET_CONNECT;
    const spy = jest.spyOn(performance, 'mark');
    startMeasure(measureName, undefined);
    expect(spy).toHaveBeenCalledTimes(1);

    expect(measureMap.has(measureName)).toBeTruthy();
    expect(measureMap.get(measureName)).not.toBe(undefined);

    // stopMeasure
    const measure = stopMeasure(measureName, undefined, (a, b) => {});
    expect(measure).not.toBe(undefined);

    // cleanup
    expect(measureMap.has(measureName)).toBe(false);
  });

  it('should return nothing when calling `stopMeasure` on measure name that does not exist in `measureMap`', () => {
    const measureName = MEASURE_NAME.SOCKET_CONNECT;
    const measure = stopMeasure(measureName, undefined);
    expect(measureMap.has(measureName)).toBeFalsy();
    expect(measure).toBe(undefined);
  });

  it('`startMeasure` should send an analytics error event', () => {
    const measureName = MEASURE_NAME.SOCKET_CONNECT;
    jest.spyOn(performance, 'mark').mockImplementation(() => {
      throw fakeError;
    });

    startMeasure(measureName, analyticsHelper);
    expect(sendErrorEventSpy).toHaveBeenCalledTimes(1);
    expect(sendErrorEventSpy).toBeCalledWith(
      fakeError,
      'Error while measuring performance when marking the start',
    );
  });

  it('`stopMeasure` should send an analytics error event when calling `performance.measure`', () => {
    const measureName = MEASURE_NAME.SOCKET_CONNECT;
    startMeasure(measureName, undefined);

    jest.spyOn(performance, 'measure').mockImplementation(() => {
      throw fakeError;
    });

    stopMeasure(measureName, analyticsHelper, (a, b) => {});
    expect(sendErrorEventSpy).toHaveBeenCalledTimes(1);
    expect(sendErrorEventSpy).toBeCalledWith(
      fakeError,
      'Error while measuring performance when marking the end',
    );
  });

  it('`stopMeasure` should send an analytics error event when calling `performance.getEntriesByName`', () => {
    const measureName = MEASURE_NAME.SOCKET_CONNECT;
    startMeasure(measureName, undefined);

    jest.spyOn(performance, 'getEntriesByName').mockImplementation(() => {
      throw fakeError;
    });

    stopMeasure(measureName, analyticsHelper, (a, b) => {});
    expect(sendErrorEventSpy).toHaveBeenCalledTimes(1);
    expect(sendErrorEventSpy).toBeCalledWith(
      fakeError,
      'Error while measuring performance when completing the measurement',
    );
  });
});
