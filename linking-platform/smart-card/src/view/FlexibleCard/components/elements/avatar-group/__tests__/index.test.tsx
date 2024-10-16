import React from 'react';
import { fireEvent, screen } from '@testing-library/react';
import { renderWithIntl } from '@atlaskit/media-test-helpers/renderWithIntl';
import '@testing-library/jest-dom';
// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { css } from '@emotion/react';
import AvatarGroup from '..';
import { ElementName } from '../../../../../../constants';

describe('Element: Avatar Group', () => {
	const testId = 'smart-element-avatar-group';
	const authorsWithNoImages = [{ name: 'Bob' }, { name: 'Charlie' }, { name: 'Spaghetti' }];

	it('renders element', async () => {
		renderWithIntl(<AvatarGroup items={authorsWithNoImages} />);

		const element = screen.getByTestId(testId);
		const avatarGroup = screen.getByTestId(`${testId}--avatar-group`);

		expect(element).toBeTruthy();
		expect(element.getAttribute('data-smart-element-avatar-group')).toBeTruthy();
		expect(avatarGroup).toBeTruthy();
	});

	it('renders override css', async () => {
		const overrideCss = css({
			backgroundColor: 'blue',
		});
		renderWithIntl(<AvatarGroup items={authorsWithNoImages} overrideCss={overrideCss} />);

		const element = screen.getByTestId(testId);
		expect(element).toHaveStyleDeclaration('background-color', 'blue');
	});

	it.each([
		[ElementName.AssignedToGroup, true, 'Assigned to'],
		[ElementName.OwnedByGroup, true, 'Owned by'],
		[ElementName.AuthorGroup, true, 'Created by'],
		[ElementName.CollaboratorGroup, true, undefined],
		[ElementName.AssignedToGroup, false, undefined],
		[ElementName.OwnedByGroup, false, undefined],
		[ElementName.AuthorGroup, false, undefined],
		[ElementName.CollaboratorGroup, false, undefined],
	])(
		'correct prefix for a name in %s element tooltip if there is only one person',
		async (elementName: ElementName, showNamePrefix: boolean, prefix: string | undefined) => {
			renderWithIntl(
				<AvatarGroup
					name={elementName}
					items={[{ name: 'Bob' }]}
					showNamePrefix={showNamePrefix}
				/>,
			);

			const firstAvatarInGroup = screen.getByTestId(`${testId}--avatar-0`);

			fireEvent.mouseEnter(firstAvatarInGroup);

			const nameTooltip = await screen.findByTestId(`${testId}--tooltip-0`);

			let name = `Bob`;
			if (showNamePrefix && prefix) {
				name = `${prefix} ${name}`;
			}

			expect(nameTooltip).toHaveTextContent(name);
		},
	);

	it('no prefix for a name in element tooltip by default if there is only one person', async () => {
		renderWithIntl(<AvatarGroup items={[{ name: 'Bob' }]} />);

		const firstAvatarInGroup = screen.getByTestId(`${testId}--avatar-0`);

		fireEvent.mouseEnter(firstAvatarInGroup);

		const nameTooltip = await screen.findByTestId(`${testId}--tooltip-0`);

		expect(nameTooltip).toHaveTextContent('Bob');
	});

	it('no prefix for a name in element tooltip by default if there is more than one person', async () => {
		renderWithIntl(<AvatarGroup items={[{ name: 'Bob' }]} />);

		const firstAvatarInGroup = screen.getByTestId(`${testId}--avatar-0`);

		fireEvent.mouseEnter(firstAvatarInGroup);

		const nameTooltip = await screen.findByTestId(`${testId}--tooltip-0`);

		expect(nameTooltip).toHaveTextContent('Bob');
	});

	it.each(authorsWithNoImages.map((author, index) => ({ name: author.name, index })))(
		'no prefix for a name in element tooltip if there are more than one person',
		async (author: { name: string; index: number }) => {
			renderWithIntl(
				<AvatarGroup
					name={ElementName.AssignedToGroup}
					items={authorsWithNoImages}
					showNamePrefix={true}
				/>,
			);
			const avatarInGroup = screen.getByTestId(`${testId}--avatar-${author.index}`);
			fireEvent.mouseEnter(avatarInGroup);
			const nameTooltip = await screen.findByTestId(`${testId}--tooltip-${author.index}`);
			expect(nameTooltip).toHaveTextContent(authorsWithNoImages[author.index].name);
		},
	);

	it('show Unassigned fallback by default if there are no assigned persons in Assigned Group', async () => {
		renderWithIntl(<AvatarGroup items={[]} name={ElementName.AssignedToGroup} />);

		const firstAvatarInGroup = screen.getByTestId(`${testId}--avatar-0`);
		expect(firstAvatarInGroup).toBeTruthy();

		fireEvent.mouseEnter(firstAvatarInGroup);

		const nameTooltip = await screen.findByTestId(`${testId}--tooltip-0`);

		expect(nameTooltip).toHaveTextContent('Unassigned');
	});

	it('hide Unassigned Fallback if there are no assigned persons in Assigned Group when showFallbackAvatar is false', async () => {
		renderWithIntl(
			<AvatarGroup items={[]} name={ElementName.AssignedToGroup} showFallbackAvatar={false} />,
		);
		const AvatarGroupComponent = screen.queryByTestId(`${testId}--avatar-group`);
		expect(AvatarGroupComponent).not.toBeInTheDocument();
	});

	it.each([ElementName.OwnedByGroup, ElementName.AuthorGroup, ElementName.CollaboratorGroup])(
		'no Unassigned Fallback for %s element',
		async (elementName: ElementName) => {
			renderWithIntl(<AvatarGroup items={[]} name={elementName} />);
			const AvatarGroupComponent = screen.queryByTestId(`${testId}--avatar-group`);
			expect(AvatarGroupComponent).not.toBeInTheDocument();
		},
	);
});
