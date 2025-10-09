import React from 'react';

import Avatar from '@atlaskit/avatar';
import { Stack } from '@atlaskit/primitives/compiled';
import Tooltip from '@atlaskit/tooltip';

import { Block } from '../examples-util/helpers';

export default () => (
	<Stack space="space.200">
		<Block heading="Circle">
			<Tooltip content="xxlarge">
				<Avatar borderColor="red" onClick={() => {}} name="xxlarge" size="xxlarge" />
			</Tooltip>
			<Avatar
				borderColor="red"
				onClick={() => {}}
				name="xlarge"
				size="xlarge"
				presence="online"
				testId="avatar"
			/>
			<Avatar borderColor="red" onClick={() => {}} name="large" size="large" presence="offline" />
			<Avatar borderColor="red" onClick={() => {}} name="medium" size="medium" presence="busy" />
			<Avatar borderColor="red" onClick={() => {}} name="small" size="small" presence="focus" />
			<Avatar borderColor="red" onClick={() => {}} name="xsmall" size="xsmall" />
		</Block>
		<Block heading="Square">
			<Avatar
				borderColor="red"
				onClick={() => {}}
				appearance="square"
				name="xxlarge"
				size="xxlarge"
			/>
			<Avatar
				borderColor="red"
				onClick={() => {}}
				appearance="square"
				name="xlarge"
				size="xlarge"
				status="approved"
			/>
			<Avatar
				borderColor="red"
				onClick={() => {}}
				appearance="square"
				name="large"
				size="large"
				status="declined"
			/>
			<Avatar
				borderColor="red"
				onClick={() => {}}
				appearance="square"
				name="medium"
				size="medium"
				status="locked"
			/>
			<Avatar
				borderColor="red"
				onClick={() => {}}
				appearance="square"
				name="small"
				size="small"
				status="approved"
			/>
			<Avatar
				borderColor="red"
				onClick={() => {}}
				appearance="square"
				name="xsmall"
				size="xsmall"
			/>
		</Block>
		<Block heading="Hexagon">
			<Avatar
				borderColor="red"
				onClick={() => {}}
				appearance="hexagon"
				name="xxlarge"
				size="xxlarge"
			/>
			<Avatar
				borderColor="red"
				onClick={() => {}}
				appearance="hexagon"
				name="xlarge"
				size="xlarge"
				status="approved"
			/>
			<Avatar
				borderColor="red"
				onClick={() => {}}
				appearance="hexagon"
				name="large"
				size="large"
				status="declined"
			/>
			<Avatar
				borderColor="red"
				onClick={() => {}}
				appearance="hexagon"
				name="medium"
				size="medium"
				status="locked"
			/>
			<Avatar
				borderColor="red"
				onClick={() => {}}
				appearance="hexagon"
				name="small"
				size="small"
				status="approved"
			/>
			<Avatar
				borderColor="red"
				onClick={() => {}}
				appearance="hexagon"
				name="xsmall"
				size="xsmall"
			/>
		</Block>
		<Block heading="Disabled">
			<Tooltip content="xxlarge">
				<Avatar borderColor="red" onClick={() => {}} name="xxlarge" size="xxlarge" isDisabled />
			</Tooltip>
			<Avatar
				borderColor="red"
				onClick={() => {}}
				name="xlarge"
				size="xlarge"
				presence="online"
				isDisabled
			/>
			<Avatar
				borderColor="red"
				onClick={() => {}}
				name="large"
				size="large"
				presence="offline"
				isDisabled
			/>
			<Avatar
				borderColor="red"
				onClick={() => {}}
				name="medium"
				size="medium"
				presence="busy"
				isDisabled
			/>
			<Avatar
				borderColor="red"
				onClick={() => {}}
				name="small"
				size="small"
				presence="focus"
				isDisabled
			/>
			<Avatar borderColor="red" onClick={() => {}} name="xsmall" size="xsmall" isDisabled />
		</Block>
	</Stack>
);
