import { JsonLd } from 'json-ld-types';
import { messages } from '../../../messages';
import { RequestAccessContextProps } from '../../../view/types';
import { ForbiddenAction } from '../../../view/BlockCard/actions/ForbiddenAction';
import extractHostname from '../hostname/extractHostname';
import { CreateUIAnalyticsEvent } from '@atlaskit/analytics-next';
import { ANALYTICS_CHANNEL } from '../../../utils/analytics';

export const extractRequestAccessContext = ({
  jsonLd,
  url,
  product,
}: {
  jsonLd: JsonLd.Meta.BaseMeta;
  url: string;
  product?: string;
}): RequestAccessContextProps => {
  const requestAccess = jsonLd?.requestAccess
    ? {
        ...jsonLd?.requestAccess,
        hostname: extractHostname(url),
      }
    : undefined;

  switch (jsonLd?.requestAccess?.accessType) {
    case 'DIRECT_ACCESS':
      return {
        ...requestAccess,
        callToActionMessageKey: 'click_to_join',
        descriptiveMessageKey: 'click_to_join_description',
        action: ForbiddenAction(
          () => window.open(url),
          'click_to_join',
          messages.click_to_join,
          { context: product },
        ),
      };
    case 'REQUEST_ACCESS':
      return {
        ...requestAccess,
        callToActionMessageKey: 'request_access',
        descriptiveMessageKey: 'request_access_description',
        action: ForbiddenAction(
          () => window.open(url),
          'request_access',
          messages.request_access,
          { product },
        ),
      };
    case 'PENDING_REQUEST_EXISTS':
      return {
        ...requestAccess,
        descriptiveMessageKey: 'request_access_pending_description',
      };
    case 'FORBIDDEN':
      return {
        ...requestAccess,
        descriptiveMessageKey: 'forbidden_description',
      };
    case 'DENIED_REQUEST_EXISTS':
      return {
        ...requestAccess,
        descriptiveMessageKey: 'request_denied_description',
      };
    default:
      return requestAccess;
  }
};

export const extractRequestAccessContextImproved = ({
  jsonLd,
  url,
  product,
  createAnalyticsEvent,
}: {
  jsonLd: JsonLd.Meta.BaseMeta;
  url: string;
  product: string;
  createAnalyticsEvent: CreateUIAnalyticsEvent;
}): RequestAccessContextProps => {
  const requestAccess = jsonLd?.requestAccess
    ? {
        ...jsonLd?.requestAccess,
        hostname: extractHostname(url),
      }
    : undefined;
  switch (jsonLd?.requestAccess?.accessType) {
    case 'DIRECT_ACCESS':
      return {
        ...requestAccess,
        titleMessageKey: 'direct_access_title',
        descriptiveMessageKey: 'direct_access_description',
        callToActionMessageKey: 'direct_access',
        action: ForbiddenAction(
          () => {
            createAnalyticsEvent({
              action: 'clicked',
              actionSubject: 'button',
              actionSubjectId: 'crossJoin',
              eventType: 'ui',
            }).fire(ANALYTICS_CHANNEL);

            window.open(url);
          },
          'direct_access',
          messages.direct_access,
          { product },
        ),
      };
    case 'REQUEST_ACCESS':
      return {
        ...requestAccess,
        titleMessageKey: 'default_no_access_title',
        descriptiveMessageKey: 'request_access_description',
        callToActionMessageKey: 'request_access',
        action: ForbiddenAction(
          () => {
            createAnalyticsEvent({
              action: 'clicked',
              actionSubject: 'button',
              actionSubjectId: 'requestAccess',
              eventType: 'ui',
            }).fire(ANALYTICS_CHANNEL);

            window.open(url);
          },
          'request_access',
          messages.request_access,
        ),
      };
    case 'PENDING_REQUEST_EXISTS':
      return {
        ...requestAccess,
        titleMessageKey: 'request_access_pending_title',
        descriptiveMessageKey: 'request_access_pending_description',
        callToActionMessageKey: 'request_access_pending',
        action: ForbiddenAction(
          () => window.open(url),
          'request_access_pending',
          messages.request_access_pending,
        ),
        buttonDisabled: true,
      };
    case 'DENIED_REQUEST_EXISTS':
      return {
        ...requestAccess,
        titleMessageKey: 'forbidden_title',
        descriptiveMessageKey: 'request_denied_description',
      };
    case 'ACCESS_EXISTS':
      if (jsonLd?.visibility === 'not_found') {
        return {
          ...requestAccess,
          titleMessageKey: 'not_found_title',
          descriptiveMessageKey: 'not_found_description',
        };
      }

      return {
        ...requestAccess,
        titleMessageKey: 'forbidden_title',
        descriptiveMessageKey: 'access_exists_description',
        callToActionMessageKey: 'request_access',
        action: ForbiddenAction(
          () => {
            createAnalyticsEvent({
              action: 'clicked',
              actionSubject: 'button',
              actionSubjectId: 'requestAccess',
              eventType: 'ui',
            }).fire(ANALYTICS_CHANNEL);

            window.open(url);
          },
          'access_exists',
          messages.request_access,
        ),
      };
    case 'FORBIDDEN':
      return {
        ...requestAccess,
        titleMessageKey: 'forbidden_title',
        descriptiveMessageKey: 'forbidden_description',
      };
    default:
      return requestAccess;
  }
};
