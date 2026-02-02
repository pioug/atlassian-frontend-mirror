/**
 * @jsxFrag
 * @jsxRuntime classic
 * @jsx jsx
 */
import React, { useEffect, useRef, useState } from 'react';

import { cssMap, jsx } from '@compiled/react';

import BoardIcon from '@atlaskit/icon/core/board';
import ClockIcon from '@atlaskit/icon/core/clock';
import FileIcon from '@atlaskit/icon/core/file';
import GlobeIcon from '@atlaskit/icon/core/globe';
import InboxIcon from '@atlaskit/icon/core/inbox';
import PersonAvatarIcon from '@atlaskit/icon/core/person-avatar';
import ProjectIcon from '@atlaskit/icon/core/project';
import StarUnstarredIcon from '@atlaskit/icon/core/star-unstarred';
import { Main } from '@atlaskit/navigation-system/layout/main';
import { Root } from '@atlaskit/navigation-system/layout/root';
import { SideNav, SideNavContent, SideNavPanelSplitter, SideNavToggleButton } from '@atlaskit/navigation-system/layout/side-nav';
import { TopNav, TopNavStart } from '@atlaskit/navigation-system/layout/top-nav';
import { Stack } from '@atlaskit/primitives/compiled';
import { ButtonMenuItem } from '@atlaskit/side-nav-items/button-menu-item';
import { FlyoutBody, FlyoutFooter, FlyoutHeader, FlyoutMenuItem, FlyoutMenuItemContent, FlyoutMenuItemTrigger } from '@atlaskit/side-nav-items/flyout-menu-item';
import { LinkMenuItem } from '@atlaskit/side-nav-items/link-menu-item';
import { MenuList } from '@atlaskit/side-nav-items/menu-list';
import { MenuSection, MenuSectionHeading } from '@atlaskit/side-nav-items/menu-section';
import { SkeletonMenuItem, SkeletonMenuSectionHeading } from '@atlaskit/side-nav-items/skeleton';
import { token } from '@atlaskit/tokens';

const MENU_LOAD_DELAY_MS = 1000;
const FLYOUT_LOAD_DELAY_MS = 1000;

type SkeletonExampleProps = {
    flyoutLoadDelayMs?: number;
    menuLoadDelayMs?: number;
    recentFlyoutDefaultOpen?: boolean;
    starredFlyoutDefaultOpen?: boolean;
};

const styles = cssMap({
    root: {
        paddingInlineStart: token('space.200'),
        paddingBlockStart: token('space.200'),
    },
});

const items = [
    {
        label: 'Modernize typography',
        icon: <FileIcon label="" color="currentColor" spacing="spacious" />,
        description: 'Design Systems Team',
    },
    {
        label: 'F1 sponsorship',
        icon: <BoardIcon label="" color="currentColor" spacing="spacious" />,
        description: 'Marketing Team',
    },
    {
        label: 'Mobile application',
        icon: <ProjectIcon label="" color="currentColor" spacing="spacious" />,
        description: 'Mobile Platform Team',
    },
    {
        label: 'Attachments',
        icon: <InboxIcon label="" color="currentColor" spacing="spacious" />,
        description: 'Core Services Team',
    },
    {
        label: 'Audit',
        icon: <GlobeIcon label="" color="currentColor" spacing="spacious" />,
        description: 'Security Team',
    },
];

function RandomItems({
    count,
    shouldHaveDescription = false,
}: {
    count: number;
    shouldHaveDescription?: boolean;
}) {
    return Array.from({ length: count }, (_, index) => {
        const itemIndex = index % items.length;
        const item = items[itemIndex];
        return (
            <ButtonMenuItem
                key={index}
                elemBefore={item.icon}
                description={shouldHaveDescription ? item.description : undefined}
            >
                {item.label}
            </ButtonMenuItem>
        );
    });
}

const SkeletonMenuItems = () => (
    <>
        <SkeletonMenuItem hasElemBefore />
        <SkeletonMenuItem hasElemBefore />
        <SkeletonMenuItem hasElemBefore />
        <SkeletonMenuItem hasElemBefore />
    </>
);

