/** @jsx jsx */

import { css, jsx } from '@compiled/react';

import { type FileIdentifier } from '@atlaskit/media-client';
import Spinner from '@atlaskit/spinner';

import { MediaSVGError } from './errors';
import type { ContentSource, MediaSvgProps } from './types';
import { useResolveSvg } from './useResolveSvg';

const svgRendererImgStyles = css({
  maxWidth: '100%',
  maxHeight: '100%',
});

const loadingStyles = css({
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  overflow: 'hidden',
});

type LoadingProps = {
  dimensions: MediaSvgProps['dimensions'];
};
export const Loading = ({ dimensions }: LoadingProps) => {
  const { width, height } = dimensions || {};
  return (
    <span
      role="status"
      css={[svgRendererImgStyles, loadingStyles]}
      style={{
        width,
        height,
        // eslint-disable-next-line @atlaskit/design-system/ensure-design-token-usage
        backgroundColor: 'white', // This background color is for transparency
      }}
    >
      <Spinner />
    </span>
  );
};

type SvgRendererProps = {
  identifier: FileIdentifier;
  testId: MediaSvgProps['testId'];
  dimensions: MediaSvgProps['dimensions'];
  onError: MediaSvgProps['onError'];
  alt: MediaSvgProps['alt'];
  svgUrl: string;
  source: ContentSource;
};

const SvgRenderer = ({
  identifier: { id, collectionName },
  testId,
  svgUrl,
  source,
  dimensions,
  onError,
  alt,
}: SvgRendererProps) => {
  const { width, height } = dimensions || {};

  return (
    <img
      data-testid={testId}
      data-fileid={id}
      data-filecollection={collectionName}
      data-source={source}
      src={svgUrl}
      alt={alt}
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
      onContextMenu={e => {
        // Disabled context menu to prevent user from copying the url and open in browser. That causes script execution.
        e.preventDefault();
      }}
    />
  );
};

export default function MediaSvg({
  testId,
  identifier,
  dimensions,
  onError,
  alt,
}: MediaSvgProps) {
  const { svgUrl, source } = useResolveSvg(identifier, onError);

  return svgUrl && source ? (
    <SvgRenderer
      identifier={identifier}
      testId={testId}
      svgUrl={svgUrl}
      source={source}
      dimensions={dimensions}
      onError={onError}
      alt={alt}
    />
  ) : (
    <Loading dimensions={dimensions} />
  );
}
