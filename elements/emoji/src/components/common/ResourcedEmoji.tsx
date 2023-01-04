import React, { FC, useEffect } from 'react';
import Loadable from 'react-loadable';
import { Props as ResourcedEmojiProps } from './ResourcedEmojiComponent';
import { UfoErrorBoundary } from './UfoErrorBoundary';
import { sampledUfoRenderedEmoji, ufoExperiences } from '../../util/analytics';
import { SAMPLING_RATE_EMOJI_RENDERED_EXP } from '../../util/constants';

export interface Props extends ResourcedEmojiProps {}

const ResourcedEmojiComponent = Loadable({
  loader: (): Promise<React.ComponentType<Props>> =>
    import(
      /* webpackChunkName: "@atlaskit-internal_resourcedEmojiComponent" */ './ResourcedEmojiComponent'
    ).then((component) => component.ResourcedEmojiComponent),
  loading: () => null,
});

const ResourcedEmoji: FC<Props> = (props) => {
  const { emojiId } = props;

  useEffect(() => {
    if (!emojiId) {
      return;
    }

    sampledUfoRenderedEmoji(emojiId).start({
      samplingRate: SAMPLING_RATE_EMOJI_RENDERED_EXP,
    });
    ufoExperiences['emoji-rendered']
      .getInstance(emojiId.id || emojiId.shortName)
      .addMetadata({
        source: 'ResourcedEmoji',
        emojiId: emojiId.id,
      });
    return () => {
      sampledUfoRenderedEmoji(emojiId).abort({
        metadata: {
          source: 'ResourcedEmoji',
          reason: 'unmount',
        },
      });
    };
  }, [emojiId]);

  return (
    <UfoErrorBoundary
      experiences={[
        ufoExperiences['emoji-rendered'].getInstance(
          props.emojiId.id || props.emojiId.shortName,
        ),
      ]}
    >
      <ResourcedEmojiComponent {...props} />
    </UfoErrorBoundary>
  );
};

export default ResourcedEmoji;
