/** @jsx jsx */
import React, { memo, ReactNode, useCallback, useMemo, useState } from 'react';

import { css, jsx } from '@emotion/react';

import Popup from '@atlaskit/popup';
import { TriggerProps } from '@atlaskit/popup/types';
import { media, UNSAFE_media } from '@atlaskit/primitives/responsive';
import { token } from '@atlaskit/tokens';

import { OverflowProvider } from '../../controllers/overflow';
import { NavigationTheme } from '../../theme';
import { PrimaryDropdownButton } from '../PrimaryDropdownButton';
import { PrimaryItemsContainerProps } from '../PrimaryItemsContainer/types';

const parentContainerStyles = css({
  display: 'flex',
  width: '100%',
  height: '100%',
});

const basePrimaryContainerStyles = css({
  display: 'none',
  minWidth: 0,
  gap: token('space.100', '8px'),
});

const smallContainerStyles = css({
  // eslint-disable-next-line @atlaskit/design-system/no-nested-styles
  [UNSAFE_media.below.sm]: {
    display: 'flex',
  },
});

const mediumContainerStyles = css({
  [media.above.sm]: {
    display: 'flex',
  },
  [media.above.lg]: {
    display: 'none',
  },
});

const largeContainerStyles = css({
  [media.above.lg]: {
    display: 'flex',
  },
});

const MoreItemsPopup = ({
  moreLabel,
  testId,
  items,
}: {
  items: ReactNode[];
  moreLabel: ReactNode;
  testId?: string;
}) => {
  const [isMoreOpen, setIsMoreOpen] = useState(false);
  const onMoreClose = useCallback(() => setIsMoreOpen(false), []);
  const onMoreClick = useCallback(
    () => setIsMoreOpen((current) => !current),
    [],
  );
  const openOverflowMenu = useCallback(() => setIsMoreOpen(true), []);

  const trigger = useCallback(
    (triggerProps: TriggerProps) => (
      <PrimaryDropdownButton
        onClick={onMoreClick}
        isSelected={isMoreOpen}
        testId={
          testId ? `${testId}-overflow-menu-trigger` : 'overflow-menu-trigger'
        }
        {...triggerProps}
      >
        {moreLabel}
      </PrimaryDropdownButton>
    ),
    [moreLabel, onMoreClick, isMoreOpen, testId],
  );

  const content = useCallback(
    () => (
      <OverflowProvider
        isVisible={false}
        openOverflowMenu={openOverflowMenu}
        closeOverflowMenu={onMoreClose}
      >
        {items}
      </OverflowProvider>
    ),
    [items, openOverflowMenu, onMoreClose],
  );

  return (
    <Popup
      placement="bottom-start"
      isOpen={isMoreOpen}
      onClose={onMoreClose}
      trigger={trigger}
      content={content}
      testId={testId ? `${testId}-overflow-menu-popup` : 'overflow-menu-popup'}
    />
  );
};

// Internal only
// eslint-disable-next-line @repo/internal/react/require-jsdoc
export const PrimaryItemsContainer = memo(
  ({
    moreLabel,
    items,
    create: Create,
    theme,
    testId,
  }: PrimaryItemsContainerProps & { theme: NavigationTheme }) => {
    const filteredItems = useMemo(
      () => React.Children.toArray(items).filter((item) => !!item),
      [items],
    );
    // NOTE: we could make these max items configurable in the future. For now
    // we are using sensible defaults. Anything over the max gets put in the
    // overflow menu for that screen size.
    // While it may be tempting to use more than 3 items for the medium nav when
    // you see the available space, you need to consider internationalistion.
    // 3 is the safe, defensive choice across many languages and scripts.
    const smallMaxItems = 0;
    const mediumMaxItems = 3;
    const largeMaxItems = 8;

    const navItems = useMemo(() => {
      return {
        // For small screens, we're currently putting all items in the overflow
        medium: {
          navBarItems: filteredItems.slice(0, mediumMaxItems),
          overflowItems: filteredItems.slice(
            mediumMaxItems,
            filteredItems.length,
          ),
        },
        large: {
          navBarItems: filteredItems.slice(0, largeMaxItems),
          overflowItems: filteredItems.slice(
            largeMaxItems,
            filteredItems.length,
          ),
        },
      };
    }, [filteredItems]);

    return (
      <div
        css={parentContainerStyles}
        data-testid={testId && `${testId}-primary-actions`}
      >
        <div css={[basePrimaryContainerStyles, smallContainerStyles]}>
          {filteredItems.length > smallMaxItems && (
            <MoreItemsPopup
              // NOTE: Would be nice to have a different label for small screens
              // with i18n support (eg. swapping from 'More' to 'Menu' like
              // Atlas does). Instead of opting for adding a new label prop right
              // now I'm holding off until DSTRFC-016 lands.
              moreLabel={moreLabel}
              items={filteredItems}
              testId={testId}
            />
          )}
        </div>
        <div css={[basePrimaryContainerStyles, mediumContainerStyles]}>
          {navItems.medium.navBarItems}
          {navItems.medium.overflowItems.length > 0 && (
            <MoreItemsPopup
              moreLabel={moreLabel}
              items={navItems.medium.overflowItems}
              testId={testId}
            />
          )}
        </div>
        <div css={[basePrimaryContainerStyles, largeContainerStyles]}>
          {navItems.large.navBarItems}
          {navItems.large.overflowItems.length > 0 && (
            <MoreItemsPopup
              moreLabel={moreLabel}
              items={navItems.large.overflowItems}
              testId={testId}
            />
          )}
        </div>
        {Create && <Create />}
      </div>
    );
  },
);
