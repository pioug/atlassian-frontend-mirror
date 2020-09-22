import React from 'react';
import { PureComponent } from 'react';
import DropdownList from '@atlaskit/droplist';
import { Popup } from '@atlaskit/editor-common';
import withOuterListeners from '../with-outer-listeners';

export interface Props {
  mountTo?: HTMLElement;
  boundariesElement?: HTMLElement;
  scrollableElement?: HTMLElement;
  trigger: React.ReactElement<any>;
  isOpen?: boolean;
  onOpenChange?: (attrs: any) => void;
  fitWidth?: number;
  fitHeight?: number;
  zIndex?: number;
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
        <div style={{ height: 0, minWidth: fitWidth || 0 }}>
          <DropdownList
            disabled={true}
            isOpen={true}
            onOpenChange={onOpenChange}
            appearance="tall"
            position={popupPlacement.join(' ')}
            shouldFlip={false}
            shouldFitContainer={true}
          >
            {children}
          </DropdownList>
        </div>
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

const DropdownWithOuterListeners = withOuterListeners(Dropdown);

export default DropdownWithOuterListeners;
