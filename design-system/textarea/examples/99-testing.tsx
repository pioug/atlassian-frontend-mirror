/**
 * @jsxRuntime classic
 * @jsx jsx
 */
// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
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
