import React from 'react';

import { AtlassianInternalWarning, md } from '@atlaskit/docs';
import { TeamsLink } from '@atlaskit/teams-app-internal-navigation/teams-link';

const _default_1: any = md`
  ${(<AtlassianInternalWarning />)}

  A React component to display a card with user information.

  Go to one of the sub-pages for more detailed explanations of what you're looking for.

${(
	<ul>
		<li>
			<TeamsLink href="profilecard/docs/profilecard-trigger" intent="reference">
				To display User profile cards
			</TeamsLink>
		</li>
		<li>
			<TeamsLink href="profilecard/docs/team-profilecard" intent="reference">
				To display Team profile cards
			</TeamsLink>
		</li>
		<li>
			<TeamsLink href="profilecard/docs/profile-client" intent="reference">
				To customise the behaviour of the profile client, e.g. fetching data from a custom source.
			</TeamsLink>
		</li>
	</ul>
)}

`;
export default _default_1;
