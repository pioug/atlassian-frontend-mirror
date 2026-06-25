import React from 'react';

import UFOSegment, { type Props as SegmentProps } from './segment';

type GenAISegmentProps = Omit<SegmentProps, 'type'>;

export const UFOGenAISegment: {
	(props: GenAISegmentProps): React.JSX.Element;
	displayName: string;
} = (props: GenAISegmentProps): React.JSX.Element => {
	return <UFOSegment type="gen-ai" {...props} />;
};

UFOGenAISegment.displayName = 'UFOGenAISegment';
