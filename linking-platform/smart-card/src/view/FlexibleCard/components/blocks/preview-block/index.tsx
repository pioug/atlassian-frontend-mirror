/** @jsx jsx */
import React from 'react';
import { jsx } from '@emotion/react';

import { PreviewBlockProps } from './types';
import { SmartLinkStatus } from '../../../../../constants';
import PreviewBlockResolvedView from './resolved';

/**
 * Represents a PreviewBlock, which typically contains media or other large format content.
 * @public
 * @param {PreviewBlock} PreviewBlock
 * @see Block
 */
const PreviewBlock: React.FC<PreviewBlockProps> = ({
  status = SmartLinkStatus.Fallback,
  testId = 'smart-block-preview',
  ...blockProps
}) => {
  if (status !== SmartLinkStatus.Resolved) {
    return null;
  }

  return <PreviewBlockResolvedView {...blockProps} testId={testId} />;
};

export default PreviewBlock;
