import React from 'react';

import { PreviewBlockProps } from './types';
import { SmartLinkStatus } from '../../../../../constants';
import Block from '../block';
import { Preview } from '../../elements';

/**
 * Represents a PreviewBlock, which typically contains media or other large format content.
 * @public
 * @param {PreviewBlock} PreviewBlock
 * @see Block
 */
const PreviewBlock: React.FC<PreviewBlockProps> = ({
  status = SmartLinkStatus.Fallback,
  testId = 'smart-block-preview',
  onError,
  ...blockProps
}) => {
  if (status !== SmartLinkStatus.Resolved) {
    return null;
  }
  return (
    <Block {...blockProps} testId={`${testId}-resolved-view`}>
      <Preview onError={onError} />
    </Block>
  );
};

export default PreviewBlock;
