/** @jsx jsx */
import { css, jsx } from '@emotion/react';
import { ActionName, FooterBlock } from '../../src';
import ExampleContainer from './example-container';

const styles = css({
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
