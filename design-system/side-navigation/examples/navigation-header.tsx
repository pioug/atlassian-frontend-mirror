import React, { type MouseEvent } from 'react';

import { Box } from '@atlaskit/primitives';

import { Header, NavigationHeader } from '../src';

import RocketIcon from './common/sample-logo';

const Example = () => {
	return (
		// eslint-disable-next-line @atlassian/a11y/interactive-element-not-keyboard-focusable
		<Box onClick={(e: MouseEvent) => e.preventDefault()}>
			<NavigationHeader>
				<Header description="Next-gen software">Concise Systems</Header>
			</NavigationHeader>

			<NavigationHeader>
				<Header iconBefore={<RocketIcon />} description="Next-gen software">
					Concise Systems
				</Header>
			</NavigationHeader>
		</Box>
	);
};

export default Example;
