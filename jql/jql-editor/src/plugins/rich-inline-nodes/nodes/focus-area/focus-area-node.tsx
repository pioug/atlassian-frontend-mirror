import React from 'react';

import FocusAreaIcon from '@atlaskit/icon/core/focus-area';

import type { NodeViewProps } from '../../util/react-node-view';
import { NodeBase } from '../base';
import type { Props } from './types';

export const FocusAreaNode = (props: NodeViewProps<Props>): React.JSX.Element => {
	const { name, ...rest } = props;

	return (
		<NodeBase iconBefore={<FocusAreaIcon label="" />} text={name} isRichNodeDisplay {...rest} />
	);
};
