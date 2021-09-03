import React from 'react';

import { act, createEvent, fireEvent, render } from '@testing-library/react';
import { IntlProvider } from 'react-intl';

import TeamProfileCard from '../../components/Team/TeamProfileCard';
import {
  errorRetryClicked,
  moreActionsClicked,
  moreMembersClicked,
  teamActionClicked,
  teamAvatarClicked,
  teamProfileCardRendered,
} from '../../util/analytics';

const analyticsListener = jest.fn();

const analytics = (fn: (duration: number) => Record<string, any>) =>
  analyticsListener(fn(SAMPLE_DURATION));

const SAMPLE_DURATION = 3.14159265;

const defaultProps = {
  analytics,
  viewProfileLink: 'http://example.com/team/123',
};

const renderWithIntl = (component: React.ReactNode) => {
  return render(<IntlProvider locale="en">{component}</IntlProvider>);
};

// Returns an integer x such that min <= x < max
function randInt(min: number, max: number) {
  return Math.floor(Math.random() * (max - min)) + min;
}

function flexiTime(event: Record<string, any>) {
  return {
    ...event,
    attributes: {
      ...event.attributes,
      firedAt: expect.anything(),
    },
  };
}

const generateMembers = (n: number) => {
  const members = [];
  while (n-- > 0) {
    members.push({
      id: Math.random().toString(),
      fullName: Math.random().toString(),
      avatarUrl: '',
    });
  }

  return members;
};

