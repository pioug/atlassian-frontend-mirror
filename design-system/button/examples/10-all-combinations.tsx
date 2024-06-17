/** @jsx jsx */
import { Fragment, useState } from 'react';

// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { css, jsx } from '@emotion/react';
import capitalize from 'lodash/capitalize';

import Checkbox from '@atlaskit/checkbox';
import ChevronDownIcon from '@atlaskit/icon/glyph/chevron-down';
import SettingsIcon from '@atlaskit/icon/glyph/settings';
import { Box, Inline, Stack, xcss } from '@atlaskit/primitives';

import { type Appearance, type Spacing } from '../src/new';
import LegacyButton from '../src/old-button/button';
import LoadingButton from '../src/old-button/loading-button';
import variants, { type Variant } from '../src/utils/variants';

const shouldFitContainerStyles = xcss({ width: 'size.1000' });
const longLabelStyles = xcss({ width: 'size.600' });

/**
 * For VR testing purposes we are overriding the animation timing
 * for both the fade-in and the rotating animations. This will
 * freeze the spinner, avoiding potential for VR test flakiness.
 */
const disableAnimationStyles = css({
	// eslint-disable-next-line @atlaskit/design-system/no-nested-styles, @atlaskit/ui-styling-standard/no-nested-selectors -- Ignored via go/DSP-18766
	'svg, span': {
		animationDuration: '0s',
		animationTimingFunction: 'step-end',
	},
});

type ComponentVersion =
	| {
			component: Variant['Component'];
			version: 'new';
	  }
	| {
			component: typeof LegacyButton;
			version: 'legacy';
	  };

const ExampleRow = ({
	component: Component,
	appearance,
	spacing,
	version,
	isIconOnly,
	showLegacyButton,
	elementType,
}: {
	appearance: Appearance;
	spacing: Spacing;
	showLegacyButton: boolean;
	isIconOnly: boolean;
	elementType: typeof HTMLButtonElement | typeof HTMLAnchorElement;
} & ComponentVersion) => {
	const isLegacyIconButton = isIconOnly && version === 'legacy';

	return (
		<tr>
			{showLegacyButton && <th>{capitalize(version)} button</th>}
			<td>
				<Component
					// @ts-ignore
					appearance={appearance}
					// @ts-ignore
					spacing={spacing}
				>
					{isLegacyIconButton ? null : capitalize(appearance)}
				</Component>
			</td>
			<td>
				{isIconOnly ? (
					'N/A '
				) : (
					<Component
						// @ts-ignore
						appearance={appearance}
						// @ts-ignore
						spacing={spacing}
						// @ts-ignore
						iconBefore={version === 'legacy' ? <ChevronDownIcon label="" /> : ChevronDownIcon}
						// @ts-ignore
						iconAfter={version === 'legacy' ? <ChevronDownIcon label="" /> : ChevronDownIcon}
					>
						{isIconOnly ? null : 'Hello'}
					</Component>
				)}
			</td>
			<td>
				<Component
					// @ts-ignore
					appearance={appearance}
					isDisabled
					// @ts-ignore
					spacing={spacing}
					// @ts-ignore
					iconBefore={version === 'legacy' ? <SettingsIcon label="" /> : SettingsIcon}
				>
					{isIconOnly ? null : 'Hello'}
				</Component>
			</td>
			<td>
				<Component
					// @ts-ignore
					appearance={appearance}
					isSelected
					// @ts-ignore
					spacing={spacing}
					// @ts-ignore
					iconBefore={version === 'legacy' ? <SettingsIcon label="" /> : SettingsIcon}
				>
					{isIconOnly ? null : 'Hello'}
				</Component>
			</td>
			<td>
				<Component
					// @ts-ignore
					appearance={appearance}
					isSelected
					isDisabled
					// @ts-ignore
					spacing={spacing}
					// @ts-ignore
					iconBefore={version === 'legacy' ? <SettingsIcon label="" /> : SettingsIcon}
				>
					{isIconOnly ? null : 'Hello'}
				</Component>
			</td>
			<td>
				{version === 'legacy' ? (
					<LoadingButton
						isLoading
						// @ts-ignore
						appearance={appearance}
						// @ts-ignore
						spacing={spacing}
						iconBefore={<SettingsIcon label="" />}
					>
						{isLegacyIconButton ? null : capitalize(appearance)}
					</LoadingButton>
				) : (
					<Component
						// @ts-ignore
						appearance={appearance}
						// @ts-ignore
						spacing={spacing}
						{...(elementType === HTMLButtonElement
							? {
									isLoading: true,
								}
							: [])}
						iconBefore={SettingsIcon}
					>
						{isLegacyIconButton ? null : capitalize(appearance)}
					</Component>
				)}
			</td>
			<td>
				{version === 'legacy' ? (
					<LoadingButton
						isLoading
						isDisabled
						// @ts-ignore
						appearance={appearance}
						// @ts-ignore
						spacing={spacing}
						iconBefore={<SettingsIcon label="" />}
					>
						{isIconOnly ? null : 'Hello'}
					</LoadingButton>
				) : (
					<Component
						// @ts-ignore
						appearance={appearance}
						isDisabled
						isLoading
						// @ts-ignore
						spacing={spacing}
						iconBefore={SettingsIcon}
					>
						{isIconOnly ? null : 'Hello'}
					</Component>
				)}
			</td>
			<td>
				{version === 'legacy' ? (
					<LoadingButton
						isLoading
						isSelected
						// @ts-ignore
						appearance={appearance}
						// @ts-ignore
						spacing={spacing}
						iconBefore={<SettingsIcon label="" />}
					>
						{isIconOnly ? null : 'Hello'}
					</LoadingButton>
				) : (
					<Component
						// @ts-ignore
						appearance={appearance}
						isSelected
						isLoading
						// @ts-ignore
						spacing={spacing}
						iconBefore={SettingsIcon}
					>
						{isIconOnly ? null : 'Hello'}
					</Component>
				)}
			</td>
			<td>
				{version === 'legacy' ? (
					<LoadingButton
						isLoading
						isSelected
						isDisabled
						// @ts-ignore
						appearance={appearance}
						// @ts-ignore
						spacing={spacing}
						iconBefore={<SettingsIcon label="" />}
					>
						{isIconOnly ? null : 'Hello'}
					</LoadingButton>
				) : (
					<Component
						// @ts-ignore
						appearance={appearance}
						isSelected
						isDisabled
						isLoading
						// @ts-ignore
						spacing={spacing}
						iconBefore={SettingsIcon}
					>
						{isIconOnly ? null : 'Hello'}
					</Component>
				)}
			</td>
			<td>
				<Box xcss={shouldFitContainerStyles}>
					<Component
						// @ts-ignore
						appearance={appearance}
						// @ts-ignore
						spacing={spacing}
						{...(isIconOnly ? [] : { shouldFitContainer: true })}
						// @ts-ignore
						iconBefore={version === 'legacy' ? <SettingsIcon label="" /> : SettingsIcon}
					>
						{isIconOnly ? null : 'Hello'}
					</Component>
				</Box>
			</td>
			<td>
				{isIconOnly ? (
					'N/A '
				) : (
					<Box xcss={longLabelStyles}>
						<Component
							// @ts-ignore
							appearance={appearance}
							// @ts-ignore
							spacing={spacing}
							// @ts-ignore
							iconBefore={version === 'legacy' ? <SettingsIcon label="" /> : SettingsIcon}
						>
							{isIconOnly ? null : 'I have a long label'}
						</Component>
					</Box>
				)}
			</td>
		</tr>
	);
};

