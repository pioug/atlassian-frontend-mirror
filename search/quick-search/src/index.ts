import * as resultTypes from './components/Results';

/*
 This component is exported in two different ways.

 v0: A legacy, backwards compatible API from when quick-search was living inside @atlaskit/navigation. This API
 is deprecated and will be removed in the next major version.

 v1: An API tailored to a stand-alone quick-search component.
*/

// API v0 Exports:
export { default as AkNavigationItemGroup } from './components/ResultItem/ResultItemGroup';
export { default as AkNavigationItem } from './components/ResultItem/ResultItem';
export { default as AkQuickSearch } from './components/QuickSearch';
export { default as AkSearch } from './components/Search/Search';
export { resultTypes as quickSearchResultTypes };

// API v1 Exports:
export { default as QuickSearch } from './components/QuickSearch';
export { default as ResultItemGroup } from './components/ResultItem/ResultItemGroup';
export {
  default as ObjectResult,
  Props as ObjectResultProps,
} from './components/Results/ObjectResult';
export {
  default as PersonResult,
  Props as PersonResultProps,
} from './components/Results/PersonResult';
export {
  default as ContainerResult,
  Props as ContainerResultProps,
} from './components/Results/ContainerResult';
export { default as ResultBase } from './components/Results/ResultBase';
// types
export { Props as ResultBaseProps } from './components/Results/ResultBase';
export { CancelableEvent, ResultData } from './components/Results/types';
