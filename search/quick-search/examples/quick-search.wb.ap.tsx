import { wb, type WorkbenchExample } from '@atlassian/workbench';

import NavigationExampleExample from './0-Navigation-Example';
import ObjectResultsExample from './1-Object-Results';
import AutocompleteExample from './10-Autocomplete';
import PeopleResultsExample from './2-People-Results';
import ContainerResultsExample from './3-Container-Results';
import CustomResultsExample from './4-Custom-Results';
import KeyboardNavigationWithNestedDOMExample from './5-Keyboard-Navigation-with-Nested-DOM';
import AnalyticsLoggingExample from './6-Analytics-Logging';
import ResultsWithOnSelectedIconExample from './8-Results-with-onSelectedIcon';
import InputControlsExample from './9-Input-Controls';

export const NavigationExample: WorkbenchExample = wb(NavigationExampleExample);
export const ObjectResults: WorkbenchExample = wb(ObjectResultsExample);
export const Autocomplete: WorkbenchExample = wb(AutocompleteExample);
export const PeopleResults: WorkbenchExample = wb(PeopleResultsExample);
export const ContainerResults: WorkbenchExample = wb(ContainerResultsExample);
export const CustomResults: WorkbenchExample = wb(CustomResultsExample);
export const KeyboardNavigationWithNestedDOM: WorkbenchExample = wb(
	KeyboardNavigationWithNestedDOMExample,
);
export const AnalyticsLogging: WorkbenchExample = wb(AnalyticsLoggingExample);
export const ResultsWithOnSelectedIcon: WorkbenchExample = wb(ResultsWithOnSelectedIconExample);
export const InputControls: WorkbenchExample = wb(InputControlsExample);
