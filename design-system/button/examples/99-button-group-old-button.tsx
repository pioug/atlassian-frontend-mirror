/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import React from 'react';

import { css, jsx } from '@compiled/react';

import Button, { ButtonGroup } from '@atlaskit/button';
import AudioIcon from '@atlaskit/icon/core/audio';
import { token } from '@atlaskit/tokens';

const rowStyles = css({
	paddingBlockEnd: token('space.100', '8px'),
	paddingBlockStart: token('space.100', '8px'),
	paddingInlineEnd: token('space.100', '8px'),
	paddingInlineStart: token('space.100', '8px')
});

const constrainedRowStyles = css({
	width: 180,
	overflowX: 'scroll',
});

const Row = (props: { children: React.ReactNode }) => (
	<div css={rowStyles}>{props.children}</div>
);
const ConstrainedRow = (props: { children: React.ReactNode }) => (
	<div
		css={[
			rowStyles,
			constrainedRowStyles,
		]}
	>
		{props.children}
	</div>
);

const CustomComponent = (props: { label?: string }) => {
	const { label } = props;

	if (!label) {
		return null;
	}

	return <Button>{label}</Button>;
};

export default (): React.JSX.Element => (
	<Row>
		<Row>
			<ButtonGroup>
				<Button appearance="primary">First Button</Button>
				<Button appearance="primary">Second Button</Button>
				<Button appearance="primary">Third Button</Button>
			</ButtonGroup>
		</Row>
		<Row>
			<ButtonGroup>
				<Button>First Button</Button>
				<CustomComponent label="Hello!" />
				<Button>Second Button</Button>
				<CustomComponent />
				<Button>Third Button</Button>
			</ButtonGroup>
		</Row>
		<ConstrainedRow>
			<ButtonGroup>
				<Button>Good times</Button>
				<Button iconAfter={<AudioIcon label="" />}>Boogie</Button>
				<Button iconAfter={<AudioIcon spacing="spacious" label="Boogie more" />} />
			</ButtonGroup>
		</ConstrainedRow>
	</Row>
);
