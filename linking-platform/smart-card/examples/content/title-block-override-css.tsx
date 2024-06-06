/** @jsx jsx */
import { css, jsx } from '@emotion/react';
import { token } from '@atlaskit/tokens';
import { ElementName, TitleBlock } from '../../src';
import ExampleContainer from './example-container';

const styles = css({
	backgroundColor: token('color.background.accent.blue.subtlest', '#E9F2FF'),
	borderRadius: '24px',
	padding: token('space.100', '8px'),
});

export default () => (
	<ExampleContainer>
		<TitleBlock
			metadata={[{ name: ElementName.CommentCount }, { name: ElementName.State }]}
			overrideCss={styles}
		/>
	</ExampleContainer>
);
