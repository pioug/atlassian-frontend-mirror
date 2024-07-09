import React from 'react';
import { Inline, xcss } from '@atlaskit/primitives';
import { type AIIndicatorContainerProps } from './types';

const contentStyles = xcss({
	color: 'color.text.subtle',
	fontSize: '12px',
	fontWeight: '400',
	lineHeight: '16px',
});

const AIIndicatorContainer = ({ icon, content, testId }: AIIndicatorContainerProps) => {
	return (
		<Inline
			alignBlock="start"
			alignInline="start"
			space="space.050"
			xcss={contentStyles}
			testId={testId}
		>
			{icon}
			{content}
		</Inline>
	);
};

export default AIIndicatorContainer;
