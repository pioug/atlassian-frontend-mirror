/** @jsx jsx */
import { jsx } from '@emotion/core';
import { gs, mq } from '../utils';

export interface ImageProps {
  src: string;
  color?: string;
  testId?: string;
}

export const Thumbnail = (props: ImageProps) => {
  return props.color ? (
    <ThumbnailWithBackground {...props} />
  ) : (
    <ThumbnailDefault {...props} />
  );
};

const sharedStyles = {
  // The dimensions of the image are set in this manner
  // in order for `flex` to respect this value.
  minWidth: [gs(13), gs(20)],
  maxWidth: [gs(13), gs(20)],
};

export const ThumbnailDefault = ({ src, testId }: ImageProps) => {
  return (
    <div
      css={mq({
        ...sharedStyles,
        backgroundSize: 'cover',
        backgroundRepeat: 'no-repeat',
        backgroundPosition: '50% 50%',
        backgroundImage: `url(${src})`,
      })}
      data-testid={testId}
      data-trello-do-not-use-override={testId}
    />
  );
};

export const ThumbnailWithBackground = ({ src, color, testId }: ImageProps) => {
  return (
    <div
      css={mq({
        ...sharedStyles,
        backgroundColor: color,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      })}
      data-testid={testId}
      data-trello-do-not-use-override={testId}
    >
      <img src={src} css={{ height: '90px', width: '90px' }} />
    </div>
  );
};
