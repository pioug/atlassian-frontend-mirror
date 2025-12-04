import React from 'react';

import { UnAuthClient } from '@atlaskit/link-test-helpers';

import VRCardView from '../utils/vr-card-view';

export const BlockCardUnauthorisedNewDesign = (): React.JSX.Element => (
	<VRCardView 
		appearance="block" 
		client={new UnAuthClient()} 
		urls={[
			'https://www.figma.com/slides/vW47To0dYPnT7jlrJdUd7h/Universal-Create-in-TwC?node-id=asdasdasd',
			'https://docs.google.com/document/d/1Bm3FqWFYWIKDtm77nEfo4nYe23qbJl4wT2E0S0BVTwA/edit?usp=sharing',
			'https://atlassian.enterprise.slack.com/archives/C07TNMDEVHC',
			'https://onedrive.live.com/?cid=DB7D70440F201358&id=DB7D70440F201358%21103&parId=root&o=OneUp',
			'https://www.dropbox.com/scl/fi/scebraopvx4bni0sechq9/Atlas23_D1_A_0014.jpg?rlkey=asdasdasd'
		]}
		style={{
			// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop
			width: '600px',
		}}
	/>
);
