import React from 'react';

import { act, fireEvent, render } from '@testing-library/react';
import { IntlProvider } from 'react-intl';

import ProfileClient from '../../../src/api/ProfileCardClient';
import TeamProfileCardTrigger from '../../../src/components/TeamProfileCardTrigger';

const defaultProps = {
  viewProfileLink: 'http://example.com/team/123',
  teamId: '123',
  orgId: 'DUMMY-ORG-ID',
};

const renderWithIntl = (component: React.ReactNode) => {
  return render(<IntlProvider locale="en">{component}</IntlProvider>);
};

const sampleProfile = {
  id: '123',
  displayName: 'The cool cats',
  description: 'A team',
};

const mockResourceClient: unknown = {
  getTeamProfile: () => {
    return Promise.resolve(sampleProfile);
  },
};

describe('TeamProfileCardTrigger', () => {
  describe('Open and close conditions', () => {
    beforeEach(() => {
      jest.useFakeTimers();
    });

    it('should open "click" trigger after click', () => {
      const { getByTestId, queryByTestId } = renderWithIntl(
        <>
          <TeamProfileCardTrigger
            {...defaultProps}
            resourceClient={mockResourceClient as ProfileClient}
            trigger="click"
          >
            <span data-testid="test-inner-trigger">This is the trigger</span>
          </TeamProfileCardTrigger>
          <span data-testid="outer-content">Hello</span>
        </>,
      );

      expect(queryByTestId('team-profilecard')).toBe(null);

      expect(getByTestId('test-inner-trigger')).toBeDefined();
      expect(getByTestId('team-profilecard-trigger-wrapper')).toBeDefined();

      act(() => {
        fireEvent.click(getByTestId('team-profilecard-trigger-wrapper'));
        jest.runAllTimers();
      });

      expect(getByTestId('team-profilecard')).toBeDefined();

      act(() => {
        fireEvent.click(getByTestId('outer-content'));
        jest.runAllTimers();
      });

      expect(queryByTestId('team-profilecard')).toBe(null);
    });

    it('should open "hover" trigger after mouse over', () => {
      const { getByTestId, queryByTestId } = renderWithIntl(
        <TeamProfileCardTrigger
          {...defaultProps}
          resourceClient={mockResourceClient as ProfileClient}
          trigger="hover"
        >
          <span data-testid="test-inner-trigger">This is the trigger</span>
        </TeamProfileCardTrigger>,
      );

      expect(queryByTestId('team-profilecard')).toBe(null);

      expect(getByTestId('test-inner-trigger')).toBeDefined();
      expect(getByTestId('team-profilecard-trigger-wrapper')).toBeDefined();

      act(() => {
        fireEvent.mouseOver(getByTestId('team-profilecard-trigger-wrapper'));
        jest.runAllTimers();
      });

      expect(getByTestId('team-profilecard')).toBeDefined();

      act(() => {
        fireEvent.mouseLeave(getByTestId('team-profilecard-trigger-wrapper'));
        jest.runAllTimers();
      });

      expect(queryByTestId('team-profilecard')).toBe(null);
    });

    it('should open "hover-click" trigger after click', () => {
      const { getByTestId, queryByTestId } = renderWithIntl(
        <>
          <TeamProfileCardTrigger
            {...defaultProps}
            resourceClient={mockResourceClient as ProfileClient}
            trigger="hover-click"
          >
            <span data-testid="test-inner-trigger">This is the trigger</span>
          </TeamProfileCardTrigger>
          <span data-testid="outer-content">Hello</span>
        </>,
      );

      expect(queryByTestId('team-profilecard')).toBe(null);

      expect(getByTestId('test-inner-trigger')).toBeDefined();
      expect(getByTestId('team-profilecard-trigger-wrapper')).toBeDefined();

      act(() => {
        fireEvent.click(getByTestId('team-profilecard-trigger-wrapper'));
        jest.runAllTimers();
      });

      expect(getByTestId('team-profilecard')).toBeDefined();

      act(() => {
        fireEvent.click(getByTestId('outer-content'));
        jest.runAllTimers();
      });

      expect(queryByTestId('team-profilecard')).toBe(null);
    });

    it('should open "hover-click" trigger after mouse over', () => {
      const { getByTestId, queryByTestId } = renderWithIntl(
        <TeamProfileCardTrigger
          {...defaultProps}
          resourceClient={mockResourceClient as ProfileClient}
          trigger="hover-click"
        >
          <span data-testid="test-inner-trigger">This is the trigger</span>
        </TeamProfileCardTrigger>,
      );

      expect(queryByTestId('team-profilecard')).toBe(null);

      expect(getByTestId('test-inner-trigger')).toBeDefined();
      expect(getByTestId('team-profilecard-trigger-wrapper')).toBeDefined();

      act(() => {
        fireEvent.mouseOver(getByTestId('team-profilecard-trigger-wrapper'));
        jest.runAllTimers();
      });

      expect(getByTestId('team-profilecard')).toBeDefined();

      act(() => {
        fireEvent.mouseLeave(getByTestId('team-profilecard-trigger-wrapper'));
        jest.runAllTimers();
      });

      expect(queryByTestId('team-profilecard')).toBe(null);
    });
  });

  describe('Trigger wrapping', () => {
    it('should wrap in an anchor tag for link type triggers', () => {
      const viewProfileOnClick = jest.fn();

      const { getByTestId } = renderWithIntl(
        <TeamProfileCardTrigger
          {...defaultProps}
          resourceClient={mockResourceClient as ProfileClient}
          triggerLinkType="link"
          trigger="hover-click"
          viewProfileOnClick={viewProfileOnClick}
        >
          <span data-testid="test-inner-trigger">This is the trigger</span>
        </TeamProfileCardTrigger>,
      );

      const trigger = getByTestId('team-profilecard-trigger-wrapper');

      expect(trigger.nodeName).toBe('A');

      expect(getByTestId('test-inner-trigger').parentElement).toBe(trigger);

      act(() => {
        fireEvent.click(trigger);
      });

      expect(viewProfileOnClick).not.toHaveBeenCalled();
    });

    it('should wrap in an anchor tag for none type triggers', () => {
      const { getByTestId } = renderWithIntl(
        <TeamProfileCardTrigger
          {...defaultProps}
          resourceClient={mockResourceClient as ProfileClient}
          triggerLinkType="none"
          trigger="hover-click"
        >
          <span data-testid="test-inner-trigger">This is the trigger</span>
        </TeamProfileCardTrigger>,
      );

      const trigger = getByTestId('team-profilecard-trigger-wrapper');

      expect(trigger.nodeName).toBe('SPAN');

      expect(getByTestId('test-inner-trigger').parentElement).toBe(trigger);
    });

    it('should wrap in an anchor tag for clickable link type triggers', () => {
      const viewProfileOnClick = jest.fn();

      const { getByTestId } = renderWithIntl(
        <TeamProfileCardTrigger
          {...defaultProps}
          resourceClient={mockResourceClient as ProfileClient}
          triggerLinkType="clickable-link"
          trigger="hover-click"
          viewProfileOnClick={viewProfileOnClick}
        >
          <span data-testid="test-inner-trigger">This is the trigger</span>
        </TeamProfileCardTrigger>,
      );

      const trigger = getByTestId('team-profilecard-trigger-wrapper');

      expect(trigger.nodeName).toBe('A');

      expect(getByTestId('test-inner-trigger').parentElement).toBe(trigger);

      act(() => {
        fireEvent.click(trigger);
      });

      expect(viewProfileOnClick).toHaveBeenCalled();
    });
  });

  describe('Error handling', () => {
    it('should show error when resource client throws', async () => {
      const getTeamProfile = jest.fn();
      const resourceClient: unknown = {
        getTeamProfile,
      };

      jest.useFakeTimers();

      const { findByTestId, getByTestId } = renderWithIntl(
        <TeamProfileCardTrigger
          {...defaultProps}
          resourceClient={resourceClient as ProfileClient}
          trigger="click"
        >
          <span data-testid="test-inner-trigger">This is the trigger</span>
        </TeamProfileCardTrigger>,
      );

      getTeamProfile.mockImplementationOnce(() => {
        return Promise.reject('Error');
      });

      act(() => {
        fireEvent.click(getByTestId('team-profilecard-trigger-wrapper'));
        jest.runAllTimers();
      });

      expect(getByTestId('team-profilecard')).toBeDefined();
      const errorSection = await findByTestId('team-profilecard-error');
      expect(errorSection).toBeDefined();
    });

    it('should re-fetch when clicking refresh button', async () => {
      const getTeamProfile = jest.fn();
      const resourceClient: unknown = {
        getTeamProfile,
      };

      jest.useFakeTimers();

      const {
        findByTestId,
        findByText,
        getByTestId,
        getByText,
      } = renderWithIntl(
        <TeamProfileCardTrigger
          {...defaultProps}
          resourceClient={resourceClient as ProfileClient}
          trigger="click"
        >
          <span data-testid="test-inner-trigger">This is the trigger</span>
        </TeamProfileCardTrigger>,
      );

      getTeamProfile.mockImplementationOnce(() => {
        return Promise.reject('Error');
      });

      act(() => {
        fireEvent.click(getByTestId('team-profilecard-trigger-wrapper'));
        jest.runAllTimers();
      });

      expect(getByTestId('team-profilecard')).toBeDefined();
      const errorSection = await findByTestId('team-profilecard-error');
      expect(errorSection).toBeDefined();

      expect(getTeamProfile).toHaveBeenCalledTimes(1);

      getTeamProfile.mockImplementationOnce(() => {
        return Promise.resolve(sampleProfile);
      });

      const refreshButton = getByText('Try again');

      expect(refreshButton).not.toBe(null);

      act(() => {
        fireEvent.click(refreshButton!);
        jest.runAllTimers();
      });

      expect(await findByText(sampleProfile.displayName)).toBeDefined();
      expect(getTeamProfile).toHaveBeenCalledTimes(2);
    });
  });
});
