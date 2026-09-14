import { wb, type WorkbenchExample } from '@atlassian/workbench';

import BasicVrExample from './0-basic.vr.ap';
import AppearanceVrExample from './1-appearance.vr.ap';
import ResizeVrExample from './2-resize.vr.ap';
import AnalyticsExample from './3-analytics';
import ReferenceExample from './4-reference';
import ValidationExample from './6-validation';
import TestingExample from './99-testing';

const BasicVr: WorkbenchExample = wb(BasicVrExample);

export default BasicVr;
export const AppearanceVr: WorkbenchExample = wb(AppearanceVrExample);
export const ResizeVr: WorkbenchExample = wb(ResizeVrExample);
export const Analytics: WorkbenchExample = wb(AnalyticsExample);
export const Reference: WorkbenchExample = wb(ReferenceExample);
export const Validation: WorkbenchExample = wb(ValidationExample);
export const Testing: WorkbenchExample = wb(TestingExample);
