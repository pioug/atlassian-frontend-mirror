export { default as GlobalQuickSearch } from './components/GlobalQuickSearchWrapper';
export type { Props } from './components/GlobalQuickSearchWrapper';

export type { Config } from './api/configureSearchClients';

export type { GlobalSearchPrefetchedResults } from './api/prefetchResults';

export { default as GlobalSearchPrefetchedResultsProvider } from './components/PrefetchedResultsProvider';

export { withFeedbackButton } from './components/feedback/withFeedbackButton';
export type { FeedbackCollectorProps } from './components/feedback/withFeedbackButton';

export {
  default as SearchSessionProvider,
  injectSearchSession,
} from './components/SearchSessionProvider';
export type { SearchSessionProps } from './components/SearchSessionProvider';
