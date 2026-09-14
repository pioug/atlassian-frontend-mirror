import { wb, type WorkbenchExample } from '@atlassian/workbench';

import BasicDarkVrExample from './basic-dark.vr.ap';
import BasicLightVrExample from './basic-light.vr.ap';
import LinkReactResourceRouterExample from './link-react-resource-router';
import SubTreeThemingOutsideAppProviderVrExample from './sub-tree-theming-outside-app-provider.vr.ap';
import SubTreeThemingVrExample from './sub-tree-theming.vr.ap';

const BasicDarkVr: WorkbenchExample = wb(BasicDarkVrExample);

export default BasicDarkVr;
export const BasicLightVr: WorkbenchExample = wb(BasicLightVrExample);
export const LinkReactResourceRouter: WorkbenchExample = wb(LinkReactResourceRouterExample);
export const SubTreeThemingOutsideAppProviderVr: WorkbenchExample = wb(
	SubTreeThemingOutsideAppProviderVrExample,
);
export const SubTreeThemingVr: WorkbenchExample = wb(SubTreeThemingVrExample);
