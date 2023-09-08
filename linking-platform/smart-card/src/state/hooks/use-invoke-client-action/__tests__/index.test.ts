import { renderHook } from '@testing-library/react-hooks';

import useInvokeClientAction from '../index';
import * as measure from '../../../../utils/performance';
import { mockAnalytics } from '../../../../utils/mocks';
import type { AnalyticsFacade } from '../../../analytics';

describe('useInvokeClientAction', () => {
  const actionType = 'PreviewAction';
  const display = 'block';
  const extensionKey = 'spaghetti-key';

  const setup = async (
    analytics: AnalyticsFacade,
    actionFn = async () => {},
  ) => {
    const { result } = renderHook(() => useInvokeClientAction({ analytics }));

    await result.current({
      actionType,
      actionFn,
      extensionKey,
      display,
    });
  };

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('invokes action', async () => {
    const actionFn = jest.fn().mockResolvedValue(undefined);

    await setup(mockAnalytics, actionFn);

    expect(actionFn).toHaveBeenCalledTimes(1);
  });

  it('send action click event', async () => {
    const analyticsSpy = jest.spyOn(mockAnalytics.ui, 'actionClickedEvent');

    await setup(mockAnalytics);

    expect(analyticsSpy).toHaveBeenCalledWith({
      actionType,
      display,
      extensionKey,
      id: expect.any(String),
      invokeType: 'client',
    });
  });

  it('sends invoke succeeded event', async () => {
    const analyticsSpy = jest.spyOn(
      mockAnalytics.operational,
      'invokeSucceededEvent',
    );

    await setup(mockAnalytics);

    expect(analyticsSpy).toHaveBeenCalledWith({
      actionType,
      display,
      extensionKey,
      id: expect.any(String),
    });
  });

  it('sends invoke failed event', async () => {
    const reason = 'Something went wrong.';
    const actionFn = jest.fn().mockRejectedValue(new Error(reason));

    const analyticsSpy = jest.spyOn(
      mockAnalytics.operational,
      'invokeFailedEvent',
    );

    await setup(mockAnalytics, actionFn);

    expect(analyticsSpy).toHaveBeenCalledWith({
      actionType,
      display,
      extensionKey,
      id: expect.any(String),
      reason,
    });
  });

  it('mark measure resolved performance', async () => {
    const measureSpy = jest.spyOn(measure, 'mark');

    await setup(mockAnalytics);

    expect(measureSpy).toHaveBeenNthCalledWith(
      1,
      expect.stringMatching(/PreviewAction$/),
      'pending',
    );
    expect(measureSpy).toHaveBeenNthCalledWith(
      2,
      expect.stringMatching(/PreviewAction$/),
      'resolved',
    );
  });

  it('mark measure errored performance', async () => {
    const actionFn = jest.fn().mockRejectedValue(new Error());
    const measureSpy = jest.spyOn(measure, 'mark');

    await setup(mockAnalytics, actionFn);

    expect(measureSpy).toHaveBeenNthCalledWith(
      1,
      expect.stringMatching(/PreviewAction$/),
      'pending',
    );
    expect(measureSpy).toHaveBeenNthCalledWith(
      2,
      expect.stringMatching(/PreviewAction$/),
      'errored',
    );
  });
});
