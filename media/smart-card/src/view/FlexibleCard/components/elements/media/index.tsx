/** @jsx jsx */
import React from 'react';
import { css, jsx } from '@emotion/core';

import ImageIcon from '../../common/image-icon';
import { MediaProps } from './types';

const styles = (url?: string) => css`
  display: flex;
  justify-content: center;
  width: 100%;
  > img {
    max-width: 100%;
    max-height: 100%;
  }
`;

const Media: React.FC<MediaProps> = ({
  testId = 'smart-element-media',
  type,
  url,
}) => {
  if (!type || !url) {
    return null;
  }

  return (
    <div css={styles(url)} data-smart-element-media data-testid={testId}>
      <ImageIcon testId={`${testId}-image`} url={url} />
    </div>
  );
};

export default Media;
