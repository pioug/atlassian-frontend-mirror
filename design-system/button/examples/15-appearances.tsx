import React from 'react';

import capitalize from 'lodash/capitalize';

import ChevronDownIcon from '@atlaskit/icon/glyph/chevron-down';
// eslint-disable-next-line @atlaskit/design-system/no-emotion-primitives -- to be migrated to @atlaskit/primitives/compiled – go/akcss
import { Stack } from '@atlaskit/primitives';

// eslint-disable-next-line @atlaskit/platform/use-entrypoints-in-examples
import variants from '../src/utils/variants';

export default function AppearancesExample(): React.JSX.Element {
	return (
		<Stack space="space.100" alignInline="start">
			{variants.map(({ name, Component, appearances }) => (
				<Stack space="space.150" key={name}>
					<h2>{name}</h2>
					<table>
						<thead>
							<tr>
								<th>Appearance</th>
								<th>Default</th>
								{name === 'Button' || (name === 'LinkButton' && <th>Icon after</th>)}
								<th>Selected</th>
							</tr>
						</thead>
						<tbody>
							{appearances.map((appearance) => (
								<tr key={appearance}>
									<th>{capitalize(appearance)}</th>
									<td>
										<Component
											// @ts-ignore
											appearance={appearance}
										>
											Default
										</Component>
									</td>
									{name === 'Button' ||
										(name === 'LinkButton' && (
											<td>
												<Component
													// @ts-ignore
													appearance={appearance}
													iconAfter={ChevronDownIcon}
												>
													Icon after
												</Component>
											</td>
										))}
									<td>
										<Component
											// @ts-ignore
											appearance={appearance}
											isSelected
										>
											Selected
										</Component>
									</td>
								</tr>
							))}
						</tbody>
					</table>
				</Stack>
			))}
		</Stack>
	);
}
