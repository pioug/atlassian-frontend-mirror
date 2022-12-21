import React, { PureComponent } from 'react';

import { withReactEditorViewOuterListeners } from '../../ui-react';
import DropdownList, { OpenChangedEvent } from '../../ui/DropList';
import Popup from '../../ui/Popup';
import { KeyDownHandlerContext } from '../DropdownMenu/types';
import { MenuArrowKeyNavigationProvider } from '../MenuArrowKeyNavigationProvider';

export interface Props {
  mountTo?: HTMLElement;
  boundariesElement?: HTMLElement;
  scrollableElement?: HTMLElement;
  trigger: React.ReactElement<any>;
  isOpen?: boolean;
  onOpenChange?: (attrs: OpenChangedEvent) => void;
  fitWidth?: number;
  fitHeight?: number;
  zIndex?: number;
  disableArrowKeyNavigation?: boolean;
  keyDownHandlerContext?: KeyDownHandlerContext;
}

export interface State {
  target?: HTMLElement;
  popupPlacement: [string, string];
}

/**
 * Wrapper around @atlaskit/droplist which uses Popup and Portal to render
 * droplist outside of "overflow: hidden" containers when needed.
 *
 * Also it controls popper's placement.
 */
export class Dropdown extends PureComponent<Props, State> {
  constructor(props: Props) {
    super(props);

    this.state = {
      popupPlacement: ['bottom', 'left'],
    };
  }

  private handleRef = (target: HTMLElement | null) => {
    this.setState({ target: target || undefined });
  };

  private updatePopupPlacement = (placement: [string, string]) => {
    this.setState({ popupPlacement: placement });
  };

  private renderDropdown() {
    const { target, popupPlacement } = this.state;
    const {
      children,
      mountTo,
      boundariesElement,
      scrollableElement,
      onOpenChange,
      fitHeight,
      fitWidth,
      zIndex,
      disableArrowKeyNavigation,
      keyDownHandlerContext,
    } = this.props;
    return (
      <Popup
        target={target}
        mountTo={mountTo}
        boundariesElement={boundariesElement}
        scrollableElement={scrollableElement}
        onPlacementChanged={this.updatePopupPlacement}
        fitHeight={fitHeight}
        fitWidth={fitWidth}
        zIndex={zIndex}
      >
        <MenuArrowKeyNavigationProvider
          disableArrowKeyNavigation={disableArrowKeyNavigation}
          keyDownHandlerContext={keyDownHandlerContext}
          closeonTab={true}
          handleClose={(event) =>
            onOpenChange && onOpenChange({ isOpen: false, event })
          }
        >
          <div style={{ height: 0, minWidth: fitWidth || 0 }}>
            <DropdownList
              isOpen={true}
              onOpenChange={onOpenChange}
              position={popupPlacement.join(' ')}
              shouldFitContainer={true}
            >
              {children}
            </DropdownList>
          </div>
        </MenuArrowKeyNavigationProvider>
      </Popup>
    );
  }

  render() {
    const { trigger, isOpen } = this.props;

    return (
      <>
        <div ref={this.handleRef}>{trigger}</div>
        {isOpen ? this.renderDropdown() : null}
      </>
    );
  }
}

const DropdownWithOuterListeners = withReactEditorViewOuterListeners(Dropdown);

export default DropdownWithOuterListeners;
