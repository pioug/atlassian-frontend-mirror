import React from 'react';

import capitalize from 'lodash/capitalize';

import ChevronDownIcon from '@atlaskit/icon/glyph/chevron-down';
// eslint-disable-next-line @atlaskit/design-system/no-emotion-primitives -- to be migrated to @atlaskit/primitives/compiled – go/akcss
import { Stack } from '@atlaskit/primitives';

// eslint-disable-next-line @atlaskit/platform/use-entrypoints-in-examples
import variants from '../src/utils/variants';

export default function SpacingExample() {
	return (
		<Stack space="space.200">
			{variants.map(({ name, Component, spacing }) => {
				const isIconButton = ['IconButton', 'LinkIconButton'].includes(name);

				return (
					<Stack space="space.150" key={name}>
						<h2>{name}</h2>
						<table>
							<thead>
								<tr>
									<th>Spacing</th>
									<th>Default appearance</th>
									{!isIconButton && (
										<>
											<th>Icon before</th>
											<th>Icon after</th>
											<th>Icon before and after</th>
										</>
									)}
								</tr>
							</thead>
							<tbody>
								{spacing.map((s) => (
									<tr key={s}>
										<th>{capitalize(s)}</th>
										<td>
											<Component
												// @ts-ignore
												spacing={s}
											>
												Default
											</Component>
										</td>
										{!isIconButton && (
											<>
												<td>
													<Component
														// @ts-ignore
														spacing={s}
														iconBefore={ChevronDownIcon}
													>
														Icon before
													</Component>
												</td>
												<td>
													<Component
														// @ts-ignore
														spacing={s}
														iconAfter={ChevronDownIcon}
													>
														Icon after
													</Component>
												</td>
												<td>
													<Component
														// @ts-ignore
														spacing={s}
														iconBefore={ChevronDownIcon}
														iconAfter={ChevronDownIcon}
													>
														Icon before and after
													</Component>
												</td>
											</>
										)}
									</tr>
								))}
							</tbody>
						</table>
					</Stack>
				);
			})}
		</Stack>
	);
}
