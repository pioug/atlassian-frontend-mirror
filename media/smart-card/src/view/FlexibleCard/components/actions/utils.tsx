import { ActionName } from '../../../../constants';
import { FlexibleUiDataContext } from '../../../../state/flexible-ui-context/types';
import { FlexibleUiContext } from '../../../../state/flexible-ui-context';
import React, { useContext } from 'react';
import DeleteAction from './delete-action';

const actionMappings: Record<
  ActionName,
  { component: React.FC<any> | undefined; props?: any }
> = {
  [ActionName.DeleteAction]: {
    component: DeleteAction,
  },
};

const getContextKey = (name: ActionName) => {
  // Attempt to predict context prop name in advance to reduce the amount of
  // code run during runtime
  return name.length > 0
    ? name.charAt(0).toLowerCase() + name.slice(1)
    : undefined;
};

const getActionData = (
  actionName: ActionName,
  contextKey?: string,
  context?: FlexibleUiDataContext,
) => {
  if (!context) {
    return undefined;
  }

  const data = context[contextKey as keyof typeof context];
  switch (actionName) {
    case ActionName.DeleteAction:
    default:
      return data;
  }
};

export const createAction = <P extends {}>(name: ActionName): React.FC<P> => {
  const { component: BaseAction, props } = actionMappings[name] || {};
  const contextKey = getContextKey(name);

  if (!BaseAction) {
    throw Error(`Action ${name} does not exist.`);
  }

  return (overrides: P) => {
    const context = useContext(FlexibleUiContext);
    const data = getActionData(name, contextKey, context);
    return <BaseAction {...props} {...data} {...overrides} />;
  };
};
