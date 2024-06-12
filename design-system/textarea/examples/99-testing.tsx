/** @jsx jsx */
import { css, jsx } from '@emotion/react';

import TextArea from '../src';

const wrapperStyles = css({
	maxWidth: 500,
});
export default () => (
	<div css={wrapperStyles}>
		<label htmlFor="basic">Basic</label>
		<TextArea name="basic" id="basic" value="I have a data-testid" testId="MyTextAreaTestId" />
	</div>
);
