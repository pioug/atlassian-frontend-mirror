import React from 'react';

import { addLocaleData } from 'react-intl';
import {
  ProviderFactory,
  combineExtensionProviders,
} from '@atlaskit/editor-common';
import { AtlaskitThemeProvider } from '@atlaskit/theme/components';
import { addGlobalEventEmitterListeners } from '@atlaskit/media-test-helpers';

import {
  providers,
  mediaProvider,
  LOCALSTORAGE_defaultDocKey,
} from '../../examples/5-full-page';
import { EditorAppearance } from '../../src/types';
import { EditorActions, ContextPanel } from '../../src';

import { Error, ErrorReport } from '../ErrorReport';
import { getXProductExtensionProvider } from '../fake-x-product-extensions';
import { getConfluenceMacrosExtensionProvider } from '../confluence-macros';
import { KitchenSinkControls } from './kitchen-sink-controls';
import { KitchenSinkAdfInput } from './kitchen-sink-adf-input';
import { Container, EditorColumn, Column, Rail } from './kitchen-sink-styles';
import { KitchenSinkRenderer } from './kitchen-sink-renderer';
import { KitchenSinkEditor } from './kitchen-sink-editor';

addGlobalEventEmitterListeners();

const appearanceOptions = [
  {
    label: 'Full page',
    value: 'full-page',
    description:
      'should be used for a full page editor where it is the user focus of the page',
  },
  {
    label: 'Comment',
    value: 'comment',
    description:
      'should be used for things like comments where you have a field input but require a toolbar & save/cancel buttons',
  },
  {
    label: 'Mobile',
    value: 'mobile',
    description:
      'should be used for the mobile web view. It is a full page editor version for mobile.',
  },
];

const docOptions = [
  { label: 'Empty document', value: null },
  { label: 'Example document', value: 'example-document.ts' },
  { label: 'With huge table', value: 'example-doc-with-huge-table.ts' },
  { label: 'With table', value: 'example-doc-with-table.ts' },
  {
    label: 'Different extension types',
    value: 'example-doc-with-different-extension-types.ts',
  },
];

type Theme = 'light' | 'dark';

const themeOptions: { label: string; value: Theme }[] = [
  { label: 'Light Theme', value: 'light' },
  { label: 'Dark Theme', value: 'dark' },
];

const LOCALSTORAGE_orientationKey =
  'fabric.editor.example.kitchen-sink.orientation';

export type KitchenSinkProps = {
  actions: EditorActions;
  locale: string;
  setLocale(locale: string): void;
  setMessages(messages: any): void;
};

export type KitchenSinkState = {
  adf: object | undefined;
  adfInput: string;

  appearance: EditorAppearance;
  showADF: boolean;
  disabled: boolean;
  vertical: boolean;

  errors: Array<Error>;
  showErrors: boolean;
  waitingToValidate: boolean;
  theme: Theme;
};

function getInitialTheme(): Theme {
  if (typeof window !== 'undefined') {
    // Retaining the preferred theme per browser session to aid development workflows.
    const preferredTheme = window.sessionStorage.getItem('theme') as Theme;
    return preferredTheme ? preferredTheme : themeOptions[0].value;
  }
  return themeOptions[0].value;
}

export class KitchenSink extends React.Component<
  KitchenSinkProps,
  KitchenSinkState
