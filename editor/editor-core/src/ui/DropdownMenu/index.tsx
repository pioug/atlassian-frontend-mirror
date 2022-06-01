/** @jsx jsx */
import { PureComponent } from 'react';
import { css, jsx } from '@emotion/react';
// eslint-disable-next-line @atlaskit/design-system/no-deprecated-imports
import DropList from '@atlaskit/droplist';
// eslint-disable-next-line @atlaskit/design-system/no-deprecated-imports
import Item, { ItemGroup } from '@atlaskit/item';
import Tooltip from '@atlaskit/tooltip';
import { Popup } from '@atlaskit/editor-common/ui';
import { akEditorFloatingPanelZIndex } from '@atlaskit/editor-shared-styles';
import withOuterListeners from '../with-outer-listeners';
import { Props, State } from './types';

const wrapper = css`
  /* tooltip in ToolbarButton is display:block */
  & > div > div {
    display: flex;
  }
`;

const DropListWithOutsideListeners: any = withOuterListeners(DropList);

/**
 * Hack for item to imitate old dropdown-menu selected styles
 */
// TODO: https://product-fabric.atlassian.net/browse/DSP-4500
/* eslint-disable @atlaskit/design-system/ensure-design-token-usage */
const itemWrapper = css`
  && > span,
  && > span:hover {
    background: #6c798f;
    color: #fff;
  }
`;
/* eslint-enable @atlaskit/design-system/ensure-design-token-usage */

const itemContentWrapper = css`
  margin-left: 8px;
`;

/**
 * Wrapper around @atlaskit/droplist which uses Popup and Portal to render
 * dropdown-menu outside of "overflow: hidden" containers when needed.
 *
 * Also it controls popper's placement.
 */
export default class DropdownMenuWrapper extends PureComponent<Props, State> {
  state: State = {
    popupPlacement: ['bottom', 'left'],
  };

  private handleRef = (target: HTMLElement | null) => {
    this.setState({ target: target || undefined });
  };

  private updatePopupPlacement = (placement: [string, string]) => {
    const { popupPlacement: previousPlacement } = this.state;
    if (
      placement[0] !== previousPlacement[0] ||
      placement[1] !== previousPlacement[1]
    ) {
      this.setState({ popupPlacement: placement });
    }
  };

  private handleClose = () => {
    if (this.props.onOpenChange) {
      this.props.onOpenChange({ isOpen: false });
    }
  };

  private renderItem(item: typeof Item) {
    const {
      onItemActivated,
      onMouseEnter,
      onMouseLeave,
      shouldUseDefaultRole,
    } = this.props;

    // onClick and value.name are the action indicators in the handlers
    // If neither are present, don't wrap in an Item.
    if (!item.onClick && !item.value && !item.value.name) {
      return <span key={String(item.content)}>{item.content}</span>;
    }

    const dropListItem = (
      <div
        css={item.isActive ? itemWrapper : ''}
        key={item.key || item.content}
      >
        <Item
          role={shouldUseDefaultRole ? 'button' : 'menuitem'}
          elemBefore={item.elemBefore}
          elemAfter={item.elemAfter}
          isDisabled={item.isDisabled}
          onClick={() => onItemActivated && onItemActivated({ item })}
          onMouseEnter={() => onMouseEnter && onMouseEnter({ item })}
          onMouseLeave={() => onMouseLeave && onMouseLeave({ item })}
          className={item.className}
          aria-label={item.label || String(item.content)}
          aria-pressed={shouldUseDefaultRole ? item.isActive : undefined}
        >
          <span css={!!item.elemBefore ? itemContentWrapper : ''}>
            {item.content}
          </span>
        </Item>
      </div>
    );

    if (item.tooltipDescription) {
      return (
        <Tooltip
          key={item.key || item.content}
          content={item.tooltipDescription}
          position={item.tooltipPosition}
        >
          {dropListItem}
        </Tooltip>
      );
    }

    return dropListItem;
  }

  private renderDropdownMenu() {
    const { target, popupPlacement } = this.state;
    const {
      items,
      mountTo,
      boundariesElement,
      scrollableElement,
      offset,
      fitHeight,
      fitWidth,
      isOpen,
      zIndex,
      shouldUseDefaultRole,
    } = this.props;

    return (
      <Popup
        target={isOpen ? target : undefined}
        mountTo={mountTo}
        boundariesElement={boundariesElement}
        scrollableElement={scrollableElement}
        onPlacementChanged={this.updatePopupPlacement}
        fitHeight={fitHeight}
        fitWidth={fitWidth}
        zIndex={zIndex || akEditorFloatingPanelZIndex}
        offset={offset}
      >
        <DropListWithOutsideListeners
          isOpen={true}
          appearance="tall"
          position={popupPlacement.join(' ')}
          shouldFlip={false}
          shouldFitContainer={true}
          isTriggerNotTabbable={true}
          handleClickOutside={this.handleClose}
          handleEscapeKeydown={this.handleClose}
        >
          <div style={{ height: 0, minWidth: fitWidth || 0 }} />
          {items.map((group, index) => (
            <ItemGroup
              key={index}
              role={shouldUseDefaultRole ? 'group' : 'menu'}
            >
              {group.items.map((item) => this.renderItem(item))}
            </ItemGroup>
          ))}
        </DropListWithOutsideListeners>
      </Popup>
    );
  }

  render() {
    const { children, isOpen } = this.props;

    return (
      <div css={wrapper}>
        <div ref={this.handleRef}>{children}</div>
        {isOpen ? this.renderDropdownMenu() : null}
      </div>
    );
  }
}
