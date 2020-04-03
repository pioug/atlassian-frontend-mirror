import { withAnalytics } from '../../../analytics/withAnalytics';
import { AnalyticsHandler } from '../../../analytics/handler';
import service from '../../../analytics/service';

describe('analytics withAnalytics', () => {
  let spy: any;

  beforeEach(() => {
    spy = jest.fn();
    service.handler = spy as AnalyticsHandler;
  });

  afterEach(() => {
    spy = null;
    service.handler = null;
  });

  it('tracks events after class method is called', () => {
    class AnnotatedTestClass {
      foo = withAnalytics('test.event', () => {
        return true;
      });
    }

    const instance = new AnnotatedTestClass();
    expect(spy).not.toHaveBeenCalled();

    instance.foo();
    expect(spy).toHaveBeenCalledWith('test.event');
    expect(spy).toHaveBeenCalledTimes(1);

    instance.foo();
    expect(spy).toHaveBeenCalledTimes(2);
    expect(spy).toHaveBeenCalledWith('test.event');
  });

  it('tracks events after bound method (instance property) is called', () => {
    class AnnotatedTestClass2 {
      foo = withAnalytics('test.event.foo', () => true);
      bar = withAnalytics('test.event.bar', () => true);
    }

    const instance = new AnnotatedTestClass2();
    expect(spy).not.toHaveBeenCalled();

    instance.foo();
    expect(spy).toHaveBeenCalledWith('test.event.foo');
    expect(spy).toHaveBeenCalledTimes(1);

    instance.bar();
    expect(spy).toHaveBeenCalledTimes(2);
    expect(spy).toHaveBeenCalledWith('test.event.bar');
  });

  it('returns unique decorated bound method (property) per instance', () => {
    class AnnotatedTestClassWithBoundMethod {
      foo = withAnalytics('test.event.foo', () => true);
    }

    const instance1 = new AnnotatedTestClassWithBoundMethod();
    const instance2 = new AnnotatedTestClassWithBoundMethod();

    expect(instance1.foo).not.toBe(instance2.foo);
  });

  it('can track private methods being called', () => {
    class AnnotatedTestClass3 {
      foo = withAnalytics('test.event.foo', () => {
        this.bar();
        return true;
      });

      private bar = withAnalytics('test.event.bar', () => true);
    }

    const instance = new AnnotatedTestClass3();
    expect(spy).not.toBeCalled();

    instance.foo();
    expect(spy).toHaveBeenCalledTimes(2);
    expect(spy).toHaveBeenCalledWith('test.event.foo');
    expect(spy).toHaveBeenCalledWith('test.event.bar');
  });

  it('should not track event if it returns false', () => {
    class AnnotatedTestClass {
      foo = withAnalytics('test.event.foo', () => false);
    }

    const instance = new AnnotatedTestClass();
    expect(spy).not.toBeCalled();

    instance.foo();
    expect(spy).not.toBeCalled();
  });
});
