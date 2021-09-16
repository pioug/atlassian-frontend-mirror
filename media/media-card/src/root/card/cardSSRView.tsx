/*
 * This file is designed to be optimised for maximum performance.
 * Because of this the imports are optimised to import only what is required
 * If you're adding a new dependency please ensure that the
 * imported file only contains and depends on only what is required for it to function.
 */
import React, { FC } from 'react';
import {
  FileIdentifier,
  ImageResizeMode,
  MediaClient,
} from '@atlaskit/media-client';
import { MediaImage } from '@atlaskit/media-ui';
import SpinnerIcon from '@atlaskit/spinner';

import { getRequestedDimensions } from '../../utils/getDataURIDimension';
import {
  defaultImageCardDimensions,
  CardDimensions,
} from '../../utils/cardDimensions';

import { Breakpoint } from '../ui/Breakpoint';
import { IconWrapper } from '../ui/iconWrapper/styled';
import {
  SSRFileExperienceWrapper,
  CardImageContainer,
  calcBreakpointSize,
} from '../ui/styledSSR';
import { Blanket } from '../ui/blanket/styled';

import { newFileExperienceClassName } from './cardConstants';
import { resizeModeToMediaImageProps } from '../../utils/resizeModeToMediaImageProps';

export interface CardSSRViewProps {
  readonly identifier: FileIdentifier;
  readonly dimensions?: CardDimensions;
  readonly mediaClient: MediaClient;
  readonly resizeMode: ImageResizeMode;
  readonly alt?: string;
  readonly disableOverlay: boolean;
  readonly isLazy?: boolean;
}

export const CardSSRView: FC<CardSSRViewProps> = ({
  identifier,
  dimensions,
  mediaClient,
  resizeMode,
  disableOverlay,
  isLazy,
}) => {
  let dataURI: string | undefined;

  try {
    const { width, height } = getRequestedDimensions({ dimensions });
    const mode = resizeMode === 'stretchy-fit' ? 'full-fit' : resizeMode;
    dataURI = mediaClient.getImageUrlSync(identifier.id, {
      collection: identifier.collectionName,
      mode,
      width,
      height,
      allowAnimated: true,
    });
  } catch (e) {
    // if we are unable to get the image url (eg missing auth) we want to continue rendering with a spinner
    dataURI = '';
  }
  const shouldDisplayBackground = !dataURI || !disableOverlay;

  return (
    <SSRFileExperienceWrapper
      className={newFileExperienceClassName}
      dimensions={dimensions}
      breakpoint={calculateBreakpoint(dimensions)}
      shouldUsePointerCursor={Boolean(dataURI)}
      displayBackground={shouldDisplayBackground}
      disableOverlay={disableOverlay}
      selected={false}
      data-testid="media-card-view"
    >
      <CardImageContainer
        className="media-file-card-view"
        data-testid="media-file-card-view"
      >
        <IconWrapper
          breakpoint={calculateBreakpoint(dimensions)}
          hasTitleBox={false}
        >
          <SpinnerIcon />
        </IconWrapper>
        {!!dataURI && (
          <MediaImage
            dataURI={dataURI}
            // alt={alt} // having alt text causes the image to fail to render with a broken image.
            // onImageLoad={this.onImageLoad}  // TODO add these back as part of tracking performance.
            // onImageError={this.onImageError}
            {...resizeModeToMediaImageProps(resizeMode)}
            loading={getLazyValue(isLazy)}
          />
        )}
        {!disableOverlay && <Blanket isFixed={false} />}
      </CardImageContainer>
    </SSRFileExperienceWrapper>
  );
};
function getLazyValue(isLazy: boolean | undefined): 'lazy' | 'eager' {
  switch (isLazy) {
    case false:
      return 'eager';
    default:
      return 'lazy';
  }
}

function calculateBreakpoint(dimensions?: CardDimensions): Breakpoint {
  const width = dimensions?.width ?? defaultImageCardDimensions.width;
  return calcBreakpointSize(parseInt(`${width}`, 10));
}
