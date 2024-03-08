/** @jsx jsx */
/** @jsxFrag */
import React from 'react';

import { jsx } from '@emotion/react';

import { scrubAdf } from '@atlaskit/adf-utils/scrub';
import type { ADFEntity } from '@atlaskit/adf-utils/types';
import { Checkbox } from '@atlaskit/checkbox';
import { ProviderFactory } from '@atlaskit/editor-common/provider-factory';
import type { OptionalPlugin } from '@atlaskit/editor-common/types';
import { isEmptyDocument } from '@atlaskit/editor-common/utils';
import type { ExtensionPlugin } from '@atlaskit/editor-plugins/extension';
import { getExampleExtensionProviders } from '@atlaskit/editor-test-helpers/example-helpers';
import Flag from '@atlaskit/flag';
import Warning from '@atlaskit/icon/glyph/warning';
import {
  mockAssetsClientFetchRequests,
  mockDatasourceFetchRequests,
} from '@atlaskit/link-test-helpers/datasource';
import { addGlobalEventEmitterListeners } from '@atlaskit/media-test-helpers/globalEventEmitterListeners';
import { token } from '@atlaskit/tokens';

import { getTranslations } from '../../example-helpers/get-translations';
import {
  getProviders,
  LOCALSTORAGE_defaultDocKey,
  mediaProvider,
} from '../../examples/5-full-page';
import type { EditorActions } from '../../src';
import { ContextPanel } from '../../src';
import { usePresetContext } from '../../src/presets/context';
import type { EditorAppearance, EditorPlugin } from '../../src/types';
import * as ADFUrl from '../adf-url';
import { copy } from '../copy';
import type { Error } from '../ErrorReport';
import { ErrorReport } from '../ErrorReport';
import { exampleSelectionDebugger } from '../example-editor-plugins';
import * as FeatureFlagUrl from '../feature-flag-url';

import { KitchenSinkAdfInput } from './kitchen-sink-adf-input';
import { KitchenSinkControls } from './kitchen-sink-controls';
import { KitchenSinkEditor } from './kitchen-sink-editor';
import { KitchenSinkRenderer } from './kitchen-sink-renderer';
import { column, container, editorColumn, rail } from './kitchen-sink-styles';

type StackPlugins = [OptionalPlugin<ExtensionPlugin>];

addGlobalEventEmitterListeners();
mockDatasourceFetchRequests();
mockAssetsClientFetchRequests();

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
  { label: 'Example document', value: './adf/example.adf.json' },
  { label: 'With huge table', value: './adf/huge-table.adf.json' },
  { label: 'With table', value: './adf/table.adf.json' },
  {
    label: 'Different extension types',
    value: './adf/extension-types.adf.json',
  },
  {
    label: 'With datasource',
    value: './adf/datasource.adf.json',
  },
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
  featureFlagInput: string;

  appearance: EditorAppearance;
  showADF: boolean;
  disabled: boolean;
  vertical: boolean;

  errors: Array<Error>;
  showErrors: boolean;
  scrubContent: boolean;
  waitingToValidate: boolean;
  sanitizePrivateContent: boolean;

  warning?: ADFUrl.Message;
  positionDebuggerEnabled?: boolean;
  key: number;
};

function scrubAdfSafely(data: any): any {
  try {
    return scrubAdf(data);
  } catch (err) {
    return {
      message: err instanceof window.Error ? err.message : String(err),
      stack: err instanceof window.Error ? err.stack : [],
    };
  }
}

function parseSafely<T>(input: string): T | {} {
  try {
    return JSON.parse(input);
  } catch (err) {
    return {};
  }
}

