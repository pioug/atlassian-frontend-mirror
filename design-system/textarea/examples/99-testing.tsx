/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { css, jsx } from '@compiled/react';

import TextArea from '@atlaskit/textarea';

const wrapperStyles = css({
	maxWidth: 500,
});
export default () => (
	<div css={wrapperStyles}>
		<label htmlFor="basic">Basic</label>
		<TextArea name="basic" id="basic" value="I have a data-testid" testId="MyTextAreaTestId" />
	</div>
);
