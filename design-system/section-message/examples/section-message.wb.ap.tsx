import { wb, type WorkbenchExample } from '@atlassian/workbench';

import BasicExampleVrExample from './00-basic-example.vr.ap';
import AppearanceVariationsVrExample from './01-appearance-variations.vr.ap';
import CustomIconExample from './02-custom-icon';
import QuickCompareFixtureExample from './04-quick-compare-fixture';
import VariableWidthExample from './05-variable-width';
import ActionsVrExample from './06-actions.vr.ap';
import ExplicitFontStylesVrExample from './07-explicit-font-styles.vr.ap';
import DismissibleVrExample from './08-dismissible.vr.ap';
import HeadingLevelExample from './09-heading-level';
import TestingVrExample from './99-testing.vr.ap';
import SsrTestingExample from './100-ssr-testing';

// Explicit named export Used to generate integration-test URLs.
export const BasicExample: WorkbenchExample = wb(BasicExampleVrExample);
// Default export required by accessibility tooling.
export default BasicExample;
export const AppearanceVariationsVr: WorkbenchExample = wb(AppearanceVariationsVrExample);
export const CustomIcon: WorkbenchExample = wb(CustomIconExample);
export const QuickCompareFixture: WorkbenchExample = wb(QuickCompareFixtureExample);
export const VariableWidth: WorkbenchExample = wb(VariableWidthExample);
export const ActionsVr: WorkbenchExample = wb(ActionsVrExample);
export const ExplicitFontStylesVr: WorkbenchExample = wb(ExplicitFontStylesVrExample);
export const DismissibleVr: WorkbenchExample = wb(DismissibleVrExample);
export const HeadingLevel: WorkbenchExample = wb(HeadingLevelExample);
export const SsrTesting: WorkbenchExample = wb(SsrTestingExample);
// Named "Testing" to match the Workbench URL used by existing integration tests.
export const Testing: WorkbenchExample = wb(TestingVrExample);
