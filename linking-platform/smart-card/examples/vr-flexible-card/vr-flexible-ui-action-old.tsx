/**
 * @jsxRuntime classic
 * @jsx jsx
 */
// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { css, jsx } from '@emotion/react';

import TrashIcon from '@atlaskit/icon/core/migration/delete--trash';
import { token } from '@atlaskit/tokens';

import { SmartLinkSize } from '../../src';
import { FlexibleUiContext } from '../../src/state/flexible-ui-context';
import { DeleteAction } from '../../src/view/FlexibleCard/components/actions';
import { exampleTokens, getContext } from '../utils/flexible-ui';
import VRTestWrapper from '../utils/vr-test-wrapper';

const containerStyles = css({
	display: 'flex',
	flexWrap: 'wrap',
	gap: token('space.050', '4px'),
	padding: token('space.050', '4px'),
});

const context = getContext();
let onClick = () => {
	console.log('Testing Delete Action...');
};

const ComponentOld = () => (
	<VRTestWrapper>
		<FlexibleUiContext.Provider value={context}>
			<table>
				<thead>
					<tr>
						<th>Size</th>
						<th>Default</th>
						<th>No content</th>
						<th>No icon</th>
						<th>Custom icon</th>
						<th>Custom text</th>
						<th>Disabled</th>
					</tr>
				</thead>
				<tbody>
					{Object.values(SmartLinkSize).map((size) => {
						return (
							<tr>
								<td>{size}</td>
								<td>
									<div css={containerStyles}>
										<DeleteAction size={size} onClick={onClick} testId="vr-test-delete-action" />
										<DeleteAction
											size={size}
											onClick={onClick}
											appearance="default"
											testId="vr-test-delete-action"
										/>
									</div>
								</td>
								<td>
									<div css={containerStyles}>
										<DeleteAction
											size={size}
											onClick={onClick}
											content={undefined}
											testId="vr-test-delete-action"
										/>
										<DeleteAction
											size={size}
											onClick={onClick}
											content={undefined}
											appearance="default"
											testId="vr-test-delete-action"
										/>
									</div>
								</td>
								<td>
									<div css={containerStyles}>
										<DeleteAction
											size={size}
											onClick={onClick}
											icon={undefined}
											testId="vr-test-delete-action"
										/>
										<DeleteAction
											size={size}
											onClick={onClick}
											icon={undefined}
											appearance="default"
											testId="vr-test-delete-action"
										/>
									</div>
								</td>
								<td>
									<div css={containerStyles}>
										<DeleteAction
											size={size}
											onClick={onClick}
											icon={
												<TrashIcon
													label="Trash"
													spacing="spacious"
													color={token('color.icon', '#44546F')}
												/>
											}
											testId="vr-test-delete-action"
										/>
										<DeleteAction
											size={size}
											onClick={onClick}
											icon={
												<TrashIcon
													label="Trash"
													spacing="spacious"
													color={token('color.icon', '#44546F')}
												/>
											}
											appearance="default"
											testId="vr-test-delete-action"
										/>
									</div>
								</td>
								<td>
									<div css={containerStyles}>
										<DeleteAction
											size={size}
											onClick={onClick}
											content="Remove"
											testId="vr-test-delete-action"
										/>
										<DeleteAction
											size={size}
											onClick={onClick}
											content="Remove"
											appearance="default"
											testId="vr-test-delete-action"
										/>
									</div>
								</td>
								<td>
									<div css={containerStyles}>
										<DeleteAction
											size={size}
											onClick={onClick}
											content="Remove"
											testId="vr-test-delete-action"
											isDisabled
										/>
										<DeleteAction
											size={size}
											onClick={onClick}
											content="Remove"
											appearance="default"
											testId="vr-test-delete-action"
											isDisabled
										/>
									</div>
								</td>
							</tr>
						);
					})}
				</tbody>
			</table>
			<h5>Override CSS</h5>
			<div css={containerStyles}>
				<DeleteAction
					appearance="default"
					content="Bold"
					onClick={onClick}
					overrideCss={css({
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
					overrideCss={css({
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
					overrideCss={css({
						// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors -- Ignored via go/DSP-18766
						button: {
							// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
							backgroundColor: exampleTokens.iconBackgroundColor,
						},
						// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors -- Ignored via go/DSP-18766
						span: {
							// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
							color: exampleTokens.iconColor,
						},
					})}
				/>
			</div>
		</FlexibleUiContext.Provider>
	</VRTestWrapper>
);

export default ComponentOld;
