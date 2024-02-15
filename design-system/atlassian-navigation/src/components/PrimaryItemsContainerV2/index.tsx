import React, {
  memo,
  ReactNode,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';

import Popup from '@atlaskit/popup';
import { TriggerProps } from '@atlaskit/popup/types';
import { Box, Inline, xcss } from '@atlaskit/primitives';
import {
  media,
  UNSAFE_useMediaQuery as useMediaQuery,
} from '@atlaskit/primitives/responsive';

import { OverflowProvider } from '../../controllers/overflow';
import { NavigationTheme } from '../../theme';
import { PrimaryDropdownButton } from '../PrimaryDropdownButton';
import { PrimaryItemsContainerProps } from '../PrimaryItemsContainer/types';

const containerWrapperStyles = xcss({
  height: '100%',
});

const sharedContainerStyles = xcss({
  height: '100%',
  alignItems: 'stretch',
  paddingInlineEnd: 'space.050',
  gap: 'space.100',
});

const smallContainerStyles = xcss({
  [media.above.sm]: {
    display: 'none',
  },
});

const mediumContainerStyles = xcss({
  display: 'none',
  [media.above.sm]: {
    display: 'flex',
  },
  [media.above.lg]: {
    display: 'none',
  },
});

const largeContainerStyles = xcss({
  display: 'none',
  [media.above.lg]: {
    display: 'flex',
  },
});

const MoreItemsPopup = ({
  moreLabel,
  testId,
  items,
}: {
  items?: ReactNode[];
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
    // We render a CSS media query based nav at first to handle SSR, then use
    // our useMediaQuery hook once we are hydrated so there is only one set of nav items
    const [isClient, setIsClient] = useState(false);
    useEffect(() => {
      setIsClient(true);
    }, []);

    // Setting up our media queries to use once app is hydrated
    const mqSm = useMediaQuery('above.sm', (event) =>
      setIsAboveSm(event.matches),
    );
    const [isAboveSm, setIsAboveSm] = useState(mqSm?.matches);

    const mqLg = useMediaQuery('above.lg', (event) =>
      setIsAboveLg(event.matches),
    );
    const [isAboveLg, setIsAboveLg] = useState(mqLg?.matches);

    // Filter out any falsy items passed in
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

    // We re-use this in both the CSS media query nav that loads in for SSR,
    // and the JS/hook media query nav that is used once hydrated
    const navItems = useMemo(() => {
      return {
        small: {
          navBarItems: [],
          overflowItems: filteredItems,
        },
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

    const hydratedNavItems = useMemo(() => {
      if (isAboveLg) {
        return navItems.large;
      }
      if (isAboveSm && !isAboveLg) {
        return navItems.medium;
      }
      return navItems.small;
    }, [isAboveLg, isAboveSm, navItems.large, navItems.medium, navItems.small]);

    return (
      <>
        {isClient ? (
          <Box role="list" xcss={containerWrapperStyles}>
            <Inline
              testId={testId && `${testId}-primary-actions`}
              xcss={sharedContainerStyles}
            >
              {hydratedNavItems.navBarItems}
              {hydratedNavItems.overflowItems.length > 0 && (
                <MoreItemsPopup
                  moreLabel={moreLabel}
                  items={hydratedNavItems.overflowItems}
                  testId={testId}
                />
              )}
            </Inline>
          </Box>
        ) : (
          <Box role="list" xcss={containerWrapperStyles}>
            <Inline xcss={[sharedContainerStyles, smallContainerStyles]}>
              {filteredItems.length > smallMaxItems && (
                // We don't need to pass items into popup, it won't be interactive (SSR only)
                <MoreItemsPopup moreLabel={moreLabel} testId={testId} />
              )}
            </Inline>
            <Inline xcss={[sharedContainerStyles, mediumContainerStyles]}>
              {navItems.medium.navBarItems}
              {navItems.medium.overflowItems.length > 0 && (
                <MoreItemsPopup moreLabel={moreLabel} testId={testId} />
              )}
            </Inline>
            <Inline xcss={[sharedContainerStyles, largeContainerStyles]}>
              {navItems.large.navBarItems}
              {navItems.large.overflowItems.length > 0 && (
                <MoreItemsPopup moreLabel={moreLabel} testId={testId} />
              )}
            </Inline>
          </Box>
        )}
        {Create && <Create />}
      </>
    );
  },
);
