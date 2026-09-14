import { wb, type WorkbenchExample } from '@atlassian/workbench';

import BasicVrExample from './0-basic.vr.ap';
import AppearanceVrExample from './1-appearance.vr.ap';
import NavigationLogoExample from './2-navigation-logo';
import SizesVrExample from './5-sizes.vr.ap';
import DefensiveStylingVrExample from './6-defensive-styling.vr.ap';

const BasicVr: WorkbenchExample = wb(BasicVrExample);

export default BasicVr;
export const AppearanceVr: WorkbenchExample = wb(AppearanceVrExample);
export const NavigationLogo: WorkbenchExample = wb(NavigationLogoExample);
export const SizesVr: WorkbenchExample = wb(SizesVrExample);
export const DefensiveStylingVr: WorkbenchExample = wb(DefensiveStylingVrExample);
