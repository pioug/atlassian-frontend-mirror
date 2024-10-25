import React from 'react';

import aiSummary from './content/card-actions/ai-summary';
import automation from './content/card-actions/automation';
import copy from './content/card-actions/copy';
import download from './content/card-actions/download';
import follow from './content/card-actions/follow';
import preview from './content/card-actions/preview';
import recentLinks from './content/card-actions/recent-links';
import status from './content/card-actions/status';
import ContentTable from './utils/content-table';
import customMd from './utils/custom-md';
import QuickLinks from './utils/quick-links';

export default customMd`

${(<QuickLinks />)}

Smart Link actions allow users to interact with linked content more efficiently without leaving their current context.
See available actions below.

&nbsp;

${(
	<ContentTable
		items={[
			{ name: 'Preview action', content: preview },
			{ name: 'Download action', content: download },
			{ name: 'Copy link action', content: copy },
			{ name: 'Jira status change action', content: status },
			{ name: 'Follow project/goal action', content: follow },
			{ name: 'AI summary action', content: aiSummary },
			{ name: 'Automation action', content: automation },
			{ name: 'Recent links action', content: recentLinks },
		]}
	/>
)}

`;
