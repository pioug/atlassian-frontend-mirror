import {
  peopleMenuRendersTestCase,
  peopleMenuToggleTestCase,
  peopleMenuTriggerRendersTestCase,
} from '@atlassian/people-menu/in-product';

describe('People & Teams', () => {
  beforeEach(() => {
    cy.navigateTo(
      'people-and-teams',
      'people-menu',
      'default-with-mocked-data',
    );
  });

  peopleMenuTriggerRendersTestCase(
    '[data-testid="menu-people-primary-button"]',
  ).test(cy);

  peopleMenuToggleTestCase(
    '[data-testid="menu-people-primary-button"]',
    'menu',
  ).test(cy);

  peopleMenuRendersTestCase(
    '[data-testid="menu-people-primary-button"]',
    'menu',
  ).test(cy);
});
