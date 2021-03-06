import {
  getMockProfileClient as getMockProfileClientUtil,
  getMockTeamClient,
} from '../../mock-helpers';
import { modifyResponse, ProfileClient } from '../../src';
import { ProfilecardProps } from '../../src/types';

export const getMockProfileClient = (
  cacheSize: number,
  cacheMaxAge: number,
  extraProps: ProfilecardProps = {},
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
  });
};

export default null;

export { getMockTeamClient };
