/** @jsx jsx */
import type { ReactElement } from 'react';
import React, { Component } from 'react';
import { css, jsx } from '@emotion/react';

import type {
  DropdownOptions,
  DropdownOptionT,
} from '@atlaskit/editor-common/types';
import type { EditorView } from '@atlaskit/editor-prosemirror/view';
import { token } from '@atlaskit/tokens';
import ExpandIcon from '@atlaskit/icon/glyph/chevron-down';

import type { OpenChangedEvent } from '../../../ui/Dropdown';
import UiDropdown from '../../../ui/Dropdown';
import { FloatingToolbarButton as Button } from '@atlaskit/editor-common/ui';

import DropdownMenu, { itemSpacing, menuItemDimensions } from './DropdownMenu';

const dropdownExpandContainer = css`
  margin: 0px ${token('space.negative.050', '-4px')};
`;

const iconGroup = css`
  display: flex;
`;

const CompositeIcon = ({ icon }: { icon: React.ReactChild }) => (
  <div css={iconGroup}>
    {icon}
    <span css={dropdownExpandContainer}>
      <ExpandIcon label="Expand dropdown menu" />
    </span>
  </div>
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
  // Increased dropdown item width to prevent labels from being truncated
  dropdownWidth?: number;
  // Show a check next to selected dropdown menu items (true by default)
  showSelected?: boolean;
  setDisableParentScroll?: (disable: boolean) => void;
  editorView?: EditorView;
  dropdownListId?: string;
  // A prop to align the dropdown with the floating toolbar instead of the toolbar item
  alignDropdownWithToolbar?: boolean;
}

export interface State {
  isOpen: boolean;
  isOpenedByKeyboard: boolean;
}

export default class Dropdown extends Component<Props, State> {
  state: State = { isOpen: false, isOpenedByKeyboard: false };
  triggerRef = React.createRef<HTMLDivElement>();

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
      dropdownWidth,
      editorView,
      dropdownListId,
      alignDropdownWithToolbar,
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
          onKeyDown={this.toggleOpenByKeyboard}
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
            <span css={dropdownExpandContainer}>
              <ExpandIcon label="Expand dropdown menu" />
            </span>
          }
          onClick={this.toggleOpen}
          onKeyDown={this.toggleOpenByKeyboard}
          selected={isOpen}
          disabled={disabled}
          tooltipContent={tooltip}
          ariaHasPopup
          areaControls={dropdownListId}
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
      ? dropdownWidth || menuItemDimensions.width
      : options.width;
    const fitHeight = Array.isArray(options)
      ? options.length * menuItemDimensions.height + itemSpacing * 2
      : options.height;

    return (
      <UiDropdown
        ref={this.triggerRef}
        mountTo={mountPoint}
        boundariesElement={boundariesElement}
        scrollableElement={scrollableElement}
        isOpen={isOpen}
        handleClickOutside={this.hide}
        handleEscapeKeydown={this.hideOnEsc}
        onOpenChange={this.onOpenChanged}
        fitWidth={fitWidth + fitTolerance}
        fitHeight={fitHeight + fitTolerance}
        trigger={trigger}
        editorView={editorView}
        dropdownListId={dropdownListId}
        alignDropdownWithParentElement={alignDropdownWithToolbar}
      >
        {Array.isArray(options)
          ? this.renderArrayOptions(options)
          : options.render({ hide: this.hide, dispatchCommand })}
      </UiDropdown>
    );
  }

  private renderArrayOptions = (options: Array<DropdownOptionT<Function>>) => {
    const { showSelected, dispatchCommand, editorView } = this.props;
    return (
      <DropdownMenu
        hide={this.hide}
        dispatchCommand={dispatchCommand}
        items={options}
        showSelected={showSelected}
        editorView={editorView}
      />
    );
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

  private hide = () => {
    this.setState({ ...this.state, isOpen: false });
  };

  private hideOnEsc = () => {
    // Focus the trigger button only on Escape
    // Focus is done before hiding to ensure onBlur is called
    (
      document.querySelector(
        `[data-testid=${this.props.buttonTestId}]`,
      ) as HTMLElement
    )?.focus();
    this.hide();
  };

  private onOpenChanged = (openChangedEvent: OpenChangedEvent) => {
    if (
      !openChangedEvent.isOpen &&
      openChangedEvent.event instanceof KeyboardEvent
    ) {
      openChangedEvent.event?.key === 'Escape' ? this.hideOnEsc() : this.hide();
    }
  };

  componentDidUpdate(prevProps: Props, prevState: State) {
    if (prevState.isOpen !== this.state.isOpen) {
      if (this.props.setDisableParentScroll) {
        this.props.setDisableParentScroll(this.state.isOpen);
      }
      if (this.state.isOpen && this.state.isOpenedByKeyboard) {
        const dropList = document.querySelector(
          '[data-role="droplistContent"]',
        );
        if (dropList) {
          const keyboardEvent = new KeyboardEvent('keydown', {
            bubbles: true,
            key: 'ArrowDown',
          });
          dropList.dispatchEvent(keyboardEvent);
        }
      }
    }
  }
}
