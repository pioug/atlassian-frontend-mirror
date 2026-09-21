import StaticThemeLoadingSsrExample from './static-theme-loading.ssr';

/**
 * Workbench entry point for the React 19 streaming SSR fixture.
 *
 * Keep the implementation in the `.ssr.tsx` module so it remains directly
 * reusable by the SSR test; Workbench discovers this `.wb.ap.tsx` wrapper.
 */
export default StaticThemeLoadingSsrExample;
