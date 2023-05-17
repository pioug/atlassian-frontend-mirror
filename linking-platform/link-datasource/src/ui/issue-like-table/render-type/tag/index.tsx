import React from 'react';

import { TagType } from '@atlaskit/linking-types';
import { SimpleTag as Tag } from '@atlaskit/tag';

interface TagProps {
  text: TagType['value'];
  testId?: string;
}

export const TAG_TYPE_TEST_ID = 'link-datasource-render-type--tag';

const TagRenderType = ({ text, testId = TAG_TYPE_TEST_ID }: TagProps) => {
  if (!text) {
    return <></>;
  }

  return (
    <Tag
      text={text}
      testId={testId}
      appearance={'default'}
      color={'standard'}
    />
  );
};

export default TagRenderType;
