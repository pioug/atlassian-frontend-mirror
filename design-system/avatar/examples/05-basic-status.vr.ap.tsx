import React from 'react';

import Avatar from '@atlaskit/avatar/avatar';
import Status from '@atlaskit/avatar/status';
import { Stack } from '@atlaskit/primitives/compiled';

import { Block } from '../examples-util/block';
import { ShrinkWrap } from '../examples-util/shrink-wrap';

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
			<ShrinkWrap>
				<Status status="warning" />
			</ShrinkWrap>
		</Block>

		<Block heading="Circular">
			<Avatar name="xxlarge" size="xxlarge" />
			<Avatar name="xlarge" size="xlarge" status="approved" />
			<Avatar name="large" size="large" status="declined" />
			<Avatar name="medium" size="medium" status="locked" />
			<Avatar name="small" size="small" status="warning" />
			<Avatar name="xxsmall" size="xxsmall" />
		</Block>

		<Block heading="Square">
			<Avatar appearance="square" name="large" size="large" status="declined" />
			<Avatar appearance="square" name="medium" size="medium" status="locked" />
			<Avatar appearance="square" name="small" size="small" status="warning" />
			<Avatar appearance="square" name="xxsmall" size="xxsmall" />
		</Block>

		<Block heading="Hexagon">
			<Avatar appearance="hexagon" name="xxlarge" size="xxlarge" />
			<Avatar appearance="hexagon" name="xlarge" size="xlarge" status="approved" />
			<Avatar appearance="hexagon" name="large" size="large" status="declined" />
			<Avatar appearance="hexagon" name="medium" size="medium" status="locked" />
			<Avatar appearance="hexagon" name="small" size="small" status="warning" />
			<Avatar appearance="hexagon" name="xxsmall" size="xxsmall" />
		</Block>
	</Stack>
);
