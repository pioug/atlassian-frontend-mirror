import { wb, type WorkbenchExample } from '@atlassian/workbench';

import CreatingThemesExample from './creating-themes';
import GlobalThemeExample from './global-theme';
import LayersExample from './layers';
import ThemingComponentsExample from './theming-components';
import WithEmotionThemeProviderExample from './with-emotion-theme-provider';

const CreatingThemes: WorkbenchExample = wb(CreatingThemesExample);

export default CreatingThemes;
export const GlobalTheme: WorkbenchExample = wb(GlobalThemeExample);
export const Layers: WorkbenchExample = wb(LayersExample);
export const ThemingComponents: WorkbenchExample = wb(ThemingComponentsExample);
export const WithEmotionThemeProvider: WorkbenchExample = wb(WithEmotionThemeProviderExample);