export default function AllCombinationsExample() {
	const [isAnimationsDisabled, setAnimationsDisabled] = useState(true);
	const [showLegacyButton, setShowLegacyButton] = useState(false);

	const columnCount = showLegacyButton ? 11 : 10;

	return (
		<div css={isAnimationsDisabled && disableAnimationStyles}>
			<Box padding="space.200">
				<Inline space="space.200">
					<Checkbox
						label="Compare to legacy button"
						isChecked={showLegacyButton}
						onChange={() => setShowLegacyButton((value) => !value)}
					/>
					<Checkbox
						label="Disable animations for VR testing"
						isChecked={isAnimationsDisabled}
						onChange={() => setAnimationsDisabled((value) => !value)}
					/>
				</Inline>
				<Stack space="space.200">
					{variants.map(
						({ name, elementType, Component: NewButtonComponent, appearances, spacing }) => {
							const isIconOnly = ['IconButton', 'LinkIconButton'].includes(name);
							return (
								<Stack space="space.100" key={name}>
									<h2>{name}</h2>
									<table>
										<thead>
											<tr>
												{showLegacyButton && <th>Version</th>}
												<th>Default</th>
												<th>Icons</th>
												<th>Disabled</th>
												<th>Selected</th>
												<th>Disabled + Selected</th>
												<th>Loading</th>
												<th>Loading + Disabled</th>
												<th>Loading + Selected</th>
												<th>Loading + Disabled + Selected</th>
												<th>Should fit container</th>
												<th>Truncation</th>
											</tr>
										</thead>
										<tbody>
											{spacing.map((space) => (
												<Fragment key={space}>
													<tr>
														<th colSpan={columnCount}>
															<Box paddingBlock="space.150">
																<h3>{capitalize(space)} spacing</h3>
															</Box>
														</th>
													</tr>
													{appearances.map((appearance) => (
														<Fragment key={appearance}>
															{showLegacyButton && (
																<ExampleRow
																	showLegacyButton={showLegacyButton}
																	appearance={appearance}
																	component={LegacyButton}
																	spacing={space}
																	version="legacy"
																	isIconOnly={isIconOnly}
																	elementType={elementType}
																/>
															)}
															<ExampleRow
																showLegacyButton={showLegacyButton}
																appearance={appearance}
																component={NewButtonComponent}
																spacing={space}
																version="new"
																isIconOnly={isIconOnly}
																elementType={elementType}
															/>
														</Fragment>
													))}
												</Fragment>
											))}
										</tbody>
									</table>
								</Stack>
							);
						},
					)}
				</Stack>
			</Box>
		</div>
	);
}
