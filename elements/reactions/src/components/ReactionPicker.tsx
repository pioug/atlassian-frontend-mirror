/** @jsx jsx */
import React, { Fragment, PureComponent } from 'react';
import ReactDOM from 'react-dom';
import { jsx, css } from '@emotion/core';
import { EmojiId } from '@atlaskit/emoji/types';
import { EmojiPicker } from '@atlaskit/emoji/picker';
import { EmojiProvider } from '@atlaskit/emoji/resource';
import { Manager, Popper, Reference, PopperProps } from '@atlaskit/popper';
import { borderRadius } from '@atlaskit/theme/constants';
import { N0, N50A, N60A } from '@atlaskit/theme/colors';
import { token } from '@atlaskit/tokens';
import { Selector } from './Selector';
import { Trigger } from './Trigger';
import { UFO } from '../analytics';
import { ReactionSource } from '../types';
import { layers } from '@atlaskit/theme/constants';

export interface Props {
  /**
   * Provider for loading emojis
   */
  emojiProvider: Promise<EmojiProvider>;
  /**
   * Event callback when an emoji button is selected
   * @param id emoji unique id
   * @param source source where the reaction was picked (either the initial default reactions or the custom reactions picker)
   */
  onSelection: (emojiId: string, source: ReactionSource) => void;
  /**
   * apply "miniMode" className to the <ReactionPicker /> component (defaults to false)
   */
  miniMode?: boolean;
  /**
   * @deprecated Not been used anymore
   */
  boundariesElement?: string;
  /**
   * Optional class name
   */
  className?: string;
  /**
   * Optional Show the "more emoji" selector icon for choosing emoji beyond the default list of emojis (defaults to false)
   */
  allowAllEmojis?: boolean;
  /**
   * Enable/Disable the button to be clickable (defaults to false)
   */
  disabled?: boolean;
  /**
   * Optional event handler when the emoji picker is opened
   */
  onOpen?: () => void;
  /**
   * Optional event handler when the emoji picker is clicked outside and closed
   */
  onCancel?: () => void;
  /**
   * Optional event handler when the custom emoji picker icon is selected
   */
  onShowMore?: () => void;
}

export interface State {
  isOpen: boolean;
  showFullPicker?: boolean;
}

const pickerStyle = css({
  verticalAlign: 'middle',
  '&.miniMode': {
    display: 'inline-block',
    marginRight: '4px',
  },
});

const contentStyle = css({
  display: 'flex',
});

const popupStyle = css({
  background: token('elevation.surface.overlay', N0),
  borderRadius: `${borderRadius()}px`,
  boxShadow: token(
    'elevation.shadow.overlay',
    `0 4px 8px -2px ${N50A}, 0 0 1px ${N60A}`,
  ),
  '&> div': {
    boxShadow: undefined,
  },
});

function noop() {}

/**
 * This renders the picker component (wrapped by the ConnectedReactionPicker)
 */
export class ReactionPicker extends PureComponent<Props, State> {
  updatePopper: () => void = noop;

  static defaultProps = {
    disabled: false,
  };

  constructor(props: Props) {
    super(props);

    this.state = {
      isOpen: false,
      showFullPicker: false,
    };
  }

  componentDidMount() {
    document.addEventListener('click', this.handleClickOutside, {
      capture: true,
    });
  }

  componentWillUnmount() {
    document.removeEventListener('click', this.handleClickOutside, {
      capture: true,
    });
    UFO.PickerRender.abort({
      metadata: {
        source: 'Reaction-Picker',
        reason: 'unmount',
      },
    });
  }

  private handleClickOutside = (e: MouseEvent) => {
    const { isOpen } = this.state;
    if (!isOpen) {
      return;
    }

    const domNode = ReactDOM.findDOMNode(this);
    if (!domNode || (e.target instanceof Node && !domNode.contains(e.target))) {
      if (this.props.onCancel) {
        this.props.onCancel();
      }
      this.close();
    }
  };

  private close(_emojiId?: string) {
    this.setState(
      {
        isOpen: false,
        showFullPicker: false,
      },
      () => {
        // ufo abort reaction experience
        UFO.PickerRender.abort({
          metadata: {
            emojiId: _emojiId,
            source: 'Reaction-Picker',
            reason: 'close dialog',
          },
        });
      },
    );
  }

  private showFullPicker = (e: React.MouseEvent<HTMLElement>) => {
    e.preventDefault();
    const { onShowMore } = this.props;
    if (onShowMore) {
      onShowMore();
    }
    // Update popper position
    this.setState(
      {
        isOpen: true,
        showFullPicker: true,
      },
      () => this.updatePopper(),
    );
  };

  private renderSelector() {
    const { emojiProvider, allowAllEmojis } = this.props;

    return (
      <div css={contentStyle}>
        <Selector
          emojiProvider={emojiProvider}
          onSelection={this.onEmojiSelected}
          showMore={allowAllEmojis}
          onMoreClick={this.showFullPicker}
        />
      </div>
    );
  }

  private renderEmojiPicker() {
    return (
      <EmojiPicker
        emojiProvider={this.props.emojiProvider}
        onSelection={this.onEmojiSelected}
      />
    );
  }

  private renderContent() {
    return this.state.showFullPicker
      ? this.renderEmojiPicker()
      : this.renderSelector();
  }

  private onEmojiSelected = (emoji: EmojiId) => {
    const { onSelection } = this.props;

    if (!emoji.id) {
      return;
    }

    onSelection(
      emoji.id,
      this.state.showFullPicker ? 'emojiPicker' : 'quickSelector',
    );
    this.close(emoji.id);
  };

  private onTriggerClick = () => {
    // ufo start reaction experience
    UFO.PickerRender.start();
    if (this.props.onOpen) {
      this.props.onOpen();
    }
    this.setState(
      {
        isOpen: !this.state.isOpen,
        showFullPicker: false,
      },
      () => {
        // ufo add reaction success
        UFO.PickerRender.success();
      },
    );
  };

  private popperModifiers: PopperProps<{}>['modifiers'] = [
    { name: 'applyStyle', enabled: false },
    {
      name: 'hide',
      enabled: false,
    },
    {
      name: 'offset',
      enabled: true,
      options: {
        offset: [0, 0],
      },
    },
    {
      name: 'flip',
      enabled: true,
      options: {
        flipVariations: true,
        boundariesElement: 'scrollParent',
      },
    },
    {
      name: 'preventOverflow',
      enabled: true,
    },
  ];

  render() {
    const { isOpen } = this.state;
    const { miniMode, className } = this.props;

    return (
      <div
        className={` ${isOpen ? 'isOpen' : ''} ${
          miniMode ? 'miniMode' : ''
        } ${className}`}
        css={pickerStyle}
      >
        <Manager>
          <Reference>
            {({ ref }) => (
              <Trigger
                ref={ref}
                onClick={this.onTriggerClick}
                miniMode={miniMode}
                disabled={this.props.disabled}
              />
            )}
          </Reference>
          <Popper placement="bottom-start" modifiers={this.popperModifiers}>
            {({ ref, style, update }) => {
              this.updatePopper = update;
              return (
                <Fragment>
                  {isOpen && (
                    <div style={{ zIndex: layers.layer(), ...style }} ref={ref}>
                      <div css={popupStyle}>{this.renderContent()}</div>
                    </div>
                  )}
                </Fragment>
              );
            }}
          </Popper>
        </Manager>
      </div>
    );
  }
}
