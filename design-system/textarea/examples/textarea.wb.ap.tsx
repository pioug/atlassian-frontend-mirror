import { wb, type WorkbenchExample } from '@atlassian/workbench';

import BasicVrExample from './0-basic.vr.ap';
import AppearanceVrExample from './1-appearance.vr.ap';
import ResizeVrExample from './2-resize.vr.ap';
import AnalyticsExample from './3-analytics';
import ReferenceExample from './4-reference';
import ValidationExample from './6-validation';
import TestingExample from './99-testing';

// Explicit named export Used to generate integration-test URLs.
export const Basic: WorkbenchExample = wb(BasicVrExample);
// Default export required by accessibility tooling.
export default Basic;
export const AppearanceVr: WorkbenchExample = wb(AppearanceVrExample);
// Named "Resize" to match the Workbench URL used by existing integration tests.
export const Resize: WorkbenchExample = wb(ResizeVrExample);
export const Analytics: WorkbenchExample = wb(AnalyticsExample);
export const Reference: WorkbenchExample = wb(ReferenceExample);
export const Validation: WorkbenchExample = wb(ValidationExample);
export const Testing: WorkbenchExample = wb(TestingExample);
