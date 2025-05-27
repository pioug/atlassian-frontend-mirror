import React from 'react';

import { cssMap, styled } from '@compiled/react';

import { type Icon } from '@atlaskit/linking-types';
import { fg } from '@atlaskit/platform-feature-flags';
import { Box } from '@atlaskit/primitives/compiled';
import { token } from '@atlaskit/tokens';

import TextRenderType from '../text';

interface IconProps extends Icon {
	testId?: string;
}

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-styled -- To migrate as part of go/ui-styling-standard
const IconWrapper = styled.div({
	display: 'flex',
	alignItems: 'center',
	justifyContent: 'left',
});

const styles = cssMap({
	textWrapperStyles: {
		marginLeft: token('space.100'),
		overflow: 'hidden',
		textOverflow: 'ellipsis',
		whiteSpace: 'nowrap',
	},
});

export const ICON_TYPE_TEST_ID = 'link-datasource-render-type--icon';
export const ICON_TYPE_TEXT_TEST_ID = `${ICON_TYPE_TEST_ID}-text`;

/**
 * @deprecated: To be cleaned up and replaced with new-icon after
 * `platform-datasources-enable-two-way-sync-priority` rollout.
 */
const IconRenderType = ({
	label: propLabel = '',
	text,
	source,
	testId = ICON_TYPE_TEST_ID,
}: IconProps) => {
	// image-redundant-alt - icon does not need label if the text is the same as the label
	const label =
		propLabel.toLowerCase() !== text?.toLowerCase() || !fg('fix_a11y_issues_inline_edit')
			? propLabel
			: '';

	return (
		<IconWrapper>
			<img
				src={source}
				alt={label}
				data-testid={testId}
				// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
				style={{ minWidth: '20px', maxWidth: '20px' }} // having just width: '20px' shrinks it when table width is reduced
			/>
			{text && (
				<Box xcss={styles.textWrapperStyles}>
					<TextRenderType testId={ICON_TYPE_TEXT_TEST_ID} text={text}></TextRenderType>
				</Box>
			)}
		</IconWrapper>
	);
};

export default IconRenderType;
