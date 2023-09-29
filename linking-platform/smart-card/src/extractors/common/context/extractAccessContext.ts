import { JsonLd } from 'json-ld-types';
import { messages } from '../../../messages';
import { RequestAccessContextProps } from '../../../view/types';
import { ForbiddenAction } from '../../../view/BlockCard/actions/ForbiddenAction';

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
          { context },
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
          { context },
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

export const extractRequestAccessContextImproved = ({
  jsonLd,
  url,
  product,
}: {
  jsonLd: JsonLd.Meta.BaseMeta;
  url: string;
  product: string;
}): RequestAccessContextProps => {
  switch (jsonLd?.requestAccess?.accessType) {
    case 'DIRECT_ACCESS':
      return {
        ...jsonLd?.requestAccess,
        titleMessageKey: 'direct_access_title_crossjoin',
        descriptiveMessageKey: 'direct_access_description_crossjoin',
        callToActionMessageKey: 'direct_access_crossjoin',
        action: ForbiddenAction(
          () => window.open(url),
          'direct_access',
          messages.direct_access_crossjoin,
          { product },
        ),
      };
    case 'REQUEST_ACCESS':
      return {
        ...jsonLd?.requestAccess,
        titleMessageKey: 'default_no_access_title_crossjoin',
        descriptiveMessageKey: 'request_access_description_crossjoin',
        callToActionMessageKey: 'request_access_crossjoin',
        action: ForbiddenAction(
          () => window.open(url),
          'request_access',
          messages.request_access_crossjoin,
        ),
      };
    case 'PENDING_REQUEST_EXISTS':
      return {
        ...jsonLd?.requestAccess,
        titleMessageKey: 'request_access_pending_title_crossjoin',
        descriptiveMessageKey: 'request_access_pending_description_crossjoin',
        callToActionMessageKey: 'request_access_pending_crossjoin',
        action: ForbiddenAction(
          () => window.open(url),
          'request_access_pending',
          messages.request_access_pending_crossjoin,
        ),
      };
    case 'DENIED_REQUEST_EXISTS':
      return {
        ...jsonLd?.requestAccess,
        titleMessageKey: 'default_no_access_title_crossjoin',
        descriptiveMessageKey: 'request_denied_description_crossjoin',
      };
    case 'ACCESS_EXISTS':
      return {
        ...jsonLd?.requestAccess,
        titleMessageKey: 'default_no_access_title_crossjoin',
        descriptiveMessageKey: 'access_exists_description_crossjoin',
        callToActionMessageKey: 'request_access_crossjoin',
        action: ForbiddenAction(
          () => window.open(url),
          'access_exists',
          messages.request_access_crossjoin,
        ),
      };
    case 'FORBIDDEN':
      return {
        ...jsonLd?.requestAccess,
        titleMessageKey: 'forbidden_title_crossjoin',
        descriptiveMessageKey: 'forbidden_description_crossjoin',
      };
    default:
      return jsonLd?.requestAccess;
  }
};
