/**
 * @jsxRuntime classic
 * @jsx jsx
 */
// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { css, jsx } from '@emotion/react';

import { ActionName, FooterBlock, SmartLinkSize } from '../../src';

import ExampleContainer from './example-container';

const styles = css({
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors -- Ignored via go/DSP-18766
	'[data-smart-element-badge]': {
		opacity: 0.2,
	},
});

export default () => (
	<ExampleContainer>
		<FooterBlock
			actions={[
				{
					name: ActionName.EditAction,
					onClick: () => {},
					size: SmartLinkSize.Small,
				},
				{
					name: ActionName.DeleteAction,
					onClick: () => {},
					size: SmartLinkSize.Small,
				},
			]}
			overrideCss={styles}
		/>
		<br />
		<FooterBlock
			actions={[
				{
					name: ActionName.EditAction,
					onClick: () => {},
					size: SmartLinkSize.Medium,
				},
				{
					name: ActionName.DeleteAction,
					onClick: () => {},
					size: SmartLinkSize.Medium,
				},
			]}
			overrideCss={styles}
		/>
		<br />
		<FooterBlock
			actions={[
				{
					name: ActionName.EditAction,
					onClick: () => {},
					size: SmartLinkSize.Large,
				},
				{
					name: ActionName.DeleteAction,
					onClick: () => {},
					size: SmartLinkSize.Large,
				},
			]}
			overrideCss={styles}
		/>
		<br />
		<FooterBlock
			actions={[
				{
					name: ActionName.EditAction,
					onClick: () => {},
					size: SmartLinkSize.XLarge,
				},
				{
					name: ActionName.DeleteAction,
					onClick: () => {},
					size: SmartLinkSize.XLarge,
				},
			]}
			overrideCss={styles}
		/>
	</ExampleContainer>
);
