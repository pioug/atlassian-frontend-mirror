import React from 'react';

import styled from '@emotion/styled';

import { type StringType } from '@atlaskit/linking-types';

import { fieldTextFontSize } from '../../styled';

interface TextProps {
	testId?: string;
	text: StringType['value'];
}

export const TEXT_TYPE_TEST_ID = 'link-datasource-render-type--text';

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-styled -- To migrate as part of go/ui-styling-standard
const TextWrapper = styled.span({
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
	fontSize: fieldTextFontSize,
});

const TextRenderType = ({ text, testId = TEXT_TYPE_TEST_ID }: TextProps) => {
	if (!(text && typeof text === 'string')) {
		return <></>;
	}

	return (
		<>
			<TextWrapper data-testid={testId}>{text}</TextWrapper>
			<br />
		</>
	);
};

export default TextRenderType;
