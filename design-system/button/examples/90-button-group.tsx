import React from 'react';

import AudioIcon from '@atlaskit/icon/glyph/audio';
import { Box, Stack, xcss } from '@atlaskit/primitives';

import { ButtonGroup } from '../src';
import Button, { LinkButton } from '../src/new';

const constrainedRowStyles = xcss({
	width: 'size.1000',
	overflowX: 'scroll',
});

const ConstrainedRow = (props: { children: React.ReactNode }) => (
	<Box xcss={constrainedRowStyles}>{props.children}</Box>
);

export default function ButtonGroupExample() {
	return (
		<Stack alignInline="start" space="space.100">
			<h2 id="heading-appearance">Button appearance</h2>
			<ButtonGroup titleId="heading-appearance">
				<Button>Default</Button>
				<Button appearance="primary">Primary</Button>
				<Button appearance="warning">Warning</Button>
				<Button appearance="danger">Error</Button>
			</ButtonGroup>
			<h2 id="heading-options">Item options</h2>
			<ButtonGroup appearance="primary" titleId="heading-options">
				<Button>Save</Button>
				<Button>Edit</Button>
				<Button>Delete</Button>
			</ButtonGroup>
			<h2 id="heading-links">Link buttons</h2>
			<ButtonGroup titleId="heading-links">
				<LinkButton href="/home">Home</LinkButton>
				<LinkButton href="/settings" appearance="primary">
					Settings
				</LinkButton>
			</ButtonGroup>
			<h2 id="heading-overflow">Scrolling overflow</h2>
			<ConstrainedRow>
				<ButtonGroup titleId="heading-overflow">
					<Button>Good times</Button>
					<Button iconAfter={AudioIcon}>Boogie</Button>
					<Button iconAfter={AudioIcon}>Boogie more</Button>
				</ButtonGroup>
			</ConstrainedRow>
		</Stack>
	);
}
