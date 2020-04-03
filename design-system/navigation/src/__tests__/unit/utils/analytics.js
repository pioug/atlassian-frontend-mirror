import { navigationExpandedCollapsed } from '../../../utils/analytics';

describe('Analytics Util', () => {
  const mockAnalyticsEvent = {
    fire: jest.fn(),
  };
  const mockCreateAnalyticsEvent = jest.fn(() => mockAnalyticsEvent);
  beforeEach(() => {
    jest.clearAllMocks();
    jest.resetModules();
  });

  describe('navigationExpandedCollapsed', () => {
    it('should create and fire an expand event when isCollapsed is false', () => {
      navigationExpandedCollapsed(mockCreateAnalyticsEvent, {
        isCollapsed: false,
        trigger: 'chevron',
      });
      expect(mockCreateAnalyticsEvent).toHaveBeenCalledTimes(1);
      expect(mockCreateAnalyticsEvent).toHaveBeenCalledWith({
        action: 'expanded',
        actionSubject: 'productNavigation',
        attributes: {
          trigger: 'chevron',
        },
      });
      expect(mockAnalyticsEvent.fire).toHaveBeenCalledTimes(1);
      expect(mockAnalyticsEvent.fire).toHaveBeenCalledWith('navigation');
    });

    it('should create and fire a collapse event when isCollapsed is true', () => {
      navigationExpandedCollapsed(mockCreateAnalyticsEvent, {
        isCollapsed: true,
        trigger: 'chevron',
      });
      expect(mockCreateAnalyticsEvent).toHaveBeenCalledTimes(1);
      expect(mockCreateAnalyticsEvent).toHaveBeenCalledWith({
        action: 'collapsed',
        actionSubject: 'productNavigation',
        attributes: {
          trigger: 'chevron',
        },
      });
      expect(mockAnalyticsEvent.fire).toHaveBeenCalledTimes(1);
      expect(mockAnalyticsEvent.fire).toHaveBeenCalledWith('navigation');
    });

    ['chevron', 'resizerClick', 'resizerDrag'].forEach(trigger => {
      it(`should pass the correct trigger - ${trigger}`, () => {
        navigationExpandedCollapsed(mockCreateAnalyticsEvent, {
          isCollapsed: true,
          trigger,
        });
        expect(mockCreateAnalyticsEvent).toHaveBeenCalledTimes(1);
        expect(mockCreateAnalyticsEvent).toHaveBeenCalledWith({
          action: 'collapsed',
          actionSubject: 'productNavigation',
          attributes: {
            trigger,
          },
        });
      });
    });
  });

  describe('withGlobalItemAnalytics', () => {
    const mockWithAnalyticsEventsReturn = jest.fn();
    const mockWithAnalyticsEvents = jest.fn(
      () => mockWithAnalyticsEventsReturn,
    );
    beforeEach(() => {
      jest.doMock('@atlaskit/analytics-next', () => ({
        withAnalyticsEvents: mockWithAnalyticsEvents,
      }));
    });

    it('should wrap component with withAnalyticsEvents HOC that patches onClick prop callback', () => {
      const Comp = () => null;

      const { withGlobalItemAnalytics } = require('../../../utils/analytics');

      withGlobalItemAnalytics(Comp);

      expect(mockWithAnalyticsEvents).toHaveBeenCalledTimes(1);
      expect(mockWithAnalyticsEvents).toHaveBeenCalledWith({
        onClick: expect.any(Function),
      });
      expect(mockWithAnalyticsEventsReturn).toHaveBeenCalledWith(Comp);
    });

    it('should fire a navigationItem clicked event when component is clicked', () => {
      const Comp = () => null;

      const { withGlobalItemAnalytics } = require('../../../utils/analytics');

      withGlobalItemAnalytics(Comp);

      const onClickCb = mockWithAnalyticsEvents.mock.calls[0][0].onClick;
      expect(onClickCb).toEqual(expect.any(Function));

      onClickCb(mockCreateAnalyticsEvent, { id: 'productLogo' });

      expect(mockCreateAnalyticsEvent).toHaveBeenCalledTimes(1);
      expect(mockCreateAnalyticsEvent).toHaveBeenCalledWith({
        action: 'clicked',
        actionSubject: 'navigationItem',
        actionSubjectId: 'productLogo',
        attributes: {
          navigationLayer: 'global',
        },
      });

      expect(mockAnalyticsEvent.fire).toHaveBeenCalledTimes(1);
      expect(mockAnalyticsEvent.fire).toHaveBeenCalledWith('navigation');
    });

    it('should NOT fire an event when the component does not have an id prop', () => {
      const Comp = () => null;

      const { withGlobalItemAnalytics } = require('../../../utils/analytics');

      withGlobalItemAnalytics(Comp);

      const onClickCb = mockWithAnalyticsEvents.mock.calls[0][0].onClick;
      expect(onClickCb).toEqual(expect.any(Function));

      onClickCb(mockCreateAnalyticsEvent, {});

      expect(mockCreateAnalyticsEvent).not.toHaveBeenCalled();
    });
  });
});
