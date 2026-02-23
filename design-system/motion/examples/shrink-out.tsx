/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { useState } from 'react';

import { css, jsx } from '@compiled/react';

import ButtonGroup from '@atlaskit/button/button-group';
import Button from '@atlaskit/button/new';
import { ExitingPersistence, ShrinkOut } from '@atlaskit/motion';
import { token } from '@atlaskit/tokens';

import { Block, Centered } from './utils';

const buttonContainerStyles = css({
	textAlign: 'center',
});

const blockStyles = css({
	width: 'auto',
	marginBlockEnd: token('space.050', '4px'),
	marginBlockStart: token('space.050', '4px'),
	marginInlineEnd: token('space.050', '4px'),
	marginInlineStart: token('space.050', '4px'),
	overflow: 'hidden'
});

const centeredStyles = css({
	height: '82px',
});

const apps = [
	'Confluence',
	'Bitbucket',
	'Jira Service Management',
	'Opsgenie',
	'Statuspage',
	'Jira Software',
];

export default (): JSX.Element => {
	const [actualApps, setApps] = useState(apps);

	return (
		<div>
			<div css={buttonContainerStyles}>
				<ButtonGroup label="App options">
					<Button onClick={() => setApps(apps)}>Reset</Button>
				</ButtonGroup>
			</div>

			<Centered css={centeredStyles}>
				<ExitingPersistence>
					{actualApps.map((app) => (
						<ShrinkOut key={app}>
							{(props) => (
								<Block {...props} appearance="small" css={blockStyles}>
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
