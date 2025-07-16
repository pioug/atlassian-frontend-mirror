import React, { Fragment, useState } from 'react';

import capitalize from 'lodash/capitalize';

import LegacyButton from '@atlaskit/button';
import Checkbox from '@atlaskit/checkbox';
import StarFilledIcon from '@atlaskit/icon/glyph/star-filled';
// eslint-disable-next-line @atlaskit/design-system/no-emotion-primitives -- to be migrated to @atlaskit/primitives/compiled – go/akcss
import { Box, Stack } from '@atlaskit/primitives';

// eslint-disable-next-line @atlaskit/platform/use-entrypoints-in-examples
import { type IconSize } from '../src/new-button/variants/types';
// eslint-disable-next-line @atlaskit/platform/use-entrypoints-in-examples
import { iconButtonShapes, iconButtonVariants } from '../src/utils/variants';

const iconSizes: IconSize[] = ['small', 'large', 'xlarge'];

export default function IconButtonExample() {
	const [showLegacyButton, setShowLegacyButton] = useState(false);

	return (
		<Box padding="space.200">
			<Checkbox
				label="Compare to legacy button"
				isChecked={showLegacyButton}
				onChange={() => setShowLegacyButton((value) => !value)}
			/>
			<Stack space="space.300" alignInline="start">
				{iconButtonVariants.map(({ name, Component, appearances }) => {
					return (
						<Stack space="space.050" key={name}>
							<h2>{name}</h2>
							<table>
								<thead>
									<tr>
										{showLegacyButton && <th>Version</th>}
										<th>Appearance</th>
										<th>Default</th>
										<th>Disabled</th>
										<th>Selected</th>
										<th>Disabled + Selected</th>
										{iconSizes.map((size) => (
											<th key={size}>{capitalize(size)} icon size</th>
										))}
										{iconButtonShapes.map((shape) => (
											<th key={shape}>{shape} shape</th>
										))}
									</tr>
								</thead>
								<tbody>
									{appearances.map((appearance) => (
										<Fragment key={appearance}>
											{showLegacyButton && (
												<tr>
													<th>Legacy button</th>
													<th>{capitalize(appearance)}</th>
													<td>
														<LegacyButton
															appearance={appearance === 'discovery' ? undefined : appearance}
															iconBefore={<StarFilledIcon label="Label" size="medium" />}
														/>
													</td>
													<td>
														<LegacyButton
															appearance={appearance === 'discovery' ? undefined : appearance}
															iconBefore={<StarFilledIcon label="Label" size="medium" />}
															isDisabled
														/>
													</td>
													<td>
														<LegacyButton
															appearance={appearance === 'discovery' ? undefined : appearance}
															iconBefore={<StarFilledIcon label="Label" size="medium" />}
															isSelected
														/>
													</td>
													<td>
														<LegacyButton
															appearance={appearance === 'discovery' ? undefined : appearance}
															iconBefore={<StarFilledIcon label="Label" size="medium" />}
															isSelected
															isDisabled
														/>
													</td>

													{iconSizes.map((size) => (
														<td>
															<LegacyButton
																appearance={appearance === 'discovery' ? undefined : appearance}
																iconBefore={<StarFilledIcon label="Label" size={size} />}
															/>
														</td>
													))}
												</tr>
											)}
											<tr>
												{showLegacyButton && <th>New IconButton</th>}
												<th>{capitalize(appearance)}</th>
												<td>
													<Component appearance={appearance} />
												</td>
												<td>
													<Component appearance={appearance} isDisabled />
												</td>
												<td>
													<Component appearance={appearance} isSelected />
												</td>
												<td>
													<Component appearance={appearance} isSelected isDisabled />
												</td>

												{iconSizes.map((size) => (
													<td key={size}>
														<Component
															appearance={appearance}
															icon={(iconProps) => <StarFilledIcon {...iconProps} size={size} />}
														/>
													</td>
												))}
												{iconButtonShapes.map((shape) => (
													<td key={shape}>
														<Component appearance={appearance} shape={shape} />
													</td>
												))}
											</tr>
										</Fragment>
									))}
								</tbody>
							</table>
						</Stack>
					);
				})}
			</Stack>
		</Box>
	);
}
