/** @jsx jsx */
import React, { useCallback, useEffect, useState } from 'react';
import { css, jsx, SerializedStyles } from '@emotion/react';

import { PreviewBlockProps } from '../types';
import { MediaPlacement } from '../../../../../../constants';
import Block from '../../block';
import { Preview } from '../../../elements';

/**
 * Due to its placement on the left/right and ignoreContainerPadding prop
 * rely on its parent container styling, css variables are declared in
 * <Container /> to preset the base values for the preview block styling.
 *
 * `--container-padding` is the padding of the Container. This value is based
 *   on size and hidePadding.
 * `--container-gap-left` and `--container-gap-right` are the gap or padding of
 *   the Container depending on whether the container has other preview blocks
 *   with left/right positioning.
 * `--preview-block-width` is the size of the preview image in relation to
 *   the Container width when the placement is left/right.
 * @param placement
 * @param ignoreContainerPadding
 */
const getPreviewBlockStyles = (
  placement?: MediaPlacement,
  ignoreContainerPadding?: boolean,
): SerializedStyles | undefined => {
  if (placement === MediaPlacement.Left || placement === MediaPlacement.Right) {
    const containerPadding = ignoreContainerPadding
      ? '0rem'
      : 'var(--container-padding)';
    return css`
      position: absolute;
      top: ${containerPadding};
      bottom: ${containerPadding};
      width: calc(var(--preview-block-width) - ${containerPadding});

      ${placement === MediaPlacement.Left ? `left: ${containerPadding};` : ''}
      ${placement === MediaPlacement.Right ? `right: ${containerPadding};` : ''}

      [data-smart-element-media='image'] {
        aspect-ratio: unset;
        padding-top: unset;
        width: 100%;
        height: 100%;
        object-fit: cover;
      }
    `;
  }

  if (ignoreContainerPadding) {
    return css`
      margin-left: calc(var(--container-gap-left) * -1);
      margin-right: calc(var(--container-gap-right) * -1);
      &:first-of-type {
        margin-top: calc(var(--container-padding) * -1);
      }
      &:last-of-type {
        margin-bottom: calc(var(--container-padding) * -1);
      }
    `;
  }
};

/**
 * Represents a resolved PreviewBlock, which typically contains media or other large format content.
 * @public
 * @param {PreviewBlock} PreviewBlock
 * @see Block
 */
const PreviewBlockResolvedView: React.FC<PreviewBlockProps> = ({
  ignoreContainerPadding = false,
  onError,
  overrideCss,
  placement,
  testId,
  overrideUrl,
  ...blockProps
}) => {
  const [styles, setStyles] = useState<SerializedStyles | undefined>(
    overrideCss,
  );

  const updateStyles = useCallback(() => {
    setStyles(css`
      ${getPreviewBlockStyles(placement, ignoreContainerPadding)}
      ${overrideCss}
    `);
  }, [ignoreContainerPadding, overrideCss, placement]);

  useEffect(() => {
    updateStyles();
  }, [ignoreContainerPadding, overrideCss, placement, updateStyles]);

  const handleOnLoad = useCallback(() => {
    updateStyles();
  }, [updateStyles]);

  const handleOnError = useCallback(() => {
    if (onError) {
      onError();
    }
  }, [onError]);

  return (
    <Block
      {...blockProps}
      overrideCss={styles}
      testId={`${testId}-resolved-view`}
    >
      <Preview
        onError={handleOnError}
        onLoad={handleOnLoad}
        overrideUrl={overrideUrl}
      />
    </Block>
  );
};

export default PreviewBlockResolvedView;
