import { ActionName } from '../../../../constants';
import { FlexibleUiDataContext } from '../../../../state/flexible-ui-context/types';
import { FlexibleUiContext } from '../../../../state/flexible-ui-context';
import React, { useContext } from 'react';
import Action from './action';
import { FormattedMessage } from 'react-intl-next';
import { messages } from '../../../../messages';
import ViewAction from './action/view-action';
import ShortcutIcon from '@atlaskit/icon/glyph/shortcut';

const actionMappings: {
  [key in ActionName]?: { component: React.FC<any> | undefined; props?: any };
} = {
  [ActionName.CustomAction]: {
    component: Action,
    props: {},
  },
  [ActionName.ViewAction]: {
    component: ViewAction,
    props: {
      testId: 'smart-action-view-action',
      content: <FormattedMessage {...messages.view} />,
      icon: <ShortcutIcon label="View" />,
      tooltipMessage: <FormattedMessage {...messages.view} />,
    },
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
    case ActionName.ViewAction:
      return data;
    default:
      return undefined;
  }
};

export const createDataAction = <P extends {}>(
  name: ActionName,
): React.FC<P> => {
  const { component: BaseAction, props } = actionMappings[name] || {};
  const contextKey = getContextKey(name);

  if (!BaseAction) {
    throw Error(`Action ${name} does not exist.`);
  }

  return (overrides: P) => {
    const context = useContext(FlexibleUiContext);
    const data = getActionData(name, contextKey, context);
    return data && typeof data === 'object' ? (
      <BaseAction {...props} {...data} {...overrides} url={context?.url} />
    ) : null;
  };
};

export const createUIAction = <P extends {}>(name: ActionName): React.FC<P> => {
  const { component: BaseAction, props } = actionMappings[name] || {};

  if (!BaseAction) {
    throw Error(`Action ${name} does not exist.`);
  }

  return (overrides: P) => {
    const combinedProps = { ...props, ...overrides };
    return <BaseAction {...combinedProps} />;
  };
};
