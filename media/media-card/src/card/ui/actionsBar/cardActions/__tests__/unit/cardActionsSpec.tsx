import React from 'react';
import { createEvent, fireEvent, render, type RenderResult, within } from '@testing-library/react';
import { screen } from '@testing-library/react';

import AnnotateIcon from '@atlaskit/icon/glyph/media-services/annotate';
import CrossIcon from '@atlaskit/icon/core/migration/close--cross';
import { AnalyticsListener, type UIAnalyticsEventHandler } from '@atlaskit/analytics-next';
import { FabricChannel } from '@atlaskit/analytics-listeners';

import { CardActionsView } from '../..';
import { type CardAction } from '../../../../../actions';

describe('CardActions', () => {
	const openAction = {
		label: 'Open',
		handler: jest.fn(),
	};
	const closeAction = {
		label: 'Close',
		handler: jest.fn(),
	};
	const annotateAction = {
		label: 'Annotate',
		handler: jest.fn(),
		// eslint-disable-next-line @atlaskit/design-system/no-legacy-icons -- TODO: no icon available (https://product-fabric.atlassian.net/browse/DSP-20852)
		icon: <AnnotateIcon size="small" label="annotate" />,
	};
	const deleteAction = {
		label: 'Delete',
		handler: jest.fn(),
		icon: <CrossIcon color="currentColor" LEGACY_size="small" label="delete" />,
	};
	const actionButtonTestId = 'media-card-primary-action';
	const dropdownItemsTestId = 'media-card-actions-menu-item';
	const menuActions = [openAction, closeAction, annotateAction, deleteAction];

	const openDropdownMenuIfExists = (card: RenderResult) => {
		const moreButton = card.queryByLabelText('more')?.closest('button');
		moreButton && fireEvent.click(moreButton);
	};

	const setup = (
		actions: CardAction[],
		triggerColor?: string,
		analyticsHandler?: UIAnalyticsEventHandler,
	) => {
		const TheCardActionsView = () => (
			<CardActionsView filename="test.jpg" actions={actions} triggerColor={triggerColor} />
		);
		const card = render(
			analyticsHandler ? (
				<AnalyticsListener channel={FabricChannel.media} onEvent={analyticsHandler}>
					<TheCardActionsView />
				</AnalyticsListener>
			) : (
				<TheCardActionsView />
			),
		);
		openDropdownMenuIfExists(card);

		const iconButtons = card.queryAllByTestId(actionButtonTestId);
		const dropdownMenu = screen.queryByTestId('media-card-actions-menu--content');
		const dropdownItems = card.queryAllByTestId(dropdownItemsTestId);

		return {
			card,
			iconButtons,
			dropdownMenu,
			dropdownItems,
		};
	};

	it('should render nothing given no actions', () => {
		const { card } = setup([]);

		expect(card.queryByTestId('prevent-click-through')).toBeNull();
	});

	/* Disabled because Dropdown now defers rendering children until layer is positioned. Integration test will replace these https://ecosystem.atlassian.net/browse/AK-5183
  it('should render only dropdown menu given one action with no icon', () => {
    const { iconButtons, dropdownMenu, dropdownItems } = setup([openAction]);

    expect(iconButtons).toHaveLength(0);
    expect(dropdownMenu).toHaveLength(1);
    expect(dropdownItems).toHaveLength(1);
    expect(dropdownItems.prop('children')).toEqual(openAction.label);

    expect(openAction.handler).not.toHaveBeenCalled();
  });

  it('should render only dropdown menu given multiple actions with no icon', () => {
    const { iconButtons, dropdownMenu, dropdownItems } = setup([
      openAction,
      closeAction,
    ]);

    expect(iconButtons).toHaveLength(0);
    expect(dropdownMenu).toHaveLength(1);
    expect(dropdownItems).toHaveLength(2);
  });
  */
	it('should render only icon button given one action with an icon', () => {
		const triggerColor = 'red';
		const { iconButtons, dropdownMenu, dropdownItems } = setup([annotateAction], triggerColor);

		expect(iconButtons).toHaveLength(1);
		const actionButton = iconButtons[0];
		const actionButtonIcon = within(actionButton).getByRole('img');
		expect(actionButtonIcon).toBeTruthy();
		expect(actionButton.style.color).toEqual(triggerColor);

		expect(dropdownMenu).toBeNull();
		expect(dropdownItems).toHaveLength(0);
	});

	it('should render two icon button given two actions with an icon', () => {
		const { iconButtons, dropdownMenu, dropdownItems } = setup([annotateAction, deleteAction]);

		expect(iconButtons).toHaveLength(2);
		expect(dropdownMenu).toBeNull();
		expect(dropdownItems).toHaveLength(0);
	});

	it('should add a label on the button of icon', () => {
		const { iconButtons } = setup([annotateAction, deleteAction]);

		expect(iconButtons).toHaveLength(2);
		expect(iconButtons[0]).toHaveAccessibleName('test.jpg — Annotate');
		expect(iconButtons[1]).toHaveAccessibleName('test.jpg — Delete');
	});

	/* Disabled because Dropdown now defers rendering children until layer is positioned. Integration test will replace these https://ecosystem.atlassian.net/browse/AK-5183
  it('should render one icon button and a dropdown menu given more than two actions', () => {
    const { iconButtons, dropdownMenu, dropdownItems } = setup(menuActions);

    expect(iconButtons).toHaveLength(1);
    expect(dropdownMenu).toHaveLength(1);
    expect(dropdownItems).toHaveLength(3);
  });
  */

	it('should call onToggle callback when dropdown menu trigger is clicked', () => {
		const onToggle = jest.fn();
		const card = render(<CardActionsView actions={menuActions} onToggle={onToggle} />);
		openDropdownMenuIfExists(card);

		expect(onToggle).toHaveBeenCalled();
	});

	it('should call action handler when icon button is pressed', () => {
		const triggerColor = 'green';
		const { iconButtons } = setup([annotateAction], triggerColor);

		iconButtons[0].click();

		expect(annotateAction.handler).toHaveBeenCalled();
	});
	/* Disabled because Dropdown now defers rendering children until layer is positioned. Integration test will replace these https://ecosystem.atlassian.net/browse/AK-5183
  it('should call action handler when item is pressed', () => {
    const triggerColor = 'some-color-string';
    const { dropdownItems } = setup([openAction], triggerColor);

    dropdownItems.simulate('click');

    expect(openAction.handler).toHaveBeenCalled();
  });
  */

	it('should pass supplied trigger color to dropdown menu trigger when there are multiple actions', async () => {
		const triggerColor = 'green';
		const { card } = setup(menuActions, triggerColor);
		const moreButton = card.getByLabelText('more').closest('div');

		fireEvent.click(moreButton!);

		const actions = screen.getAllByTestId(actionButtonTestId);
		actions.forEach((action) => {
			expect(action.style.color).toEqual(triggerColor);
		});
	});

	it('should pass supplied trigger color to delete button when there is a single action', () => {
		const triggerColor = 'blue';
		const { iconButtons } = setup([deleteAction], triggerColor);

		iconButtons.forEach((iconButton) => {
			expect(iconButton.style.color).toEqual(triggerColor);
		});
	});

	it('should prevent default of mousedown event to avoid changing currently focused element', () => {
		const { iconButtons } = setup([annotateAction], 'pink');

		const mockEvent = createEvent.mouseDown(iconButtons[0]);
		mockEvent.preventDefault = jest.fn();
		fireEvent(iconButtons[0], mockEvent);

		expect(mockEvent.preventDefault).toHaveBeenCalled();
	});

	describe('Analytics Events', () => {
		const clickIconButton = async (card: RenderResult, at: number) =>
			(await card.findAllByTestId(actionButtonTestId))[at].click();
		const clickDropdownItem = async (card: RenderResult, at: number) =>
			(await card.findAllByTestId(dropdownItemsTestId))[at].click();

		const matchingActionEventPayload = (actionSubjectId: string, label: string) =>
			expect.objectContaining({
				payload: {
					eventType: 'ui',
					action: 'clicked',
					actionSubject: 'button',
					actionSubjectId,
					attributes: { label },
				},
			});
		const matchingPrimaryAction = (label: string) =>
			matchingActionEventPayload('mediaCardPrimaryActionButton', label);
		const matchingSecondaryAction = (label: string) =>
			matchingActionEventPayload('mediaCardSecondaryActionButton', label);
		const matchingMenuItemAction = (label: string) =>
			matchingActionEventPayload('mediaCardDropDownMenuItem', label);

		it('should fire analytics event on every action clicked', async () => {
			const analyticsEventHandler: jest.Mock = jest.fn();
			const twoActions = [annotateAction, deleteAction];
			const { card: card1 } = setup(twoActions, undefined, analyticsEventHandler);
			await clickIconButton(card1, 0);
			await clickIconButton(card1, 1);

			expect(analyticsEventHandler).toBeCalledTimes(2);
			expect(analyticsEventHandler).toHaveBeenNthCalledWith(
				1,
				matchingPrimaryAction(twoActions[0].label),
				'media',
			);
			expect(analyticsEventHandler).toHaveBeenNthCalledWith(
				2,
				matchingSecondaryAction(twoActions[1].label),
				'media',
			);
		});

		it('should fire analytics event on every clicked menu item and dropdown menu', async () => {
			const matchingDropdownAnalyticsEvent = expect.objectContaining({
				payload: expect.objectContaining({
					eventType: 'ui',
					action: 'clicked',
					actionSubject: 'button',
					actionSubjectId: 'mediaCardDropDownMenu',
					attributes: {},
				}),
			});

			const analyticsEventHandler: jest.Mock = jest.fn();
			const fourActions = [annotateAction, openAction, deleteAction, closeAction];
			const { card: card2 } = setup(fourActions, undefined, analyticsEventHandler);
			// There is a click in dropdown from setup
			await clickDropdownItem(card2, 0); // dropdown[0] = fourActions[1]
			openDropdownMenuIfExists(card2);
			await clickDropdownItem(card2, 1); // dropdown[1] = fourActions[2]
			openDropdownMenuIfExists(card2);
			await clickDropdownItem(card2, 2); // dropdown[2] = fourActions[3]

			expect(analyticsEventHandler).toBeCalledTimes(6);
			expect(analyticsEventHandler).toHaveBeenNthCalledWith(
				1,
				matchingDropdownAnalyticsEvent,
				'media',
			);
			expect(analyticsEventHandler).toHaveBeenNthCalledWith(
				2,
				matchingMenuItemAction(fourActions[1].label),
				'media',
			);
			expect(analyticsEventHandler).toHaveBeenNthCalledWith(
				3,
				matchingDropdownAnalyticsEvent,
				'media',
			);
			expect(analyticsEventHandler).toHaveBeenNthCalledWith(
				4,
				matchingMenuItemAction(fourActions[2].label),
				'media',
			);
			expect(analyticsEventHandler).toHaveBeenNthCalledWith(
				5,
				matchingDropdownAnalyticsEvent,
				'media',
			);
			expect(analyticsEventHandler).toHaveBeenNthCalledWith(
				6,
				matchingMenuItemAction(fourActions[3].label),
				'media',
			);
		});
	});
});
