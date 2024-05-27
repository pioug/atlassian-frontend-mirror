import React from 'react';

import { act, render, screen } from '@testing-library/react';
import { IntlProvider } from 'react-intl-next';

import { type WidthObserver } from '@atlaskit/width-detector';

import * as Image from '../../../../../examples-helpers/images.json';

import UserType, { USER_TYPE_TEST_ID, type UserProps } from './index';

let mockInnerSetWidth: Function | undefined;

const setWidth = (width: number) =>
  typeof mockInnerSetWidth === 'function'
    ? mockInnerSetWidth(width)
    : undefined;

type WidthObserverType = typeof WidthObserver;

jest.mock('@atlaskit/width-detector', () => {
  return {
    WidthObserver: (props => {
      mockInnerSetWidth = props.setWidth;
      return null;
    }) as WidthObserverType,
  };
});

describe('User Type', () => {
  const setup = (props: UserProps[] = []) => {
    return render(
      <IntlProvider locale="en">
        <UserType users={props} />
      </IntlProvider>,
    );
  };

  it('renders with display name as Unassigned when no parameters passed', async () => {
    const { queryByTestId } = setup();

    const el = queryByTestId(USER_TYPE_TEST_ID);

    expect(el).toBeInTheDocument();
    expect(el).toHaveTextContent('Unassigned');
  });

  it('renders with the passed in displayName', async () => {
    const user = [
      {
        displayName: 'UNCLE_BOB',
      },
    ];
    const { queryByTestId } = setup(user);

    const el = queryByTestId(USER_TYPE_TEST_ID);

    expect(el).toBeInTheDocument();
    expect(el).toHaveTextContent('UNCLE_BOB');
  });

  it('renders with the passed in avatarSource as img src', async () => {
    const user = [
      {
        displayName: 'UNCLE_BOB',
        avatarSource: Image.trello,
      },
    ];
    setup(user);

    const userContainer = screen.queryByTestId(USER_TYPE_TEST_ID);
    const img = screen.getByTestId(`${USER_TYPE_TEST_ID}--avatar--image`);

    expect(userContainer).toBeInTheDocument();
    expect(img).toBeInTheDocument();
    expect(img).toHaveAttribute('src', Image.trello);
  });

  it('renders with avatarGroup when provided information of multiple users', async () => {
    const users = [
      {
        displayName: 'UNCLE_BEN',
      },
      {
        displayName: 'AUNT_MAY',
      },
      {
        displayName: 'PETER_PARKER',
      },
      {
        displayName: 'MATT_MURDOCK',
      },
      {
        displayName: 'MILES_MORALES',
      },
    ];

    setup(users);

    const usersContainer = screen.queryByTestId(
      `${USER_TYPE_TEST_ID}--avatar-group`,
    );

    expect(usersContainer).toBeInTheDocument();
    expect(screen.queryByTestId(USER_TYPE_TEST_ID)).toBeNull();
  });

  it('renders avatarGroup with displayNames of maxCount - 1 avatar images if number of users is more than maxCount', async () => {
    const users = [
      {
        displayName: 'UNCLE_BOB',
      },
      {
        displayName: 'UNCLE_BEN',
      },
      {
        displayName: 'AUNT_MAY',
      },
      {
        displayName: 'PETER_PARKER',
      },
      {
        displayName: 'MATT_MURDOCK',
      },
      {
        displayName: 'MILES_MORALES',
      },
    ];
    const maxCount = 5;

    setup(users);

    const usersContainer = screen.queryByTestId(
      `${USER_TYPE_TEST_ID}--avatar-group`,
    );

    expect(usersContainer).toHaveTextContent('UNCLE_BOB');
    expect(usersContainer).toHaveTextContent('UNCLE_BEN');
    expect(usersContainer).toHaveTextContent('AUNT_MAY');
    expect(usersContainer).toHaveTextContent('PETER_PARKER');
    expect(usersContainer).toHaveTextContent(`+${users.length - maxCount + 1}`);
  });

  describe('when column width changes', () => {
    const assertMaxCount = (
      userCount: number,
      availableWidth: number,
      expectedAvatarCircles: number,
    ) => {
      const users = new Array(userCount)
        .fill(null)
        .map(i => ({ displayName: `UNCLE_BOB_${i}` }));

      const { getByTestId } = setup(users);

      act(() => setWidth(availableWidth));

      expect(
        getByTestId(`${USER_TYPE_TEST_ID}--avatar-group`).children,
      ).toHaveLength(expectedAvatarCircles);
    };

    it('should return 1 avatar image when width is not enough to display any images', () => {
      assertMaxCount(5, 15, 1);
    });

    it('should return 1 avatar image when width is just enough to display an image', () => {
      assertMaxCount(5, 29, 1);
    });

    it('should return 1 avatar image when width is exactly enough to display 2 images (48px)', () => {
      assertMaxCount(5, 48, 1);
    });

    it('should return 2 avatar images with enough width', () => {
      assertMaxCount(5, 50, 2);
    });

    it('should return 5 avatar images with enough width', () => {
      assertMaxCount(5, 110, 5);
    });

    it('should return 5 avatar images with 10 users and enough width', () => {
      assertMaxCount(10, 1000, 5);
    });
  });
});
