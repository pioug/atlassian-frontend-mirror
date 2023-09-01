import React from 'react';
import { fireEvent, waitFor } from '@testing-library/react';
import { renderWithIntl } from '@atlaskit/media-test-helpers/renderWithIntl';
import '@testing-library/jest-dom/extend-expect';
import { css } from '@emotion/react';
import AvatarGroup from '..';
import { ElementName } from '../../../../../../constants';

describe('Element: Avatar Group', () => {
  const testId = 'smart-element-avatar-group';
  const authorsWithNoImages = [
    { name: 'Bob' },
    { name: 'Charlie' },
    { name: 'Spaghetti' },
  ];

  it('renders element', async () => {
    const { getByTestId } = renderWithIntl(
      <AvatarGroup items={authorsWithNoImages} />,
    );

    const element = await getByTestId(testId);
    const avatarGroup = await getByTestId(`${testId}--avatar-group`);

    expect(element).toBeTruthy();
    expect(
      element.getAttribute('data-smart-element-avatar-group'),
    ).toBeTruthy();
    expect(avatarGroup).toBeTruthy();
  });

  it('renders override css', async () => {
    const overrideCss = css`
      background-color: blue;
    `;
    const { getByTestId } = renderWithIntl(
      <AvatarGroup items={authorsWithNoImages} overrideCss={overrideCss} />,
    );

    const element = await getByTestId(testId);
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
    'correct prefix for a name in %s element tooltip',
    async (
      elementName: ElementName,
      showNamePrefix: boolean,
      prefix: string | undefined,
    ) => {
      const { getByTestId } = renderWithIntl(
        <AvatarGroup
          name={elementName}
          items={authorsWithNoImages}
          showNamePrefix={showNamePrefix}
        />,
      );

      const firstAvatarInGroup = await getByTestId(`${testId}--avatar-0`);

      fireEvent.mouseEnter(firstAvatarInGroup);

      const nameTooltip = await waitFor(() =>
        getByTestId(`${testId}--tooltip-0`),
      );

      let name = `Bob`;
      if (showNamePrefix && prefix) {
        name = `${prefix} ${name}`;
      }

      expect(nameTooltip).toHaveTextContent(name);
    },
  );

  it.each(
    authorsWithNoImages.map((author, index) => ({ name: author.name, index })),
  )(
    'no prefix for a name in element tooltip by default',
    async (author: { name: string; index: number }) => {
      const { getByTestId } = renderWithIntl(
        <AvatarGroup items={authorsWithNoImages} />,
      );

      const firstAvatarInGroup = await getByTestId(
        `${testId}--avatar-${author.index}`,
      );

      fireEvent.mouseEnter(firstAvatarInGroup);

      const nameTooltip = await waitFor(() =>
        getByTestId(`${testId}--tooltip-${author.index}`),
      );

      expect(nameTooltip).toHaveTextContent(
        authorsWithNoImages[author.index].name,
      );
    },
  );

  it('show Unassigned fallback by default if there are no assigned persons in Assigned Group', async () => {
    const { getByTestId } = renderWithIntl(
      <AvatarGroup items={[]} name={ElementName.AssignedToGroup} />,
    );

    const firstAvatarInGroup = await getByTestId(`${testId}--avatar-0`);
    expect(firstAvatarInGroup).toBeTruthy();

    fireEvent.mouseEnter(firstAvatarInGroup);

    const nameTooltip = await waitFor(() =>
      getByTestId(`${testId}--tooltip-0`),
    );

    expect(nameTooltip).toHaveTextContent('Unassigned');
  });

  it('hide Unassigned Fallback if there are no assigned persons in Assigned Group when showFallbackAvatar is false', async () => {
    const { queryByTestId } = await renderWithIntl(
      <AvatarGroup
        items={[]}
        name={ElementName.AssignedToGroup}
        showFallbackAvatar={false}
      />,
    );
    const AvatarGroupComponent = await queryByTestId(`${testId}--avatar-group`);
    expect(AvatarGroupComponent).not.toBeInTheDocument();
  });

  it.each([
    ElementName.OwnedByGroup,
    ElementName.AuthorGroup,
    ElementName.CollaboratorGroup,
  ])(
    'no Unassigned Fallback for %s element',
    async (elementName: ElementName) => {
      const { queryByTestId } = await renderWithIntl(
        <AvatarGroup items={[]} name={elementName} />,
      );
      const AvatarGroupComponent = await queryByTestId(
        `${testId}--avatar-group`,
      );
      expect(AvatarGroupComponent).not.toBeInTheDocument();
    },
  );
});
