/** @jsx jsx */
import React from 'react';
import { jsx } from '@emotion/react';
import { injectIntl, WrappedComponentProps } from 'react-intl-next';
import ExpandIcon from '@atlaskit/icon/glyph/chevron-down';
import ToolbarButton from '../../../../ui/ToolbarButton';
import Dropdown, { OpenChangedEvent } from '../../../../ui/Dropdown';
import Alignment from '../../../../ui/Alignment';
import { AlignmentPluginState, AlignmentState } from '../../pm-plugins/types';
import {
  expandIconWrapper,
  separator,
  triggerWrapper,
  wrapper,
} from './styles';
import { IconMap } from './icon-map';
import { messages } from './messages';

export interface State {
  isOpen: boolean;
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
  };

  render() {
    const { isOpen } = this.state;
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
          handleClickOutside={(event: MouseEvent) =>
            this.hide({ isOpen: false, event })
          }
          handleEscapeKeydown={this.hideonEsc}
          onOpenChange={this.hide}
          fitWidth={112}
          fitHeight={80}
          closeonTab={true}
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
            onClick={(align) => this.changeAlignment(align)}
            selectedAlignment={pluginState.align}
          />
        </Dropdown>
        <span css={separator} />
      </span>
    );
  }

  private changeAlignment = (align: AlignmentState) => {
    this.toggleOpen();
    return this.props.changeAlignment(align);
  };

  private toggleOpen = () => {
    this.handleOpenChange({ isOpen: !this.state.isOpen });
  };

  private handleOpenChange = ({ isOpen }: { isOpen: boolean }) => {
    this.setState({ isOpen });
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

  private hideonEsc = () => {
    this.hide();
    //To set the focus on the textcolor button when the menu is closed by 'Esc' only (aria guidelines)
    this.toolbarItemRef?.current?.focus();
  };
}

export default injectIntl(AlignmentToolbar);
