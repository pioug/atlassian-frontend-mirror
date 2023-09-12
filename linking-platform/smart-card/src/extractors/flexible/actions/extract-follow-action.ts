import { extractLink } from '@atlaskit/link-extractors';
import { SmartLinkActionType } from '@atlaskit/linking-types';
import type { JsonLd } from 'json-ld-types';

import { ServerActionProp } from '../../../state/flexible-ui-context/types';
import { getExtensionKey } from '../../../state/helpers';
import { ServerActionOptions } from '../../../view/FlexibleCard/types';

import extractServerAction from '../extract-server-action';

const extractFollowAction = (
  response?: JsonLd.Response,
  showServerActions?: boolean | ServerActionOptions,
  id?: string,
): ServerActionProp<boolean> | undefined => {
  if (!showServerActions) {
    return;
  }

  const extensionKey = getExtensionKey(response);
  const data = response?.data as JsonLd.Data.BaseData;
  const actions = extractServerAction(data);
  if (!extensionKey || actions.length === 0) {
    return;
  }

  const action = actions.find((item) => {
    if (item?.name === 'UpdateAction') {
      const actionName = (item as JsonLd.Primitives.UpdateAction)
        ?.dataUpdateAction?.name;
      return (
        actionName === SmartLinkActionType.FollowEntityAction ||
        actionName === SmartLinkActionType.UnfollowEntityAction
      );
    }
    return false;
  }) as JsonLd.Primitives.UpdateAction;

  if (!action || !action.resourceIdentifiers) {
    return;
  }

  const url = extractLink(data);
  const reload = url ? { id, url } : undefined;

  const actionType = action.dataUpdateAction?.name as SmartLinkActionType;

  return {
    action: {
      action: {
        actionType,
        resourceIdentifiers: action.resourceIdentifiers,
      },
      providerKey: extensionKey,
      reload,
    },
    value: actionType === SmartLinkActionType.FollowEntityAction,
  };
};

export default extractFollowAction;
