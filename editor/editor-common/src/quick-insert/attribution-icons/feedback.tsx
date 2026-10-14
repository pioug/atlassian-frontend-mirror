import React from 'react';

import { feedbackIcon } from '@atlaskit/logo/raw-icons';

/** Decorative product icon accompanying the localized Feedback attribution name. */
export const FeedbackAttributionIcon = (): React.JSX.Element => (
	<img src={feedbackIcon} alt="" width={16} height={16} />
);
