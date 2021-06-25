import isMatch from 'lodash/isMatch';
import { UIAnalyticsEvent } from '@atlaskit/analytics-next';

export const createAnalyticsListenerEventsSpy = () => {
  const spyFn = jest.fn();
  const onFire = (event: UIAnalyticsEvent) => {
    spyFn(event.payload);
  };
  const expectAnalyticsToHaveBeenCalledWith = (
    expectedArgs: Record<string, unknown>,
    expectedCallTimes: number,
  ) => {
    const matchingCalls = spyFn.mock.calls.filter(([actualArg]) =>
      isMatch(actualArg, expectedArgs),
    );
    function prettyDebug(callCount: number) {
      return `${JSON.stringify(expectedArgs)}, called ${callCount} times`;
    }
    return expect(prettyDebug(matchingCalls.length)).toEqual(
      prettyDebug(expectedCallTimes),
    );
  };

  return {
    analyticsSpy: {
      onFire,
      expectTohaveBeenCalledWith: expectAnalyticsToHaveBeenCalledWith,
    },
  };
};
