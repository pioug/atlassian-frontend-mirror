import React from 'react';
import { Caption } from '@atlaskit/editor-common/ui';
import { type NodeProps } from '../types';

const RenderCaption = ({ children, dataAttributes }: NodeProps) => {
	return (
		<Caption hasContent={true} dataAttributes={dataAttributes}>
			{children}
		</Caption>
	);
};

export default RenderCaption;
