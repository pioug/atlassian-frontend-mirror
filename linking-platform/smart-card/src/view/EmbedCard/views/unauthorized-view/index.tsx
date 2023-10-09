import Button from '@atlaskit/button';
import React, { type FC, useCallback, useMemo } from 'react';
import { FormattedMessage } from 'react-intl-next';
import { di } from 'react-magnetic-di';

import { messages } from '../../../../messages';
import UnauthorisedViewContent from '../../../common/UnauthorisedViewContent';
import { getUnresolvedEmbedCardImage } from '../../utils';
import UnresolvedView from '../unresolved-view';
import { UnauthorizedViewProps } from './types';

const UnauthorizedView: FC<UnauthorizedViewProps> = ({
  analytics,
  context,
  extensionKey,
  onAuthorize,
  testId = 'embed-card-unauthorized-view',
  ...unresolvedViewProps
}) => {
  di(getUnresolvedEmbedCardImage);

  const handleOnAuthorizeClick = useCallback(() => {
    if (onAuthorize) {
      analytics.track.appAccountAuthStarted({
        extensionKey,
      });

      onAuthorize();
    }
  }, [onAuthorize, analytics.track, extensionKey]);

  const content = useMemo(() => {
    if (onAuthorize) {
      // Our title and button messages always expect the product name to be present
      // while the description support when product name is not present.
      // To be looked at https://product-fabric.atlassian.net/browse/EDM-8173
      const values = { context: context?.text ?? '' };
      if (values) {
        // title: Connect your {context} account
        // button: Connect to {context}
        return {
          title: (
            <FormattedMessage
              {...messages.connect_link_account_card_name}
              values={values}
            />
          ),
          description: (
            <UnauthorisedViewContent
              analytics={analytics}
              providerName={context?.text}
              testId={testId}
            />
          ),
          button: (
            <Button
              testId="connect-account"
              appearance="primary"
              onClick={handleOnAuthorizeClick}
            >
              <FormattedMessage
                {...messages.connect_unauthorised_account_action}
                values={values}
              />
            </Button>
          ),
        };
      }
    }

    const values = context?.text ? { context: context?.text } : undefined;
    if (values) {
      // title: We can't display private pages from {context}
      // description: You're trying to preview a link to a private {context} page. We recommend you review the URL or contact the page owner.
      return {
        title: (
          <FormattedMessage
            {...messages.unauthorised_account_name}
            values={values}
          />
        ),
        description: (
          <FormattedMessage
            {...messages.unauthorised_account_description}
            values={values}
          />
        ),
      };
    }

    // title: We can't display private pages
    // description: You're trying to preview a link to a private page. We recommend you review the URL or contact the page owner.
    return {
      title: (
        <FormattedMessage {...messages.unauthorised_account_name_no_provider} />
      ),
      description: (
        <FormattedMessage
          {...messages.unauthorised_account_description_no_provider}
        />
      ),
    };
  }, [analytics, context?.text, handleOnAuthorizeClick, onAuthorize, testId]);

  return (
    <UnresolvedView
      {...unresolvedViewProps}
      {...content}
      icon={context?.icon}
      image={context?.image ?? getUnresolvedEmbedCardImage('unauthorized')}
      testId={testId}
      text={context?.text}
    />
  );
};

export default UnauthorizedView;
