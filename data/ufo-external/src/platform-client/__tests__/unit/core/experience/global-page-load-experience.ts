import { UFOExperienceState } from '../../../../core/experience/experience-state';
import { GlobalPageLoadExperience } from '../../../../core/experience/global-page-load-experience';

describe('Global Page Load Experience tests', () => {
  test('GlobalPageLoadExperience instantiates without error', () => {
    expect(GlobalPageLoadExperience).not.toBe(null);
  });

  test('GlobalPageLoadExperience startPageLoad', async () => {
    expect(GlobalPageLoadExperience.state).toBe(UFOExperienceState.NOT_STARTED);
    await GlobalPageLoadExperience.startPageLoad('test');
    expect(GlobalPageLoadExperience.state).toBe(UFOExperienceState.STARTED);
  });

  test('GlobalPageLoadExperience should set and get the correct id', async () => {
    const pageId = 'newPageId';
    GlobalPageLoadExperience.setPageLoadId(pageId);
    const currentPageId = await GlobalPageLoadExperience.getId();
    expect(currentPageId).toEqual(pageId);
  });

  test('GlobalPageLoadExperience export data should not be null', async () => {
    const data = await GlobalPageLoadExperience.exportData();
    expect(data).not.toBe(null);
  });

  test('GlobalPageLoadExperience config should be updated', async () => {
    GlobalPageLoadExperience.updateConfig({ category: 'test-category' });
    expect(GlobalPageLoadExperience.config.category).toEqual('test-category');
  });
});
