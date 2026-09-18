import { wb, type WorkbenchExample } from '@atlassian/workbench';

import BasicExample from './00-basic';
import ResponsiveExample from './01-responsive';
import UploadExample from './02-upload';
import LoadingViewExample from './03-loading-view';
import TestVrBasicExample from './test-vr-basic.vr.ap';

export const Basic: WorkbenchExample = wb(BasicExample);
export const Responsive: WorkbenchExample = wb(ResponsiveExample);
export const Upload: WorkbenchExample = wb(UploadExample);
export const LoadingView: WorkbenchExample = wb(LoadingViewExample);
export const TestVrBasic: WorkbenchExample = wb(TestVrBasicExample);
