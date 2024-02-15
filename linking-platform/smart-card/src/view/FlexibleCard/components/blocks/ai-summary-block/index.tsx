import React from 'react';
import AISummaryBlockResolvedView from './resolved';
import { AISummaryBlockProps } from './types';
import { SmartLinkStatus } from '../../../../../constants';

/**
 * Represents an AISummaryBlock, designed to summarising link resource
 * content using AI.
 * @public
 * @param {AISummaryBlockProps} AISummaryBlock
 * @see Block
 */
const AISummaryBlock: React.FC<AISummaryBlockProps> = ({
  status,
  testId = 'smart-ai-summary-block',
  ...props
}) => {
  if (status !== SmartLinkStatus.Resolved) {
    return null;
  }

  return <AISummaryBlockResolvedView {...props} testId={testId} />;
};

export default AISummaryBlock;
