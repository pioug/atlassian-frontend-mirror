import Loadable from 'react-loadable';

export const loadAtlassianSwitcher = () =>
  import(
    /* webpackChunkName: "@ak-switcher-chunk-atlassian-switcher" */ './atlassian-switcher'
  );

export const loadJiraSwitcher = () =>
  import(
    /* webpackChunkName: "@ak-switcher-chunk-jira-switcher" */ './jira-switcher'
  );

export const loadConfluenceSwitcher = () =>
  import(
    /* webpackChunkName: "@ak-switcher-chunk-confluence-switcher" */ './confluence-switcher'
  );

export const loadGenericSwitcher = () =>
  import(
    /* webpackChunkName: "@ak-switcher-chunk-generic-switcher" */ './generic-switcher'
  );

export const loadTrelloSwitcher = () =>
  import(
    /* webpackChunkName: "@ak-switcher-chunk-trello-switcher" */ './trello-switcher'
  );

export const AtlassianSwitcherLoader = Loadable({
  loader: loadAtlassianSwitcher,
  loading: () => null,
});

export const JiraSwitcherLoader = Loadable({
  loader: loadJiraSwitcher,
  loading: () => null,
});

export const ConfluenceSwitcherLoader = Loadable({
  loader: loadConfluenceSwitcher,
  loading: () => null,
});

export const GenericSwitcherLoader = Loadable({
  loader: loadGenericSwitcher,
  loading: () => null,
});

export const TrelloSwitcherLoader = Loadable({
  loader: loadTrelloSwitcher,
  loading: () => null,
});
