/** @jsx jsx */
import { css, jsx } from '@emotion/react';
import { token } from '@atlaskit/tokens';
import { ActionName, FooterBlock, TitleBlock } from '../../src';
import ExampleContainer from './example-container';

const styles = css({
	marginTop: token('space.050', '4px'),
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors -- Ignored via go/DSP-18766
	'[data-smart-element-icon], [data-smart-element-link], [data-smart-element-badge]': {
		opacity: 0.2,
	},
});

export default () => (
	<ExampleContainer>
		<TitleBlock
			actions={[
				{ name: ActionName.EditAction, onClick: () => {} },
				{ name: ActionName.DeleteAction, onClick: () => {} },
			]}
			overrideCss={styles}
		/>
		<FooterBlock
			actions={[
				{ name: ActionName.EditAction, onClick: () => {} },
				{ name: ActionName.DeleteAction, onClick: () => {} },
			]}
			overrideCss={styles}
		/>
	</ExampleContainer>
);
