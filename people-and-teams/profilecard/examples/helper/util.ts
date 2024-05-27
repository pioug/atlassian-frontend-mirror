import { modifyResponse, ProfileClient, type ProfileClientOptions } from '../../src';
import {
  getMockProfileClient as getMockProfileClientUtil,
  getMockTeamClient,
} from '../../src/mocks';
import { type ProfilecardProps } from '../../src/types';

export const getMockProfileClient = (
  cacheSize: number,
  cacheMaxAge: number,
  extraProps: ProfilecardProps = {},
  extraOptions?: ProfileClientOptions,
) => {
  const MockProfileClient = getMockProfileClientUtil(
    ProfileClient,
    // @ts-ignore
    (response) => {
      return {
        ...modifyResponse(response),
        ...extraProps,
      };
    },
  );

  return new MockProfileClient({
    cacheSize,
    cacheMaxAge,
    ...extraOptions,
  });
};

export default null;

export { getMockTeamClient };
