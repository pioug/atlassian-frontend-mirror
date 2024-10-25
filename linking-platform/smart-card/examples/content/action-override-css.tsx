/**
 * @jsxRuntime classic
 * @jsx jsx
 */
// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { css, jsx } from '@emotion/react';

import { token } from '@atlaskit/tokens';

import { ActionName, FooterBlock } from '../../src';

import ExampleContainer from './example-container';

const styles = css({
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors -- Ignored via go/DSP-18766
	'[data-smart-element-badge]': {
		opacity: 0.2,
	},
});

const overrideEditStyles = css({
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors -- Ignored via go/DSP-18766
	button: {
		backgroundColor: token('color.background.accent.green.bolder', '#1F845A'),
	},
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors -- Ignored via go/DSP-18766
	span: {
		color: token('color.text.inverse', '#FFFFFF'),
	},
});

const overrideDeleteStyles = css({
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors -- Ignored via go/DSP-18766
	button: {
		backgroundColor: token('color.background.danger.bold', '#CA3521'),
	},
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors -- Ignored via go/DSP-18766
	span: {
		color: token('color.text.inverse', '#FFFFFF'),
	},
});

export default () => (
	<ExampleContainer>
		<FooterBlock
			actions={[
				{
					name: ActionName.EditAction,
					onClick: () => {},
					overrideCss: overrideEditStyles,
				},
				{
					name: ActionName.DeleteAction,
					onClick: () => {},
					overrideCss: overrideDeleteStyles,
				},
			]}
			overrideCss={styles}
		/>
	</ExampleContainer>
);
