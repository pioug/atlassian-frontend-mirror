import React from 'react';

import { act, createEvent, fireEvent, render } from '@testing-library/react';
import { IntlProvider } from 'react-intl';

import { getMockTeamClient } from '../../../examples/helper/util';
import ProfileClient from '../../../src/client/ProfileCardClient';
import { TeamProfileCardTriggerInternal as TeamProfileCardTrigger } from '../../components/Team/TeamProfileCardTrigger';
import { teamCardTriggered, teamRequestAnalytics } from '../../util/analytics';

const createAnalyticsEvent = jest.fn((body) => {
  // Mocking an implementation of this so tests will run successfully
  const event = {
    dummy: 'hello',
    clone: () => ({
      fire: () => undefined,
    }),
  };

  return event as any;
});

const defaultProps = {
  createAnalyticsEvent,
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
  members: [],
};

const mockResourceClient: unknown = {
  getTeamProfile: () => {
    return Promise.resolve(sampleProfile);
  },
};

function flexiTime(event: Record<string, any>) {
  return {
    ...event,
    attributes: {
      ...event.attributes,
      firedAt: expect.anything(),
    },
  };
}

describe('TeamProfileCardTrigger', () => {
  describe('Open and close conditions', () => {
    beforeEach(() => {
      createAnalyticsEvent.mockClear();
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

      expect(createAnalyticsEvent).toHaveBeenCalledWith(
        flexiTime(teamCardTriggered('click')),
      );

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

      expect(createAnalyticsEvent).toHaveBeenCalledWith(
        flexiTime(teamCardTriggered('hover')),
      );

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
    describe('Link type trigger click behaviour', () => {
      const setupClickTest = () => {
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

        return { trigger };
      };

      it('should preventDefault on basic click', () => {
        const { trigger } = setupClickTest();

        const basicClick = createEvent.click(trigger);
        basicClick.preventDefault = jest.fn();

        act(() => {
          fireEvent(trigger, basicClick);
        });

        expect(basicClick.preventDefault).toHaveBeenCalledTimes(1);
      });

      it('should not preventDefault on cmd+click', () => {
        const { trigger } = setupClickTest();

        const cmdClick = createEvent.click(trigger, { metaKey: true });
        cmdClick.preventDefault = jest.fn();

        act(() => {
          fireEvent(trigger, cmdClick);
        });

        expect(cmdClick.preventDefault).not.toHaveBeenCalled();
      });

      it('should not preventDefault on alt+click', () => {
        const { trigger } = setupClickTest();

        const altClick = createEvent.click(trigger, { altKey: true });
        altClick.preventDefault = jest.fn();

        act(() => {
          fireEvent(trigger, altClick);
        });

        expect(altClick.preventDefault).not.toHaveBeenCalled();
      });

      it('should not preventDefault on ctrl+click', () => {
        const { trigger } = setupClickTest();

        const ctrlClick = createEvent.click(trigger, { ctrlKey: true });
        ctrlClick.preventDefault = jest.fn();

        act(() => {
          fireEvent(trigger, ctrlClick);
        });

        expect(ctrlClick.preventDefault).not.toHaveBeenCalled();
      });

      it('should not preventDefault on shift+click', () => {
        const { trigger } = setupClickTest();

        const shiftClick = createEvent.click(trigger, { shiftKey: true });
        shiftClick.preventDefault = jest.fn();

        act(() => {
          fireEvent(trigger, shiftClick);
        });

        expect(shiftClick.preventDefault).not.toHaveBeenCalled();
      });
    });

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

  describe('Profile client analytics', () => {
    beforeEach(() => {
      createAnalyticsEvent.mockClear();
      jest.useFakeTimers();
    });

    it('Request success analytics', async () => {
      const MockTeamClient = getMockTeamClient({
        team: sampleProfile,
        timeout: 0,
        error: undefined,
        errorRate: 0,
      });

      const clientArgs = {
        cacheSize: 10,
        cacheMaxAge: 0,
        url: 'DUMMY',
      };

      const profileClient = new ProfileClient(clientArgs, {
        teamClient: new MockTeamClient(clientArgs),
      });

      const { getByTestId } = renderWithIntl(
        <TeamProfileCardTrigger
          {...defaultProps}
          resourceClient={profileClient}
          trigger="click"
        >
          <span data-testid="test-inner-trigger">This is the trigger</span>
        </TeamProfileCardTrigger>,
      );

      act(() => {
        fireEvent.click(getByTestId('team-profilecard-trigger-wrapper'));
        jest.runAllTimers();
      });

      await new Promise(setImmediate);

      expect(createAnalyticsEvent).toHaveBeenCalledWith(
        flexiTime(teamRequestAnalytics('triggered')),
      );

      expect(createAnalyticsEvent).toHaveBeenCalledWith(
        flexiTime(
          teamRequestAnalytics('succeeded', {
            duration: expect.anything(),
          }),
        ),
      );
    });

    it('Request failure analytics', async () => {
      const error = 'An error occurred';
      const MockTeamClient = getMockTeamClient({
        team: sampleProfile,
        timeout: 0,
        error,
        errorRate: 1,
      });

      const clientArgs = {
        cacheSize: 10,
        cacheMaxAge: 0,
        url: 'DUMMY',
      };

      const profileClient = new ProfileClient(clientArgs, {
        teamClient: new MockTeamClient(clientArgs),
      });

      const { getByTestId } = renderWithIntl(
        <TeamProfileCardTrigger
          {...defaultProps}
          resourceClient={profileClient}
          trigger="click"
        >
          <span data-testid="test-inner-trigger">This is the trigger</span>
        </TeamProfileCardTrigger>,
      );

      act(() => {
        fireEvent.click(getByTestId('team-profilecard-trigger-wrapper'));
        jest.runAllTimers();
      });

      await new Promise(setImmediate);

      expect(createAnalyticsEvent).toHaveBeenCalledWith(
        flexiTime(teamRequestAnalytics('triggered')),
      );

      expect(createAnalyticsEvent).toHaveBeenCalledWith(
        flexiTime(
          teamRequestAnalytics('failed', {
            duration: expect.anything(),
            errorReason: error,
          }),
        ),
      );
    });
  });
});
