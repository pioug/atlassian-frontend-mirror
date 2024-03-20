import React from 'react';

import { SaveAndCancelButtons } from '../../examples/5-full-page';
import type EditorActions from '../../src/actions';
import languages from '../../src/i18n/languages';
import LanguagePicker from '../LanguagePicker';

export interface KitchenSinkToolbarProps {
  actions: EditorActions;
  locale: string;
  loadLocale(locale: string): void;
}

export const KitchenSinkToolbar = React.memo(
  (props: KitchenSinkToolbarProps) => {
    return (
      <React.Fragment>
        <LanguagePicker
          languages={languages}
          locale={props.locale}
          onChange={props.loadLocale}
        />
        <SaveAndCancelButtons editorActions={props.actions} />
      </React.Fragment>
    );
  },
);
