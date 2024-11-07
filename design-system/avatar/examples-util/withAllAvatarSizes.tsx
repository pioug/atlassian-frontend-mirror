/* eslint-disable @repo/internal/react/no-unsafe-spread-props */
// eslint-disable-next-line @repo/internal/fs/filename-pattern-match
import React from 'react';

import Avatar from '@atlaskit/avatar';
import { type AppearanceType } from '@atlaskit/avatar/types';

import { Block } from './helpers';

interface WithAllAvatarSizesProps {
	presence?: JSX.Element;
	appearance?: AppearanceType;
}

const WithAllAvatarSizes = (props: WithAllAvatarSizesProps) => {
	const { presence, ...rest } = props;

	return (
		<Block>
			<Avatar size="xxlarge" {...rest} />
			<Avatar size="xlarge" {...props} />
			<Avatar size="large" {...props} />
			<Avatar size="medium" {...props} />
			<Avatar size="small" {...props} />
			<Avatar size="xsmall" {...rest} />
		</Block>
	);
};

export default WithAllAvatarSizes;
