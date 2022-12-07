import React from 'react';
import { FormattedMessage } from 'react-intl-next';
import { messages } from '../../messages';
import { CONTENT_URL_SECURITY_AND_PERMISSIONS } from '../../constants';

type UnauthorisedViewContentProps = {
  /**
   * Is the name of the provider for the account that needs to be connected
   * Eg. Google, Microsoft etc
   */
  providerName?: string;

  /**
   * A `testId` prop is provided for specified elements, which is a unique
   * string that appears as a data attribute `data-testid` in the rendered code,
   * serving as a hook for automated tests
   */
  testId?: string;
};

/**
 * This component is used in unauthorized views of a smart link.
 * It represents the main text that provides a user with information on how to connect their account
 */
const UnauthorisedViewContent = ({
  providerName,
  testId = 'unauthorised-view-content',
}: UnauthorisedViewContentProps) => (
  <>
    <FormattedMessage
      {...messages.connect_unauthorised_account_description}
      values={{ context: providerName }}
    />{' '}
    <a
      href={CONTENT_URL_SECURITY_AND_PERMISSIONS}
      target="_blank"
      data-testid={`${testId}-learn-more`}
    >
      <FormattedMessage {...messages.learn_more_about_smart_links_security} />
    </a>
  </>
);

export default UnauthorisedViewContent;