> {
  constructor(props: KitchenSinkProps) {
    super(props);
    if (history.scrollRestoration === 'auto') {
      history.scrollRestoration = 'manual';
    }
  }

  private getJSONFromStorage = (key: string, fallback: any = undefined) => {
    const localADF = (localStorage && localStorage.getItem(key)) || undefined;

    return localADF ? JSON.parse(localADF) : fallback;
  };

  private getDefaultADF = () =>
    this.getJSONFromStorage(LOCALSTORAGE_defaultDocKey, {
      version: 1,
      type: 'doc',
      content: [],
    });

  private getDefaultOrientation = () => {
    const data = this.getJSONFromStorage(LOCALSTORAGE_orientationKey, {
      vertical: false,
    });
    return data;
  };

  public state: KitchenSinkState = {
    adf: this.getDefaultADF(),
    adfInput: JSON.stringify(this.getDefaultADF(), null, 2),
    appearance: 'full-page',
    showADF: false,
    disabled: false,
    vertical: this.getDefaultOrientation().vertical,
    errors: [],
    showErrors: false,
    waitingToValidate: false,
    theme: getInitialTheme(),
  };

  private dataProviders = ProviderFactory.create({
    ...providers,
    mediaProvider,
    extensionProvider: Promise.resolve(
      combineExtensionProviders([
        getXProductExtensionProvider(),
        getConfluenceMacrosExtensionProvider(),
      ]),
    ),
  });

  private popupMountPoint?: HTMLElement | null;

  public componentDidUpdate(_: KitchenSinkProps, prevState: KitchenSinkState) {
    if (prevState.theme !== this.state.theme) {
      window.sessionStorage.setItem('theme', this.state.theme);
    }
  }

  public componentDidMount() {
    window.requestAnimationFrame(() => {
      const anchorElement: HTMLElement | null = document.getElementById(
        decodeURIComponent(window.location.hash.slice(1)),
      );
      if (anchorElement) {
        anchorElement.scrollIntoView();
      }
    });
  }

  private toggleFullWidthMode = (fullWidthMode: boolean) => {
    this.setState({
      appearance: fullWidthMode ? 'full-width' : 'full-page',
    });
  };

  private onAppeareanceChange = (appearance: EditorAppearance) => {
    this.setState({ appearance });
  };

  private onThemeChange = (theme: Theme) => {
    this.setState({ theme });
  };

  private onOrientationChange = (vertical: boolean) => {
    this.setState({ vertical });

    localStorage.setItem(
      LOCALSTORAGE_orientationKey,
      JSON.stringify({ vertical: vertical }),
    );
  };

  private onEditorToggle = (enabled: boolean) => {
    this.setState({ disabled: !enabled });
  };

  private onErrorToggle = (showErrors: boolean) => {
    if (showErrors === true) {
      return this.setState({ showErrors, showADF: true });
    }

    this.setState({ showErrors });
  };

  private onAdfToggle = (showADF: boolean) => {
    this.setState({ showADF });
  };

  private setPopupRef = (ref: HTMLElement) => {
    this.popupMountPoint = ref;
  };

  private loadDocument = async (opt: { value: string | null }) => {
    if (opt.value === null) {
      this.props.actions.clear();
      return;
    }

    const docModule = await import(`../${opt.value}`);
    const adf = docModule.exampleDocument;

    this.props.actions.replaceDocument(adf, false);
  };

  private onDocumentChanged = (adf: any) => {
    this.setState({
      adf,
      adfInput: JSON.stringify(adf, null, 2),
      waitingToValidate: true,
    });
  };

  private onDocumentValidated = (errors?: Array<Error>) => {
    this.setState({ errors: errors || [], waitingToValidate: false });
  };

  private onInputChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    this.setState({ adfInput: event.target.value });
  };

  private onInputSubmit = () => {
    this.props.actions.replaceDocument(this.state.adfInput, false);
  };

  private loadLocale = async (locale: string) => {
    const localeData = await import(
      `react-intl/locale-data/${locale.substring(0, 2)}`
    );
    addLocaleData(localeData.default);
    const messages = await import(`../../src/i18n/${locale}`);
    this.props.setLocale(locale);
    this.props.setMessages(messages);
  };

  public render() {
    return (
      <AtlaskitThemeProvider mode={this.state.theme}>
        <>
          <KitchenSinkControls
            adfEnabled={this.state.showADF}
            appearance={this.state.appearance}
            appearanceOptions={appearanceOptions}
            docOptions={docOptions}
            editorEnabled={!this.state.disabled}
            errors={this.state.errors}
            errorsEnabled={this.state.showErrors}
            theme={this.state.theme}
            themeOptions={themeOptions}
            validating={this.state.waitingToValidate}
            vertical={this.state.vertical}
            onAppearanceChange={this.onAppeareanceChange}
            onLoadDocument={this.loadDocument}
            onFullWidthChange={this.toggleFullWidthMode}
            onThemeChange={this.onThemeChange}
            onOrientationChange={this.onOrientationChange}
            onEditorToggle={this.onEditorToggle}
            onErrorToggle={this.onErrorToggle}
            onAdfToggle={this.onAdfToggle}
          />
          <Container vertical={this.state.vertical} root>
            <EditorColumn
              vertical={this.state.vertical}
              narrow={this.state.vertical && this.state.showADF}
            >
              <KitchenSinkEditor
                actions={this.props.actions}
                locale={this.props.locale}
                popupMountPoint={this.popupMountPoint}
                theme={this.state.theme}
                adf={this.state.adf}
                setPopupRef={this.setPopupRef}
                onDocumentChanged={this.onDocumentChanged}
                onDocumentValidated={this.onDocumentValidated}
                loadLocale={this.loadLocale}
                appearance={this.state.appearance}
                disabled={this.state.disabled}
                extensionProviders={editorActions => [
                  getXProductExtensionProvider(),
                  getConfluenceMacrosExtensionProvider(editorActions),
                ]}
              />
            </EditorColumn>
            <Column narrow={this.state.vertical && this.state.showADF}>
              <KitchenSinkRenderer
                document={this.state.adf}
                appearance={this.state.appearance}
                dataProviders={this.dataProviders}
                isFullPage={this.state.appearance.startsWith('full')}
                locale={this.props.locale}
              />
            </Column>
            {this.state.showADF ? (
              <Rail>
                <ContextPanel visible={this.state.showADF}>
                  <div>
                    <Container>
                      {this.state.errors.length > 0 && (
                        <ErrorReport errors={this.state.errors} />
                      )}
                    </Container>
                    <KitchenSinkAdfInput
                      value={this.state.adfInput}
                      onChange={this.onInputChange}
                      onSubmit={this.onInputSubmit}
                    />
                  </div>
                </ContextPanel>
              </Rail>
            ) : null}
          </Container>
        </>
      </AtlaskitThemeProvider>
    );
  }
}
