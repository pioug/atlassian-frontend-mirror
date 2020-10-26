import React, { Component, ReactElement } from 'react';
import styled from 'styled-components';
import ExpandIcon from '@atlaskit/icon/glyph/chevron-down';

import UiDropdown from '../../../ui/Dropdown';
import Button from './Button';
import DropdownMenu, { itemSpacing, menuItemDimensions } from './DropdownMenu';
import { DropdownOptions, DropdownOptionT } from './types';

const DropdownExpandContainer = styled.span`
  margin: 0px -4px;
`;

const IconGroup = styled.div`
  display: flex;
`;

const CompositeIcon = ({ icon }: { icon: React.ReactChild }) => (
  <IconGroup>
    {icon}
    <DropdownExpandContainer>
      <ExpandIcon label="Expand dropdown menu" />
    </DropdownExpandContainer>
  </IconGroup>
);

export interface Props {
  title: string;
  icon?: ReactElement<any>;
  hideExpandIcon?: boolean;
  options: DropdownOptions<Function>;
  dispatchCommand: (command: Function) => void;
  mountPoint?: HTMLElement;
  boundariesElement?: HTMLElement;
  scrollableElement?: HTMLElement;
  disabled?: boolean;
  tooltip?: string;
  buttonTestId?: string;
}

export interface State {
  isOpen: boolean;
}

export default class Dropdown extends Component<Props, State> {
  state: State = { isOpen: false };

  render() {
    const { isOpen } = this.state;
    const {
      title,
      icon,
      options,
      dispatchCommand,
      mountPoint,
      boundariesElement,
      scrollableElement,
      hideExpandIcon,
      disabled,
      tooltip,
      buttonTestId,
    } = this.props;

    let trigger;
    if (icon) {
      const TriggerIcon = hideExpandIcon ? icon : <CompositeIcon icon={icon} />;
      trigger = (
        <Button
          testId={buttonTestId}
          title={title}
          icon={TriggerIcon}
          onClick={this.toggleOpen}
          selected={isOpen}
          disabled={disabled}
          tooltipContent={tooltip}
        />
      );
    } else {
      trigger = (
        <Button
          testId={buttonTestId}
          iconAfter={
            <DropdownExpandContainer>
              <ExpandIcon label="Expand dropdown menu" />
            </DropdownExpandContainer>
          }
          onClick={this.toggleOpen}
          selected={isOpen}
          disabled={disabled}
          tooltipContent={tooltip}
        >
          {title}
        </Button>
      );
    }

    /**
     * We want to change direction of our dropdowns a bit early,
     * not exactly when it hits the boundary.
     */
    const fitTolerance = 10;
    const fitWidth = Array.isArray(options)
      ? menuItemDimensions.width
      : options.width;
    const fitHeight = Array.isArray(options)
      ? options.length * menuItemDimensions.height + itemSpacing * 2
      : options.height;

    return (
      <UiDropdown
        mountTo={mountPoint}
        boundariesElement={boundariesElement}
        scrollableElement={scrollableElement}
        isOpen={isOpen}
        handleClickOutside={this.hide}
        handleEscapeKeydown={this.hide}
        fitWidth={fitWidth + fitTolerance}
        fitHeight={fitHeight + fitTolerance}
        trigger={trigger}
      >
        {Array.isArray(options)
          ? this.renderArrayOptions(options)
          : options.render({ hide: this.hide, dispatchCommand })}
      </UiDropdown>
    );
  }

  private renderArrayOptions = (options: Array<DropdownOptionT<Function>>) => (
    <DropdownMenu
      hide={this.hide}
      dispatchCommand={this.props.dispatchCommand}
      items={options}
    />
  );

  private toggleOpen = () => {
    this.setState({ isOpen: !this.state.isOpen });
  };

  private hide = () => {
    this.setState({ isOpen: false });
  };
}
