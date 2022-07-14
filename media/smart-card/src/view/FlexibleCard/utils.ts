import { JsonLd } from 'json-ld-types';
import { CardProviderRenderers } from '@atlaskit/link-provider';
import { RetryOptions } from './types';
import { SmartLinkStatus } from '../../constants';
import { getEmptyJsonLd, getUnauthorizedJsonLd } from '../../utils/jsonld';
import { extractRequestAccessContext } from '../../extractors/common/context';
import { MessageKey, messages } from '../../messages';
import { FlexibleUiDataContext } from '../../state/flexible-ui-context/types';
import extractFlexibleLinkContext from '../../extractors/flexible';
import { extractErrorIcon } from '../../extractors/flexible/icon';
import { handleOnClick } from '../../utils';
import { extractProvider } from '@atlaskit/linking-common/extractors';

export const getContextByStatus = (
  url: string,
  status?: SmartLinkStatus,
  details?: JsonLd.Response,
  renderers?: CardProviderRenderers,
): FlexibleUiDataContext | undefined => {
  switch (status) {
    case SmartLinkStatus.Pending:
    case SmartLinkStatus.Resolving:
      return { title: url, url };
    case SmartLinkStatus.Resolved:
      return extractFlexibleLinkContext(details, renderers);
    case SmartLinkStatus.Unauthorized:
    case SmartLinkStatus.Forbidden:
    case SmartLinkStatus.NotFound:
    case SmartLinkStatus.Errored:
    case SmartLinkStatus.Fallback:
    default:
      const linkIcon = extractErrorIcon(details, status);
      return { linkIcon, title: url, url };
  }
};

const getForbiddenMessageKey = (meta: JsonLd.Meta.BaseMeta): MessageKey => {
  const accessType = meta?.requestAccess?.accessType;
  switch (accessType) {
    case 'DIRECT_ACCESS':
      return 'join_to_view';
    case 'REQUEST_ACCESS':
      return 'request_access_to_view';
    case 'PENDING_REQUEST_EXISTS':
      return 'pending_request';
    case 'FORBIDDEN':
      return 'forbidden_access';
    case 'DENIED_REQUEST_EXISTS':
      return 'request_denied';
    default:
      return 'restricted_link';
  }
};

export const getRetryOptions = (
  url: string,
  status?: SmartLinkStatus,
  details?: JsonLd.Response,
  onAuthorize?: (() => void) | undefined,
): RetryOptions | undefined => {
  switch (status) {
    case SmartLinkStatus.Forbidden:
      const data = (details && details.data) || getEmptyJsonLd();
      const meta = details?.meta ?? getUnauthorizedJsonLd().meta;
      const provider = extractProvider(data as JsonLd.Data.BaseData);
      const context = provider?.text;
      const access = extractRequestAccessContext({
        jsonLd: meta,
        url,
        context,
      });
      const messageKey = getForbiddenMessageKey(meta);
      const descriptor = messages[messageKey as MessageKey];
      const values = context ? { context } : undefined;
      const retry = onAuthorize || access?.action?.promise;
      const onClick = retry ? handleOnClick(retry) : undefined;
      return { descriptor, onClick, values };
    case SmartLinkStatus.Unauthorized:
      return {
        descriptor: messages.connect_link_account,
        onClick: onAuthorize ? handleOnClick(onAuthorize) : undefined,
      };
    case SmartLinkStatus.NotFound:
      return { descriptor: messages.cannot_find_link };
  }
};
