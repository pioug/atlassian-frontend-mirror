import React from 'react';
import { type SubSupAttributes } from '@atlaskit/adf-schema';
import { type MarkProps } from '../types';

const isSub = (type: SubSupAttributes['type']): type is 'sub' => {
	return type === 'sub';
};

export default function SubSup(props: MarkProps<SubSupAttributes>) {
	if (isSub(props.type)) {
		// Ignored via go/ees005
		// eslint-disable-next-line react/jsx-props-no-spreading
		return <sub {...props.dataAttributes}>{props.children}</sub>;
	}

	// Ignored via go/ees005
	// eslint-disable-next-line react/jsx-props-no-spreading
	return <sup {...props.dataAttributes}>{props.children}</sup>;
}
