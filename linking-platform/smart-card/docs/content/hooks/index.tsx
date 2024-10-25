import { code } from '@atlaskit/docs';

import actionOptions from '../../content/action-options';
import customMd from '../../utils/custom-md';

export default customMd`

### useSmartLinkEvents

Allows for the dispatch of analytics events for a given URL.

Returns a SmartLinkEvents object which can be used to trigger properly formed smart links events. Currently only supports the insertSmartLink event.

${code`
	const smartLinkEvents = useSmartLinkEvents();

	// trigger a smart link inserted analytics event
	smartLinkEvents.insertSmartLink(
		url,
		'inline',
		createAnalyticsEvent
	);
`}

### useSmartLinkActions

Extracts and returns actions for the given URL. \`useSmartLinkActions\` relies on the smart link context so usages must be wrapped in a \`SmartLinkProvider\` or equivalent.

${actionOptions}

${code`
	const actions = useSmartLinkActions({ url, apperance: 'block' });

	// render the actions
	actions.map(action => (
		<button onClick={action.handler}>
			{action.text}
		</button>
	));
`}


### useSmartLinkReload

Returns a function that can be used to programatically reload a smart link for a given URL. \`useSmartLinkReload\` relies on the smart link context so usages must be wrapped in a \`SmartLinkProvider\` or equivalent.

${code`
	const reload = useSmartLinkReload({ url });

	// reload the smart link
	reload();
`}
`;
