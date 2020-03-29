import cases from 'jest-in-case';

import { NAVIGATION_CHANNEL } from '../../../../constants';
import { fireDrawerDismissedEvents } from '../../analytics';

describe('Analytics', () => {
  describe('fireDrawerDismissedEvents', () => {
    cases(
      'should add the correct actionSubjectId and fire the drawer dismissed event passed to it',
      ({ drawerName, name }) => {
        const mockEvent = {
          payload: {},
          update: jest.fn(() => mockEvent),
          fire: jest.fn(),
        };

        fireDrawerDismissedEvents(drawerName, mockEvent);

        expect(mockEvent.update).toHaveBeenCalledWith({
          actionSubjectId: name,
        });
        expect(mockEvent.fire).toHaveBeenCalledWith(NAVIGATION_CHANNEL);
      },
      [
        {
          name: 'quickSearchDrawer',
          drawerName: 'search',
        },
        {
          name: 'notificationsDrawer',
          drawerName: 'notification',
        },
        {
          name: 'createDrawer',
          drawerName: 'create',
        },
        {
          name: 'inviteDrawer',
          drawerName: 'invite',
        },
        {
          name: 'starDrawer',
          drawerName: 'starred',
        },
        {
          name: 'helpDrawer',
          drawerName: 'help',
        },
        {
          name: 'settingsDrawer',
          drawerName: 'settings',
        },
      ],
    );

    it('should fire a keyboardShortcut pressed event when a drawer is dismissed with the ESC key', () => {
      const mockEvent = {
        payload: {
          action: 'dismissed',
          actionSubject: 'drawer',
          attributes: {
            trigger: 'escKey',
          },
        },
        clone: jest.fn(() => clonedEvent),
        update: jest.fn(() => mockEvent),
        fire: jest.fn(),
      };

      const clonedEvent = { ...mockEvent };

      fireDrawerDismissedEvents('search', mockEvent);

      expect(mockEvent.clone).toHaveBeenCalled();
      expect(clonedEvent.update).toHaveBeenCalled();

      const updateFn = clonedEvent.update.mock.calls[0][0];

      expect(updateFn()).toEqual({
        action: 'pressed',
        actionSubject: 'keyboardShortcut',
        actionSubjectId: 'dismissDrawer',
        attributes: {
          key: 'Esc',
        },
      });
      expect(clonedEvent.fire).toHaveBeenCalledWith(NAVIGATION_CHANNEL);
    });

    it('should NOT fire a keyboardShortcut pressed event when a drawer is dismissed not using ESC key', () => {
      const mockEvent = {
        payload: {
          action: 'dismissed',
          actionSubject: 'drawer',
          attributes: {
            trigger: 'backButton',
          },
        },
        clone: jest.fn(() => clonedEvent),
        update: jest.fn(() => mockEvent),
        fire: jest.fn(),
      };

      const clonedEvent = { ...mockEvent };

      fireDrawerDismissedEvents('search', mockEvent);

      expect(mockEvent.clone).not.toHaveBeenCalled();

      // Should still fire the original dismissed drawer event
      expect(mockEvent.update).toHaveBeenCalled();
      expect(mockEvent.fire).toHaveBeenCalled();
    });
  });
});
