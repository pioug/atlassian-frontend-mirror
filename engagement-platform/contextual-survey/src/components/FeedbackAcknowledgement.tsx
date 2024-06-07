/** @jsx jsx */
import { css, jsx } from '@emotion/react';

import { fontFallback } from '@atlaskit/theme/typography';
import { token } from '@atlaskit/tokens';

import SuccessContainer from './SuccessContainer';

const styles = css({
	font: token('font.heading.xsmall', fontFallback.heading.xsmall),
	marginTop: 0,
});
export default () => (
	<SuccessContainer>
		<h1 css={styles}>Thanks for your feedback</h1>
	</SuccessContainer>
);
