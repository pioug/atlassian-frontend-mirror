import { objectKeyToString } from '../../type-helpers';

describe('type-helpers', () => {
  it('objectKeyToString', () => {
    const objectKey = {
      localId: 'task-1',
      objectAri: 'object',
    };
    const key = objectKeyToString(objectKey);
    expect(key).toEqual('object:task-1');
  });
});
