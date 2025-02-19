/* eslint-disable @atlaskit/ui-styling-standard/no-imported-style-values */
/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { css, jsx } from '@compiled/react';

import TrashIcon from '@atlaskit/icon/core/migration/delete--trash';
import { fg } from '@atlaskit/platform-feature-flags';
import { Box, Inline, Text } from '@atlaskit/primitives/compiled';
import { token } from '@atlaskit/tokens';

import { SmartLinkSize } from '../../src';
import { FlexibleUiContext } from '../../src/state/flexible-ui-context';
import { DeleteAction } from '../../src/view/FlexibleCard/components/actions';
import { getContext } from '../utils/flexible-ui';
import VRTestWrapper from '../utils/vr-test-wrapper';

import ComponentOld from './vr-flexible-ui-action-old';
const context = getContext();
let onClick = () => {
	console.log('Testing Delete Action...');
};

const appearances: React.ComponentProps<typeof DeleteAction>['appearance'][] = [
	'default',
	'subtle',
	'primary',
	'warning',
	'danger',
];
const customText = 'Remove';
const href = 'https://some-url';

const ComponentNew = () => {
	const icon = <TrashIcon label="Trash" spacing="spacious" />;

	return (
		<VRTestWrapper>
			<FlexibleUiContext.Provider value={context}>
				{appearances.map((appearance) => (
					<Box>
						<Text size="large" weight="bold">
							Appearance: {appearance}
						</Text>
						<table>
							<thead>
								<tr>
									<th>Size</th>
									<th>Default</th>
									<th>Icon only</th>
									<th>Text only</th>
									<th>Custom icon</th>
									<th>Custom text</th>
									<th>Loading</th>
									<th>Disabled</th>
								</tr>
							</thead>
							<tbody>
								{Object.values(SmartLinkSize).map((size) => (
									<tr>
										<td>{size}</td>
										<td>
											<Inline space="space.050">
												<DeleteAction
													appearance={appearance}
													size={size}
													onClick={onClick}
													testId="as-button"
												/>
												<DeleteAction
													appearance={appearance}
													href={href}
													size={size}
													onClick={onClick}
													testId="as-link"
												/>
											</Inline>
										</td>
										<td>
											<Inline alignInline="center" space="space.050">
												<DeleteAction
													appearance={appearance}
													content={undefined}
													onClick={onClick}
													size={size}
													testId="as-button-icon-only"
												/>
												<DeleteAction
													appearance={appearance}
													content={undefined}
													href={href}
													onClick={onClick}
													size={size}
													testId="as-link-icon-only"
												/>
											</Inline>
										</td>
										<td>
											<Inline space="space.050">
												<DeleteAction
													appearance={appearance}
													icon={undefined}
													onClick={onClick}
													size={size}
													testId="as-button-text-only"
												/>
												<DeleteAction
													appearance={appearance}
													href={href}
													icon={undefined}
													onClick={onClick}
													size={size}
													testId="as-link-text-only"
												/>
											</Inline>
										</td>
										<td>
											<Inline space="space.050">
												<DeleteAction
													appearance={appearance}
													icon={icon}
													onClick={onClick}
													size={size}
													testId="as-button-custom-icon"
												/>
												<DeleteAction
													appearance={appearance}
													href={href}
													icon={icon}
													onClick={onClick}
													size={size}
													testId="as-link-custom-icon"
												/>
											</Inline>
										</td>
										<td>
											<Inline space="space.050">
												<DeleteAction
													appearance={appearance}
													content={customText}
													onClick={onClick}
													size={size}
													testId="as-button-custom-text"
												/>
												<DeleteAction
													appearance={appearance}
													content={customText}
													href={href}
													onClick={onClick}
													size={size}
													testId="as-link-custom-text"
												/>
											</Inline>
										</td>
										<td>
											<DeleteAction
												appearance={appearance}
												isLoading={true}
												onClick={onClick}
												size={size}
												testId="as-button-is-loading"
											/>
										</td>
										<td>
											<Inline space="space.050">
												<DeleteAction
													appearance={appearance}
													isDisabled
													onClick={onClick}
													size={size}
													testId="as-button-is-disabled"
												/>
												<DeleteAction
													appearance={appearance}
													href={href}
													isDisabled
													onClick={onClick}
													size={size}
													testId="as-link-is-disabled"
												/>
											</Inline>
										</td>
									</tr>
								))}
							</tbody>
						</table>
					</Box>
				))}
				<h5>Override CSS</h5>
				<Inline space="space.050">
					<DeleteAction
						appearance="default"
						content="Bold"
						onClick={onClick}
						css={css({
							// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors -- Ignored via go/DSP-18766
							span: {
								fontWeight: token('font.weight.bold'),
							},
						})}
					/>
					<DeleteAction
						appearance="default"
						content="Italic"
						onClick={onClick}
						css={css({
							// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors -- Ignored via go/DSP-18766
							span: {
								fontStyle: 'italic',
							},
						})}
					/>
					<DeleteAction
						appearance="default"
						content="Color"
						onClick={onClick}
						css={css({
							// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors -- Ignored via go/DSP-18766
							button: {
								backgroundColor: token('color.icon.brand', '#0C66E4'),
							},
							// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors -- Ignored via go/DSP-18766
							span: {
								color: token('color.text.inverse', '#FFFFFF'),
							},
						})}
					/>
				</Inline>
			</FlexibleUiContext.Provider>
		</VRTestWrapper>
	);
};

const Component = (): JSX.Element => {
	if (fg('bandicoots-compiled-migration-smartcard')) {
		return <ComponentNew />;
	}
	return <ComponentOld />;
};
export default Component;
