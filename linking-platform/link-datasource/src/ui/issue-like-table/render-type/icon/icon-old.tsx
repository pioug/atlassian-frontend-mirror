import React from 'react';

// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import styled from '@emotion/styled';

import { type Icon } from '@atlaskit/linking-types';
import { Box, xcss } from '@atlaskit/primitives';

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

const textWrapperStyles = xcss({
	marginLeft: 'space.100',
	overflow: 'hidden',
	textOverflow: 'ellipsis',
	whiteSpace: 'nowrap',
});

export const ICON_TYPE_TEST_ID = 'link-datasource-render-type--icon';
export const ICON_TYPE_TEXT_TEST_ID = `${ICON_TYPE_TEST_ID}-text`;

/**
 * @deprecated: To be cleaned up and replaced with new-icon after
 * `platform-datasources-enable-two-way-sync-priority` rollout.
 */
const IconRenderType = ({ label, text, source, testId = ICON_TYPE_TEST_ID }: IconProps) => {
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
				<Box xcss={textWrapperStyles}>
					<TextRenderType testId={ICON_TYPE_TEXT_TEST_ID} text={text}></TextRenderType>
				</Box>
			)}
		</IconWrapper>
	);
};

export default IconRenderType;
