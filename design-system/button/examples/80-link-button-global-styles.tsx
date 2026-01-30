/**
 * @jsxRuntime classic
 * @jsx jsx
 */

import capitalize from 'lodash/capitalize';

import { cssMap, jsx } from '@atlaskit/css';
import Heading from '@atlaskit/heading';
import LinkExternalIcon from '@atlaskit/icon/core/link-external';
import { Box, Stack } from '@atlaskit/primitives/compiled';
import { token } from '@atlaskit/tokens';

// eslint-disable-next-line @atlaskit/platform/use-entrypoints-in-examples
import type { IconButtonAppearance, LinkButtonAppearance } from '../src/new-button/variants/types';
// eslint-disable-next-line @atlaskit/platform/use-entrypoints-in-examples
import { linkButtonVariants } from '../src/utils/variants';

import GlobalStyleSimulator from './utils/global-style-simulator';

const styles = cssMap({
	root: {
		paddingBlockStart: token('space.200'),
		paddingInlineEnd: token('space.200'),
		paddingBlockEnd: token('space.200'),
		paddingInlineStart: token('space.200'),
	},
});

export default function LinkButtonGlobalStylesExample(): JSX.Element {
	return (
		<Box xcss={styles.root}>
			<GlobalStyleSimulator />
			<Stack space="space.200" alignInline="start">
				<Heading size="large">
					Ensures link buttons defend against global anchor styles from apps
				</Heading>

				{linkButtonVariants.map(({ name, Component, appearances }) => (
					<Stack space="space.150" key={name}>
						<Heading size="medium">{name}</Heading>
						<table>
							<thead>
								<tr>
									<th>Appearance</th>
									<th>Default</th>
									<th>Selected</th>
									<th>Disabled</th>
								</tr>
							</thead>
							<tbody>
								{appearances.map((appearance) => (
									<tr key={appearance}>
										<th>{capitalize(appearance)}</th>
										<td>
											{name === 'LinkButton' ? (
												<Component
													appearance={appearance as LinkButtonAppearance}
													iconAfter={LinkExternalIcon}
													testId={`${name}-${appearance}`}
												>
													Default
												</Component>
											) : (
												<Component
													appearance={appearance as IconButtonAppearance}
													icon={LinkExternalIcon}
													testId={`${name}-${appearance}`}
												/>
											)}
										</td>
										<td>
											{name === 'LinkButton' ? (
												<Component
													appearance={appearance as LinkButtonAppearance}
													iconAfter={LinkExternalIcon}
													isSelected
													testId={`${name}-${appearance}-selected`}
												>
													Selected
												</Component>
											) : (
												<Component
													appearance={appearance as IconButtonAppearance}
													icon={LinkExternalIcon}
													testId={`${name}-${appearance}-selected`}
													isSelected
												/>
											)}
										</td>
										<td>
											{name === 'LinkButton' ? (
												<Component
													appearance={appearance as LinkButtonAppearance}
													iconAfter={LinkExternalIcon}
													testId={`${name}-${appearance}-disabled`}
													isDisabled
												>
													Default
												</Component>
											) : (
												<Component
													appearance={appearance as IconButtonAppearance}
													icon={LinkExternalIcon}
													testId={`${name}-${appearance}-disabled`}
													isDisabled
												/>
											)}
										</td>
									</tr>
								))}
							</tbody>
						</table>
					</Stack>
				))}
			</Stack>
		</Box>
	);
}
