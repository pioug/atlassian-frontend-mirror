/** @jsx jsx */
import type { MouseEventHandler } from 'react';
import React, { PureComponent, useContext } from 'react';

import { css, jsx } from '@emotion/react';

import { akEditorFloatingPanelZIndex } from '@atlaskit/editor-shared-styles';
import type { CustomItemComponentProps } from '@atlaskit/menu';
import { CustomItem, MenuGroup } from '@atlaskit/menu';
import { B100, DN600, DN80, N70, N900 } from '@atlaskit/theme/colors';
import { themed } from '@atlaskit/theme/components';
import type { ThemeProps } from '@atlaskit/theme/types';
import { token } from '@atlaskit/tokens';
import type { PositionType } from '@atlaskit/tooltip';
import Tooltip from '@atlaskit/tooltip';

import { DropdownMenuSharedCssClassName } from '../../styles';
import { KeyDownHandlerContext } from '../../ui-menu/ToolbarArrowKeyNavigationProvider';
import { withReactEditorViewOuterListeners } from '../../ui-react';
import DropList from '../../ui/DropList';
import Popup from '../../ui/Popup';
import { ArrowKeyNavigationProvider } from '../ArrowKeyNavigationProvider';
import { ArrowKeyNavigationType } from '../ArrowKeyNavigationProvider/types';

import type { MenuItem, Props, State } from './types';

export type { MenuItem } from './types';

const wrapper = css`
  /* tooltip in ToolbarButton is display:block */
  & > div > div {
    display: flex;
  }
`;

const focusedMenuItemStyle = css`
  box-shadow: inset 0px 0px 0px 2px ${token('color.border.focused', B100)};
  outline: none;
`;

const buttonStyles =
  (isActive?: boolean, submenuActive?: boolean) => (theme: ThemeProps) => {
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
        :focus > span[aria-disabled='false'] {
          ${focusedMenuItemStyle};
        }
        :focus-visible,
        :focus-visible > span[aria-disabled='false'] {
          outline: none;
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
        ${!submenuActive &&
        `
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
          }`}
        > span[aria-disabled='true'] {
          color: ${themed({
            light: token('color.text.disabled', N70),
            dark: token('color.text.disabled', DN80),
          })(theme)};
        }
        :focus > span[aria-disabled='false'] {
          ${focusedMenuItemStyle};
        }
        :focus-visible,
        :focus-visible > span[aria-disabled='false'] {
          outline: none;
        }
      `; // The default focus-visible style is removed to ensure consistency across browsers
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
    selectionIndex: -1,
  };

  private popupRef = React.createRef<HTMLDivElement>();

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

  private handleCloseAndFocus = () => {
    this.state.target?.querySelector('button')?.focus();
    this.handleClose();
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
      onItemActivated,
      arrowKeyNavigationProviderOptions,
    } = this.props;

    // Note that this onSelection function can't be refactored to useMemo for
    // performance gains as it is being used as a dependency in a useEffect in
    // MenuArrowKeyNavigationProvider in order to check for re-renders to adjust
    // focus for accessibility. If this needs to be refactored in future refer
    // back to ED-16740 for context.
    const navigationProviderProps =
      arrowKeyNavigationProviderOptions.type === ArrowKeyNavigationType.COLOR
        ? arrowKeyNavigationProviderOptions
        : {
            ...arrowKeyNavigationProviderOptions,
            onSelection: (index: number) => {
              let result: MenuItem[] = [];
              if (typeof onItemActivated === 'function') {
                result = items.reduce((result, group) => {
                  return result.concat(group.items);
                }, result);
                onItemActivated({
                  item: result[index],
                  shouldCloseMenu: false,
                });
              }
            },
          };
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
        <ArrowKeyNavigationProvider
          {...navigationProviderProps}
          handleClose={this.handleCloseAndFocus}
          closeOnTab={true}
        >
          <DropListWithOutsideListeners
            isOpen={true}
            appearance="tall"
            position={popupPlacement.join(' ')}
            shouldFlip={false}
            shouldFitContainer={true}
            isTriggerNotTabbable={true}
            handleClickOutside={this.handleClose}
            handleEscapeKeydown={this.handleCloseAndFocus}
            handleEnterKeydown={(e: KeyboardEvent) => {
              e.preventDefault();
              e.stopPropagation();
            }}
            targetRef={this.state.target}
          >
            <div style={{ height: 0, minWidth: fitWidth || 0 }} />
            <div ref={this.popupRef}>
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
            </div>
          </DropListWithOutsideListeners>
        </ArrowKeyNavigationProvider>
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

  componentDidUpdate(previousProps: Props) {
    const isOpenToggled = this.props.isOpen !== previousProps.isOpen;
    if (this.props.isOpen && isOpenToggled) {
      if (
        typeof this.props.shouldFocusFirstItem === 'function' &&
        this.props.shouldFocusFirstItem()
      ) {
        const keyboardEvent = new KeyboardEvent('keydown', {
          key: 'ArrowDown',
          bubbles: true,
        });
        this.state.target?.dispatchEvent(keyboardEvent);
      }
    }
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
    <span
      ref={ref}
      {...rest}
      style={{
        // This forces the item container back to be `position: static`, the default value.
        // This ensures the custom nested menu for table color picker still works as now
        // menu items from @atlaskit/menu all have `position: relative` set for the selected borders.
        // The current implementation unfortunately is very brittle. Design System Team will
        // be prioritizing official support for accessible nested menus that we want you to move
        // to in the future.
        position: 'static',
      }}
    >
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
  const [submenuActive, setSubmenuActive] = React.useState(false);

  // onClick and value.name are the action indicators in the handlers
  // If neither are present, don't wrap in an Item.
  if (!item.onClick && !(item.value && item.value.name)) {
    return <span key={String(item.content)}>{item.content}</span>;
  }

  const _handleSubmenuActive: MouseEventHandler<HTMLDivElement> = (event) => {
    setSubmenuActive(
      !!(event.target as Element).closest(
        `.${DropdownMenuSharedCssClassName.SUBMENU}`,
      ),
    );
  };

  const dropListItem = (
    <div
      css={(theme: ThemeProps) =>
        buttonStyles(item.isActive, submenuActive)({ theme })
      }
      tabIndex={-1}
      aria-disabled={item.isDisabled ? 'true' : 'false'}
      onMouseDown={_handleSubmenuActive}
    >
      <CustomItem
        item={item}
        key={item.key ?? String(item.content)}
        testId={`dropdown-item__${String(item.content)}`}
        role={shouldUseDefaultRole ? 'button' : 'menuitem'}
        iconBefore={item.elemBefore}
        iconAfter={item.elemAfter}
        isDisabled={item.isDisabled}
        onClick={() => onItemActivated && onItemActivated({ item })}
        aria-label={item['aria-label'] || String(item.content)}
        aria-pressed={shouldUseDefaultRole ? item.isActive : undefined}
        aria-keyshortcuts={item['aria-keyshortcuts']}
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

export const DropdownMenuWithKeyboardNavigation: React.FC<any> = React.memo(
  ({ ...props }) => {
    const keyDownHandlerContext = useContext(KeyDownHandlerContext);
    // This context is to handle the tab, Arrow Right/Left key events for dropdown.
    // Default context has the void callbacks for above key events
    return (
      <DropdownMenuWrapper
        arrowKeyNavigationProviderOptions={{
          ...props.arrowKeyNavigationProviderOptions,
          keyDownHandlerContext,
        }}
        {...props}
      />
    );
  },
);
