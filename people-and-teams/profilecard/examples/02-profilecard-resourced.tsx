import React, { useState } from 'react';

import styled from '@emotion/styled';

import ButtonGroup from '@atlaskit/button/button-group';
import Button from '@atlaskit/button/new';
import { token } from '@atlaskit/tokens';

import ProfileCardResourced from '../src';

import ExampleWrapper from './helper/example-wrapper';
import { getMockProfileClient } from './helper/util';

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-styled -- To migrate as part of go/ui-styling-standard
export const Wrap = styled.div({
	marginBottom: token('space.250', '20px'),
});

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-styled -- To migrate as part of go/ui-styling-standard
export const MainStage = styled.div({
	margin: token('space.200', '16px'),
});

const mockClient = getMockProfileClient(10, 0);
// With a real client this would look like:
// const client = new ProfileClient({ url: 'http://api/endpoint' });

const defaultProps = {
	cloudId: 'dummy-cloud',
	resourceClient: mockClient,
	actions: [
		{
			label: 'View profile',
			id: 'view-profile',
			shouldRender: (data: any) => data && data.accountType !== 'customer',
			callback: () => {},
		},
	],
};

export default function Example() {
	const [actions, setActions] = useState(defaultProps.actions);
	const [resourceClient, setResourceClient] = useState(defaultProps.resourceClient);

	const handleChangeActions = () => {
		setActions([
			{
				label: 'View profile - ' + Date.now(),
				id: 'view-profile - ' + Date.now(),
				callback: () => {},
				shouldRender: (data: any) => data && data.accountType !== 'customer',
			},
		]);
	};

	const handleChangeResourceClient = () => {
		setResourceClient(getMockProfileClient(10, 0));
	};

	return (
		<ExampleWrapper>
			<MainStage>
				<Wrap>
					<ButtonGroup>
						{/* Check re-rederning Profile Card when `actions` is changed */}
						<Button onClick={handleChangeActions}>Update "actions" props</Button>
						{/* Check re-fetching data when `resourceClient` is changed */}
						<Button onClick={handleChangeResourceClient}>Update "resourceClient" props</Button>
					</ButtonGroup>
				</Wrap>
				<Wrap>
					<ProfileCardResourced
						{...defaultProps}
						userId="1"
						actions={actions}
						resourceClient={resourceClient}
					/>
				</Wrap>
				<br />
				<Wrap>
					<ProfileCardResourced
						{...defaultProps}
						userId="2"
						actions={actions}
						resourceClient={resourceClient}
					/>
				</Wrap>
				<br />
				<Wrap>
					<ProfileCardResourced
						{...defaultProps}
						userId="error:NotFound"
						actions={actions}
						resourceClient={resourceClient}
					/>
				</Wrap>
				<br /> Customer account
				<Wrap>
					<ProfileCardResourced
						{...defaultProps}
						userId="3"
						actions={actions}
						resourceClient={resourceClient}
					/>
				</Wrap>
			</MainStage>
		</ExampleWrapper>
	);
}
