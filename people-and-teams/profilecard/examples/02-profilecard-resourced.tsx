import React, { useState } from 'react';

import ButtonGroup from '@atlaskit/button/button-group';
import Button from '@atlaskit/button/new';
import { cssMap } from '@atlaskit/css';
import { Box } from '@atlaskit/primitives/compiled';
import { token } from '@atlaskit/tokens';

import ProfileCardResourced from '../src';

import ExampleWrapper from './helper/example-wrapper';
import { MainStage } from './helper/main-stage';
import { getMockProfileClient } from './helper/util';

const styles = cssMap({
	wrap: {
		marginBottom: token('space.250', '20px'),
	},
});

const Wrap = ({ children }: { children: React.ReactNode }) => {
	return <Box xcss={styles.wrap}>{children}</Box>;
};

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
