import React from 'react';
import { injectIntl, InjectedIntlProps } from 'react-intl';
import ExpandIcon from '@atlaskit/icon/glyph/chevron-down';
import ToolbarButton from '../../../../ui/ToolbarButton';
import Dropdown from '../../../../ui/Dropdown';
import Alignment from '../../../../ui/Alignment';
import { AlignmentPluginState, AlignmentState } from '../../pm-plugins/types';
import {
  ExpandIconWrapper,
  Separator,
  TriggerWrapper,
  Wrapper,
} from './styles';
import { iconMap } from './icon-map';
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

class AlignmentToolbar extends React.Component<
  Props & InjectedIntlProps,
  State
> {
  static displayName = 'AlignmentToolbar';

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
      <Wrapper>
        <Dropdown
          mountTo={popupsMountPoint}
          boundariesElement={popupsBoundariesElement}
          scrollableElement={popupsScrollableElement}
          isOpen={this.state.isOpen}
          handleClickOutside={this.hide}
          handleEscapeKeydown={this.hide}
          fitWidth={112}
          fitHeight={80}
          trigger={
            <ToolbarButton
              spacing={isReducedSpacing ? 'none' : 'default'}
              disabled={disabled}
              selected={isOpen}
              title={title}
              aria-label="Text alignment"
              className="align-btn"
              onClick={this.toggleOpen}
              iconBefore={
                <TriggerWrapper>
                  {iconMap[pluginState.align]}
                  <ExpandIconWrapper>
                    <ExpandIcon label="" />
                  </ExpandIconWrapper>
                </TriggerWrapper>
              }
            />
          }
        >
          <Alignment
            onClick={(align) => this.changeAlignment(align)}
            selectedAlignment={pluginState.align}
          />
        </Dropdown>
        <Separator />
      </Wrapper>
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

  private hide = () => {
    if (this.state.isOpen === true) {
      this.setState({ isOpen: false });
    }
  };
}

export default injectIntl(AlignmentToolbar);
