import React from 'react';
import { PopupWrapper, PopUps } from './kitchen-sink-styles';
import { EditorAppearance, EditorPlugin, EditorProps } from '../../src/types';
import EditorActions from '../../src/actions';
import { ValidatingKitchenSinkEditor } from './validating-kitchen-sink-editor';
import { KitchenSinkToolbar } from './kitchen-sink-toolbar';

type Theme = 'light' | 'dark';

export interface KitchenSinkEditorProps {
  locale: string;
  theme: Theme;
  actions: EditorActions;
  adf: any;
  disabled: boolean;
  appearance: EditorAppearance;
  extensionProviders: EditorProps['extensionProviders'];
  popupMountPoint: HTMLElement | null | undefined;
  setPopupRef(ref: HTMLElement): void;
  onDocumentChanged(adf: any): void;
  onDocumentValidated(): void;
  loadLocale(locale: string): void;
  featureFlags: EditorProps['featureFlags'];
  editorPlugins?: EditorPlugin[];
}

export const KitchenSinkEditor: React.StatelessComponent<KitchenSinkEditorProps> = React.memo(
  (props) => {
    const { actions, locale, loadLocale } = props;

    const primaryToolbarComponents = React.useMemo(
      () => (
        <KitchenSinkToolbar
          actions={actions}
          locale={locale}
          loadLocale={loadLocale}
        />
      ),
      [actions, locale, loadLocale],
    );

    return (
      <PopupWrapper>
        <PopUps innerRef={props.setPopupRef} />
        <ValidatingKitchenSinkEditor
          actions={props.actions}
          adf={props.adf}
          disabled={props.disabled}
          appearance={props.appearance}
          popupMountPoint={props.popupMountPoint || undefined}
          onDocumentChanged={props.onDocumentChanged}
          onDocumentValidated={props.onDocumentValidated}
          extensionProviders={props.extensionProviders}
          primaryToolbarComponents={primaryToolbarComponents}
          featureFlags={props.featureFlags}
          editorPlugins={props.editorPlugins}
        />
      </PopupWrapper>
    );
  },
);
