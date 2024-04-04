import { JsonLd } from 'json-ld-types';
import { ExtractFlexibleUiDataContextParams, RetryOptions } from './types';
import { SmartLinkStatus } from '../../constants';
import { getEmptyJsonLd, getForbiddenJsonLd } from '../../utils/jsonld';
import { extractRequestAccessContextImproved } from '../../extractors/common/context';
import { MessageKey, messages } from '../../messages';
import { FlexibleUiDataContext } from '../../state/flexible-ui-context/types';
import extractFlexibleUiContext from '../../extractors/flexible';
import { extractErrorIcon } from '../../extractors/flexible/icon';
import { handleOnClick } from '../../utils';
import { extractProvider } from '@atlaskit/link-extractors';
import extractProviderIcon from '../../extractors/flexible/icon/extract-provider-icon';
import extractPreview from '../../extractors/flexible/extract-preview';

export const getContextByStatus = (
  params: ExtractFlexibleUiDataContextParams,
): FlexibleUiDataContext | undefined => {
  const { response, status, url } = params ?? {};
  switch (status) {
    case SmartLinkStatus.Pending:
    case SmartLinkStatus.Resolving:
      return { title: url, url };
    case SmartLinkStatus.Resolved:
      return extractFlexibleUiContext(params);
    case SmartLinkStatus.Unauthorized:
    case SmartLinkStatus.Forbidden:
    case SmartLinkStatus.NotFound:
    case SmartLinkStatus.Errored:
    case SmartLinkStatus.Fallback:
    default:
      const preview = extractPreview(response?.data as JsonLd.Data.BaseData);
      const linkIcon = extractErrorIcon(response, status);
      const provider = extractProviderIcon(
        response?.data as JsonLd.Data.BaseData,
      );
      return { linkIcon, title: url, url, provider, preview };
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
  response?: JsonLd.Response,
  onAuthorize?: (() => void) | undefined,
): RetryOptions | undefined => {
  const data = (response && response.data) || getEmptyJsonLd();
  const provider = extractProvider(data as JsonLd.Data.BaseData);
  const context = provider?.text;
  const values = context ? { context } : undefined;
  switch (status) {
    case SmartLinkStatus.Forbidden:
      const meta = response?.meta ?? getForbiddenJsonLd().meta;
      const access = extractRequestAccessContextImproved({
        jsonLd: meta,
        url,
        product: context ?? '',
      });
      const messageKey = getForbiddenMessageKey(meta);
      const descriptor = messages[messageKey as MessageKey];
      const retry = onAuthorize || access?.action?.promise;
      const onClick =
        retry && !(access?.buttonDisabled ?? false)
          ? handleOnClick(retry)
          : undefined;
      return { descriptor, onClick, values };
    case SmartLinkStatus.Unauthorized:
      return onAuthorize
        ? {
            descriptor: messages.connect_link_account_card_name,
            onClick: handleOnClick(onAuthorize),
            values,
          }
        : undefined;
    case SmartLinkStatus.NotFound:
      return { descriptor: messages.cannot_find_link };
  }
};
