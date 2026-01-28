import React from 'react';


import { AnalyticsListener } from '@atlaskit/analytics-next';
import { skipAutoA11yFile } from '@atlassian/a11y-jest-testing';
import { ffTest } from '@atlassian/feature-flags-test-utils';
import { render, screen, userEvent } from '@atlassian/testing-library';


import { ButtonMenuItem } from '../../button-menu-item';
import { FlyoutBody } from '../../flyout-menu-item/flyout-body';
import { FlyoutHeader } from '../../flyout-menu-item/flyout-header';
import { FlyoutMenuItem } from '../../flyout-menu-item/flyout-menu-item';
import { FlyoutMenuItemContent } from '../../flyout-menu-item/flyout-menu-item-content';
import { FlyoutMenuItemTrigger } from '../../flyout-menu-item/flyout-menu-item-trigger';

// This file exposes one or more accessibility violations. Testing is currently skipped but violations need to
// be fixed in a timely manner or result in escalation. Once all violations have been fixed, you can remove
// the next line and associated import. For more information, see go/afm-a11y-tooling:jest
skipAutoA11yFile();

describe('flyout menu item analytics', () => {
    ffTest.on('platform_dst_nav4_flyout_menu_slots_close_button', 'includes updated to flyout menu to track analytics for closing the flyout menu', () => {
        it('should call onClick with analytics metadata when opened', async () => {
            const onClick = jest.fn();

            render(
                <AnalyticsListener channel="navigation" onEvent={onClick}>
                    <FlyoutMenuItem>
                        <FlyoutMenuItemTrigger>Trigger</FlyoutMenuItemTrigger>
                        <FlyoutMenuItemContent>
                            <ButtonMenuItem>Item 1</ButtonMenuItem>
                        </FlyoutMenuItemContent>
                    </FlyoutMenuItem>,
                </AnalyticsListener>
            );

            await userEvent.click(screen.getByRole('button', { name: 'Trigger' }));

            expect(onClick.mock.calls[0][0].payload).toEqual({
                source: 'sideNav',
                actionSubject: 'flyoutMenu',
                action: 'opened',
            });
        });

        it('should call onClose with analytics metadata when closed via close button', async () => {
            const onClose = jest.fn();

            render(
                <AnalyticsListener channel="navigation" onEvent={onClose}>
                    <FlyoutMenuItem isDefaultOpen>
                        <FlyoutMenuItemTrigger>Trigger</FlyoutMenuItemTrigger>
                        <FlyoutMenuItemContent onClose={onClose}>
                            <FlyoutHeader title="Flyout Menu Item" closeButtonLabel="Close flyout menu" testId="flyout-header" />
                            <FlyoutBody>
                                <ButtonMenuItem>Item 1</ButtonMenuItem>
                            </FlyoutBody>
                        </FlyoutMenuItemContent>
                    </FlyoutMenuItem>,
                </AnalyticsListener>
            );

            await userEvent.click(screen.getByTestId('flyout-header--close-button'));

            expect(onClose.mock.calls[0][0].payload).toEqual({
                source: 'sideNav',
                actionSubject: 'flyoutMenu',
                action: 'closed',
                attributes: {
                    closeSource: 'close-button',
                },
            });
        });

        it('should call onClose with analytics metadata when closed via escape key', async () => {
            const onClose = jest.fn();

            render(
                <AnalyticsListener channel="navigation" onEvent={onClose}>
                    <FlyoutMenuItem isDefaultOpen>
                        <FlyoutMenuItemTrigger>Trigger</FlyoutMenuItemTrigger>
                        <FlyoutMenuItemContent onClose={onClose}>
                            <ButtonMenuItem>Item 1</ButtonMenuItem>
                        </FlyoutMenuItemContent>
                    </FlyoutMenuItem>,
                </AnalyticsListener>
            );

            await userEvent.keyboard('{Escape}');

            expect(onClose.mock.calls[0][0].payload).toEqual({
                source: 'sideNav',
                actionSubject: 'flyoutMenu',
                action: 'closed',
                attributes: {
                    closeSource: 'escape-key',
                },
            });
        });

        it('should call onClose with analytics metadata when closed via outside click', async () => {
            const onClose = jest.fn();

            render(
                <AnalyticsListener channel="navigation" onEvent={onClose}>
                    <div data-testid="outside">Outside element</div>
                    <FlyoutMenuItem isDefaultOpen>
                        <FlyoutMenuItemTrigger>Trigger</FlyoutMenuItemTrigger>
                        <FlyoutMenuItemContent onClose={onClose}>
                            <ButtonMenuItem>Item 1</ButtonMenuItem>
                        </FlyoutMenuItemContent>
                    </FlyoutMenuItem>,
                </AnalyticsListener>
            );

            await userEvent.click(screen.getByTestId('outside'));

            expect(onClose.mock.calls[0][0].payload).toEqual({
                source: 'sideNav',
                actionSubject: 'flyoutMenu',
                action: 'closed',
                attributes: {
                    closeSource: 'outside-click',
                },
            });
        });

        it('should call onClose with analytics metadata when closed via clicking trigger', async () => {
            const onClose = jest.fn();

            render(
                <AnalyticsListener channel="navigation" onEvent={onClose}>
                    <FlyoutMenuItem isDefaultOpen>
                        <FlyoutMenuItemTrigger>Trigger</FlyoutMenuItemTrigger>
                        <FlyoutMenuItemContent onClose={onClose}>
                            <ButtonMenuItem>Item 1</ButtonMenuItem>
                        </FlyoutMenuItemContent>
                    </FlyoutMenuItem>,
                </AnalyticsListener>
            );

            await userEvent.click(screen.getByRole('button', { name: 'Trigger' }));

            expect(onClose.mock.calls[0][0].payload).toEqual({
                source: 'sideNav',
                actionSubject: 'flyoutMenu',
                action: 'closed',
                attributes: {
                    closeSource: 'outside-click',
                },
            });
        });
    });
});
