import React from 'react';

import { type TagType } from '@atlaskit/linking-types';
import { SimpleTag as Tag } from '@atlaskit/tag';

interface TagProps {
	tag: TagType['value'];
	testId?: string;
}

export const TAG_TYPE_TEST_ID = 'link-datasource-render-type--tag';

const TagRenderType = ({ tag, testId = TAG_TYPE_TEST_ID }: TagProps): React.JSX.Element => {
	const text = tag?.text;

	if (!(text && typeof text === 'string')) {
		return <></>;
	}

	return (
		<Tag
			text={text}
			testId={testId}
			appearance={'default'}
			color={tag?.color ?? 'standard'}
			href={tag?.url}
		/>
	);
};

export default TagRenderType;
