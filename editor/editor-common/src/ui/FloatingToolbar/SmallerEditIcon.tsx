/**
 * @jsxRuntime classic
 * @jsx jsx
 */
// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { css, jsx } from '@emotion/react';

import EditIcon from '@atlaskit/icon/core/migration/edit';

const editIconStyles = css({
	width: '20px',
});

/* eslint-disable @atlaskit/design-system/consistent-css-prop-usage */
export const SmallerEditIcon = () => {
	return (
		<div css={editIconStyles}>
			<EditIcon label="edit" />
		</div>
	);
};
/* eslint-enable @atlaskit/design-system/consistent-css-prop-usage */
