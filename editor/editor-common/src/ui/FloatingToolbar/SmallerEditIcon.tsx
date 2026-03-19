/**
 * @jsxRuntime classic
 * @jsx jsx
 */
// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled, @typescript-eslint/consistent-type-imports -- Ignored via go/DSP-18766; jsx required at runtime for @jsxRuntime classic
import { css, jsx } from '@emotion/react';

import EditIcon from '@atlaskit/icon/core/edit';

const editIconStyles = css({
	width: '20px',
});

/* eslint-disable @atlaskit/design-system/consistent-css-prop-usage */
export const SmallerEditIcon = (): jsx.JSX.Element => {
	return (
		<div css={editIconStyles}>
			<EditIcon label="edit" />
		</div>
	);
};
/* eslint-enable @atlaskit/design-system/consistent-css-prop-usage */
