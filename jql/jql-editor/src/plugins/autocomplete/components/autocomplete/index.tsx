import React, { useCallback } from 'react';

import { EventType } from '@atlaskit/jql-editor-common';

import { Action, ActionSubject } from '../../../../analytics';
import {
  useAutocompleteLoading,
  useAutocompleteOptions,
  useStoreActions,
} from '../../../../state';
import AutocompleteDropdown from '../autocomplete-dropdown';
import {
  AutocompleteAnalyticsAttributes,
  AutocompleteProps,
  SelectableAutocompleteOption,
} from '../types';

const Autocomplete = ({ keymap, onClick }: AutocompleteProps) => {
  const [options] = useAutocompleteOptions();
  const [loading] = useAutocompleteLoading();

  const [, { createAndFireAnalyticsEvent }] = useStoreActions();

  const handleClick = useCallback(
    (
      option: SelectableAutocompleteOption,
      analyticsAttributes: AutocompleteAnalyticsAttributes,
    ) => {
      onClick(option);
      createAndFireAnalyticsEvent({
        action: Action.SELECTED,
        actionSubject: ActionSubject.AUTOCOMPLETE_OPTION,
        eventType: EventType.TRACK,
        attributes: {
          ...analyticsAttributes,
        },
      });
    },
    [createAndFireAnalyticsEvent, onClick],
  );

  return (
    <AutocompleteDropdown
      options={options}
      loading={loading}
      keymap={keymap}
      onClick={handleClick}
    />
  );
};

export default Autocomplete;
