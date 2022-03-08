import React from 'react';
import { ComponentClass } from 'react';

import {
  defaultEmojiHeight,
  SAMPLING_RATE_EMOJI_RENDERED_EXP_RESOURCEEMOJI,
} from '../../util/constants';
import EmojiPlaceholder from './EmojiPlaceholder';
import LoadingEmojiComponent, {
  Props as LoadingProps,
  State as LoadingState,
} from './LoadingEmojiComponent';
import EmojiProvider from '../../api/EmojiResource';
import {
  Props as ComponentProps,
  BaseResourcedEmojiProps,
} from './ResourcedEmojiComponent';
import { sampledUfoRenderedEmoji, ufoExperiences } from '../../util/analytics';
import { UfoErrorBoundary } from './UfoErrorBoundary';

export interface Props extends BaseResourcedEmojiProps, LoadingProps {}

const resourcedEmojiModuleLoader = () =>
  import(
    /* webpackChunkName:"@atlaskit-internal_resourcedEmojiComponent" */ './ResourcedEmojiComponent'
  );

const resourcedEmojiComponentLoader: () => Promise<
  ComponentClass<ComponentProps>
> = () => resourcedEmojiModuleLoader().then((module) => module.default);

export default class ResourcedEmoji extends LoadingEmojiComponent<
  Props,
  LoadingState
> {
  // state initialised with static component to prevent
  // rerender when the module has already been loaded
  static AsyncLoadedComponent: ComponentClass<ComponentProps>;
  state = {
    asyncLoadedComponent: ResourcedEmoji.AsyncLoadedComponent,
  };

  constructor(props: Props) {
    super(props, {});
    sampledUfoRenderedEmoji(props.emojiId).start({
      samplingRate: SAMPLING_RATE_EMOJI_RENDERED_EXP_RESOURCEEMOJI,
    });

    ufoExperiences['emoji-rendered']
      .getInstance(props.emojiId.id || props.emojiId.shortName)
      .addMetadata({
        source: 'resourced-emoji',
      });
  }

  componentWillUnmount() {
    sampledUfoRenderedEmoji(this.props.emojiId).abort();
  }

  asyncLoadComponent() {
    resourcedEmojiComponentLoader().then((component) => {
      ResourcedEmoji.AsyncLoadedComponent = component;
      this.setAsyncState(component);
    });
  }

  renderLoading() {
    const { fitToHeight, emojiId, showTooltip } = this.props;
    return (
      <EmojiPlaceholder
        shortName={emojiId.shortName}
        showTooltip={showTooltip}
        size={fitToHeight || defaultEmojiHeight}
      />
    );
  }

  renderLoaded(
    loadedEmojiProvider: EmojiProvider,
    ResourcedEmojiComponent: ComponentClass<ComponentProps>,
  ) {
    const { emojiProvider, ...otherProps } = this.props;
    return (
      <UfoErrorBoundary
        experiences={[
          ufoExperiences['emoji-rendered'].getInstance(
            this.props.emojiId.id || this.props.emojiId.shortName,
          ),
        ]}
      >
        <ResourcedEmojiComponent
          {...otherProps}
          emojiProvider={loadedEmojiProvider}
        />
      </UfoErrorBoundary>
    );
  }
}
