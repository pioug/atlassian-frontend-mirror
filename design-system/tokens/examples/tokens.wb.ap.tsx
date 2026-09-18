import { wb, type WorkbenchExample } from '@atlassian/workbench';

import ColorRolesVrExample from './0-color-roles.vr.ap';
import ColorAccentsExample from './1-color-accents';
import ElevationsExample from './2-elevations';
import ColorPairsExample from './3-color-pairs';
import SpacingVrVrExample from './4-spacing-vr.vr.ap';
import TypographyVrVrExample from './5-typography-vr.vr.ap';
import GetTokenValueWithHookExample from './6-get-token-value-with-hook';
import GetTokenValueWithClassExample from './7-get-token-value-with-class';
import ShapeVrVrExample from './8-shape-vr.vr.ap';
import ContrastCheckerExample from './9-contrast-checker';
import CustomThemeVrExample from './9-custom-theme.vr.ap';
import CurrentSurfaceVrVrExample from './10-current-surface-vr.vr.ap';
import ThemeShowcaseExample from './11-theme-showcase.ap';
import TypographyExample from './20-typography';

const ColorRolesVr: WorkbenchExample = wb(ColorRolesVrExample);

export default ColorRolesVr;
export const ColorAccents: WorkbenchExample = wb(ColorAccentsExample);
export const CurrentSurfaceVrVr: WorkbenchExample = wb(CurrentSurfaceVrVrExample);
export const Elevations: WorkbenchExample = wb(ElevationsExample);
export const Typography: WorkbenchExample = wb(TypographyExample);
export const ColorPairs: WorkbenchExample = wb(ColorPairsExample);
export const SpacingVrVr: WorkbenchExample = wb(SpacingVrVrExample);
export const TypographyVrVr: WorkbenchExample = wb(TypographyVrVrExample);
export const GetTokenValueWithHook: WorkbenchExample = wb(GetTokenValueWithHookExample);
export const GetTokenValueWithClass: WorkbenchExample = wb(GetTokenValueWithClassExample);
export const ShapeVrVr: WorkbenchExample = wb(ShapeVrVrExample);
export const ContrastChecker: WorkbenchExample = wb(ContrastCheckerExample);
export const CustomThemeVr: WorkbenchExample = wb(CustomThemeVrExample);
export const ThemeShowcase: WorkbenchExample = wb(ThemeShowcaseExample);
