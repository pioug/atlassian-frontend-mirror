import React from 'react';

import LoadingSkeleton from '../../../common/loading-skeleton';
import Block from '../../block';
import { BlockProps } from '../../types';

export const RelatedUrlsBlockResolvingView: React.FC<
  BlockProps & { testId?: string }
> = ({ testId, ...blockProps }) => (
  <Block {...blockProps} testId={testId}>
    <LoadingSkeleton height={1.55} width={22} />
  </Block>
);
