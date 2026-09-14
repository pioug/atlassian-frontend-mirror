import React from 'react';

import Avatar from '@atlaskit/avatar/avatar';

import { useHydratedAssets } from '../../../../state';
import type { NodeViewProps } from '../../util/react-node-view';
import { NodeBase } from '../base';

import type { Props } from './types';

export const AssetsNode = ({
	id,
	fieldName,
	name,
	selected,
	error,
}: NodeViewProps<Props>): React.JSX.Element => {
	const [assets] = useHydratedAssets({ id, fieldName });

	return (
		<NodeBase
			iconBefore={
				// square, so the object icon is not cropped to a circle
				<Avatar
					src={assets?.avatarUrl}
					appearance="square"
					size="xxsmall"
					borderColor="transparent"
					testId="jql-editor-assets-node-avatar"
				/>
			}
			text={name}
			isRichNodeDisplay
			selected={selected}
			error={error}
		/>
	);
};
