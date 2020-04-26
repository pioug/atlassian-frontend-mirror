import { withAnalyticsEvents } from '@atlaskit/analytics-next';

import {
  navigationExpandedCollapsed,
  navigationItemClicked,
} from '../../analytics';

const mockWithAnalyticsEvents = withAnalyticsEvents;

const mockAnalyticsComp = jest.fn(() => () => null);

jest.mock('@atlaskit/analytics-next', () => ({
  withAnalyticsEvents: jest.fn(() => mockAnalyticsComp),
  withAnalyticsContext: jest.fn(() => jest.fn(() => () => null)),
}));

describe('analytics', () => {
  const dummyComp = () => {};
  let fireEventSpy;
  let createAnalyticsEventSpy;

  beforeEach(() => {
    jest.clearAllMocks();
    fireEventSpy = jest.fn();
    createAnalyticsEventSpy = jest.fn(() => ({ fire: fireEventSpy }));
  });
  describe('navigationItem clicked', () => {
    it('should fire a UI event on click', () => {
      expect(mockWithAnalyticsEvents).not.toHaveBeenCalled();

      navigationItemClicked(dummyComp, 'comp');
      expect(mockWithAnalyticsEvents).toHaveBeenCalledTimes(1);
      const mockArgs = mockWithAnalyticsEvents.mock.calls[0][0];
      // Expect only onClick prop to be instrumented
      expect(Object.keys(mockArgs)).toEqual(['onClick']);

      mockArgs.onClick(createAnalyticsEventSpy, {
        icon: function myIcon() {},
        id: 'abc',
        index: 1,
      });
      // Expect event to be created with correct payload
      expect(createAnalyticsEventSpy).toHaveBeenCalledWith(
        expect.objectContaining({
          action: 'clicked',
          actionSubject: 'navigationItem',
          attributes: {
            componentName: 'comp',
            iconSource: 'myIcon',
            itemId: 'abc',
            navigationItemIndex: 1,
          },
        }),
      );
      // Expect event to be fired on correct channel
      expect(fireEventSpy).toBeCalledWith('navigation');
    });

    it('should pass an actionSubjectId instead of an itemId attribute when useActionSubjectId arg is true', () => {
      navigationItemClicked(dummyComp, 'comp', true);
      const mockArgs = mockWithAnalyticsEvents.mock.calls[0][0];

      mockArgs.onClick(createAnalyticsEventSpy, {
        icon: function myIcon() {},
        id: 'abc',
        index: 1,
      });
      // Expect event to be created with correct payload
      expect(createAnalyticsEventSpy).toHaveBeenCalledWith(
        expect.objectContaining({
          action: 'clicked',
          actionSubject: 'navigationItem',
          actionSubjectId: 'abc',
          attributes: {
            componentName: 'comp',
            iconSource: 'myIcon',
            navigationItemIndex: 1,
          },
        }),
      );
    });

    it('should retrieve iconSource from before prop if icon prop not specified', () => {
      navigationItemClicked(dummyComp, 'comp');
      const mockArgs = mockWithAnalyticsEvents.mock.calls[0][0];
      mockArgs.onClick(createAnalyticsEventSpy, {
        before: function myBeforeIcon() {},
      });

      expect(createAnalyticsEventSpy).toHaveBeenCalledWith(
        expect.objectContaining({
          attributes: expect.objectContaining({
            iconSource: 'myBeforeIcon',
          }),
        }),
      );
    });

    it('should convert id prop from kebab case to camel case', () => {
      navigationItemClicked(dummyComp, 'comp');
      const mockArgs = mockWithAnalyticsEvents.mock.calls[0][0];
      mockArgs.onClick(createAnalyticsEventSpy, {
        id: 'my-item-id',
      });

      expect(createAnalyticsEventSpy).toHaveBeenCalledWith(
        expect.objectContaining({
          attributes: expect.objectContaining({
            itemId: 'myItemId',
          }),
        }),
      );
    });

    it('should gracefully handle missing or non-string id prop', () => {
      navigationItemClicked(dummyComp, 'comp');
      const mockArgs = mockWithAnalyticsEvents.mock.calls[0][0];
      mockArgs.onClick(createAnalyticsEventSpy, {
        id: 5,
      });

      // Numeric id
      expect(createAnalyticsEventSpy).toHaveBeenCalledWith(
        expect.objectContaining({
          attributes: expect.objectContaining({
            itemId: '5',
          }),
        }),
      );

      mockArgs.onClick(createAnalyticsEventSpy, {});

      // Undefined id
      expect(createAnalyticsEventSpy).toHaveBeenLastCalledWith(
        expect.objectContaining({
          attributes: expect.objectContaining({
            itemId: 'undefined',
          }),
        }),
      );
    });
  });

  describe('navigationExpandedCollapsed', () => {
    it('should fire a productNavigation expanded event when isCollapsed is false', () => {
      const analyticsArgs = { isCollapsed: false, trigger: 'chevron' };
      navigationExpandedCollapsed(createAnalyticsEventSpy, analyticsArgs);
      expect(createAnalyticsEventSpy).toHaveBeenCalledTimes(1);
      expect(createAnalyticsEventSpy).toHaveBeenCalledWith({
        action: 'expanded',
        actionSubject: 'productNavigation',
        attributes: {
          trigger: 'chevron',
        },
      });
    });

    it('should fire a productNavigation collapsed event when isCollapsed is true', () => {
      const analyticsArgs = { isCollapsed: true, trigger: 'chevron' };
      navigationExpandedCollapsed(createAnalyticsEventSpy, analyticsArgs);
      expect(createAnalyticsEventSpy).toHaveBeenCalledTimes(1);
      expect(createAnalyticsEventSpy).toHaveBeenCalledWith({
        action: 'collapsed',
        actionSubject: 'productNavigation',
        attributes: {
          trigger: 'chevron',
        },
      });
    });

    it('should fire the event on the fabric navigation channel', () => {
      const analyticsArgs = { isCollapsed: true, trigger: 'chevron' };
      navigationExpandedCollapsed(createAnalyticsEventSpy, analyticsArgs);
      expect(fireEventSpy).toHaveBeenCalledTimes(1);
      expect(fireEventSpy).toHaveBeenCalledWith('navigation');
    });
  });
});
