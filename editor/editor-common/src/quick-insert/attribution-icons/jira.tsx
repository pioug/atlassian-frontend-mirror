import React from 'react';

import { jiraIcon } from '@atlaskit/logo/raw-icons';

/** Decorative product icon accompanying the localized Jira attribution name. */
export const JiraAttributionIcon = (): React.JSX.Element => (
	<img src={jiraIcon} alt="" width={16} height={16} />
);
