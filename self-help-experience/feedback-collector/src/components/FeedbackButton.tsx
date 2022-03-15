import React, { useState } from 'react';

import { useIntl } from 'react-intl-next';

import Button from '@atlaskit/button';
import { FlagGroup } from '@atlaskit/flag';
import FeedbackIcon from '@atlaskit/icon/glyph/feedback';

import FeedbackCollector from './FeedbackCollector';
import FeedbackFlag from './FeedbackFlag';
import { messages } from './messages';

interface Props {
  embeddableKey: string;
  requestTypeId: string;
  email?: string;
}

const FeedbackButton = (props: Props) => {
  const [isOpen, setIsOpen] = useState(false);
  const [displayFlag, setDisplayFlag] = useState(false);
  const { formatMessage } = useIntl();
  const { embeddableKey, requestTypeId, email } = props;

  return (
    <>
      <Button
        onClick={() => setIsOpen(true)}
        iconBefore={
          <FeedbackIcon
            label={formatMessage(messages.feedbackIconLabel)}
            size="small"
          />
        }
      >
        {formatMessage(messages.giveFeedback)}
      </Button>

      {isOpen && (
        <FeedbackCollector
          onClose={() => setIsOpen(false)}
          onSubmit={() => setDisplayFlag(true)}
          email={email}
          requestTypeId={requestTypeId}
          embeddableKey={embeddableKey}
        />
      )}

      <FlagGroup onDismissed={() => setDisplayFlag(false)}>
        {displayFlag && <FeedbackFlag />}
      </FlagGroup>
    </>
  );
};

export default FeedbackButton;
