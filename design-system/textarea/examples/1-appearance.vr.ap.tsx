/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { css, jsx } from '@compiled/react';

import TextArea from '@atlaskit/textarea/text-area';

const wrapperStyles = css({
	maxWidth: 500,
});

const _default: () => JSX.Element = () => (
	<div id="appearance" css={wrapperStyles}>
		<label htmlFor="standard">Standard</label>
		{/* eslint-disable-next-line @atlaskit/design-system/no-placeholder */}
		<TextArea
			name="standard"
			id="standard"
			placeholder="standard"
			appearance="standard"
			testId="standardId"
		/>
		<label htmlFor="disabled">Disabled</label>
		{/* eslint-disable-next-line @atlaskit/design-system/no-placeholder, @atlaskit/design-system/no-readonly-or-disabled-inputs */}
		<TextArea
			name="disabled"
			id="disabled"
			placeholder="standard, disabled"
			appearance="standard"
			testId="standardId"
			isDisabled
		/>
		<label htmlFor="subtle">Subtle</label>
		{/* eslint-disable-next-line @atlaskit/design-system/no-placeholder */}
		<TextArea
			name="subtle"
			id="subtle"
			placeholder="subtle"
			appearance="subtle"
			testId="subtleId"
		/>
		<label htmlFor="subtle-disabled">Subtle and disabled</label>
		{/* eslint-disable-next-line @atlaskit/design-system/no-placeholder, @atlaskit/design-system/no-readonly-or-disabled-inputs */}
		<TextArea
			name="subtle-disabled"
			id="subtle-disabled"
			placeholder="subtle, disabled"
			appearance="subtle"
			testId="subtleId"
			isDisabled
		/>
		<label htmlFor="none">None</label>
		{/* eslint-disable-next-line @atlaskit/design-system/no-placeholder */}
		<TextArea name="none" id="none" placeholder="none" appearance="none" testId="noneId" />
		<label htmlFor="none-disabled">None/disabled</label>
		{/* eslint-disable-next-line @atlaskit/design-system/no-placeholder, @atlaskit/design-system/no-readonly-or-disabled-inputs */}
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
export default _default;
