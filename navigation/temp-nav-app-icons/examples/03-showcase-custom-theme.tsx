/**
 * @jsxRuntime classic
 * @jsx jsx
 */

import { useState } from 'react';

import { jsx } from '@compiled/react';

import { Stack } from '@atlaskit/primitives';
import Select from '@atlaskit/select';

import ShowcaseExample from './01-showcase';
import { customThemeApps } from './utils/custom-theme-components';

const colorOptions = [
	{ label: 'None', value: undefined },
	{ label: 'Black', value: 'black' },
	{ label: 'White', value: 'white' },
	{ label: 'Red', value: 'red' },
] as const;

export default function ShowcaseLegacyExample() {
	const [iconColor, setIconColor] = useState<string | undefined>(undefined);
	const [textColor, setTextColor] = useState<string | undefined>(undefined);

	return (
		<div>
			<Stack space="space.200">
				<label htmlFor="icon-color">Icon color</label>
				<Select<(typeof colorOptions)[number]>
					inputId="icon-color"
					options={colorOptions}
					defaultOption={colorOptions[0]}
					onChange={(newValue) => setIconColor(newValue?.value ?? undefined)}
				/>
				<label htmlFor="text-color">Text color</label>
				<Select<(typeof colorOptions)[number]>
					inputId="text-color"
					options={colorOptions}
					defaultOption={colorOptions[0]}
					onChange={(newValue) => setTextColor(newValue?.value ?? undefined)}
				/>
				<ShowcaseExample apps={customThemeApps} iconColor={iconColor} textColor={textColor} />
			</Stack>
		</div>
	);
}
