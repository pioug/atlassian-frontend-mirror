import { AvatarProps } from '../../types';
import { composeUniqueKey } from '../../utils';

describe('composeAUniqueKey', () => {
  it("fallback to index when avatar don't have `key`", () => {
    const avatar: AvatarProps = {
      name: 'test_user',
    };

    const key = composeUniqueKey(avatar, 0);
    expect(key).toEqual(0);
  });

  it('use key for the unique key', () => {
    const avatar: AvatarProps = {
      name: 'test_user',
      key: 'test@atlassian.com',
    };
    const key = composeUniqueKey(avatar, 0);
    expect(key).toEqual('test@atlassian.com');
  });
});
