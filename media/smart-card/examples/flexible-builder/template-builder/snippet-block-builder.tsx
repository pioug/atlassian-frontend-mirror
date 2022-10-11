/** @jsx jsx */
import { jsx } from '@emotion/react';
import React from 'react';
import { BlockBuilderProps } from '../types';
import MaxLinesOption from './inputs/max-lines-option';

const DEFAULT_MAX_LINES = 3;

const SnippetBlockBuilder: React.FC<BlockBuilderProps> = ({
  onChange,
  template,
}) => {
  return (
    <div>
      <MaxLinesOption
        defaultValue={DEFAULT_MAX_LINES}
        label="Max lines"
        name="snippet.maxLines"
        onChange={onChange}
        propName="maxLines"
        max={3}
        template={template}
      />
    </div>
  );
};

export default SnippetBlockBuilder;
