import React from 'react';

import { layers } from '@atlaskit/theme/constants';
import { MockPresenceResource } from '@atlaskit/util-data-test/mock-presence-resource';

import MentionTextInput from '../example-helpers/demo-mention-text-input';
import { slowResourceProvider } from '../example-helpers/index';
import { onSelection } from '../example-helpers/on-selection';

const tallPageStyle: React.CSSProperties = {
	height: '2000px',
};

const downPage: React.CSSProperties = {
	position: 'absolute',
	top: '400px',
};

export default function Example(): React.JSX.Element {
	return (
		// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
		<div style={tallPageStyle}>
			{/* eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766 */}
			<div style={downPage}>
				<MentionTextInput
					label="User search"
					onSelection={onSelection}
					resourceProvider={slowResourceProvider}
					presenceProvider={new MockPresenceResource(200, 500)}
					relativePosition="above"
					zIndex={layers.modal()}
				/>
			</div>
		</div>
	);
}
