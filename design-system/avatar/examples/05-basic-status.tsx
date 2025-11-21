import React from 'react';

import Avatar, { Status } from '@atlaskit/avatar';
import { Stack } from '@atlaskit/primitives/compiled';

import { Block, ShrinkWrap } from '../examples-util/helpers';

export default (): React.JSX.Element => (
	<Stack space="space.200">
		<Block heading="Status">
			<ShrinkWrap>
				<Status status="approved" />
			</ShrinkWrap>
			<ShrinkWrap>
				<Status status="declined" />
			</ShrinkWrap>
			<ShrinkWrap>
				<Status status="locked" />
			</ShrinkWrap>
		</Block>

		<Block heading="Circular">
			<Avatar name="xxlarge" size="xxlarge" />
			<Avatar name="xlarge" size="xlarge" status="approved" />
			<Avatar name="large" size="large" status="declined" />
			<Avatar name="medium" size="medium" status="locked" />
			<Avatar name="small" size="small" status="approved" />
			<Avatar name="xsmall" size="xsmall" />
		</Block>

		<Block heading="Square">
			<Avatar appearance="square" name="xxlarge" size="xxlarge" />
			<Avatar appearance="square" name="xlarge" size="xlarge" status="approved" />
			<Avatar appearance="square" name="large" size="large" status="declined" />
			<Avatar appearance="square" name="medium" size="medium" status="locked" />
			<Avatar appearance="square" name="small" size="small" status="approved" />
			<Avatar appearance="square" name="xsmall" size="xsmall" />
		</Block>

		<Block heading="Hexagon">
			<Avatar appearance="hexagon" name="xxlarge" size="xxlarge" />
			<Avatar appearance="hexagon" name="xlarge" size="xlarge" status="approved" />
			<Avatar appearance="hexagon" name="large" size="large" status="declined" />
			<Avatar appearance="hexagon" name="medium" size="medium" status="locked" />
			<Avatar appearance="hexagon" name="small" size="small" status="approved" />
			<Avatar appearance="hexagon" name="xsmall" size="xsmall" />
		</Block>
	</Stack>
);
