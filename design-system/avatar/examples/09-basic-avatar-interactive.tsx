import React from 'react';

import Avatar from '@atlaskit/avatar';
import Tooltip from '@atlaskit/tooltip';

import { Block, Gap } from '../examples-util/helpers';

export default () => (
	<div>
		<Block heading="Circle">
			<Tooltip content="xxlarge">
				<Avatar borderColor="red" onClick={() => {}} name="xxlarge" size="xxlarge" />
			</Tooltip>
			<Gap />
			<Avatar
				borderColor="red"
				onClick={() => {}}
				name="xlarge"
				size="xlarge"
				presence="online"
				testId="avatar"
			/>
			<Gap />
			<Avatar borderColor="red" onClick={() => {}} name="large" size="large" presence="offline" />
			<Gap />
			<Avatar borderColor="red" onClick={() => {}} name="medium" size="medium" presence="busy" />
			<Gap />
			<Avatar borderColor="red" onClick={() => {}} name="small" size="small" presence="focus" />
			<Gap />
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
			<Gap />
			<Avatar
				borderColor="red"
				onClick={() => {}}
				appearance="square"
				name="xlarge"
				size="xlarge"
				status="approved"
			/>
			<Gap />
			<Avatar
				borderColor="red"
				onClick={() => {}}
				appearance="square"
				name="large"
				size="large"
				status="declined"
			/>
			<Gap />
			<Avatar
				borderColor="red"
				onClick={() => {}}
				appearance="square"
				name="medium"
				size="medium"
				status="locked"
			/>
			<Gap />
			<Avatar borderColor="red" onClick={() => {}} appearance="square" name="small" size="small" />
			<Gap />
			<Avatar
				borderColor="red"
				onClick={() => {}}
				appearance="square"
				name="xsmall"
				size="xsmall"
			/>
		</Block>
		<Block heading="Disabled">
			<Tooltip content="xxlarge">
				<Avatar borderColor="red" onClick={() => {}} name="xxlarge" size="xxlarge" isDisabled />
			</Tooltip>
			<Gap />
			<Avatar
				borderColor="red"
				onClick={() => {}}
				name="xlarge"
				size="xlarge"
				presence="online"
				isDisabled
			/>
			<Gap />
			<Avatar
				borderColor="red"
				onClick={() => {}}
				name="large"
				size="large"
				presence="offline"
				isDisabled
			/>
			<Gap />
			<Avatar
				borderColor="red"
				onClick={() => {}}
				name="medium"
				size="medium"
				presence="busy"
				isDisabled
			/>
			<Gap />
			<Avatar
				borderColor="red"
				onClick={() => {}}
				name="small"
				size="small"
				presence="focus"
				isDisabled
			/>
			<Gap />
			<Avatar borderColor="red" onClick={() => {}} name="xsmall" size="xsmall" isDisabled />
		</Block>
	</div>
);
