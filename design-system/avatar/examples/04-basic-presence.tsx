// eslint-disable-next-line @repo/internal/fs/filename-pattern-match
import React from 'react';

import Avatar, { Presence } from '@atlaskit/avatar';
import { Stack } from '@atlaskit/primitives';

import { Block, ShrinkWrap } from '../examples-util/helpers';

export default () => (
	<Stack space="space.200">
		<Block heading="Presence">
			<ShrinkWrap>
				<Presence presence="online" />
			</ShrinkWrap>
			<ShrinkWrap>
				<Presence presence="busy" />
			</ShrinkWrap>
			<ShrinkWrap>
				<Presence presence="focus" />
			</ShrinkWrap>
			<ShrinkWrap>
				<Presence presence="offline" />
			</ShrinkWrap>
		</Block>
		<Block heading="Circular">
			<Avatar name="xxlarge" size="xxlarge" />
			<Avatar name="xlarge" size="xlarge" presence="online" />
			<Avatar name="large" size="large" presence="busy" />
			<Avatar name="medium" size="medium" presence="focus" />
			<Avatar name="small" size="small" presence="offline" />
			<Avatar name="xsmall" size="xsmall" />
		</Block>
		<Block heading="Square">
			<Avatar appearance="square" name="xxlarge" size="xxlarge" />
			<Avatar appearance="square" name="xlarge" size="xlarge" presence="online" />
			<Avatar appearance="square" name="large" size="large" presence="busy" />
			<Avatar appearance="square" name="medium" size="medium" presence="focus" />
			<Avatar appearance="square" name="small" size="small" presence="offline" />
			<Avatar appearance="square" name="xsmall" size="xsmall" />
		</Block>
	</Stack>
);
