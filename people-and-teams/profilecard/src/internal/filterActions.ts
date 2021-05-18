import { ProfileCardAction } from '../types';

const filterActions = (
  actions: ProfileCardAction[] = [],
  data: any,
): ProfileCardAction[] => {
  return actions.filter((action) => {
    if (!action.shouldRender) {
      return true;
    } else if (typeof action.shouldRender !== 'function') {
      return Boolean(action.shouldRender);
    }

    return action.shouldRender(data);
  });
};

export default filterActions;
