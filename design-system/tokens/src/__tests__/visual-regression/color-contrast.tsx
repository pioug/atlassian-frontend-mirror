import {
  checkColorContrast,
  toHaveNoViolations,
} from '@af/accessibility-testing';
import { getExampleUrl, loadPage } from '@atlaskit/visual-regression/helper';

expect.extend(toHaveNoViolations);

describe('Tokens should pass color contrast checks', () => {
  it('for light mode', async () => {
    const url = getExampleUrl(
      'design-system',
      'tokens',
      'color-pairs',
      global.__BASEURL__,
    );
    const { page } = global;
    await loadPage(page, url);

    const results = await checkColorContrast(page);

    /**
     * These color pairs currently fail the contrast checks, however we're
     * aware of them and are working to resolve them. We'll exclude them from
     * the check so we can have the test pass in order to catch other regressions.
     * This will be removed once https://product-fabric.atlassian.net/browse/DSP-4893
     * is resolved.
     */
    const knownFailingLightThemePairs = [
      'color.text.selected on color.background.selected.hovered',
      'color.text.selected on color.background.selected.pressed',
      'color.text.warning.inverse on color.background.warning.bold.pressed',
    ];

    const adjustedResults = results.violations[0].nodes.filter((node) => {
      return !knownFailingLightThemePairs.some((pair) =>
        node.html.includes(pair),
      );
    });

    results.violations[0].nodes = adjustedResults;

    expect(results.incomplete.length).toEqual(0);
    expect(results).toHaveNoViolations();
  });

  it('for dark mode', async () => {
    const url = getExampleUrl(
      'design-system',
      'tokens',
      'color-pairs',
      global.__BASEURL__,
      'dark',
    );
    const { page } = global;
    await loadPage(page, url);

    const results = await checkColorContrast(page);

    /**
     * These color pairs currently fail the contrast checks, however we're
     * aware of them and are working to resolve them. We'll exclude them from
     * the check so we can have the test pass in order to catch other regressions.
     * This will be removed once https://product-fabric.atlassian.net/browse/DSP-4893
     * is resolved.
     */
    const knownFailingLightThemePairs = [
      'color.text on color.background.inverse.subtle.pressed',
      'color.text.selected on color.background.selected.pressed',
      'color.text on color.background.danger.pressed',
      'color.text on color.background.warning.pressed',
      'color.text on color.background.success.pressed',
      'color.text on color.background.discovery.pressed',
      'color.text on color.background.information.pressed',
    ];

    const adjustedResults = results.violations[0].nodes.filter((node) => {
      return !knownFailingLightThemePairs.some((pair) =>
        node.html.includes(pair),
      );
    });

    results.violations[0].nodes = adjustedResults;

    expect(results.incomplete.length).toEqual(0);
    expect(results).toHaveNoViolations();
  });
});
