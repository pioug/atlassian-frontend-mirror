import { recentWorkRendersTestCase } from '@atlassian/recent-work/in-product';

describe('Recent Work', () => {
  beforeEach(() => {
    cy.navigateTo('activity-platform', 'recent-work', 'basic');
  });

  recentWorkRendersTestCase('[data-testid="recent-work"]').test(cy);
});
