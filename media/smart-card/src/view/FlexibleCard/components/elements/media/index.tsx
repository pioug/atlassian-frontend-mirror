/** @jsx jsx */
import React from 'react';
import { css, jsx } from '@emotion/core';

import ImageIcon from '../../common/image-icon';
import { MediaProps } from './types';

/**
 * Media: Image
 * [aspect-ratio: 16 / 9] The context box is fixed to aspect ratio of 16:9.
 * [object-fit: cover] The replaced content is sized to maintain
 * its aspect ratio while filling the element's entire content box.
 * If the object's aspect ratio does not match the aspect ratio of its box,
 * then the object will be clipped to fit.
 * [object-position] Center alignment of the selected replaced element's
 * contents within the element's box.
 */
const styles = css`
  aspect-ratio: 16 / 9;
  display: flex;
  width: 100%;

  // fallback
  @supports not (aspect-ratio: auto) {
    padding-top: 56.25%; // 16:9 ratio (9 / 16 = 0.5625)
    height: 0;
    position: relative;
    overflow: hidden;
  }

  > img {
    min-height: 100%;
    min-width: 100%;
    max-height: 100%;
    max-width: 100%;
    object-fit: cover;
    object-position: center center;

    // fallback
    @supports not (aspect-ratio: auto) {
      position: absolute;
      transform: translate(-50%, -50%);
      left: 50%;
      top: 50%;
      width: auto;
      height: auto;
    }
  }
`;

/**
 * A base element that displays a Media.
 * @internal
 * @param {MediaProps} MediaProps - The props necessary for the Media element.
 * @see Preview
 */
const Media: React.FC<MediaProps> = ({
  overrideCss,
  testId = 'smart-element-media',
  type,
  url,
}) => {
  if (!type || !url) {
    return null;
  }

  return (
    <div
      css={[styles, overrideCss]}
      data-smart-element-media
      data-testid={testId}
    >
      <ImageIcon testId={`${testId}-image`} url={url} />
    </div>
  );
};

export default Media;
