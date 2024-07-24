import React from 'react';

import { type AppearanceType, type SizeType } from '@atlaskit/avatar';

import { RANDOM_USERS } from '../examples-util/data';
import { ExampleGroup } from '../examples-util/helpers';
import AvatarGroup from '../src';

const makeColor = (num: number) => {
	let hex = '#';
	for (let i = 0; i < 6; i++) {
		hex += ((num * 3 * i) % 16).toString(16);
	}
	return hex;
};

export default () => {
	const dataNoBorderColor = RANDOM_USERS.map((d) => ({
		key: d.email,
		name: d.name,
		appearance: 'circle' as AppearanceType,
		size: 'medium' as SizeType,
	}));

	const dataWithBorderColor = RANDOM_USERS.map((d, i) => ({
		key: d.email,
		name: d.name,
		appearance: 'circle' as AppearanceType,
		borderColor: makeColor(i),
		size: 'medium' as SizeType,
	}));

	return (
		// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
		<div style={{ maxWidth: 270 }}>
			<ExampleGroup heading="borderColor set on AvatarGroup">
				<AvatarGroup
					appearance="stack"
					onAvatarClick={console.log}
					data={dataNoBorderColor}
					borderColor="red"
					size="large"
					testId="test"
				/>
			</ExampleGroup>
			<ExampleGroup heading="borderColor on individual Avatars">
				<AvatarGroup
					appearance="grid"
					onAvatarClick={console.log}
					data={dataWithBorderColor}
					maxCount={14}
					size="large"
					testId="test"
				/>
			</ExampleGroup>
			<ExampleGroup heading="borderColor on both, with AvatarGroup taking precedence">
				<AvatarGroup
					appearance="grid"
					onAvatarClick={console.log}
					data={dataWithBorderColor}
					borderColor="red"
					maxCount={14}
					size="large"
					testId="test"
				/>
			</ExampleGroup>
		</div>
	);
};
