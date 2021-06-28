import React from 'react';
import languages from '../../src/i18n/languages';
import LanguagePicker from '../LanguagePicker';
import { SaveAndCancelButtons } from '../../examples/5-full-page';
import EditorActions from '../../src/actions';

export interface KitchenSinkToolbarProps {
  actions: EditorActions;
  locale: string;
  loadLocale(locale: string): void;
}

export const KitchenSinkToolbar: React.StatelessComponent<KitchenSinkToolbarProps> = React.memo(
  (props) => {
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
