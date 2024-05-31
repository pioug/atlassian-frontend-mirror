/** @jsx jsx */
import { css, jsx } from '@emotion/react';

import { relativeFontSizeToBase16 } from '@atlaskit/editor-shared-styles';

const optionStyle = css({
	display: 'flex',
	flexDirection: 'column',
});

const description = css({
	fontSize: relativeFontSizeToBase16(12),
	fontStyle: 'italic',
});

export const formatAppearanceOption = (
	option: { label: string; description?: string },
	{ context }: { context: string },
) => {
	if (context === 'menu') {
		return (
			<div css={optionStyle}>
				<div>{option.label}</div>
				{option.description && <div css={description}>{option.description}</div>}
			</div>
		);
	}

	return option.label;
};
