import React from 'react';
import { ComponentClass } from 'react';
import { EmojiProvider } from '../../api/EmojiResource';
import { RelativePosition } from '../../types';
import debug from '../../util/logger';
import LoadingEmojiComponent, {
  Props as LoadingProps,
  State as LoadingState,
} from '../common/LoadingEmojiComponent';
import Popup from '../common/Popup';
import EmojiTypeAheadComponent, {
  EmojiTypeAheadBaseProps,
  Props as ComponentProps,
} from './EmojiTypeAheadComponent';

const emojiTypeAheadModuleLoader = () =>
  import(
    /* webpackChunkName:"@atlaskit-internal_emojiTypeAheadComponent" */ './EmojiTypeAheadComponent'
  );

const emojiTypeAheadComponentLoader: () => Promise<
  ComponentClass<ComponentProps>
> = () => emojiTypeAheadModuleLoader().then((module) => module.default);

export interface Props extends EmojiTypeAheadBaseProps, LoadingProps {
  /** CSS selector, or target HTML element */
  target?: string | HTMLElement;
  position?: RelativePosition;
  zIndex?: number | string;
  offsetX?: number;
  offsetY?: number;
}

export default class EmojiTypeahead extends LoadingEmojiComponent<
  Props,
  LoadingState
> {
  // state initialised with static component to prevent
  // rerender when the module has already been loaded
  static AsyncLoadedComponent?: ComponentClass<ComponentProps>;
  state = {
    asyncLoadedComponent: EmojiTypeahead.AsyncLoadedComponent,
  };

  constructor(props: Props) {
    super(props, {});
  }

  selectNext = () => {
    if (this.refs.typeAhead) {
      (this.refs.typeAhead as EmojiTypeAheadComponent).selectNext();
    }
  };

  selectPrevious = () => {
    if (this.refs.typeAhead) {
      (this.refs.typeAhead as EmojiTypeAheadComponent).selectPrevious();
    }
  };

  chooseCurrentSelection = () => {
    if (this.refs.typeAhead) {
      (this.refs.typeAhead as EmojiTypeAheadComponent).chooseCurrentSelection();
    }
  };

  count = (): number => {
    if (this.refs.typeAhead) {
      return (this.refs.typeAhead as EmojiTypeAheadComponent).count();
    }
    return 0;
  };

  asyncLoadComponent() {
    emojiTypeAheadComponentLoader().then((component) => {
      EmojiTypeahead.AsyncLoadedComponent = component;
      this.setAsyncState(component);
    });
  }

  renderLoaded(
    loadedEmojiProvider: EmojiProvider,
    EmojiTypeAheadComponent: ComponentClass<ComponentProps>,
  ) {
    const {
      emojiProvider,
      target,
      position,
      zIndex,
      offsetX,
      offsetY,
      ...otherProps
    } = this.props;

    const typeAhead = (
      <EmojiTypeAheadComponent
        {...otherProps}
        emojiProvider={loadedEmojiProvider}
        ref="typeAhead"
      />
    );

    if (position) {
      debug('target, position', target, position);
      if (target) {
        return (
          <Popup
            target={target}
            relativePosition={position}
            zIndex={zIndex}
            offsetX={offsetX}
            offsetY={offsetY}
            children={typeAhead}
          />
        );
      }
      // don't show if we have a position, but no target yet
      return null;
    }

    return typeAhead;
  }
}
