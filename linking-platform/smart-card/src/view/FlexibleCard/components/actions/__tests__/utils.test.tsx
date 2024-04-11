import { ActionName } from '../../../../../constants';
import { createUIAction } from '../utils';

describe('createUIAction', () => {
  it('throws error if base element does not exists', () => {
    expect(() => createUIAction('Random' as ActionName)).toThrow(
      new Error('Action Random does not exist.'),
    );
  });
});
