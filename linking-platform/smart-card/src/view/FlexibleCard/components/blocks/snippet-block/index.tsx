import React from 'react';

import { SnippetBlockProps } from './types';
import Block from '../block';
import { SmartLinkStatus } from '../../../../../constants';
import { Snippet } from '../../elements';
import { getMaxLines } from '../../utils';

const DEFAULT_MAX_LINES = 3;
const MAXIMUM_MAX_LINES = 3;
const MINIMUM_MAX_LINES = 1;

/**
 * Represents a SnippetBlock, which is used to display longer form text content, like descriptions.
 * @public
 * @param {SnippetBlock} SnippetBlock
 * @see Block
 */
const SnippetBlock: React.FC<SnippetBlockProps> = ({
  maxLines = DEFAULT_MAX_LINES,
  status = SmartLinkStatus.Fallback,
  testId = 'smart-block-snippet',
  text,
  ...blockProps
}) => {
  if (status !== SmartLinkStatus.Resolved) {
    return null;
  }

  const snippetMaxLines = getMaxLines(
    maxLines,
    DEFAULT_MAX_LINES,
    MAXIMUM_MAX_LINES,
    MINIMUM_MAX_LINES,
  );

  return (
    <Block {...blockProps} testId={`${testId}-resolved-view`}>
      <Snippet maxLines={snippetMaxLines} text={text} />
    </Block>
  );
};

export default SnippetBlock;
