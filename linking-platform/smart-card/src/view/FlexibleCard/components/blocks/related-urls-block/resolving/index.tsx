import React from 'react';

import LoadingSkeleton from '../../../common/loading-skeleton';
import Block from '../../block';
import { type BlockProps } from '../../types';

export const RelatedUrlsBlockResolvingView = ({
	testId,
	...blockProps
}: BlockProps & { testId?: string }) => (
	<Block {...blockProps} testId={testId}>
		<LoadingSkeleton height={1.55} width={22} />
	</Block>
);
