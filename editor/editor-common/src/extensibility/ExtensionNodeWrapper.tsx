/** @jsx jsx */
import React from 'react';

import { css, jsx } from '@emotion/react';
import classnames from 'classnames';

import { ZERO_WIDTH_SPACE } from '../utils';

const styles = css({
  '&.inline-extension': {
    display: 'inline-block',
  },
  '&.relative': {
    position: 'relative',
  },
});

type Props = {
  children: React.ReactNode;
  nodeType: string;
  showMacroInteractionDesignUpdates?: boolean;
};
/**
 * If inlineExtension, add zero width space to the end of the nodes and wrap with span;
 * Also if showMacroInteractionDesignUpdates is true, then add the inline-block style to account for the lozenge.
 * else wrap with a div (for multi bodied extensions)
 *
 * @param param0
 * @returns
 */
export const ExtensionNodeWrapper = ({
  children,
  nodeType,
  showMacroInteractionDesignUpdates,
}: Props) => {
  const wrapperClassNames = classnames({
    'inline-extension':
      nodeType === 'inlineExtension' && showMacroInteractionDesignUpdates,
    relative: showMacroInteractionDesignUpdates,
  });

  return (
    <span className={wrapperClassNames} css={styles}>
      {children}
      {nodeType === 'inlineExtension' && ZERO_WIDTH_SPACE}
    </span>
  );
};
