import { StatelessComponent } from 'react';
import createNamespaceContext, { Props } from './helper/createNamespaceContext';

export const PEOPLE_TEAMS_CONTEXT = 'peopleTeamsCtx';

export const PeopleTeamsAnalyticsContext: StatelessComponent<Props> = createNamespaceContext(
  PEOPLE_TEAMS_CONTEXT,
  'PeopleTeamsAnalyticsContext',
);
