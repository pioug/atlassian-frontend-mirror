/** @jsx jsx */
import React, { PureComponent } from 'react';

import { css, jsx } from '@emotion/react';

import { akEditorFloatingPanelZIndex } from '@atlaskit/editor-shared-styles';
import {
  CustomItem,
  CustomItemComponentProps,
  MenuGroup,
} from '@atlaskit/menu';
import { DN600, DN80, N70, N900 } from '@atlaskit/theme/colors';
import { themed } from '@atlaskit/theme/components';
import { ThemeProps } from '@atlaskit/theme/types';
import { token } from '@atlaskit/tokens';
import Tooltip, { PositionType } from '@atlaskit/tooltip';

import { withReactEditorViewOuterListeners } from '../../ui-react';
import DropList from '../../ui/DropList';
import Popup from '../../ui/Popup';

import { MenuItem, Props, State } from './types';
export type { MenuItem } from './types';

const wrapper = css`
  /* tooltip in ToolbarButton is display:block */
  & > div > div {
    display: flex;
  }
`;

const buttonStyles = (isActive?: boolean) => (theme: ThemeProps) => {
  if (isActive) {
    /**
     * Hack for item to imitate old dropdown-menu selected styles
     */
    return css`
      > span,
      > span:hover,
      > span:active {
        background: ${token('color.background.selected', '#6c798f')};
        color: ${token('color.text', '#fff')};
      }
    `;
  } else {
    return css`
      > span:hover[aria-disabled='false'] {
        color: ${themed({
          light: token('color.text', N900),
          dark: token('color.text', DN600),
        })(theme)};
        background-color: ${themed({
          light: token(
            'color.background.neutral.subtle.hovered',
            'rgb(244, 245, 247)',
          ),
          dark: token(
            'color.background.neutral.subtle.hovered',
            'rgb(59, 71, 92)',
          ),
        })(theme)};
      }
      > span:active[aria-disabled='false'] {
        background-color: ${themed({
          light: token(
            'color.background.neutral.subtle.pressed',
            'rgb(179, 212, 255)',
          ),
          dark: token(
            'color.background.neutral.subtle.pressed',
            'rgb(179, 212, 255)',
          ),
        })(theme)};
      }
      > span[aria-disabled='true'] {
        color: ${themed({
          light: token('color.text.disabled', N70),
          dark: token('color.text.disabled', DN80),
        })(theme)};
      }
    `;
  }
};

const DropListWithOutsideListeners: any =
  withReactEditorViewOuterListeners(DropList);

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
            <MenuGroup
              key={index}
              role={shouldUseDefaultRole ? 'group' : 'menu'}
            >
              {group.items.map((item) => (
                <DropdownMenuItem
                  key={item.key ?? String(item.content)}
                  item={item}
                  onItemActivated={this.props.onItemActivated}
                  shouldUseDefaultRole={this.props.shouldUseDefaultRole}
                  onMouseEnter={this.props.onMouseEnter}
                  onMouseLeave={this.props.onMouseLeave}
                />
              ))}
            </MenuGroup>
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

type DropdownMenuItemCustomComponentProps = CustomItemComponentProps & {
  item: MenuItem;
} & React.ComponentProps<'span'>;

const DropdownMenuItemCustomComponent = React.forwardRef<
  HTMLAnchorElement,
  DropdownMenuItemCustomComponentProps
>((props: DropdownMenuItemCustomComponentProps, ref) => {
  const { children, ...rest } = props;

  return (
    <span ref={ref} {...rest}>
      {children}
    </span>
  );
});

function DropdownMenuItem({
  item,
  onItemActivated,
  shouldUseDefaultRole,
  onMouseEnter,
  onMouseLeave,
}: {
  item: MenuItem;
} & Pick<
  Props,
  'onItemActivated' | 'shouldUseDefaultRole' | 'onMouseEnter' | 'onMouseLeave'
>) {
  // onClick and value.name are the action indicators in the handlers
  // If neither are present, don't wrap in an Item.
  if (!item.onClick && !(item.value && item.value.name)) {
    return <span key={String(item.content)}>{item.content}</span>;
  }

  const dropListItem = (
    <div css={(theme: ThemeProps) => buttonStyles(item.isActive)({ theme })}>
      <CustomItem
        item={item}
        key={item.key ?? String(item.content)}
        role={shouldUseDefaultRole ? 'button' : 'menuitem'}
        iconBefore={item.elemBefore}
        iconAfter={item.elemAfter}
        isDisabled={item.isDisabled}
        onClick={() => onItemActivated && onItemActivated({ item })}
        aria-label={item['aria-label'] || String(item.content)}
        aria-pressed={shouldUseDefaultRole ? item.isActive : undefined}
        onMouseDown={(e) => {
          e.preventDefault();
        }}
        component={DropdownMenuItemCustomComponent}
        onMouseEnter={() => onMouseEnter && onMouseEnter({ item })}
        onMouseLeave={() => onMouseLeave && onMouseLeave({ item })}
      >
        {item.content}
      </CustomItem>
    </div>
  );

  if (item.tooltipDescription) {
    return (
      <Tooltip
        key={item.key ?? String(item.content)}
        content={item.tooltipDescription}
        position={item.tooltipPosition as PositionType}
      >
        {dropListItem}
      </Tooltip>
    );
  }

  return dropListItem;
}
