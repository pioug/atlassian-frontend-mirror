import { JsonLd } from 'json-ld-types';
import {
  RequestAccessContextProps,
  ForbiddenAction,
  messages,
} from '@atlaskit/media-ui';

export const extractRequestAccessContext = ({
  jsonLd,
  url,
  context,
}: {
  jsonLd: JsonLd.Meta.BaseMeta;
  url: string;
  context?: string;
}): RequestAccessContextProps => {
  switch (jsonLd?.requestAccess?.accessType) {
    case 'DIRECT_ACCESS':
      return {
        ...jsonLd?.requestAccess,
        callToActionMessageKey: 'click_to_join',
        descriptiveMessageKey: 'click_to_join_description',
        action: ForbiddenAction(
          () => window.open(url),
          'click_to_join',
          messages.click_to_join,
          context,
        ),
      };
    case 'REQUEST_ACCESS':
      return {
        ...jsonLd?.requestAccess,
        callToActionMessageKey: 'request_access',
        descriptiveMessageKey: 'request_access_description',
        action: ForbiddenAction(
          () => window.open(url),
          'request_access',
          messages.request_access,
          context,
        ),
      };
    case 'PENDING_REQUEST_EXISTS':
      return {
        ...jsonLd?.requestAccess,
        descriptiveMessageKey: 'request_access_pending_description',
      };
    case 'FORBIDDEN':
      return {
        ...jsonLd?.requestAccess,
        descriptiveMessageKey: 'forbidden_description',
      };
    case 'DENIED_REQUEST_EXISTS':
      return {
        ...jsonLd?.requestAccess,
        descriptiveMessageKey: 'request_denied_description',
      };
    default:
      return jsonLd?.requestAccess;
  }
};
