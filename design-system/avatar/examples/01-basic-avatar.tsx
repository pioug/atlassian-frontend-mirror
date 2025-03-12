import React from 'react';

import Avatar from '@atlaskit/avatar';
import { Stack } from '@atlaskit/primitives/compiled';
import Tooltip from '@atlaskit/tooltip';

import { Block } from '../examples-util/helpers';

export default () => (
	<Stack space="space.200">
		<Block heading="Circle">
			<Tooltip content="xxlarge">
				<Avatar name="xxlarge" size="xxlarge" testId="avatar" />
			</Tooltip>
			<Avatar name="xlarge" size="xlarge" presence="online" />
			<Avatar name="large" size="large" presence="offline" />
			<Avatar name="medium" size="medium" presence="busy" />
			<Avatar name="small" size="small" presence="focus" />
			<Avatar name="xsmall" size="xsmall" />
		</Block>
		<Block heading="Square">
			<Avatar appearance="square" name="xxlarge" size="xxlarge" />
			<Avatar appearance="square" name="xlarge" size="xlarge" status="approved" />
			<Avatar appearance="square" name="large" size="large" status="declined" />
			<Avatar appearance="square" name="medium" size="medium" status="locked" />
			<Avatar appearance="square" name="small" size="small" />
			<Avatar appearance="square" name="xsmall" size="xsmall" />
		</Block>
		<Block heading="Disabled">
			<Tooltip content="xxlarge">
				<Avatar name="xxlarge" size="xxlarge" isDisabled />
			</Tooltip>
			<Avatar name="xlarge" size="xlarge" presence="online" isDisabled />
			<Avatar name="large" size="large" presence="offline" isDisabled />
			<Avatar name="medium" size="medium" presence="busy" isDisabled />
			<Avatar name="small" size="small" presence="focus" isDisabled />
			<Avatar name="xsmall" size="xsmall" isDisabled />
		</Block>
	</Stack>
);
