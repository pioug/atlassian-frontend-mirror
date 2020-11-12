import React from 'react';

import { addLocaleData } from 'react-intl';
import { ADFEntity, scrubAdf } from '@atlaskit/adf-utils';
import {
  ProviderFactory,
  combineExtensionProviders,
} from '@atlaskit/editor-common';
import Flag from '@atlaskit/flag';
import { AtlaskitThemeProvider } from '@atlaskit/theme/components';
import { addGlobalEventEmitterListeners } from '@atlaskit/media-test-helpers';
import Warning from '@atlaskit/icon/glyph/warning';

import {
  providers,
  mediaProvider,
  LOCALSTORAGE_defaultDocKey,
} from '../../examples/5-full-page';
import { EditorAppearance } from '../../src/types';
import { EditorActions, ContextPanel } from '../../src';

import { fromLocation, encode, check, Message } from '../adf-url';
import { copy } from '../copy';
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
  scrubContent: boolean;
  waitingToValidate: boolean;
  theme: Theme;

  warning?: Message;
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

  private getDefaultADF = () => {
    const maybeAdf = fromLocation<object>(window.parent.location);
    const adf = maybeAdf instanceof window.Error ? undefined : maybeAdf;

    if (maybeAdf instanceof window.Error) {
      window.setTimeout(() => {
        this.setState({
          warning: {
            type: 'warn',
            title: "Couldn't load ADF from URL",
            message: maybeAdf.message,
          },
        });
      }, 1000);
    }

    return (
      adf ||
      this.getJSONFromStorage(LOCALSTORAGE_defaultDocKey, {
        version: 1,
        type: 'doc',
        content: [],
      })
    );
  };

  private getDefaultOrientation = () => {
    const data = this.getJSONFromStorage(LOCALSTORAGE_orientationKey, {
      vertical: false,
    });
    return data;
  };

  private getDefaultAppearance = (): EditorAppearance => {
    const result = this.params.get('appearance');
    switch (result) {
      case 'full-page':
      case 'comment':
      case 'mobile':
      case 'full-width':
        return result;
      default:
        return 'full-page';
    }
  };

  private params = new URLSearchParams(window.location.search);

  public state: KitchenSinkState = {
    adf: this.getDefaultADF(),
    adfInput: JSON.stringify(this.getDefaultADF(), null, 2),
    appearance: this.getDefaultAppearance(),
    showADF: this.params.get('show-adf') === 'true',
    disabled: this.params.get('disabled') === 'true',
    vertical:
      this.params.get('vertical') === null
        ? this.getDefaultOrientation().vertical
        : this.params.get('vertical') === 'true',
    errors: [],
    showErrors: false,
    waitingToValidate: false,
    scrubContent: this.params.get('scrub') === 'true',
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
      JSON.stringify({ vertical }),
    );
  };

  private onEditorToggle = (enabled: boolean) => {
    this.setState({ disabled: !enabled });
  };

  private onScrubToggle = (scrubContent: boolean) => {
    this.setState({ scrubContent });
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

  private onCopyLink = async () => {
    const value = await this.props.actions.getValue();
    const url = new URL(window.location.href);
    url.searchParams.set('adf', encode(value));

    if (this.state.disabled) {
      url.searchParams.set('disabled', 'true');
    } else {
      url.searchParams.delete('disabled');
    }

    if (this.state.scrubContent) {
      url.searchParams.set('scrub', 'true');
    } else {
      url.searchParams.delete('scrub');
    }

    if (this.state.showADF) {
      url.searchParams.set('show-adf', 'true');
    } else {
      url.searchParams.delete('show-adf');
    }

    if (this.state.appearance !== 'full-page') {
      url.searchParams.set('appearance', this.state.appearance);
    } else {
      url.searchParams.delete('appearance');
    }

    if (this.state.vertical) {
      url.searchParams.set('vertical', 'true');
    } else {
      url.searchParams.delete('vertical');
    }

    const result = url.toString();

    window.parent.history.pushState(
      value,
      window.parent.document.title,
      result,
    );
    copy(result);

    const warning = check(result);

    if (warning) {
      this.setState({ warning });
    }
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
        <div>
          <KitchenSinkControls
            adfEnabled={this.state.showADF}
            appearance={this.state.appearance}
            appearanceOptions={appearanceOptions}
            docOptions={docOptions}
            editorEnabled={!this.state.disabled}
            errors={this.state.errors}
            errorsEnabled={this.state.showErrors}
            scrubContent={this.state.scrubContent}
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
            onCopyLink={this.onCopyLink}
            onScrubToggle={this.onScrubToggle}
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
                document={
                  this.state.scrubContent
                    ? scrubAdf(this.state.adf as ADFEntity)
                    : this.state.adf
                }
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
                    <label>
                      Plain
                      <KitchenSinkAdfInput
                        value={this.state.adfInput}
                        onChange={this.onInputChange}
                        onSubmit={this.onInputSubmit}
                      />
                    </label>
                    <br />
                    <label>
                      Scrubbed
                      <KitchenSinkAdfInput
                        value={JSON.stringify(
                          scrubAdf(this.state.adf as ADFEntity),
                          null,
                          '  ',
                        )}
                      />
                    </label>
                  </div>
                </ContextPanel>
              </Rail>
            ) : null}
          </Container>
        </div>
        {this.state.warning && (
          <div style={{ position: 'fixed', top: 125, right: 15, width: 400 }}>
            <Flag
              actions={[
                {
                  content: 'Sure',
                  onClick: () => this.setState({ warning: undefined }),
                },
              ]}
              appearance="warning"
              description={this.state.warning.message}
              icon={<Warning label="Heads up!" />}
              title={this.state.warning.title}
              id="warning"
            />
          </div>
        )}
      </AtlaskitThemeProvider>
    );
  }
}
