import React from 'react';

import { type StringType } from '@atlaskit/linking-types';
import { Text } from '@atlaskit/primitives/compiled';

interface TextProps {
	testId?: string;
	text: StringType['value'];
}

export const TEXT_TYPE_TEST_ID = 'link-datasource-render-type--text';

const TextRenderType = ({ text, testId = TEXT_TYPE_TEST_ID }: TextProps): React.JSX.Element => {
	if (!(text && typeof text === 'string')) {
		return <></>;
	}

	return (
		<>
			<Text testId={testId}>{text}</Text>
			<br />
		</>
	);
};

export default TextRenderType;
