import {
  withAnalyticsEvents,
  withAnalyticsContext,
  createAndFireEvent,
} from '@atlaskit/analytics-next';
import {
  name as packageName,
  version as packageVersion,
} from '../../version.json';
import '../../ToggleStateless';

// This is a global mock for this file that will mock all components wrapped with analytics
// and replace them with an empty SFC that returns null. This includes components imported
// directly in this file and others imported as dependencies of those imports.
jest.mock('@atlaskit/analytics-next', () => ({
  withAnalyticsEvents: jest.fn(() => jest.fn(() => () => null)),
  withAnalyticsContext: jest.fn(() => jest.fn(() => () => null)),
  createAndFireEvent: jest.fn(() => jest.fn(args => args)),
}));

describe('ToggleStateless', () => {
  it('should be wrapped with analytics context', () => {
    expect(withAnalyticsContext).toHaveBeenCalledWith({
      componentName: 'toggle',
      packageName,
      packageVersion,
    });
  });

  it('should be wrapped with analytics events', () => {
    expect(createAndFireEvent).toHaveBeenCalledWith('atlaskit');
    expect(withAnalyticsEvents).toHaveBeenLastCalledWith({
      onBlur: {
        action: 'blurred',
        actionSubject: 'toggle',
        attributes: {
          componentName: 'toggle',
          packageName,
          packageVersion,
        },
      },
      onChange: {
        action: 'changed',
        actionSubject: 'toggle',
        attributes: {
          componentName: 'toggle',
          packageName,
          packageVersion,
        },
      },
      onFocus: {
        action: 'focused',
        actionSubject: 'toggle',
        attributes: {
          componentName: 'toggle',
          packageName,
          packageVersion,
        },
      },
    });
  });
});
