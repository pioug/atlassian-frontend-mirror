/** @jsx jsx */
import { jsx } from '@emotion/react';

import React from 'react';
import { popupWrapper, PopUps } from './kitchen-sink-styles';
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
  sanitizePrivateContent: boolean;
  appearance: EditorAppearance;
  extensionProviders: EditorProps['extensionProviders'];
  popupMountPoint: HTMLElement | null | undefined;
  setPopupRef(ref: HTMLDivElement): void;
  onDocumentChanged(adf: any): void;
  onDocumentValidated(): void;
  loadLocale(locale: string): void;
  featureFlags: EditorProps['featureFlags'];
  editorPlugins?: EditorPlugin[];
}

export const KitchenSinkEditor: React.StatelessComponent<KitchenSinkEditorProps> =
  React.memo((props) => {
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
      <div css={popupWrapper} className="popups-wrapper">
        <PopUps ref={props.setPopupRef} className="popups" />
        <ValidatingKitchenSinkEditor
          actions={props.actions}
          adf={props.adf}
          disabled={props.disabled}
          appearance={props.appearance}
          sanitizePrivateContent={props.sanitizePrivateContent}
          popupMountPoint={props.popupMountPoint || undefined}
          onDocumentChanged={props.onDocumentChanged}
          onDocumentValidated={props.onDocumentValidated}
          extensionProviders={props.extensionProviders}
          primaryToolbarComponents={primaryToolbarComponents}
          featureFlags={props.featureFlags}
          editorPlugins={props.editorPlugins}
        />
      </div>
    );
  });
