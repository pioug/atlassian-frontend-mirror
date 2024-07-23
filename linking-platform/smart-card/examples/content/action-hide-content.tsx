/**
 * @jsxRuntime classic
 * @jsx jsx
 */
// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { css, jsx } from '@emotion/react';
import { ActionName, FooterBlock } from '../../src';
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
				{ name: ActionName.EditAction, onClick: () => {}, hideContent: true },
				{ name: ActionName.DeleteAction, onClick: () => {}, hideContent: true },
			]}
			overrideCss={styles}
		/>
	</ExampleContainer>
);
