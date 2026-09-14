import { wb, type WorkbenchExample } from '@atlassian/workbench';

import BasicExample from './0-basic.vr.ap';
import MaxExample from './1-max';
import CustomizationExample from './4-customization.vr.ap';
import ContainersExample from './5-containers.vr.ap';
import VisualUpliftsExample from './6-badge-visual-uplifts-behind-ff.vr.ap';
import NewEntrypointExample from './7-new-entrypoint';
import TestingExample from './99-testing';

const Basic: WorkbenchExample = wb(BasicExample);

export default Basic;
export const Max: WorkbenchExample = wb(MaxExample);
export const Customization: WorkbenchExample = wb(CustomizationExample);
export const Containers: WorkbenchExample = wb(ContainersExample);
export const VisualUplifts: WorkbenchExample = wb(VisualUpliftsExample);
export const NewEntrypoint: WorkbenchExample = wb(NewEntrypointExample);
export const Testing: WorkbenchExample = wb(TestingExample);
