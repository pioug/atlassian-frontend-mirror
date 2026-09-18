import { wb, type WorkbenchExample } from '@atlassian/workbench';

import BasicExample from './00-basic';
import LoadingAndErrorStatesExample from './02-loading-and-error-states';
import DifferentFileTypesExample from './03-different-file-types';
import CardActionsExample from './04-card-actions';
import InlineBasicExample from './05-inline-basic';
import InlineLoadingAndErrorStatesExample from './06-inline-loading-and-error-states';

export const Basic: WorkbenchExample = wb(BasicExample);
export const LoadingAndErrorStates: WorkbenchExample = wb(LoadingAndErrorStatesExample);
export const DifferentFileTypes: WorkbenchExample = wb(DifferentFileTypesExample);
export const CardActions: WorkbenchExample = wb(CardActionsExample);
export const InlineBasic: WorkbenchExample = wb(InlineBasicExample);
export const InlineLoadingAndErrorStates: WorkbenchExample = wb(InlineLoadingAndErrorStatesExample);