const RecentSkeletonFlyoutMenuItems = () => (
    <>
        <SkeletonMenuSectionHeading />
        <SkeletonMenuItem hasDescription hasElemBefore />
        <SkeletonMenuItem hasDescription hasElemBefore />
        <SkeletonMenuItem hasDescription hasElemBefore />
        <SkeletonMenuItem hasDescription hasElemBefore />

        <SkeletonMenuSectionHeading />
        <SkeletonMenuItem hasDescription hasElemBefore />
        <SkeletonMenuItem hasDescription hasElemBefore />
    </>
);

const StarredSkeletonFlyoutMenuItems = () => (
    <>
        {Array.from({ length: 12 }, (_, index) => (
            <SkeletonMenuItem key={index} hasElemBefore />
        ))}
    </>
);

export const SkeletonExample = ({
    flyoutLoadDelayMs = FLYOUT_LOAD_DELAY_MS,
    menuLoadDelayMs = MENU_LOAD_DELAY_MS,
    recentFlyoutDefaultOpen = false,
    starredFlyoutDefaultOpen = false,
}: SkeletonExampleProps = {}) => {
    const [menuItemsVisible, setMenuItemsVisible] = useState(false);

    const [recentFlyoutContentLoaded, setRecentFlyoutContentLoaded] = useState(false);
    const recentFlyoutLoadTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    const [starredFlyoutContentLoaded, setStarredFlyoutContentLoaded] = useState(false);
    const starredFlyoutLoadTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    useEffect(() => {
        const timer = setTimeout(() => {
            setMenuItemsVisible(true);
        }, menuLoadDelayMs);
        return () => clearTimeout(timer);
    }, [menuLoadDelayMs]);

    const handleRecentFlyoutOpenChange = (isOpen: boolean) => {
        if (recentFlyoutLoadTimerRef.current) {
            clearTimeout(recentFlyoutLoadTimerRef.current);
            recentFlyoutLoadTimerRef.current = null;
        }
        if (isOpen) {
            setRecentFlyoutContentLoaded(false);
            recentFlyoutLoadTimerRef.current = setTimeout(() => {
                setRecentFlyoutContentLoaded(true);
                recentFlyoutLoadTimerRef.current = null;
            }, flyoutLoadDelayMs);
        } else {
            setRecentFlyoutContentLoaded(false);
        }
    };

    const handleStarredFlyoutOpenChange = (isOpen: boolean) => {
        if (starredFlyoutLoadTimerRef.current) {
            clearTimeout(starredFlyoutLoadTimerRef.current);
            starredFlyoutLoadTimerRef.current = null;
        }
        if (isOpen) {
            setStarredFlyoutContentLoaded(false);
            starredFlyoutLoadTimerRef.current = setTimeout(() => {
                setStarredFlyoutContentLoaded(true);
                starredFlyoutLoadTimerRef.current = null;
            }, flyoutLoadDelayMs);
        } else {
            setStarredFlyoutContentLoaded(false);
        }
    };

    useEffect(() => {
        return () => {
            if (recentFlyoutLoadTimerRef.current) {
                clearTimeout(recentFlyoutLoadTimerRef.current);
            }

            if (starredFlyoutLoadTimerRef.current) {
                clearTimeout(starredFlyoutLoadTimerRef.current);
            }
        };
    }, []);

    return (
        <Root isSideNavShortcutEnabled>
            <TopNav>
                <TopNavStart
                    sideNavToggleButton={
                        <SideNavToggleButton collapseLabel="Collapse sidebar" expandLabel="Expand sidebar" />
                    }
                >
                    Top nav
                </TopNavStart>
            </TopNav>

            <SideNav>
                <SideNavContent>
                    <MenuList>
                        {menuItemsVisible ? (
                            <>
                                <LinkMenuItem
                                    href="#"
                                    elemBefore={<PersonAvatarIcon label="" color="currentColor" />}
                                    isSelected
                                >
                                    For you
                                </LinkMenuItem>

                                <FlyoutMenuItem onOpenChange={handleRecentFlyoutOpenChange} isDefaultOpen={recentFlyoutDefaultOpen}>
                                    <FlyoutMenuItemTrigger elemBefore={<ClockIcon label="" color="currentColor" />}>
                                        Recent
                                    </FlyoutMenuItemTrigger>
                                    <FlyoutMenuItemContent>
                                        <FlyoutHeader title="Recent" closeButtonLabel="Close" />
                                        {recentFlyoutContentLoaded ? (
                                            <>
                                                <FlyoutBody>
                                                    <MenuList>
                                                        <MenuSection isMenuListItem>
                                                            <MenuSectionHeading>Today</MenuSectionHeading>
                                                            <MenuList>
                                                                <RandomItems count={4} shouldHaveDescription />
                                                            </MenuList>
                                                        </MenuSection>
                                                        <MenuSection isMenuListItem>
                                                            <MenuSectionHeading>Yesterday</MenuSectionHeading>
                                                            <MenuList>
                                                                <RandomItems count={2} shouldHaveDescription />
                                                            </MenuList>
                                                        </MenuSection>
                                                    </MenuList>
                                                </FlyoutBody>

                                                <FlyoutFooter>
                                                    <MenuList>
                                                        <ButtonMenuItem>View all recent items</ButtonMenuItem>
                                                    </MenuList>
                                                </FlyoutFooter>
                                            </>
                                        ) : (
                                            <>
                                                <FlyoutBody>
                                                    <MenuList>
                                                        <RecentSkeletonFlyoutMenuItems />
                                                    </MenuList>
                                                </FlyoutBody>
                                            </>
                                        )}
                                    </FlyoutMenuItemContent>
                                </FlyoutMenuItem>

                                <FlyoutMenuItem onOpenChange={handleStarredFlyoutOpenChange} isDefaultOpen={starredFlyoutDefaultOpen}>
                                    <FlyoutMenuItemTrigger
                                        elemBefore={<StarUnstarredIcon label="" color="currentColor" />}
                                    >
                                        Starred
                                    </FlyoutMenuItemTrigger>
                                    <FlyoutMenuItemContent>
                                        <FlyoutHeader title="Starred" closeButtonLabel="Close recent flyout" />
                                        {starredFlyoutContentLoaded ? (
                                            <>
                                                <FlyoutBody>
                                                    <MenuList>
                                                        <RandomItems count={12} />
                                                    </MenuList>
                                                </FlyoutBody>

                                                <FlyoutFooter>
                                                    <MenuList>
                                                        <ButtonMenuItem>View all starred items</ButtonMenuItem>
                                                    </MenuList>
                                                </FlyoutFooter>
                                            </>
                                        ) : (
                                            <>
                                                <FlyoutBody>
                                                    <MenuList>
                                                        <StarredSkeletonFlyoutMenuItems />
                                                    </MenuList>
                                                </FlyoutBody>
                                            </>
                                        )}
                                    </FlyoutMenuItemContent>
                                </FlyoutMenuItem>

                                <LinkMenuItem
                                    href="#"
                                    elemBefore={<PersonAvatarIcon label="" color="currentColor" />}
                                >
                                    Other
                                </LinkMenuItem>
                            </>
                        ) : (
                            <SkeletonMenuItems />
                        )}
                    </MenuList>
                </SideNavContent>
                <SideNavPanelSplitter label="Resize side nav" tooltipContent="Double click to collapse" />
            </SideNav>

            <Main>
                <Stack xcss={styles.root} space="space.200">
                    <div>
                        Skeleton side nav menu item
                        <SkeletonMenuItem />
                    </div>

                    <div>
                        Skeleton side nav menu item with description
                        <SkeletonMenuItem hasDescription />
                    </div>

                    <div>
                        Skeleton side nav menu item with icon element
                        <SkeletonMenuItem hasElemBefore />
                    </div>

                    <div>
                        Skeleton side nav menu item with description and icon element
                        <SkeletonMenuItem hasDescription hasElemBefore />
                    </div>

                    <div>
                        Skeleton side nav menu section heading
                        <SkeletonMenuSectionHeading />
                    </div>
                </Stack>
            </Main>
        </Root>
    );
};

export const SkeletonMenuItemsExample = () => (
    <SkeletonExample menuLoadDelayMs={5000} />
);

export const SkeletonFlyoutExample = () => (
    <SkeletonExample menuLoadDelayMs={0} flyoutLoadDelayMs={5000} recentFlyoutDefaultOpen />
);

export default SkeletonExample;
