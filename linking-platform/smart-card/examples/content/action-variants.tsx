/**
 * @jsxRuntime classic
 * @jsx jsx
 */
// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { css, jsx } from '@emotion/react';
import ExampleContainer from './example-container';
import { DeleteAction, EditAction } from '../../src/view/FlexibleCard/components/actions';

const styles = css({
	display: 'flex',
});
export default () => (
	<ExampleContainer>
		<div css={styles}>
			<EditAction onClick={() => {}} />
			<DeleteAction onClick={() => {}} />
		</div>
	</ExampleContainer>
);
