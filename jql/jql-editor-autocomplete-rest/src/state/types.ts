import { Action } from 'react-sweet-state';
import type { Observable } from 'rxjs/Observable';

import { JqlEditorAutocompleteAnalyticsEvent } from '../analytics';
import {
  GetAutocompleteInitialData,
  JQLFieldResponse,
  JQLFunctionResponse,
} from '../common/types';

export type Store = {
  initialDataFetched: boolean;
  jqlSearchableFields$: Observable<JQLFieldResponse>;
  jqlOrderableFields$: Observable<JQLFieldResponse>;
  jqlFunctions$: Observable<JQLFunctionResponse>;
};

export type Actions = {
  load: (
    getInitialData: GetAutocompleteInitialData,
    createAndFireAnalyticsEvent: (
      payload: JqlEditorAutocompleteAnalyticsEvent,
    ) => void,
  ) => Action<Store>;
};
