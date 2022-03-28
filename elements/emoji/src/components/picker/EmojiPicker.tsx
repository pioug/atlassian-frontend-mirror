/** @jsx jsx */
import { jsx } from '@emotion/core';
import {
  withAnalyticsEvents,
  WithAnalyticsEventsProps,
} from '@atlaskit/analytics-next';
import { ComponentClass } from 'react';
import { ufoExperiences } from '../../util/analytics';
import { EmojiProvider } from '../../api/EmojiResource';
import { OnEmojiEvent } from '../../types';
import LoadingEmojiComponent, {
  Props as LoadingProps,
  State as LoadingState,
} from '../common/LoadingEmojiComponent';
import {
  PickerRefHandler,
  Props as ComponentProps,
} from './EmojiPickerComponent';
import { LoadingItem } from './EmojiPickerVirtualItems';
import { emojiPicker } from './styles';
import { UfoErrorBoundary } from '../common/UfoErrorBoundary';
const emojiPickerModuleLoader = () =>
  import(
    /* webpackChunkName:"@atlaskit-internal_emojiPickerComponent" */ './EmojiPickerComponent'
  );

const emojiPickerLoader: () => Promise<ComponentClass<ComponentProps>> = () =>
  emojiPickerModuleLoader().then((module) => module.default);

export interface Props extends LoadingProps {
  onSelection?: OnEmojiEvent;
  onPickerRef?: PickerRefHandler;
  hideToneSelector?: boolean;
}

export class EmojiPickerInternal extends LoadingEmojiComponent<
  Props & WithAnalyticsEventsProps,
  LoadingState
> {
  // state initialised with static component to prevent
  // rerender when the module has already been loaded
  static AsyncLoadedComponent?: ComponentClass<ComponentProps>;
  state = {
    asyncLoadedComponent: EmojiPickerInternal.AsyncLoadedComponent,
  };

  constructor(props: Props) {
    super(props, {});
    ufoExperiences['emoji-picker-opened'].start();
  }

  asyncLoadComponent() {
    emojiPickerLoader().then((component) => {
      EmojiPickerInternal.AsyncLoadedComponent = component;
      this.setAsyncState(component);
    });
  }

  renderLoading(): JSX.Element | null {
    const item = new LoadingItem();
    const handlePickerRef = (ref: any) => {
      if (this.props.onPickerRef) {
        this.props.onPickerRef(ref);
      }
    };
    ufoExperiences['emoji-picker-opened'].markFMP();

    return (
      <div css={emojiPicker} ref={handlePickerRef}>
        {item.renderItem()}
      </div>
    );
  }

  renderLoaded(
    loadedEmojiProvider: EmojiProvider,
    EmojiPickerComponent: ComponentClass<ComponentProps>,
  ) {
    const { emojiProvider, ...otherProps } = this.props;
    return (
      <UfoErrorBoundary experiences={[ufoExperiences['emoji-picker-opened']]}>
        <EmojiPickerComponent
          emojiProvider={loadedEmojiProvider}
          {...otherProps}
        />
      </UfoErrorBoundary>
    );
  }
}

const EmojiPicker = withAnalyticsEvents()(EmojiPickerInternal);

export default EmojiPicker;
