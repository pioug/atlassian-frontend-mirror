import { ActionName } from '../../../../constants';
import { FlexibleUiDataContext } from '../../../../state/flexible-ui-context/types';
import { FlexibleUiContext } from '../../../../state/flexible-ui-context';
import React, { useContext } from 'react';
import Action from './action';
import { FormattedMessage } from 'react-intl-next';
import { messages } from '../../../../messages';
import CrossIcon from '@atlaskit/icon/glyph/cross';
import EditIcon from '@atlaskit/icon/glyph/edit';
import PreviewAction from './action/preview-action';
import VidFullScreenOnIcon from '@atlaskit/icon/glyph/vid-full-screen-on';
import ViewAction from './action/view-action';
import ShortcutIcon from '@atlaskit/icon/glyph/shortcut';
import DownloadAction from './action/download-action';
import DownloadIcon from '@atlaskit/icon/glyph/download';

const actionMappings: Record<
  ActionName,
  { component: React.FC<any> | undefined; props?: any }
> = {
  [ActionName.CustomAction]: {
    component: Action,
    props: {},
  },
  [ActionName.DeleteAction]: {
    component: Action,
    props: {
      testId: 'smart-action-delete-action',
      content: <FormattedMessage {...messages.delete} />,
      icon: <CrossIcon label="Delete" />,
      tooltipMessage: <FormattedMessage {...messages.delete} />,
    },
  },
  [ActionName.EditAction]: {
    component: Action,
    props: {
      testId: 'smart-action-edit-action',
      content: <FormattedMessage {...messages.edit} />,
      icon: <EditIcon label="Edit" />,
      tooltipMessage: <FormattedMessage {...messages.edit} />,
    },
  },
  [ActionName.PreviewAction]: {
    component: PreviewAction,
    props: {
      testId: 'smart-action-preview-action',
      content: <FormattedMessage {...messages.preview} />,
      icon: <VidFullScreenOnIcon label="Full screen view" />,
      tooltipMessage: <FormattedMessage {...messages.preview} />,
    },
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
  [ActionName.DownloadAction]: {
    component: DownloadAction,
    props: {
      testId: 'smart-action-download-action',
      content: <FormattedMessage {...messages.download} />,
      icon: <DownloadIcon label="Download" />,
      tooltipMessage: <FormattedMessage {...messages.download} />,
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
    case ActionName.PreviewAction:
    case ActionName.ViewAction:
    case ActionName.DownloadAction:
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
