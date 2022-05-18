import React from 'react';
import SectionMessage, {
  SectionMessageAction,
} from '@atlaskit/section-message';
import { toAbsolutePath } from './index';

const FlexibleUiMessage: React.FC = () => {
  const learnMoreLink = toAbsolutePath('./flexible');
  return (
    <SectionMessage
      actions={[
        <SectionMessageAction href={learnMoreLink}>
          Learn more
        </SectionMessageAction>,
        <SectionMessageAction href="https://atlassian.slack.com/archives/CFKGAQZRV">
          Request and feedback
        </SectionMessageAction>,
      ]}
    >
      This component requires Flexible Smart Links to function properly.
      Flexible Smart Links is a feature offered via Smart Links.
    </SectionMessage>
  );
};

export default FlexibleUiMessage;
