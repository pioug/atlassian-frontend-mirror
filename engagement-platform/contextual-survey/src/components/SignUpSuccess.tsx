/**
 * @jsxRuntime classic
 * @jsx jsx
 */
// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { css, jsx } from '@emotion/react';

import { fontFallback } from '@atlaskit/theme/typography';
import { token } from '@atlaskit/tokens';

import SuccessContainer from './SuccessContainer';

const styles = css({
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values -- Ignored via go/DSP-18766
	font: token('font.heading.xsmall', fontFallback.heading.xsmall),
	margin: 0,
});
interface Props {}

export default ({}: Props) => (
	<SuccessContainer>
		<h1 css={styles}>Thanks for signing up</h1>
		<p>We may reach out to you in the future to participate in additional research.</p>
	</SuccessContainer>
);
