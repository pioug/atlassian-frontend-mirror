import React, { useCallback, useMemo } from 'react';

import { EditorView } from 'prosemirror-view';
import { akEditorMenuZIndex } from '@atlaskit/editor-shared-styles';
import DropdownMenu from '../../../../ui/DropdownMenu';
import { useMenuState } from './hooks/menu-state';
import { MoreButton } from './more-button';

import { MenuIconItem } from './types';

type DropdownMenuProps = {
  editorView: EditorView;
  isReducedSpacing: boolean;
  items: Array<MenuIconItem>;
  moreButtonLabel: string;
  hasFormattingActive: boolean;
  popupsBoundariesElement?: HTMLElement;
  popupsMountPoint?: HTMLElement;
  popupsScrollableElement?: HTMLElement;
};
export const FormattingTextDropdownMenu: React.FC<DropdownMenuProps> = React.memo(
  ({
    editorView,
    moreButtonLabel,
    isReducedSpacing,
    items,
    hasFormattingActive,
    popupsBoundariesElement,
    popupsMountPoint,
    popupsScrollableElement,
  }) => {
    const [isMenuOpen, toggleMenu, closeMenu] = useMenuState();
    const group = useMemo(
      () => [
        {
          items,
        },
      ],
      [items],
    );
    const onItemActivated = useCallback(
      ({ item }: { item: MenuIconItem }) => {
        item.command(editorView.state, editorView.dispatch);
        closeMenu();
      },
      [editorView.state, editorView.dispatch, closeMenu],
    );
    return (
      <DropdownMenu
        mountTo={popupsMountPoint}
        onOpenChange={closeMenu}
        boundariesElement={popupsBoundariesElement}
        scrollableElement={popupsScrollableElement}
        onItemActivated={onItemActivated}
        isOpen={isMenuOpen}
        items={group}
        zIndex={akEditorMenuZIndex}
        fitHeight={188}
        fitWidth={136}
      >
        <MoreButton
          isSelected={isMenuOpen || hasFormattingActive}
          label={moreButtonLabel}
          isReducedSpacing={isReducedSpacing}
          isDisabled={false}
          onClick={toggleMenu}
        />
      </DropdownMenu>
    );
  },
);
