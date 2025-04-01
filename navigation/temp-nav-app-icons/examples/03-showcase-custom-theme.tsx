/**
 * @jsxRuntime classic
 * @jsx jsx
 */

import { Fragment, useState } from 'react';

import { jsx } from '@compiled/react';

import { Box, Inline } from '@atlaskit/primitives';
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
	const [iconColor, setIconColor] = useState<string | undefined>('black');
	const [textColor, setTextColor] = useState<string | undefined>('black');

	return (
		<Fragment>
			<Box padding="space.200" paddingBlockEnd="space.0" backgroundColor="color.background.neutral">
				<Inline space="space.200" shouldWrap>
					<Inline space="space.100" alignBlock="center">
						<label htmlFor="icon-color">Icon color</label>
						<Select<(typeof colorOptions)[number]>
							inputId="icon-color"
							options={colorOptions}
							defaultOption={colorOptions[0]}
							onChange={(newValue) => setIconColor(newValue?.value ?? undefined)}
						/>
					</Inline>
					<Inline space="space.100" alignBlock="center">
						<label htmlFor="text-color">Text color</label>
						<Select<(typeof colorOptions)[number]>
							inputId="text-color"
							options={colorOptions}
							defaultOption={colorOptions[0]}
							onChange={(newValue) => setTextColor(newValue?.value ?? undefined)}
						/>
					</Inline>
				</Inline>
			</Box>
			<ShowcaseExample apps={customThemeApps} iconColor={iconColor} textColor={textColor} />
		</Fragment>
	);
}
