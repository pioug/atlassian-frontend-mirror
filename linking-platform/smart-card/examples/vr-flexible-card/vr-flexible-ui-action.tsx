/* eslint-disable @atlaskit/ui-styling-standard/no-imported-style-values */
/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { css, jsx } from '@compiled/react';

import TrashIcon from '@atlaskit/icon/core/migration/delete--trash';
import { fg } from '@atlaskit/platform-feature-flags';
import { token } from '@atlaskit/tokens';

import { SmartLinkSize } from '../../src';
import { FlexibleUiContext } from '../../src/state/flexible-ui-context';
import { DeleteAction } from '../../src/view/FlexibleCard/components/actions';
import { getContext } from '../utils/flexible-ui';
import VRTestWrapper from '../utils/vr-test-wrapper';

import ComponentOld from './vr-flexible-ui-action-old';

const containerStyles = css({
	display: 'flex',
	flexWrap: 'wrap',
	gap: token('space.050', '4px'),
	paddingTop: token('space.050', '4px'),
	paddingRight: token('space.050', '4px'),
	paddingBottom: token('space.050', '4px'),
	paddingLeft: token('space.050', '4px'),
});

const context = getContext();
let onClick = () => {
	console.log('Testing Delete Action...');
};

const ComponentNew = () => (
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
			</div>
		</FlexibleUiContext.Provider>
	</VRTestWrapper>
);

const Component = (): JSX.Element => {
	if (fg('bandicoots-compiled-migration-smartcard')) {
		return <ComponentNew />;
	}
	return <ComponentOld />;
};
export default Component;
