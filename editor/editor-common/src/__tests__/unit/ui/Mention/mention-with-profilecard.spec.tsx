import React from 'react';

import { render, waitFor } from '@testing-library/react';
import { IntlProvider } from 'react-intl-next';

import * as FeatureFlags from '@atlaskit/platform-feature-flags';
import ProfileCardClient from '@atlaskit/profilecard/client';
import { getMockProfileClient } from '@atlaskit/profilecard/mocks';

import type { Props } from '../../../../ui/Mention/mention-with-profilecard';
import MentionWithProfileCard from '../../../../ui/Mention/mention-with-profilecard';

describe('<MentionWithProfileCard />', () => {
  const mockProfileClient = getMockProfileClient(ProfileCardClient, 0);

  const mockProfilecardProvider = {
    cloudId: 'test-cloud-id',
    resourceClient: mockProfileClient,
    getActions: jest.fn(),
  };

  const mockOnClick = jest.fn();
  const mockOnMouseEnter = jest.fn();
  const mockOnMouseLeave = jest.fn();

  const mockProps = {
    id: 'test-id',
    text: '@John Smith',
    accessLevel: 'CONTAINER',
    profilecardProvider: mockProfilecardProvider,
    onClick: mockOnClick,
    onMouseEnter: mockOnMouseEnter,
    onMouseLeave: mockOnMouseLeave,
  };

  const mockPropsWithoutTextSymbol = {
    ...mockProps,
    text: 'User',
  };

  const renderMentionWithProfileCard = (props: Props) => {
    return render(
      <IntlProvider locale="en">
        <MentionWithProfileCard {...props} />
      </IntlProvider>,
    );
  };

  const getBooleanFFSpy = jest.spyOn(FeatureFlags, 'getBooleanFF');
  beforeAll(() => {
    getBooleanFFSpy.mockImplementation(
      (flag) => flag === 'platform.profile-card-trigger-next',
    );
  });

  test('should pass correct props to ProfileCardTrigger component', async () => {
    const { getByTestId } = renderMentionWithProfileCard(mockProps);

    await waitFor(() => {
      expect(getByTestId('mention-with-profilecard-trigger')).toBeTruthy();
      expect(getByTestId('mention-with-profilecard-trigger')).toHaveAttribute(
        'aria-label',
        'John Smith',
      );
    });
  });

  test('should pass correct props to ProfileCardTrigger component without text symbol', async () => {
    const { getByTestId } = renderMentionWithProfileCard(
      mockPropsWithoutTextSymbol,
    );

    await waitFor(() => {
      expect(getByTestId('mention-with-profilecard-trigger')).toBeTruthy();
      expect(getByTestId('mention-with-profilecard-trigger')).toHaveAttribute(
        'aria-label',
        'User',
      );
    });
  });
});
