import React from 'react';

import { resourceProvider } from '../example-helpers/index';
import { MockPresenceResource } from '@atlaskit/util-data-test/mock-presence-resource';
import MentionTextInput from '../example-helpers/demo-mention-text-input';
import { onSelection } from '../example-helpers/on-selection';

export default function Example(): React.JSX.Element {
	return (
		<MentionTextInput
			label="User search"
			onSelection={onSelection}
			resourceProvider={resourceProvider}
			presenceProvider={new MockPresenceResource()}
		/>
	);
}
