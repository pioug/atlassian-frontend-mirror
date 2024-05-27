import React from 'react';
import FooterBlockResolvedView from './resolved';
import { type FooterBlockProps } from './types';
import { SmartLinkStatus } from '../../../../../constants';

/**
 * Represents a FooterBlock, designed to contain elements and actions that should appear
 * at the bottom of a link card.
 * @public
 * @param {FooterBlockProps} FooterBlockProps
 * @see Block
 */
const FooterBlock: React.FC<FooterBlockProps> = ({
  status,
  testId = 'smart-footer-block',
  ...props
}) => {
  if (status !== SmartLinkStatus.Resolved) {
    return null;
  }

  return <FooterBlockResolvedView {...props} testId={testId} />;
};

export default FooterBlock;
