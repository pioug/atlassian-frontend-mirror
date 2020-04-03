import {
  AnalyticsHandler,
  detectHandler,
  hermentHandler,
} from '../../../analytics/handler';
import service from '../../../analytics/service';

describe('analytics service', () => {
  it('auto-detects Herment', () => {
    window.AJS = { EventQueue: { push() {} } };
    expect(detectHandler()).toBe(hermentHandler);
    delete window.AJS;
  });

  it('allows setting the handler', () => {
    let eventName;
    const handler: AnalyticsHandler = (name: string) => {
      eventName = name;
    };
    service.handler = handler;
    service.trackEvent('test.event');
    expect(eventName).toEqual('test.event');
  });

  it('allows removing the handler', () => {
    let called = false;
    const handler: AnalyticsHandler = () => {
      called = true;
    };
    service.handler = handler;
    service.handler = null;
    service.trackEvent('test.event');
    expect(called).toBe(false);
  });
});
