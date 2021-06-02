import {
  withAnalyticsEvents,
  WithAnalyticsEventsProps,
} from '@atlaskit/analytics-next';
import React from 'react';
import { ComponentClass } from 'react';
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
import * as styles from './styles';

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
    return (
      <div className={styles.emojiPicker} ref={handlePickerRef}>
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
      <EmojiPickerComponent
        emojiProvider={loadedEmojiProvider}
        {...otherProps}
      />
    );
  }
}

const EmojiPicker = withAnalyticsEvents()(EmojiPickerInternal);

export default EmojiPicker;
