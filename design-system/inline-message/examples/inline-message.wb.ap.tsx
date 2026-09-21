import { wb, type WorkbenchExample } from '@atlassian/workbench';

import BasicVrExample from './01-basic.vr.ap';
import DifferentTypesVrExample from './02-different-types.vr.ap';
import TypeConnectivityExample from './03-type-connectivity';
import TypeConfirmationExample from './04-type-confirmation';
import TypeErrorExample from './05-type-error';
import TypeWarningExample from './06-type-warning';
import TypeInfoExample from './07-type-info';
import WithLongTextExample from './08-with-long-text';
import WithDialogOnTheRightExample from './09-with-dialog-on-the-right';
import InModalExample from './10-in-modal';
import FallbackPlacementsVrExample from './11-fallback-placements.vr.ap';
import IconSpacingExample from './12-icon-spacing';
import TestingVrExample from './99-testing.vr.ap';
import TestingTopLayerFocusExample from './testing-top-layer-focus';

// Explicit named export Used to generate integration-test URLs.
export const Basic: WorkbenchExample = wb(BasicVrExample);

// Default export required by accessibility tooling.
export default Basic;
export const DifferentTypesVr: WorkbenchExample = wb(DifferentTypesVrExample);
export const TypeConnectivity: WorkbenchExample = wb(TypeConnectivityExample);
export const TypeConfirmation: WorkbenchExample = wb(TypeConfirmationExample);
export const TypeError: WorkbenchExample = wb(TypeErrorExample);
export const TypeWarning: WorkbenchExample = wb(TypeWarningExample);
export const TypeInfo: WorkbenchExample = wb(TypeInfoExample);
export const WithLongText: WorkbenchExample = wb(WithLongTextExample);
export const WithDialogOnTheRight: WorkbenchExample = wb(WithDialogOnTheRightExample);
export const InModal: WorkbenchExample = wb(InModalExample);
export const FallbackPlacementsVr: WorkbenchExample = wb(FallbackPlacementsVrExample);
export const IconSpacing: WorkbenchExample = wb(IconSpacingExample);
// Named "Testing" to match the Workbench URL used by existing integration tests.
export const Testing: WorkbenchExample = wb(TestingVrExample);
export const TestingTopLayerFocus: WorkbenchExample = wb(TestingTopLayerFocusExample);
