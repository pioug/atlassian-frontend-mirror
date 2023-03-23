import filterActions from '../../internal/filterActions';
import { ProfileCardAction } from '../../types';

describe('filterActions', () => {
  it('should filter actions based on shouldRender', () => {
    const action1 = {
      label: 'test 1',
      shouldRender: () => true,
    };
    const action2 = {
      label: 'test 2',
      shouldRender: () => false,
    };
    const action3 = {
      label: 'test 3',
    };
    const action4 = {
      label: 'test 4',
      shouldRender: true,
    };
    const actions: ProfileCardAction[] = [action1, action2, action3, action4];
    const data = 'test';
    const filteredActions = filterActions(actions, data);

    expect(filteredActions).toEqual([action1, action3, action4]);
  });
});
