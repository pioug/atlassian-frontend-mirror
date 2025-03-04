/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { css, jsx } from '@compiled/react';

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
				{ name: ActionName.EditAction, onClick: () => {}, hideIcon: true },
				{ name: ActionName.DeleteAction, onClick: () => {}, hideIcon: true },
			]}
			css={styles}
		/>
	</ExampleContainer>
);
