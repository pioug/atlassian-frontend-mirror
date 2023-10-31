import React from 'react';

import { messages } from '../../../../../../messages';
import Text from '../../../elements/text';
import Block from '../../block';
import { RelatedUrlsBlockErroredViewProps } from './types';

export const RelatedUrlsBlockErroredView: React.FC<
  RelatedUrlsBlockErroredViewProps
> = ({ testId, ...blockProps }) => (
  <Block {...blockProps} testId={testId}>
    <Text message={{ descriptor: messages.generic_error_message }} />
  </Block>
);
