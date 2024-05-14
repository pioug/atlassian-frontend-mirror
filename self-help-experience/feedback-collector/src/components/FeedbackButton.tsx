import React, { PropsWithChildren, useState } from 'react';

import { useIntl } from 'react-intl-next';

import Button from '@atlaskit/button/new';
import { FlagGroup } from '@atlaskit/flag';
import FeedbackIcon from '@atlaskit/icon/glyph/feedback';

import { messages } from '../messages';

import FeedbackCollector from './FeedbackCollector';
import FeedbackFlag from './FeedbackFlag';
import { IntlProviderWithResolvedMessages } from './IntlProviderWithResolvedMessages';

type Props = PropsWithChildren<{
  entrypointId: string;
  atlassianAccountId?: string;
  shouldGetEntitlementDetails?: boolean;
}>;

/*
 * Standard feedback button with "Give Feedback" as the text and speaker icon on the left of the text
 * */
const FeedbackButton = (props: Props) => {
  const [isOpen, setIsOpen] = useState(false);
  const [displayFlag, setDisplayFlag] = useState(false);
  const { formatMessage } = useIntl();
  const { entrypointId, atlassianAccountId, shouldGetEntitlementDetails } =
    props;

  return (
    <>
      <Button
        onClick={() => setIsOpen(true)}
        iconBefore={FeedbackIcon}
        UNSAFE_iconBefore_size="small"
      >
        {formatMessage(messages.giveFeedback)}
      </Button>

      {isOpen && (
        <FeedbackCollector
          onClose={() => setIsOpen(false)}
          onSubmit={() => setDisplayFlag(true)}
          atlassianAccountId={atlassianAccountId}
          entrypointId={entrypointId}
          shouldGetEntitlementDetails={shouldGetEntitlementDetails}
        />
      )}

      <FlagGroup onDismissed={() => setDisplayFlag(false)}>
        {displayFlag && <FeedbackFlag />}
      </FlagGroup>
    </>
  );
};

const FeedbackButtonWithIntl = (props: Props) => {
  const { locale } = useIntl();
  return (
    <IntlProviderWithResolvedMessages locale={locale}>
      <FeedbackButton {...props} />
    </IntlProviderWithResolvedMessages>
  );
};

export default FeedbackButtonWithIntl;
