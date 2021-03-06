import React from 'react';

import { AutoDismissFlag } from '@atlaskit/flag';
import SuccessIcon from '@atlaskit/icon/glyph/check-circle';
import { G300 } from '@atlaskit/theme/colors';

interface AkProps {
  isDismissAllowed?: boolean;
  onDismissed?: (...args: Array<any>) => void;
}
const FeedbackFlag = (props: AkProps) => (
  <AutoDismissFlag
    icon={<SuccessIcon primaryColor={G300} label="Success" />}
    id="feedbackSent"
    description="Your valuable feedback helps us continually improve our products."
    title="Thanks!"
    {...props}
  />
);

export default FeedbackFlag;