describe('TeamProfileCard', () => {
  beforeEach(() => {
    analyticsListener.mockReset();
  });

  it('should render spinner when isLoading is true', () => {
    const { getByTestId } = renderWithIntl(
      <TeamProfileCard isLoading {...defaultProps} />,
    );

    const spinner = getByTestId('team-profilecard-spinner');

    expect(spinner).toBeDefined();
    expect(analyticsListener).toHaveBeenCalledWith(
      flexiTime(
        teamProfileCardRendered('spinner', { duration: SAMPLE_DURATION }),
      ),
    );
  });

  describe('Error state', () => {
    it('should render error content when hasError is true', () => {
      const { getByTestId } = renderWithIntl(
        <TeamProfileCard
          hasError
          {...defaultProps}
          clientFetchProfile={() => null}
        />,
      );

      const errorView = getByTestId('team-profilecard-error');

      expect(errorView).toBeDefined();
      expect(analyticsListener).toHaveBeenCalledWith(
        flexiTime(
          teamProfileCardRendered('error', {
            duration: SAMPLE_DURATION,
            hasRetry: true,
          }),
        ),
      );
    });

    it('should call clientFetchProfile when re-fetch button is clicked', () => {
      const clientFetchProfile = jest.fn();
      const { getByTestId } = renderWithIntl(
        <TeamProfileCard
          hasError
          {...defaultProps}
          clientFetchProfile={clientFetchProfile}
        />,
      );

      act(() => {
        fireEvent.click(getByTestId('client-fetch-profile-button'));
      });

      expect(clientFetchProfile).toHaveBeenCalledTimes(1);
      expect(analyticsListener).toHaveBeenCalledWith(
        flexiTime(errorRetryClicked({ duration: SAMPLE_DURATION })),
      );
    });
  });

  it('should send content analytics when rendering successfully', () => {
    const onClick = jest.fn();
    renderWithIntl(
      <TeamProfileCard
        {...defaultProps}
        team={{
          id: '123',
          displayName: 'Team name',
          description: 'A team',
          members: [],
        }}
        viewProfileOnClick={onClick}
      />,
    );

    expect(analyticsListener).toHaveBeenCalledWith(
      flexiTime(
        teamProfileCardRendered('content', {
          duration: SAMPLE_DURATION,
          numActions: 1,
          memberCount: 0,
          includingYou: false,
          descriptionLength: 6,
          titleLength: 9,
        }),
      ),
    );
  });

  describe('Action buttons', () => {
    describe('Click behaviour (cmd+click, ctrl+click, etc)', () => {
      const setupClickTest = () => {
        const onClick = jest.fn();
        const { getByText } = renderWithIntl(
          <TeamProfileCard
            {...defaultProps}
            team={{
              id: '123',
              displayName: 'Team name',
              description: 'A team',
            }}
            viewProfileOnClick={onClick}
          />,
        );

        const button = getByText('View profile');

        return {
          onClick,
          button,
        };
      };

      it('should call onClick for basic click', () => {
        const { button, onClick } = setupClickTest();

        const basicClick = createEvent.click(button);
        basicClick.preventDefault = jest.fn();

        act(() => {
          fireEvent(button, basicClick);
        });

        expect(onClick).toHaveBeenCalledTimes(1);
        expect(basicClick.preventDefault).toHaveBeenCalledTimes(1);
      });

      it('should not call onClick for cmd+click', () => {
        const { button, onClick } = setupClickTest();

        const commandClick = createEvent.click(button, { metaKey: true });
        commandClick.preventDefault = jest.fn();

        act(() => {
          fireEvent(button, commandClick);
        });

        expect(onClick).not.toHaveBeenCalled();
        expect(commandClick.preventDefault).not.toHaveBeenCalled();
      });

      it('should not call onClick for alt+click', () => {
        const { button, onClick } = setupClickTest();

        const altClick = createEvent.click(button, { altKey: true });
        altClick.preventDefault = jest.fn();

        act(() => {
          fireEvent(button, altClick);
        });

        expect(onClick).not.toHaveBeenCalled();
        expect(altClick.preventDefault).not.toHaveBeenCalled();
      });

      it('should not call onClick for ctrl+click', () => {
        const { button, onClick } = setupClickTest();

        const controlClick = createEvent.click(button, { ctrlKey: true });
        controlClick.preventDefault = jest.fn();

        act(() => {
          fireEvent(button, controlClick);
        });

        expect(onClick).not.toHaveBeenCalled();
        expect(controlClick.preventDefault).not.toHaveBeenCalled();
      });

      it('should not call onClick for shift+click', () => {
        const { button, onClick } = setupClickTest();

        const shiftClick = createEvent.click(button, { shiftKey: true });
        shiftClick.preventDefault = jest.fn();

        act(() => {
          fireEvent(button, shiftClick);
        });

        expect(onClick).not.toHaveBeenCalled();
        expect(shiftClick.preventDefault).not.toHaveBeenCalled();
      });
    });

    describe('View profile button', () => {
      it('should call viewProfileOnClick on click if provided', () => {
        const onClick = jest.fn();
        const { getByText } = renderWithIntl(
          <TeamProfileCard
            {...defaultProps}
            team={{
              id: '123',
              displayName: 'Team name',
              description: 'A team',
            }}
            viewProfileOnClick={onClick}
          />,
        );

        const button = getByText('View profile');

        act(() => {
          fireEvent.click(button);
        });

        expect(onClick).toHaveBeenCalledTimes(1);
        expect(analyticsListener).toHaveBeenCalledWith(
          flexiTime(
            teamActionClicked({
              duration: SAMPLE_DURATION,
              hasHref: true,
              hasOnClick: true,
              index: 0,
              actionId: 'view-profile',
            }),
          ),
        );
      });

      it('should have appropriate href', () => {
        const link = 'http://example.com/team/abcd';
        const { getByText } = renderWithIntl(
          <TeamProfileCard
            {...defaultProps}
            team={{
              id: '123',
              displayName: 'Team name',
              description: 'A team',
            }}
            viewProfileLink={link}
          />,
        );

        expect(getByText('View profile').closest('a')).toHaveAttribute(
          'href',
          link,
        );
      });
    });
    it('should not display more button if no actions provided', () => {
      const { getByText, queryByTestId } = renderWithIntl(
        <TeamProfileCard
          {...defaultProps}
          team={{
            id: '123',
            displayName: 'Team name',
            description: 'A team',
          }}
        />,
      );

      expect(queryByTestId('more-actions-button')).toBe(null);

      expect(getByText('View profile')).toBeDefined();
    });

    it('should not display more button if one action is provided', () => {
      const callback = jest.fn();
      const { getByText, queryByTestId } = renderWithIntl(
        <TeamProfileCard
          {...defaultProps}
          team={{
            id: '123',
            displayName: 'Team name',
            description: 'A team',
          }}
          actions={[{ label: 'Extra button', callback }]}
        />,
      );

      expect(queryByTestId('more-actions-button')).toBe(null);

      const actionButton = getByText('Extra button');

      expect(getByText('View profile')).toBeDefined();
      expect(actionButton).toBeDefined();

      act(() => {
        fireEvent.click(actionButton);
      });

      expect(callback).toHaveBeenCalledTimes(1);
    });

    it('should open dropdown when more button clicked', () => {
      const firstCallback = jest.fn();
      const secondCallback = jest.fn();
      const { getByTestId, getByText, queryByText } = renderWithIntl(
        <TeamProfileCard
          {...defaultProps}
          team={{
            id: '123',
            displayName: 'Team name',
            description: 'A team',
          }}
          actions={[
            {
              label: 'First extra',
              id: 'first-extra',
              callback: firstCallback,
            },
            {
              label: 'Second extra',
              id: 'second-extra',
              callback: secondCallback,
            },
          ]}
        />,
      );

      const moreButton = getByTestId('more-actions-button');

      expect(getByText('View profile')).toBeDefined();
      expect(moreButton).toBeDefined();

      expect(getByText('First extra')).toBeDefined();

      expect(queryByText('Second extra')).toBe(null);

      act(() => {
        fireEvent.click(moreButton);
      });

      expect(analyticsListener).toHaveBeenCalledWith(
        flexiTime(
          moreActionsClicked({ duration: SAMPLE_DURATION, numActions: 3 }),
        ),
      );

      expect(getByText('First extra')).toBeDefined();

      expect(getByText('Second extra')).toBeDefined();

      act(() => {
        fireEvent.click(getByText('Second extra'));
      });

      expect(analyticsListener).toHaveBeenCalledWith(
        flexiTime(
          teamActionClicked({
            duration: SAMPLE_DURATION,
            hasHref: false,
            hasOnClick: true,
            index: 2,
            actionId: 'second-extra',
          }),
        ),
      );

      expect(firstCallback).toHaveBeenCalledTimes(0);
      expect(secondCallback).toHaveBeenCalledTimes(1);

      act(() => {
        fireEvent.click(getByText('First extra'));
      });

      expect(analyticsListener).toHaveBeenCalledWith(
        flexiTime(
          teamActionClicked({
            duration: SAMPLE_DURATION,
            hasHref: false,
            hasOnClick: true,
            index: 1,
            actionId: 'first-extra',
          }),
        ),
      );

      expect(firstCallback).toHaveBeenCalledTimes(1);
      expect(secondCallback).toHaveBeenCalledTimes(1);
    });
  });

  describe('Member count', () => {
    it('should include the "Team" label', () => {
      const numMembers = Math.floor(randInt(0, 100));
      const { getByText } = renderWithIntl(
        <TeamProfileCard
          {...defaultProps}
          team={{
            id: '123',
            displayName: 'Some people group',
            description: 'This is a description',
            members: generateMembers(numMembers),
          }}
        />,
      );

      // The component with the member count must start with "Team"
      expect(getByText(/^Team .* members?$/)).toBeDefined();
    });

    it('should show 0 member team', () => {
      const { getByText } = renderWithIntl(
        <TeamProfileCard
          {...defaultProps}
          team={{
            id: '123',
            displayName: 'Team name',
            description: 'A team',
            members: [],
          }}
        />,
      );

      expect(getByText('0 members', { exact: false })).toBeDefined();
    });

    it('should show number of members for number <50', () => {
      const numMembers = randInt(1, 50);
      const { getByText } = renderWithIntl(
        <TeamProfileCard
          {...defaultProps}
          team={{
            id: '123',
            displayName: 'Team name',
            description: 'A team',
            members: generateMembers(numMembers),
          }}
        />,
      );

      // Must be "member" not "members" to account for "1 member"
      expect(getByText(new RegExp(`${numMembers} members?`))).toBeDefined();
    });

    it('should show estimate for teams with >50 members', () => {
      const numMembers = randInt(50, 150);
      const { getByText } = renderWithIntl(
        <TeamProfileCard
          {...defaultProps}
          team={{
            id: '123',
            displayName: 'Team name',
            description: 'A team',
            members: generateMembers(numMembers),
          }}
        />,
      );

      // Must be "member" not "members" to account for "1 member"
      expect(getByText('50+ members', { exact: false })).toBeDefined();
    });

    it('should show member count including you for teams with <50 members', () => {
      const numMembers = randInt(1, 50);
      const members = generateMembers(numMembers);

      const { getByText } = renderWithIntl(
        <TeamProfileCard
          {...defaultProps}
          team={{
            id: '123',
            displayName: 'Team name',
            description: 'A team',
            members,
          }}
          viewingUserId={members[randInt(0, numMembers)].id}
        />,
      );

      // Must be "member" not "members" to account for "1 member"
      expect(
        getByText(new RegExp(`${numMembers} members?, including you`)),
      ).toBeDefined();
    });

    it('should show estimate including you for teams with >50 members', () => {
      const numMembers = randInt(50, 150);
      const members = generateMembers(numMembers);
      const { getByText } = renderWithIntl(
        <TeamProfileCard
          {...defaultProps}
          team={{
            id: '123',
            displayName: 'Team name',
            description: 'A team',
            members,
          }}
          viewingUserId={members[randInt(0, numMembers)].id}
        />,
      );

      // Must be "member" not "members" to account for "1 member"
      expect(
        getByText('50+ members, including you', { exact: false }),
      ).toBeDefined();
    });

    it('should be able to expand to find a list of all members', () => {
      const NUM_MEMBERS = 11;
      const members = generateMembers(NUM_MEMBERS - 1).concat({
        id: 'abcd',
        fullName: 'Simple name',
        avatarUrl: '',
      });

      const { getByText, queryByText } = renderWithIntl(
        <TeamProfileCard
          {...defaultProps}
          team={{
            id: '123',
            displayName: 'Team name',
            description: 'A team',
            members,
          }}
        />,
      );

      expect(queryByText('Simple name')).toBe(null);

      expect(getByText('+3')).toBeDefined();

      act(() => {
        fireEvent.click(getByText('+3'));
      });

      expect(getByText('Simple name')).toBeDefined();

      expect(analyticsListener).toHaveBeenCalledWith(
        flexiTime(
          moreMembersClicked({
            duration: SAMPLE_DURATION,
            memberCount: NUM_MEMBERS,
          }),
        ),
      );
    });
  });

  describe('Avatar group', () => {
    beforeEach(() => {
      analyticsListener.mockReset();
    });

    it('should show expected href on avatars', () => {
      const members = generateMembers(3);

      const generateUserLink = (userId: string) =>
        `https://example.com/user/${userId}`;

      const { getByTestId } = renderWithIntl(
        <TeamProfileCard
          {...defaultProps}
          team={{
            id: '123',
            displayName: 'Team name',
            description: 'A team',
            members,
          }}
          generateUserLink={generateUserLink}
        />,
      );

      const expectedLink = generateUserLink(members[0].id);

      expect(
        getByTestId('profilecard-avatar-group--avatar-0').firstChild,
      ).toHaveAttribute('href', expectedLink);
    });

    it('should fire analytics on avatar click', () => {
      const members = generateMembers(3);

      const { getByTestId } = renderWithIntl(
        <TeamProfileCard
          {...defaultProps}
          team={{
            id: '123',
            displayName: 'Team name',
            description: 'A team',
            members,
          }}
        />,
      );

      act(() => {
        fireEvent.click(
          getByTestId('profilecard-avatar-group--avatar-0')
            .firstChild as Element,
        );
      });

      expect(analyticsListener).toHaveBeenCalledWith(
        flexiTime(
          teamAvatarClicked({
            duration: SAMPLE_DURATION,
            hasOnClick: false,
            hasHref: false,
            index: 0,
          }),
        ),
      );
    });

    it('should fire analytics on avatar click when href is provided', () => {
      const members = generateMembers(3);

      const generateUserLink = (userId: string) =>
        `https://example.com/user/${userId}`;

      const { getByTestId } = renderWithIntl(
        <TeamProfileCard
          {...defaultProps}
          team={{
            id: '123',
            displayName: 'Team name',
            description: 'A team',
            members,
          }}
          generateUserLink={generateUserLink}
        />,
      );

      act(() => {
        fireEvent.click(
          getByTestId('profilecard-avatar-group--avatar-0')
            .firstChild as Element,
        );
      });

      expect(analyticsListener).toHaveBeenCalledWith(
        flexiTime(
          teamAvatarClicked({
            duration: SAMPLE_DURATION,
            hasOnClick: false,
            hasHref: true,
            index: 0,
          }),
        ),
      );
    });

    it('should fire analytics on avatar click when onClick is provided and call onClick', () => {
      const members = generateMembers(3);

      const onUserClick = jest.fn();

      const { getByTestId } = renderWithIntl(
        <TeamProfileCard
          {...defaultProps}
          team={{
            id: '123',
            displayName: 'Team name',
            description: 'A team',
            members,
          }}
          onUserClick={onUserClick}
        />,
      );

      act(() => {
        fireEvent.click(
          getByTestId('profilecard-avatar-group--avatar-0')
            .firstChild as Element,
        );
      });

      expect(analyticsListener).toHaveBeenCalledWith(
        flexiTime(
          teamAvatarClicked({
            duration: SAMPLE_DURATION,
            hasOnClick: true,
            hasHref: false,
            index: 0,
          }),
        ),
      );

      expect(onUserClick).toHaveBeenCalledWith(
        members[0].id,
        expect.anything(),
      );
    });

    it('should fire analytics on avatar click when onClick and link are provided and call onClick', () => {
      const members = generateMembers(3);

      const onUserClick = jest.fn();

      const generateUserLink = (userId: string) =>
        `https://example.com/user/${userId}`;

      const { getByTestId } = renderWithIntl(
        <TeamProfileCard
          {...defaultProps}
          team={{
            id: '123',
            displayName: 'Team name',
            description: 'A team',
            members,
          }}
          onUserClick={onUserClick}
          generateUserLink={generateUserLink}
        />,
      );

      act(() => {
        fireEvent.click(
          getByTestId('profilecard-avatar-group--avatar-0')
            .firstChild as Element,
        );
      });

      expect(analyticsListener).toHaveBeenCalledWith(
        flexiTime(
          teamAvatarClicked({
            duration: SAMPLE_DURATION,
            hasOnClick: true,
            hasHref: true,
            index: 0,
          }),
        ),
      );

      expect(onUserClick).toHaveBeenCalledWith(
        members[0].id,
        expect.anything(),
      );

      const expectedLink = generateUserLink(members[0].id);

      expect(
        getByTestId('profilecard-avatar-group--avatar-0').firstChild,
      ).toHaveAttribute('href', expectedLink);
    });
  });
});
