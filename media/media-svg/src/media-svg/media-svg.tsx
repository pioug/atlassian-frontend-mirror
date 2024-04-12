/** @jsx jsx */
import { useEffect, useMemo, useState } from 'react';

import { css, jsx } from '@compiled/react';

import { FileIdentifier } from '@atlaskit/media-client';
import { useMediaClient } from '@atlaskit/media-client-react';

import { MediaSVGError } from './errors';
import type { MediaSvgProps } from './types';

const svgRendererImgStyles = css({
  maxWidth: '100%',
  maxHeight: '100%',
});
type SvgRendererProps = {
  identifier: FileIdentifier;
  testId: MediaSvgProps['testId'];
  dimensions: MediaSvgProps['dimensions'];
  onError: MediaSvgProps['onError'];
  svgBlob: Blob;
};

const SvgRenderer = ({
  identifier: { id, collectionName },
  testId,
  svgBlob,
  dimensions,
  onError,
}: SvgRendererProps) => {
  const { width, height } = dimensions || {};

  const objectUrl = useMemo(() => URL.createObjectURL(svgBlob), [svgBlob]);

  return (
    <img
      data-testid={testId}
      data-fileid={id}
      data-filecollection={collectionName}
      src={objectUrl}
      css={svgRendererImgStyles}
      style={{
        width,
        height,
        objectFit: 'contain',
        // eslint-disable-next-line @atlaskit/design-system/ensure-design-token-usage
        backgroundColor: 'white', // This background color is for transparency
      }}
      onError={() => {
        onError && onError(new MediaSVGError('img-error'));
      }}
    />
  );
};

export const useRemoteSvg = (
  { id, collectionName }: FileIdentifier,
  onError?: (error: Error) => void,
) => {
  const mediaClient = useMediaClient();
  const [svgBlob, setSvgBlob] = useState<Blob | undefined>(undefined);

  useEffect(() => {
    setSvgBlob(undefined);
    mediaClient.mediaStore
      .getFileBinary(id, collectionName)
      .then(setSvgBlob)
      .catch(e => {
        onError &&
          onError(
            new MediaSVGError(
              'binary-fetch',
              e instanceof Error ? e : undefined,
            ),
          );
      });
  }, [id, collectionName, onError, mediaClient.mediaStore]);

  return svgBlob;
};

export default function MediaSvg({
  testId,
  identifier,
  dimensions,
  onError,
}: MediaSvgProps) {
  const svgBlob = useRemoteSvg(identifier, onError);

  return svgBlob ? (
    <SvgRenderer
      identifier={identifier}
      testId={testId}
      svgBlob={svgBlob}
      dimensions={dimensions}
      onError={onError}
    />
  ) : (
    // TODO: HANDLE LOADING STATE
    <div role="status">LOADING</div>
  );
}
