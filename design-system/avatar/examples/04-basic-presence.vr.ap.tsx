import React from 'react';

import Avatar from '@atlaskit/avatar/avatar';
import Presence from '@atlaskit/avatar/presence';
import { Stack } from '@atlaskit/primitives/compiled';

import { Block } from '../examples-util/block';
import { ShrinkWrap } from '../examples-util/shrink-wrap';

export default (): React.JSX.Element => (
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
			<Avatar name="xxsmall" size="xxsmall" />
		</Block>
		<Block heading="Square">
			<Avatar appearance="square" name="large" size="large" presence="busy" />
			<Avatar appearance="square" name="medium" size="medium" presence="focus" />
			<Avatar appearance="square" name="small" size="small" presence="offline" />
			<Avatar appearance="square" name="xxsmall" size="xxsmall" />
		</Block>
		<Block heading="Hexagon">
			<Avatar appearance="hexagon" name="xxlarge" size="xxlarge" />
			<Avatar appearance="hexagon" name="xlarge" size="xlarge" presence="online" />
			<Avatar appearance="hexagon" name="large" size="large" presence="busy" />
			<Avatar appearance="hexagon" name="medium" size="medium" presence="focus" />
			<Avatar appearance="hexagon" name="small" size="small" presence="offline" />
			<Avatar appearance="hexagon" name="xxsmall" size="xxsmall" />
		</Block>
	</Stack>
);
