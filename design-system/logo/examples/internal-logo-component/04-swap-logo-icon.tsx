/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { Fragment, useState } from 'react';

import { cssMap, jsx } from '@atlaskit/css';
import { Box, Inline, Stack } from '@atlaskit/primitives/compiled';
import Select from '@atlaskit/select';
import Toggle from '@atlaskit/toggle';

import { rows } from './utils/all-components';
import { appOrder, selectOptions } from './utils/constants';

const wrapperStyles = cssMap({
	root: {
		width: '100%',
		position: 'relative',
		overflowY: 'auto',
		// @ts-ignore this is a valid height value
		height: 'calc(100vh - 48px)',
		zIndex: 0,
		paddingBlockStart: 'var(--ds-space-200)',
	},
	item: {
		// Fixed with to prevent the items from jumping around when the logos are shown
		width: '300px',
	},
});

export default function ShowcaseExample(): JSX.Element {
	const [appearance, setAppearance] = useState<'brand' | 'neutral' | 'inverse' | 'legacy'>('brand');

	const [showLogos, setShowLogos] = useState(false);
	const [useCustomTheme, setUseCustomTheme] = useState(false);

	const customisedProps = {
		appearance: appearance,
		logoColor: useCustomTheme ? 'black' : undefined,
		iconColor: useCustomTheme ? 'black' : undefined,
	} as any;

	return (
		<Fragment>
			<Box padding="space.200" backgroundColor="color.background.neutral">
				<Stack space="space.100">
					<Inline alignBlock="center" space="space.200">
						<label htmlFor="appearance">Appearance:</label>
						<Select<(typeof selectOptions)[number]>
							inputId="appearance"
							spacing="compact"
							options={selectOptions}
							defaultOption={selectOptions[0]}
							onChange={(newValue) => setAppearance(newValue?.value ?? 'brand')}
						/>
					</Inline>
					<Inline alignBlock="center" space="space.200">
						<label htmlFor="show-logos">Show logos:</label>
						<Toggle
							id="show-logos"
							onChange={() => setShowLogos((prev) => !prev)}
							isChecked={showLogos}
						/>
					</Inline>
					<Inline alignBlock="center" space="space.200">
						<label htmlFor="show-custom-theme">Show custom theme:</label>
						<Toggle
							id="show-custom-theme"
							onChange={() => setUseCustomTheme((prev) => !prev)}
							isChecked={useCustomTheme}
						/>
					</Inline>
				</Stack>
			</Box>

			<div css={wrapperStyles.root}>
				<Inline space="space.200" shouldWrap>
					{rows
						.sort(
							(a: (typeof rows)[0], b: (typeof rows)[0]) =>
								appOrder.indexOf(a.name) - appOrder.indexOf(b.name),
						)
						.filter(({ Logo }) => Logo !== null)
						.map(({ Icon24, Logo }) => {
							return (
								<div css={wrapperStyles.item}>
									{Logo && <Logo {...customisedProps} />}
									{Icon24 && <Icon24 {...customisedProps} />}
								</div>
							);
						})}
				</Inline>
			</div>
		</Fragment>
	);
}
