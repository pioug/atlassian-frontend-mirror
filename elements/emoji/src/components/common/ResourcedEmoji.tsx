import React from 'react';
import { ComponentClass } from 'react';

import { defaultEmojiHeight } from '../../util/constants';
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
      <ResourcedEmojiComponent
        {...otherProps}
        emojiProvider={loadedEmojiProvider}
      />
    );
  }
}
