import { getMockProfileClient as getMockProfileClientUtil } from '../../mock-helpers';
import { ProfileClient, modifyResponse } from '../../src';
import { ProfilecardProps } from '../../src/types';

export const getMockProfileClient = (
  cacheSize: number,
  cacheMaxAge: number,
  extraProps: ProfilecardProps = {},
) => {
  const MockProfileClient = getMockProfileClientUtil(
    ProfileClient,
    // @ts-ignore
    response => {
      return {
        ...modifyResponse(response),
        ...extraProps,
      };
    },
  );

  return new MockProfileClient({
    cacheSize,
    cacheMaxAge,
  });
};

export const analyticsHandler = (actionName: string, props?: {}) =>
  console.log('Analytics event invoked: ', actionName, props);

export default null;
