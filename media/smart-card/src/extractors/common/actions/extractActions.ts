import { DownloadAction, ViewAction, ActionProps } from '@atlaskit/media-ui';
import { JsonLd } from 'json-ld-types';
import { InvokeHandler } from '../../../model/invoke-handler';
import { InvokeClientOpts, InvokeServerOpts } from '../../../model/invoke-opts';

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

const getServerActionProps = (
  jsonLd: JsonLd.Data.BaseData,
  action: JsonLd.Primitives.ServerAction,
  handler: InvokeHandler,
): ActionProps => {
  const id = (action['@id'] as string) || action['@type'];
  const data: InvokeServerOpts = {
    type: 'server' as const,
    key: action.identifier as string,
    action: {
      type: action['@type'],
      payload: {
        id,
        context: jsonLd.context,
      },
    },
  };
  return {
    id,
    text: action.name as string,
    promise: () => handler(data),
  };
};

const getActionsFromJsonLd = (
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

export function extractActions(
  jsonLd: JsonLd.Data.BaseData,
  handler: InvokeHandler,
): ActionProps[] {
  const actions = getActionsFromJsonLd(jsonLd);
  const clientActions = actions.filter(isClientAction);
  const serverActions = actions.filter((action) => !isClientAction(action));
  const clientActionImpls = clientActions.map((action) =>
    getClientActionProps(
      jsonLd,
      action as JsonLd.Primitives.ClientAction,
      handler,
    ),
  );
  const serverActionImpls = serverActions.map((action) =>
    getServerActionProps(
      jsonLd,
      action as JsonLd.Primitives.ServerAction,
      handler,
    ),
  );
  return [...clientActionImpls, ...serverActionImpls];
}
