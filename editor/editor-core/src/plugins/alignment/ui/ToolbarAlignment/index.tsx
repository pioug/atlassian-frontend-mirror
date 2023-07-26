/** @jsx jsx */
import React from 'react';
import { jsx } from '@emotion/react';
import type { WrappedComponentProps } from 'react-intl-next';
import { injectIntl } from 'react-intl-next';
import ExpandIcon from '@atlaskit/icon/glyph/chevron-down';
import ToolbarButton from '../../../../ui/ToolbarButton';
import type { OpenChangedEvent } from '../../../../ui/Dropdown';
import Dropdown from '../../../../ui/Dropdown';
import Alignment from '../../../../ui/Alignment';
import type {
  AlignmentPluginState,
  AlignmentState,
} from '../../pm-plugins/types';
import { expandIconWrapper, triggerWrapper, wrapper } from './styles';
import { separatorStyles } from '@atlaskit/editor-common/styles';

import { IconMap } from './icon-map';
import { messages } from './messages';

export interface State {
  isOpen: boolean;
  isOpenedByKeyboard: boolean;
}

export interface Props {
  pluginState: AlignmentPluginState;
  changeAlignment: (align: AlignmentState) => void;
  popupsMountPoint?: HTMLElement;
  popupsBoundariesElement?: HTMLElement;
  popupsScrollableElement?: HTMLElement;
  isReducedSpacing?: boolean;
  disabled?: boolean;
}

export class AlignmentToolbar extends React.Component<
  Props & WrappedComponentProps,
  State
> {
  static displayName = 'AlignmentToolbar';
  private toolbarItemRef = React.createRef<HTMLElement>();

  state: State = {
    isOpen: false,
    isOpenedByKeyboard: false,
  };

  render() {
    const { isOpen, isOpenedByKeyboard } = this.state;
    const {
      popupsMountPoint,
      popupsBoundariesElement,
      popupsScrollableElement,
      isReducedSpacing,
      pluginState,
      disabled,
      intl,
    } = this.props;

    const title = intl.formatMessage(messages.alignment);

    return (
      <span css={wrapper}>
        <Dropdown
          mountTo={popupsMountPoint}
          boundariesElement={popupsBoundariesElement}
          scrollableElement={popupsScrollableElement}
          isOpen={isOpen}
          shouldFocusFirstItem={() => {
            if (isOpenedByKeyboard) {
              this.setState({ ...this.state, isOpenedByKeyboard: false });
            }
            return isOpenedByKeyboard;
          }}
          onOpenChange={({ isOpen }: { isOpen: boolean }) => {
            this.setState({ isOpen });
          }}
          handleClickOutside={(event: MouseEvent) => {
            if (event instanceof MouseEvent) {
              this.hide({ isOpen: false, event });
            }
          }}
          handleEscapeKeydown={this.hideOnEscape}
          fitWidth={112}
          fitHeight={80}
          closeOnTab={true}
          trigger={
            <ToolbarButton
              spacing={isReducedSpacing ? 'none' : 'default'}
              disabled={disabled}
              selected={isOpen}
              title={title}
              className="align-btn"
              aria-label={title}
              aria-expanded={isOpen}
              aria-haspopup
              onClick={this.toggleOpen}
              onKeyDown={this.toggleOpenByKeyboard}
              iconBefore={
                <div css={triggerWrapper}>
                  <IconMap alignment={pluginState.align} />
                  <span css={expandIconWrapper}>
                    <ExpandIcon label="" />
                  </span>
                </div>
              }
              ref={this.toolbarItemRef}
            />
          }
        >
          <Alignment
            onClick={(align) => this.changeAlignment(align, false)}
            selectedAlignment={pluginState.align}
          />
        </Dropdown>
        <span css={separatorStyles} />
      </span>
    );
  }

  componentDidUpdate(prevProps: Props) {
    if (this.state.isOpen && this.state.isOpenedByKeyboard) {
      // by triggering the keyboard event with a setTimeout, we ensure that the tooltip
      // associated with the alignment button doesn't render until the next render cycle
      // where the popup will be correctly positioned and the relative position of the tooltip
      // will not overlap with the button.
      setTimeout(() => {
        const keyboardEvent = new KeyboardEvent('keydown', {
          bubbles: true,
          key: 'ArrowDown',
        });
        this.toolbarItemRef.current?.dispatchEvent(keyboardEvent);
      }, 0);
    }
  }

  private changeAlignment = (align: AlignmentState, togglePopup: boolean) => {
    if (togglePopup) {
      this.toggleOpen();
    }
    return this.props.changeAlignment(align);
  };

  private toggleOpen = () => {
    this.setState({ isOpen: !this.state.isOpen, isOpenedByKeyboard: false });
  };

  private toggleOpenByKeyboard = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      this.setState({ isOpen: !this.state.isOpen, isOpenedByKeyboard: true });
    }
  };

  private hide = (attrs?: OpenChangedEvent) => {
    if (this.state.isOpen) {
      this.setState({ isOpen: false });
      if (
        attrs?.event instanceof KeyboardEvent &&
        attrs.event.key === 'Escape'
      ) {
        this.toolbarItemRef?.current?.focus();
      }
    }
  };

  private hideOnEscape = () => {
    this.hide();
    this.toolbarItemRef?.current?.focus();
  };
}

export default injectIntl(AlignmentToolbar);
