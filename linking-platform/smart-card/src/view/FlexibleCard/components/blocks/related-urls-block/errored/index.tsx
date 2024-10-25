import React from 'react';

import { messages } from '../../../../../../messages';
import Text from '../../../elements/text';
import Block from '../../block';

import { type RelatedUrlsBlockErroredViewProps } from './types';

export const RelatedUrlsBlockErroredView = ({
	testId,
	...blockProps
}: RelatedUrlsBlockErroredViewProps) => (
	<Block {...blockProps} testId={testId}>
		<Text message={{ descriptor: messages.generic_error_message }} />
	</Block>
);
