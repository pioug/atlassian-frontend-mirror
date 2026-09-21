import { wb, type WorkbenchExample } from '@atlassian/workbench';

import BasicExample from './01-basic';
import BasicWithZoomExample from './02-basic-with-zoom';
import BasicWithStylesExample from './03-basic-with-styles';
import BasicWithHookExample from './04-basic-with-hook';
import BasicStackingExample from './05-basic-stacking';

export const Basic: WorkbenchExample = wb(BasicExample);
export const BasicWithZoom: WorkbenchExample = wb(BasicWithZoomExample);
export const BasicWithStyles: WorkbenchExample = wb(BasicWithStylesExample);
export const BasicWithHook: WorkbenchExample = wb(BasicWithHookExample);
export const BasicStacking: WorkbenchExample = wb(BasicStackingExample);
