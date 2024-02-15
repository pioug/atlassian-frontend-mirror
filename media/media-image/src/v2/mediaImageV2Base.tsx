import type {
  FileIdentifier,
  MediaStoreGetFileImageParams,
} from '@atlaskit/media-client';
import type { SSR } from '@atlaskit/media-common';
import { useFilePreview } from '@atlaskit/media-file-preview';
import React, { ReactNode } from 'react';
import type { MediaImageChildrenProps, MediaImageStatus } from '../types';
export interface MediaImageV2BaseProps {
  /** Instance of file identifier */
  identifier: FileIdentifier;
  /** Media API Configuration object */
  apiConfig?: MediaStoreGetFileImageParams;
  /** Render props returning `MediaImageChildrenProps` data structure */
  children: (props: MediaImageChildrenProps) => ReactNode;
  /** Server-Side-Rendering modes are "server" and "client" */
  ssr?: SSR;
}

export const MediaImageV2Base = ({
  identifier,
  apiConfig = {},
  children,
  ssr,
}: MediaImageV2BaseProps) => {
  const {
    width,
    height,
    mode,
    allowAnimated,
    upscale,
    'max-age': maxAge,
  } = apiConfig;
  const dimensions = { width, height };

  const { preview, error, getSsrScriptProps } = useFilePreview({
    identifier,
    dimensions,
    ssr,
    resizeMode: mode,
    allowAnimated,
    upscale,
    maxAge,
  });

  //----------------------------------------------------------------
  // RENDER
  //----------------------------------------------------------------

  let status: MediaImageStatus = 'loading';

  if (preview?.dataURI) {
    status = 'succeeded';
  } else if (error) {
    status = 'error';
  }
  return (
    <>
      {children({
        loading: status === 'loading',
        error: status === 'error',
        data:
          status === 'succeeded'
            ? { status, src: preview?.dataURI }
            : undefined,
      })}
      {getSsrScriptProps && <script {...getSsrScriptProps()} />}
    </>
  );
};
