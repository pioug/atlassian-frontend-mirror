import React from 'react';

import { DropList } from '@atlaskit/editor-common/ui';
import type { MenuItem } from '@atlaskit/editor-common/ui-menu';
import {
  ArrowKeyNavigationProvider,
  ArrowKeyNavigationType,
  DropdownMenuItem,
} from '@atlaskit/editor-common/ui-menu';
import { withReactEditorViewOuterListeners } from '@atlaskit/editor-common/ui-react';
import { MenuGroup, Section } from '@atlaskit/menu';
import { getBooleanFF } from '@atlaskit/platform-feature-flags';

import { dragMenuDropdownWidth } from '../consts';

const DropListWithOutsideListeners =
  withReactEditorViewOuterListeners(DropList);

type DropdownMenuProps = {
  target?: HTMLElement;
  items: Array<{
    items: MenuItem[];
  }>;
  /**
   * use to toggle top level menu keyboard navigation and action keys
   * e.g. should be false if submenu is rendered as a child to avoid multiple keydown handlers
   */
  disableKeyboardHandling: boolean;
  section: { hasSeparator?: boolean; title?: string };
  onItemActivated?: (attrs: {
    item: MenuItem;
    shouldCloseMenu?: boolean;
  }) => void;
  handleClose: (focusTarget: 'editor' | 'handle') => void;
  onMouseEnter: (attrs: { item: MenuItem }) => void;
  onMouseLeave: (attrs: { item: MenuItem }) => void;
};

export const DropdownMenu = ({
  target,
  items,
  section,
  disableKeyboardHandling,
  onItemActivated,
  handleClose,
  onMouseEnter,
  onMouseLeave,
}: DropdownMenuProps) => {
  const innerMenu = () => {
    return (
      <DropListWithOutsideListeners
        isOpen
        shouldFitContainer
        position={['bottom', 'left'].join(' ')}
        handleClickOutside={() => handleClose('editor')}
        handleEscapeKeydown={() => {
          if (!disableKeyboardHandling) {
            handleClose('handle');
          }
        }}
        handleEnterKeydown={(e: KeyboardEvent) => {
          if (!disableKeyboardHandling) {
            e.preventDefault();
            e.stopPropagation();
          }
        }}
        targetRef={target}
      >
        <div style={{ height: 0, minWidth: dragMenuDropdownWidth }} />
        <MenuGroup role="menu">
          {items.map((group, index) => (
            <Section
              hasSeparator={section?.hasSeparator && index > 0}
              title={section?.title}
              key={index}
            >
              {group.items.map((item) => (
                <DropdownMenuItem
                  shouldUseDefaultRole={false}
                  key={item.key ?? String(item.content)}
                  item={item}
                  onItemActivated={onItemActivated}
                  onMouseEnter={onMouseEnter}
                  onMouseLeave={onMouseLeave}
                />
              ))}
            </Section>
          ))}
        </MenuGroup>
      </DropListWithOutsideListeners>
    );
  };

  if (disableKeyboardHandling) {
    return innerMenu();
  }

  return (
    <ArrowKeyNavigationProvider
      closeOnTab
      type={ArrowKeyNavigationType.MENU}
      onSelection={(index) => {
        const results = items.flatMap((item) =>
          'items' in item ? item.items : item,
        );

        // onSelection is called when any focusable element is 'activated'
        // this is an issue as some menu items have toggles, which cause the index value
        // in the callback to be outside of array length.
        // The logic below normalises the index value based on the number
        // of menu items with 2 focusable elements, and adjusts the index to ensure
        // the correct menu item is sent in onItemActivated callback
        if (
          getBooleanFF('platform.editor.table.new-cell-context-menu-styling')
        ) {
          const keys = ['row_numbers', 'header_row', 'header_column'];
          let doubleItemCount = 0;

          const firstIndex = results.findIndex((value) =>
            keys.includes(value.key!),
          );

          if (firstIndex === -1 || index <= firstIndex) {
            onItemActivated && onItemActivated({ item: results[index] });
            return;
          }

          for (let i = firstIndex; i < results.length; i += 1) {
            if (keys.includes(results[i].key!)) {
              doubleItemCount += 1;
            }
            if (firstIndex % 2 === 0 && index - doubleItemCount === i) {
              onItemActivated && onItemActivated({ item: results[i] });
              return;
            }

            if (firstIndex % 2 === 1 && index - doubleItemCount === i) {
              onItemActivated && onItemActivated({ item: results[i] });
              return;
            }
          }
        } else {
          onItemActivated && onItemActivated({ item: results[index] });
        }
      }}
    >
      {innerMenu()}
    </ArrowKeyNavigationProvider>
  );
};
