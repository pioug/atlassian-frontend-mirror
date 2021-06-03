import {
  withAnalyticsEvents,
  withAnalyticsContext,
  createAndFireEvent,
} from '@atlaskit/analytics-next';
import '../../FieldTextStateless';

const packageName = process.env._PACKAGE_NAME_;
const packageVersion = process.env._PACKAGE_VERSION_;

// This is a global mock for this file that will mock all components wrapped with analytics
// and replace them with an empty SFC that returns null. This includes components imported
// directly in this file and others imported as dependencies of those imports.
jest.mock('@atlaskit/analytics-next', () => ({
  withAnalyticsEvents: jest.fn(() => jest.fn(() => () => null)),
  withAnalyticsContext: jest.fn(() => jest.fn(() => () => null)),
  createAndFireEvent: jest.fn(() => jest.fn((args) => args)),
}));

describe('FieldTextStateless', () => {
  it('should be wrapped with analytics context', () => {
    expect(withAnalyticsContext).toHaveBeenCalledWith({
      componentName: 'fieldText',
      packageName,
      packageVersion,
    });
  });

  it('should be wrapped with analytics events', () => {
    expect(createAndFireEvent).toHaveBeenCalledWith('atlaskit');
    expect(withAnalyticsEvents).toHaveBeenLastCalledWith({
      onBlur: {
        action: 'blurred',
        actionSubject: 'textField',
        attributes: {
          componentName: 'fieldText',
          packageName,
          packageVersion,
        },
      },
      onFocus: {
        action: 'focused',
        actionSubject: 'textField',
        attributes: {
          componentName: 'fieldText',
          packageName,
          packageVersion,
        },
      },
    });
  });
});
