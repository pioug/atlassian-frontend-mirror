/** @jsx jsx */
// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { jsx } from '@emotion/react';
import React from 'react';
import { type BlockBuilderProps } from '../types';
import MaxLinesOption from './inputs/max-lines-option';
import TextOption from './inputs/text-option';

const DEFAULT_MAX_LINES = 3;

const SnippetBlockBuilder: React.FC<BlockBuilderProps> = ({ onChange, template }) => {
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
			<TextOption
				defaultValue={template.text || ''}
				label="Override default link description"
				name="snippet.text"
				onChange={onChange}
				propName="text"
				template={template}
			/>
		</div>
	);
};

export default SnippetBlockBuilder;
