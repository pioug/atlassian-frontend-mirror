import React from 'react';

import { type StringType } from '@atlaskit/linking-types';
import { fg } from '@atlaskit/platform-feature-flags';
import { Text } from '@atlaskit/primitives/compiled';

import TextRenderTypeOld from './text-old';

interface TextProps {
	testId?: string;
	text: StringType['value'];
}

export const TEXT_TYPE_TEST_ID = 'link-datasource-render-type--text';

const TextRenderType = ({ text, testId = TEXT_TYPE_TEST_ID }: TextProps) => {
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

const TextRenderTypeExported = (props: TextProps) => {
	if (fg('bandicoots-compiled-migration-link-datasource')) {
		return <TextRenderType {...props} />;
	} else {
		return <TextRenderTypeOld {...props} />;
	}
};

export default TextRenderTypeExported;
