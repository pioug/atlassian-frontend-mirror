import { type JsonLd } from 'json-ld-types';
import { type InvokeHandler } from '../../../model/invoke-handler';
import { type InvokeClientOpts } from '../../../model/invoke-opts';
import { type ActionProps } from '../../../view/BlockCard/components/Action';
import { ViewAction } from '../../../view/BlockCard/actions/ViewAction';
import { DownloadAction } from '../../../view/BlockCard/actions/DownloadAction';
import { CardAction, type CardActionOptions } from '../../../view/Card/types';
import { canShowAction } from '../../../utils/actions/can-show-action';

const isClientAction = (action: JsonLd.Primitives.Action) =>
  ['ViewAction', 'DownloadAction'].indexOf(action['@type']) > -1;

const getClientAction = (
  jsonLd: JsonLd.Data.BaseData,
  action: JsonLd.Primitives.ClientAction,
): ActionProps => {
  switch (action['@type']) {
    case 'ViewAction':
      return ViewAction({ url: jsonLd.url as string });
    case 'DownloadAction':
      return DownloadAction({ url: jsonLd['atlassian:downloadUrl'] });
  }
};

const isActionEnabled = (
  action: JsonLd.Primitives.Action,
  actionOptions?: CardActionOptions,
): boolean => {
  switch (action['@type']) {
    case 'ViewAction':
      return canShowAction(CardAction.ViewAction, actionOptions);
    case 'DownloadAction':
      return canShowAction(CardAction.DownloadAction, actionOptions);
  }

  return true;
};

const getClientActionProps = (
  jsonLd: JsonLd.Data.BaseData,
  action: JsonLd.Primitives.ClientAction,
  handler: InvokeHandler,
): ActionProps => {
  const clientAction = getClientAction(jsonLd, action);
  const clientActionInvokeOpts: InvokeClientOpts = {
    type: 'client' as const,
    key: action.identifier as string,
    action: {
      type: action['@type'],
      promise: clientAction.promise,
    },
  };
  // Send client actions through common invocation flow; for analytics
  // and, in future, in order to propagate state changes.
  return { ...clientAction, promise: () => handler(clientActionInvokeOpts) };
};

export const getActionsFromJsonLd = (
  jsonLd: JsonLd.Data.BaseData,
): JsonLd.Primitives.Action[] => {
  let actions = jsonLd && jsonLd['schema:potentialAction'];
  if (!actions) {
    return [];
  }
  if (actions && !Array.isArray(actions)) {
    actions = [actions];
  }
  return actions;
};

export function extractClientActions(
  jsonLd: JsonLd.Data.BaseData,
  handler: InvokeHandler,
  actionOptions?: CardActionOptions,
): ActionProps[] {
  const actions = getActionsFromJsonLd(jsonLd);
  const clientActions = actions.filter(
    (action) =>
      isClientAction(action) && isActionEnabled(action, actionOptions),
  );

  const clientActionImpls = clientActions.map((action) =>
    getClientActionProps(
      jsonLd,
      action as JsonLd.Primitives.ClientAction,
      handler,
    ),
  );

  return clientActionImpls;
}
