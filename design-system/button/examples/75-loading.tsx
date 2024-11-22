/* eslint-disable @atlaskit/design-system/consistent-css-prop-usage */
/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { Fragment, useState } from 'react';

// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { css, jsx } from '@emotion/react';
import capitalize from 'lodash/capitalize';

import { type Appearance, type Spacing } from '@atlaskit/button/new';
import Checkbox from '@atlaskit/checkbox';
import { Box, Stack } from '@atlaskit/primitives';

// eslint-disable-next-line @atlaskit/platform/use-entrypoints-in-examples
import variants, { type Variant } from '../src/utils/variants';

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

const ExampleRow = ({
	component: Component,
	appearance,
	spacing,
	isIconOnly,
	isLoading,
}: {
	appearance: Appearance;
	spacing: Spacing;
	isIconOnly: boolean;
	isLoading: boolean;
	component: Variant['Component'];
	version: 'new';
}) => {
	return (
		<tr>
			<th>{capitalize(appearance)}</th>
			<td>
				<Component
					isLoading={isLoading}
					// @ts-ignore
					appearance={appearance}
					// @ts-ignore
					spacing={spacing}
				>
					{isIconOnly ? null : 'Hello'}
				</Component>
			</td>
			<td>
				<Component
					// @ts-ignore
					appearance={appearance}
					isDisabled
					isLoading={isLoading}
					// @ts-ignore
					spacing={spacing}
				>
					{isIconOnly ? null : 'Hello'}
				</Component>
			</td>
			<td>
				<Component
					// @ts-ignore
					appearance={appearance}
					isSelected
					isLoading={isLoading}
					// @ts-ignore
					spacing={spacing}
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
					isLoading={isLoading}
					// @ts-ignore
					spacing={spacing}
				>
					{isIconOnly ? null : 'Hello'}
				</Component>
			</td>
		</tr>
	);
};

export default function LoadingExample() {
	const [isLoading, setIsLoading] = useState(true);
	const [isAnimationsDisabled, setAnimationsDisabled] = useState(true);

	return (
		<div css={isAnimationsDisabled && disableAnimationStyles}>
			<Box padding="space.200">
				<Checkbox
					label="Show loading state"
					isChecked={isLoading}
					onChange={() => setIsLoading((value) => !value)}
				/>
				<Checkbox
					label="Disable animations for VR testing"
					isChecked={isAnimationsDisabled}
					onChange={() => setAnimationsDisabled((value) => !value)}
				/>
				<Stack space="space.200">
					{variants.map(({ name, Component: NewButtonComponent, appearances, spacing }) => {
						const isIconOnly = ['IconButton', 'LinkIconButton'].includes(name);
						const isLinkButton = ['LinkButton', 'LinkIconButton'].includes(name);
						return (
							<Stack space="space.100" key={name}>
								<h2>{name}</h2>
								{isLinkButton && (
									<p>
										<em>Link buttons should not support loading spinners</em>
									</p>
								)}
								<table>
									<thead>
										<tr>
											<th>Appearance</th>
											<th>Loading</th>
											<th>Loading + Disabled</th>
											<th>Loading + Selected</th>
											<th>Loading + Disabled + Selected</th>
										</tr>
									</thead>
									<tbody>
										{spacing.map((space) => (
											<Fragment key={space}>
												<tr>
													<th colSpan={5}>
														<Box paddingBlock="space.150">
															<h3>{capitalize(space)} spacing</h3>
														</Box>
													</th>
												</tr>
												{appearances.map((appearance) => (
													<Fragment key={appearance}>
														<ExampleRow
															appearance={appearance}
															component={NewButtonComponent}
															spacing={space}
															version="new"
															isIconOnly={isIconOnly}
															isLoading={isLoading}
														/>
													</Fragment>
												))}
											</Fragment>
										))}
									</tbody>
								</table>
							</Stack>
						);
					})}
				</Stack>
			</Box>
		</div>
	);
}
