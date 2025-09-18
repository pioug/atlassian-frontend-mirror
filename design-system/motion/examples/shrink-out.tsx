/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { useState } from 'react';

import { jsx } from '@compiled/react';

import ButtonGroup from '@atlaskit/button/button-group';
import Button from '@atlaskit/button/new';
import { ExitingPersistence, ShrinkOut } from '@atlaskit/motion';
import { token } from '@atlaskit/tokens';

import { Block, Centered } from './utils';

const apps = [
	'Confluence',
	'Bitbucket',
	'Jira Service Management',
	'Opsgenie',
	'Statuspage',
	'Jira Software',
];

export default () => {
	const [actualApps, setApps] = useState(apps);

	return (
		<div>
			{/* eslint-disable-next-line @atlaskit/design-system/consistent-css-prop-usage -- Ignored via go/DSP-18766 */}
			<div css={{ textAlign: 'center' }}>
				<ButtonGroup label="App options">
					<Button onClick={() => setApps(apps)}>Reset</Button>
				</ButtonGroup>
			</div>

			<Centered css={{ height: '82px' }}>
				<ExitingPersistence>
					{actualApps.map((app) => (
						<ShrinkOut key={app}>
							{(props) => (
								<Block
									{...props}
									appearance="small"
									css={{
										width: 'auto',
										margin: token('space.050', '4px'),
										overflow: 'hidden',
									}}
								>
									<Button
										onClick={() => {
											setApps((prods) => prods.filter((val) => val !== app));
										}}
									>
										{app}
									</Button>
								</Block>
							)}
						</ShrinkOut>
					))}
				</ExitingPersistence>
			</Centered>
		</div>
	);
};
