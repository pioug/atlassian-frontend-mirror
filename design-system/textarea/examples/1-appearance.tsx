/** @jsx jsx */
// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { css, jsx } from '@emotion/react';

import TextArea from '../src';

const wrapperStyles = css({
	maxWidth: 500,
});

export default () => (
	<div id="appearance" css={wrapperStyles}>
		<label htmlFor="standard">Standard</label>
		<TextArea
			name="standard"
			id="standard"
			placeholder="standard"
			appearance="standard"
			testId="standardId"
		/>
		<label htmlFor="disabled">Disabled</label>
		<TextArea
			name="disabled"
			id="disabled"
			placeholder="standard, disabled"
			appearance="standard"
			testId="standardId"
			isDisabled
		/>
		<label htmlFor="subtle">Subtle</label>
		<TextArea
			name="subtle"
			id="subtle"
			placeholder="subtle"
			appearance="subtle"
			testId="subtleId"
		/>
		<label htmlFor="subtle-disabled">Subtle and disabled</label>
		<TextArea
			name="subtle-disabled"
			id="subtle-disabled"
			placeholder="subtle, disabled"
			appearance="subtle"
			testId="subtleId"
			isDisabled
		/>
		<label htmlFor="none">None</label>
		<TextArea name="none" id="none" placeholder="none" appearance="none" testId="noneId" />
		<label htmlFor="none-disabled">None/disabled</label>
		<TextArea
			name="none-disabled"
			id="none-disabled"
			placeholder="none, disabled"
			appearance="none"
			testId="noneId"
			isDisabled
		/>
	</div>
);
