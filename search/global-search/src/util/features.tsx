import { ABTest, DEFAULT_AB_TEST } from '../api/CrossProductSearchClient';
import memoizeOne from 'memoize-one';
import deepEqual from 'deep-equal';

const FASTER_SEARCH_EXPERIMENT = 'faster-search';
const SEARCH_EXTENSIONS_COMPLEX_EXPERIMENT = 'search-extensions-complex';
const SPACEBALLS_EXPERIMENT = 'spaceballs';

const isInFasterSearchExperiment = (abTest: ABTest): boolean => {
  return abTest.experimentId === FASTER_SEARCH_EXPERIMENT;
};

const isInSearchExtensionsComplexExperiment = (abTest: ABTest): boolean => {
  return abTest.experimentId === SEARCH_EXTENSIONS_COMPLEX_EXPERIMENT;
};

const isInSpaceballsExperiment = (abTest: ABTest): boolean => {
  return abTest.experimentId === SPACEBALLS_EXPERIMENT;
};

export interface CommonFeatures {
  abTest: ABTest;
  complexSearchExtensionsEnabled: boolean;
  spaceballsExperimentEnabled: boolean;
}

export interface ConfluenceFeatures extends CommonFeatures {
  useUrsForBootstrapping: boolean;
  isAutocompleteEnabled: boolean;
  isNavAutocompleteEnabled: boolean;
}

export interface JiraFeatures extends CommonFeatures {
  disableJiraPreQueryPeopleSearch: boolean;
  isInFasterSearchExperiment: boolean;
}

export const DEFAULT_FEATURES: ConfluenceFeatures & JiraFeatures = {
  useUrsForBootstrapping: false,
  isAutocompleteEnabled: false,
  isNavAutocompleteEnabled: false,
  complexSearchExtensionsEnabled: false,
  disableJiraPreQueryPeopleSearch: false,
  isInFasterSearchExperiment: false,
  spaceballsExperimentEnabled: false,
  abTest: DEFAULT_AB_TEST,
};

export interface FeaturesParameters {
  abTest: ABTest;
  useUrsForBootstrapping: boolean;
  disableJiraPreQueryPeopleSearch: boolean;
  enablePreQueryFromAggregator: boolean;
  isAutocompleteEnabled: boolean;
  isNavAutocompleteEnabled: boolean;
}

export const createFeatures: (
  parameters: FeaturesParameters,
) => ConfluenceFeatures & JiraFeatures = memoizeOne(
  ({
    abTest,
    useUrsForBootstrapping,
    disableJiraPreQueryPeopleSearch,
    enablePreQueryFromAggregator,
    isAutocompleteEnabled,
    isNavAutocompleteEnabled,
  }) => {
    return {
      abTest,
      useUrsForBootstrapping,
      disableJiraPreQueryPeopleSearch,
      enablePreQueryFromAggregator,
      isInFasterSearchExperiment: isInFasterSearchExperiment(abTest),
      isAutocompleteEnabled,
      isNavAutocompleteEnabled,
      complexSearchExtensionsEnabled: isInSearchExtensionsComplexExperiment(
        abTest,
      ),
      spaceballsExperimentEnabled: isInSpaceballsExperiment(abTest),
    };
  },
  deepEqual,
);
