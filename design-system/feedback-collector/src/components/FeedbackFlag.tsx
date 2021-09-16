import React from 'react';

import { AutoDismissFlag } from '@atlaskit/flag';
import SuccessIcon from '@atlaskit/icon/glyph/check-circle';
import { G300 } from '@atlaskit/theme/colors';
import { token } from '@atlaskit/tokens';

interface AkProps {
  isDismissAllowed?: boolean;
  description?: React.ReactText;
  title?: React.ReactText;
  onDismissed?: (...args: Array<any>) => void;
}
const FeedbackFlag = (props: AkProps) => (
  <AutoDismissFlag
    icon={
      <SuccessIcon
        primaryColor={token('color.iconBorder.success', G300)}
        label="Success"
      />
    }
    id="feedbackSent"
    description={
      props.description
        ? props.description
        : 'Your valuable feedback helps us continually improve our products.'
    }
    title={props.title ? props.title : 'Thanks!'}
    {...props}
  />
);

export default FeedbackFlag;
