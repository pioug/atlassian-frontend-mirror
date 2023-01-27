import {
  notificationDocumentToggleTestCase,
  notificationRendersTestCase,
} from '@atlassian/notification-common/in-product';

describe('Notifications', () => {
  beforeEach(() => {
    cy.navigateTo('notifications', 'notification-common', 'basic');
  });

  notificationRendersTestCase().test(cy);
  notificationDocumentToggleTestCase().test(cy);
});