const Comp = (props: any) => {
  const editorApi = usePresetContext<StackPlugins>();
  const extensionProviders = React.useCallback(
    (editorActions?: EditorActions) => [
      getExampleExtensionProviders(editorApi, editorActions),
    ],
    [editorApi],
  );

  return (
    <KitchenSinkEditor {...props} extensionProviders={extensionProviders} />
  );
};

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
    const maybeAdf = ADFUrl.fromLocation<object>(window.parent.location);
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

  private getDefaultFeatureFlagInput = () => {
    const addedFeatureFlags =
      (localStorage && localStorage.getItem('featureFlagsInput')) || undefined;

    const maybeFeatureFlagsFromURL = FeatureFlagUrl.fromLocation<string>(
      window.parent.location,
    );

    let featureFlagsFromURL = {};

    if (maybeFeatureFlagsFromURL instanceof window.Error) {
      window.setTimeout(() => {
        this.setState({
          warning: {
            type: 'warn',
            title: "Couldn't load feature flags from URL",
            message: maybeFeatureFlagsFromURL.message,
          },
        });
      }, 1000);
    } else if (maybeFeatureFlagsFromURL) {
      featureFlagsFromURL = JSON.parse(maybeFeatureFlagsFromURL);
    }

    const featureFlags = {
      ...featureFlagsFromURL,
      ...(addedFeatureFlags ? JSON.parse(addedFeatureFlags) : {}),
    };

    return JSON.stringify(featureFlags, null, 2);
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
    featureFlagInput: this.getDefaultFeatureFlagInput() ?? '{}',
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
    sanitizePrivateContent: false,
    positionDebuggerEnabled: false,
    key: 1,
  };

  private dataProviders = ProviderFactory.create({
    ...getProviders(),
    mediaProvider,
    extensionProvider: Promise.resolve(getExampleExtensionProviders(undefined)),
  });

  private popupMountPoint?: HTMLElement | null;

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

  private onSanitizePrivateContent = (sanitizePrivateContent: boolean) => {
    this.setState({ sanitizePrivateContent });
    this.props.actions.replaceDocument('', false);
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
    const view = this.props.actions._privateGetEditorView();
    const url = new URL(window.location.href);
    const value = await this.props.actions.getValue();

    if (view && !isEmptyDocument(view?.state.doc)) {
      url.searchParams.set('adf', ADFUrl.encode(value));
    } else {
      url.searchParams.delete('adf');
    }

    if (this.state.featureFlagInput !== '{}') {
      url.searchParams.set(
        'ff',
        FeatureFlagUrl.encode(this.state.featureFlagInput),
      );
    } else {
      url.searchParams.delete('ff');
    }

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

    const warning = ADFUrl.check(result);

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

    const response = await fetch(opt.value);
    const adf = await response.json();

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

  private onFeatureFlagChange = (
    event: React.ChangeEvent<HTMLTextAreaElement>,
  ) => {
    this.setState({ featureFlagInput: event.target.value });
  };

  private onFeatureFlagsInputSubmit = () => {
    const featureFlagsValue = this.state.featureFlagInput || '{}';
    localStorage.setItem('featureFlagsInput', featureFlagsValue);

    // force editor component to re-mount to use added FF
    this.setState({ key: this.state.key + 1 });
  };

  private onPositionDebuggerEnabled = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    this.setState({ positionDebuggerEnabled: event.target.checked });
  };

  private customPlugins = [exampleSelectionDebugger()];
  private noopPlugins = [];

  private editorPlugins(): EditorPlugin[] {
    return this.state.positionDebuggerEnabled
      ? this.customPlugins
      : this.noopPlugins;
  }

  private loadLocale = async (locale: string) => {
    const messages = await getTranslations(locale);
    this.props.setLocale(locale);
    this.props.setMessages(messages);
  };

  public render() {
    return (
      <>
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
            validating={this.state.waitingToValidate}
            vertical={this.state.vertical}
            sanitizePrivateContent={this.state.sanitizePrivateContent}
            onAppearanceChange={this.onAppeareanceChange}
            onLoadDocument={this.loadDocument}
            onFullWidthChange={this.toggleFullWidthMode}
            onOrientationChange={this.onOrientationChange}
            onEditorToggle={this.onEditorToggle}
            onErrorToggle={this.onErrorToggle}
            onAdfToggle={this.onAdfToggle}
            onCopyLink={this.onCopyLink}
            onScrubToggle={this.onScrubToggle}
            onSanitizePrivateContent={this.onSanitizePrivateContent}
          />
          <div css={container({ vertical: this.state.vertical, root: true })}>
            <div
              css={editorColumn({
                vertical: this.state.vertical,
                narrow: this.state.vertical && this.state.showADF,
              })}
            >
              <Comp
                key={this.state.key}
                actions={this.props.actions}
                locale={this.props.locale}
                popupMountPoint={this.popupMountPoint}
                adf={this.state.adf}
                sanitizePrivateContent={this.state.sanitizePrivateContent}
                setPopupRef={this.setPopupRef}
                onDocumentChanged={this.onDocumentChanged}
                onDocumentValidated={this.onDocumentValidated}
                loadLocale={this.loadLocale}
                appearance={this.state.appearance}
                disabled={this.state.disabled}
                featureFlags={parseSafely(this.state.featureFlagInput)}
                editorPlugins={this.editorPlugins()}
              />
            </div>
            <div
              css={column({
                narrow: this.state.vertical && this.state.showADF,
              })}
            >
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
                featureFlags={{
                  ...parseSafely(this.state.featureFlagInput),
                }}
              />
            </div>
            {this.state.showADF ? (
              <div css={rail}>
                <ContextPanel visible={this.state.showADF}>
                  <div>
                    <div css={container({})}>
                      {this.state.errors.length > 0 && (
                        <ErrorReport errors={this.state.errors} />
                      )}
                    </div>
                    <label>
                      Feature flags
                      <KitchenSinkAdfInput
                        value={this.state.featureFlagInput}
                        onChange={this.onFeatureFlagChange}
                        onSubmit={this.onFeatureFlagsInputSubmit}
                        buttonLabel="Save"
                      />
                    </label>
                    <br />
                    <label>
                      Plain
                      <KitchenSinkAdfInput
                        value={this.state.adfInput}
                        onChange={this.onInputChange}
                        onSubmit={this.onInputSubmit}
                        buttonLabel="Import ADF"
                      />
                    </label>
                    <br />
                    <label>
                      Scrubbed
                      <KitchenSinkAdfInput
                        value={JSON.stringify(
                          scrubAdfSafely(this.state.adf as ADFEntity),
                          null,
                          '  ',
                        )}
                      />
                    </label>
                    <div>
                      <label>Options</label>
                      <Checkbox
                        onChange={this.onPositionDebuggerEnabled}
                        isChecked={this.state.positionDebuggerEnabled}
                        label="Position debugger enabled"
                        size="large"
                      />
                    </div>
                  </div>
                </ContextPanel>
              </div>
            ) : null}
          </div>
        </div>
        {this.state.warning && (
          <div
            style={{
              position: 'fixed',
              top: token('space.1000', '80px'),
              right: token('space.200', '16px'),
              width: 400,
            }}
          >
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
      </>
    );
  }
}
