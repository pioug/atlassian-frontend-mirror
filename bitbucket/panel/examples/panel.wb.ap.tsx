import { wb, type WorkbenchExample } from '@atlassian/workbench';

import { default as CollapsedExample } from './01-collapsed';
import { default as DefaultExpandedExample } from './02-default-expanded';
import { default as ComponentBasedHeaderExample } from './03-component-based-header';
import { default as ComponentWithScrollExample } from './04-component-with-scroll';
import { default as StatelessExample } from './05-stateless';

export const Collapsed: WorkbenchExample = wb(CollapsedExample);
export const DefaultExpanded: WorkbenchExample = wb(DefaultExpandedExample);
export const ComponentBasedHeader: WorkbenchExample = wb(ComponentBasedHeaderExample);
export const ComponentWithScroll: WorkbenchExample = wb(ComponentWithScrollExample);
export const Stateless: WorkbenchExample = wb(StatelessExample);
