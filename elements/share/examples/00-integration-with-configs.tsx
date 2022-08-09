import React, { useState } from 'react';

import { IntlProvider } from 'react-intl-next';
import styled from 'styled-components';

import { AnalyticsListener, UIAnalyticsEvent } from '@atlaskit/analytics-next';
import { Appearance } from '@atlaskit/button/types';
import WorldIcon from '@atlaskit/icon/glyph/world';
import SectionMessage from '@atlaskit/section-message';
import Select from '@atlaskit/select';
import { OptionData } from '@atlaskit/smart-user-picker';
import Toggle from '@atlaskit/toggle';
import { ufologger } from '@atlaskit/ufo';
import { userPickerData } from '@atlaskit/util-data-test/user-picker-data';

import App from '../example-helpers/AppWithFlag';
import RestrictionMessage from '../example-helpers/RestrictionMessage';
import { ProductName, ShareDialogContainer } from '../src';
import {
  ShortenRequest,
  ShortenResponse,
  UrlShortenerClient,
} from '../src/clients/AtlassianUrlShortenerClient';
import SlackIcon from '../src/components/colorSlackIcon';
import languages from '../src/i18n/languages';
import {
  Comment,
  ConfigResponse,
  Content,
  DialogPlacement,
  Integration,
  IntegrationContentProps,
  KeysOfType,
  MetaData,
  OriginTracing,
  RenderCustomTriggerButton,
  ShareButtonStyle,
  ShareClient,
  ShareResponse,
  TooltipPosition,
  User,
} from '../src/types';
import { IntegrationMode } from '../src/types/ShareEntities';

type UserData = {
  avatarUrl?: string;
  id: string;
  includesYou?: boolean;
  fixed?: boolean;
  lozenge?: string;
  memberCount?: number;
  name: string;
  publicName?: string;
  type?: string;
};

ufologger.enable();

const WrapperWithMarginTop = styled.div`
  margin-top: 10px;
`;

const JDOG_CLOUD_ID = '49d8b9d6-ee7d-4931-a0ca-7fcae7d1c3b5';

let factoryCount = 0;
function originTracingFactory(): OriginTracing {
  factoryCount++;
  const id = `id#${factoryCount}`;
  return {
    id,
    addToUrl: (l: string) => `${l}&atlOrigin=mockAtlOrigin:${id}`,
    toAnalyticsAttributes: () => ({
      originIdGenerated: id,
      originProduct: 'product',
    }),
  };
}

const loadUserOptions = (searchText?: string): OptionData[] => {
  if (!searchText) {
    return userPickerData;
  }

  return userPickerData
    .map((user: UserData) => ({
      ...user,
      type: user.type || 'user',
    }))
    .filter((user: UserData) => {
      const searchTextInLowerCase = searchText.toLowerCase();
      const propertyToMatch: KeysOfType<UserData, string | undefined>[] = [
        'id',
        'name',
        'publicName',
      ];

      return propertyToMatch.some(
        (property: KeysOfType<UserData, string | undefined>) => {
          const value = property && user[property];
          return !!(
            value && value.toLowerCase().includes(searchTextInLowerCase)
          );
        },
      );
    });
};

interface DialogPlacementOption {
  label: string;
  value: State['dialogPlacement'];
}

const dialogPlacementOptions: Array<DialogPlacementOption> = [
  { label: 'bottom-end', value: 'bottom-end' },
  { label: 'bottom', value: 'bottom' },
  { label: 'bottom-start', value: 'bottom-start' },
  { label: 'top-start', value: 'top-start' },
  { label: 'top', value: 'top' },
  { label: 'top-end', value: 'top-end' },
  { label: 'right-start', value: 'right-start' },
  { label: 'right', value: 'right' },
  { label: 'right-end', value: 'right-end' },
  { label: 'left-start', value: 'left-start' },
  { label: 'left', value: 'left' },
  { label: 'left-end', value: 'left-end' },
];

interface ConfigOption {
  label: string;
  value: ConfigResponse;
}

const configOptions: Array<ConfigOption> = [
  { label: 'Email sharing allowed', value: { disableSharingToEmails: false } },
  { label: 'Email sharing disabled', value: { disableSharingToEmails: true } },
  { label: 'No value for email sharing', value: {} },
];

interface TriggerButtonAppearanceOption {
  label: string;
  value: State['triggerButtonAppearance'];
}

const triggerButtonAppearanceOptions: Array<TriggerButtonAppearanceOption> = [
  { label: 'default', value: 'default' },
  { label: 'danger', value: 'danger' },
  { label: 'link', value: 'link' },
  { label: 'primary', value: 'primary' },
  { label: 'subtle', value: 'subtle' },
  { label: 'subtle-link', value: 'subtle-link' },
  { label: 'warning', value: 'warning' },
];

interface TriggerButtonStyleOption {
  label: string;
  value: State['triggerButtonStyle'];
}

const triggerButtonStyleOptions: Array<TriggerButtonStyleOption> = [
  { label: 'icon-only', value: 'icon-only' },
  { label: 'icon-with-text', value: 'icon-with-text' },
  { label: 'text-only', value: 'text-only' },
];

interface TriggerPositionOption {
  label: string;
  value: State['triggerButtonTooltipPosition'];
}

const triggerButtonTooltipPositionOptions: Array<TriggerPositionOption> = [
  { label: 'top', value: 'top' },
  { label: 'left', value: 'left' },
  { label: 'bottom', value: 'bottom' },
  { label: 'right', value: 'right' },
  { label: 'mouse', value: 'mouse' },
];

type ExampleState = {
  chosenConfig: number;
  customButton: boolean;
  customTitle: boolean;
  customHelperMessage: boolean;
  customTooltipText: boolean;
  customTriggerButtonIcon: boolean;
  escapeOnKeyPress: boolean;
  restrictionMessage: boolean;
  useUrlShortener: boolean;
  shortLinkData?: ShortenRequest;
  product: ProductName;
  hasFooter: boolean;
  enableSmartUserPicker: boolean;
  hasShareFieldsFooter: boolean;
  isCopyDisabled: boolean;
  isPublicLink: boolean;
  hasTabs: boolean;
  hasSplit: boolean;
  shareIntegrations: Array<Integration>;
  integrationMode: IntegrationMode;
  locales: string[];
  locale: string;
};

type State = {
  isAutoOpenDialog: boolean;
  dialogPlacement: DialogPlacement;
  triggerButtonAppearance: Appearance;
  triggerButtonStyle: ShareButtonStyle;
  triggerButtonTooltipPosition: TooltipPosition;
} & ExampleState;

const renderCustomTriggerButton: RenderCustomTriggerButton = (
  { onClick },
  { ...triggerProps },
) => (
  // @ts-ignore
  <button onClick={onClick} {...triggerProps}>
    Custom Button
  </button>
);

const FooterWrapper = styled.div`
  margin-top: 8px;

  > * {
    border-radius: 0;
  }
`;

const FieldsFooterWrapper = styled.div`
  margin-top: 8px;
  margin-bottom: 8px;
  > * {
    border-radius: 0;
  }
`;

const CustomFooter = () => (
  <FooterWrapper>
    <SectionMessage appearance="information" title="Footer">
      <p>This is a sample footer for the Share dialog</p>
    </SectionMessage>
  </FooterWrapper>
);

const ShareFieldsFooter = () => (
  <FieldsFooterWrapper>
    <SectionMessage appearance="warning">
      <p>This is a sample fields footer for the Share form</p>
    </SectionMessage>
  </FieldsFooterWrapper>
);
class MockUrlShortenerClient implements UrlShortenerClient {
  count = 0;

  public isSupportedProduct(): boolean {
    return true;
  }

  public shorten(): Promise<ShortenResponse> {
    return new Promise<ShortenResponse>((resolve) => {
      this.count++;
      setTimeout(() => {
        resolve({
          shortUrl: `https://foo.atlassian.net/short#${this.count}`,
        });
      }, 350);
    });
  }
}

const listenerHandler = (event: UIAnalyticsEvent, channel?: string) => {
  // eslint-disable-next-line no-console
  console.log(
    `AnalyticsEvent(${channel})\n\tpayload=%o\n\tcontext=%o`,
    event.payload,
    event.context,
  );
};

const IntegrationContent = (props: IntegrationContentProps) => {
  return (
    <>
      <div>Share to Integration form</div>
      <a
        href="#"
        onClick={() => {
          props?.changeTab?.(0);
        }}
      >
        Change tab
      </a>
    </>
  );
};

export default function Example() {
  const defaultProps: State = {
    isAutoOpenDialog: false,
    customButton: false,
    customTitle: false,
    customHelperMessage: false,
    chosenConfig: 0,
    customTooltipText: false,
    customTriggerButtonIcon: false,
    restrictionMessage: false,
    useUrlShortener: false,
    shortLinkData: undefined,
    dialogPlacement: dialogPlacementOptions[2].value,
    escapeOnKeyPress: true,
    triggerButtonAppearance: triggerButtonAppearanceOptions[0].value,
    triggerButtonStyle: triggerButtonStyleOptions[0].value,
    triggerButtonTooltipPosition: triggerButtonTooltipPositionOptions[0].value,
    product: 'confluence',
    hasFooter: false,
    enableSmartUserPicker: false,
    hasShareFieldsFooter: false,
    isCopyDisabled: false,
    isPublicLink: false,
    hasTabs: false,
    hasSplit: false,
    integrationMode: 'off',
    shareIntegrations: [],
    locales: Object.keys(languages),
    locale: 'en-US',
  };

  const [state, setState] = useState<State>(defaultProps);

  const share = (
    _content: Content,
    _users: User[],
    _metaData: MetaData,
    _comment?: Comment,
  ) => {
    console.info('Share', {
      _content,
      _users,
      _metaData,
      _comment,
    });

    return new Promise<ShareResponse>((resolve) => {
      setTimeout(
        () =>
          resolve({
            shareRequestId: 'c41e33e5-e622-4b38-80e9-a623c6e54cdd',
          }),
        2000,
      );
    });
  };

  const shareClient: ShareClient = {
    getConfig: () =>
      new Promise<ConfigResponse>((resolve) => {
        setTimeout(() => {
          resolve(configOptions[state.chosenConfig].value);
        }, 1000);
      }),
    share: share,
  };

  const urlShortenerClient: UrlShortenerClient = new MockUrlShortenerClient();

  const localeOptions = state.locales.map((l) => ({
    label: l,
    value: l,
  }));

  return (
    <AnalyticsListener onEvent={listenerHandler} channel="fabric-elements">
      <IntlProvider locale={state.locale}>
        <App>
          {(showFlags) => (
            <>
              <h4>Share Component</h4>
              <WrapperWithMarginTop>
                <ShareDialogContainer
                  isAutoOpenDialog={state.isAutoOpenDialog}
                  shareClient={shareClient}
                  urlShortenerClient={urlShortenerClient}
                  cloudId={JDOG_CLOUD_ID}
                  dialogPlacement={state.dialogPlacement}
                  loadUserOptions={loadUserOptions}
                  originTracingFactory={originTracingFactory}
                  productId="confluence"
                  renderCustomTriggerButton={
                    state.customButton ? renderCustomTriggerButton : undefined
                  }
                  shareAri="ari"
                  shareContentType="issue"
                  shareFormTitle={
                    state.customTitle ? 'Custom Title' : undefined
                  }
                  shareTitle="My Share"
                  shouldCloseOnEscapePress={state.escapeOnKeyPress}
                  showFlags={showFlags}
                  enableSmartUserPicker={state.enableSmartUserPicker}
                  triggerButtonAppearance={state.triggerButtonAppearance}
                  triggerButtonIcon={
                    state.customTriggerButtonIcon ? WorldIcon : undefined
                  }
                  triggerButtonStyle={state.triggerButtonStyle}
                  triggerButtonTooltipText={
                    state.customTooltipText ? 'Custom Tooltip Text' : undefined
                  }
                  triggerButtonTooltipPosition={
                    state.triggerButtonTooltipPosition
                  }
                  bottomMessage={
                    state.restrictionMessage ? <RestrictionMessage /> : null
                  }
                  useUrlShortener={state.useUrlShortener}
                  shortLinkData={state.shortLinkData}
                  product={state.product}
                  customFooter={state.hasFooter ? <CustomFooter /> : undefined}
                  onUserSelectionChange={console.log}
                  shareFieldsFooter={
                    state.hasShareFieldsFooter ? (
                      <ShareFieldsFooter />
                    ) : undefined
                  }
                  onDialogOpen={() => {
                    console.log('Share Dialog Opened');
                  }}
                  isCopyDisabled={state.isCopyDisabled}
                  isPublicLink={state.isPublicLink}
                  integrationMode={state.integrationMode}
                  shareIntegrations={state.shareIntegrations}
                  shareFormHelperMessage={
                    state.customHelperMessage
                      ? 'Custom Helper Message'
                      : undefined
                  }
                />
              </WrapperWithMarginTop>
              <h4>Options</h4>
              <div>
                <WrapperWithMarginTop>
                  Enable Integration Tabs
                  <Toggle
                    isChecked={state.hasTabs}
                    onChange={() =>
                      setState({
                        ...state,
                        hasTabs: !state.hasTabs,
                        hasSplit: false,
                        integrationMode:
                          state.integrationMode !== 'tabs' ? 'tabs' : 'off',
                        shareIntegrations: [
                          {
                            type: 'Slack',
                            Icon: SlackIcon,
                            Content: IntegrationContent,
                          },
                        ],
                      })
                    }
                  />
                </WrapperWithMarginTop>
                <WrapperWithMarginTop>
                  Enable Integration Split Button
                  <Toggle
                    isChecked={state.hasSplit}
                    onChange={() =>
                      setState({
                        ...state,
                        hasTabs: false,
                        hasSplit: !state.hasSplit,
                        integrationMode:
                          state.integrationMode !== 'split' ? 'split' : 'off',
                        shareIntegrations: [
                          {
                            type: 'Slack',
                            Icon: SlackIcon,
                            Content: IntegrationContent,
                          },
                        ],
                      })
                    }
                  />
                </WrapperWithMarginTop>
                <WrapperWithMarginTop>
                  Is Public Link
                  <Toggle
                    isChecked={state.isPublicLink}
                    onChange={() =>
                      setState({ ...state, isPublicLink: !state.isPublicLink })
                    }
                  />
                </WrapperWithMarginTop>
                <WrapperWithMarginTop>
                  Is Copy Disabled
                  <Toggle
                    isChecked={state.isCopyDisabled}
                    onChange={() =>
                      setState({
                        ...state,
                        isCopyDisabled: !state.isCopyDisabled,
                      })
                    }
                  />
                </WrapperWithMarginTop>
                <WrapperWithMarginTop>
                  Close Share Dialog on escape key press
                  <Toggle
                    isChecked={state.escapeOnKeyPress}
                    onChange={() =>
                      setState({
                        ...state,
                        escapeOnKeyPress: !state.escapeOnKeyPress,
                      })
                    }
                  />
                </WrapperWithMarginTop>
                <WrapperWithMarginTop>
                  Custom Share Dialog Trigger Button
                  <Toggle
                    isChecked={state.customButton}
                    onChange={() =>
                      setState({ ...state, customButton: !state.customButton })
                    }
                  />
                </WrapperWithMarginTop>
                <WrapperWithMarginTop>
                  Custom Share Dialog Title
                  <Toggle
                    isChecked={state.customTitle}
                    onChange={() =>
                      setState({ ...state, customTitle: !state.customTitle })
                    }
                  />
                </WrapperWithMarginTop>
                <WrapperWithMarginTop>
                  Custom Share Form Helper Message
                  <Toggle
                    isChecked={state.customHelperMessage}
                    onChange={() =>
                      setState({
                        ...state,
                        customHelperMessage: !state.customHelperMessage,
                      })
                    }
                  />
                </WrapperWithMarginTop>
                <WrapperWithMarginTop>
                  Custom Trigger Button Tooltip Text
                  <Toggle
                    isChecked={state.customTooltipText}
                    onChange={() =>
                      setState({
                        ...state,
                        customTooltipText: !state.customTooltipText,
                      })
                    }
                  />
                </WrapperWithMarginTop>
                <WrapperWithMarginTop>
                  Custom Trigger Button Icon
                  <Toggle
                    isChecked={state.customTriggerButtonIcon}
                    onChange={() =>
                      setState({
                        ...state,
                        customTriggerButtonIcon: !state.customTriggerButtonIcon,
                      })
                    }
                  />
                </WrapperWithMarginTop>
                <WrapperWithMarginTop>
                  Show Restriction Message
                  <Toggle
                    isChecked={state.restrictionMessage}
                    onChange={() =>
                      setState({
                        ...state,
                        restrictionMessage: !state.restrictionMessage,
                      })
                    }
                  />
                </WrapperWithMarginTop>
                <WrapperWithMarginTop>
                  Use URL shortener
                  <Toggle
                    isChecked={!!state.shortLinkData}
                    onChange={() =>
                      setState({
                        ...state,
                        shortLinkData: state.shortLinkData
                          ? undefined
                          : {
                              product: state.product,
                              type: 'test',
                              params: { x: 'a' },
                            },
                      })
                    }
                  />
                </WrapperWithMarginTop>
                <WrapperWithMarginTop>
                  Use URL shortener legacy API
                  <Toggle
                    isChecked={state.useUrlShortener}
                    onChange={() =>
                      setState({
                        ...state,
                        useUrlShortener: !state.useUrlShortener,
                      })
                    }
                  />
                </WrapperWithMarginTop>
                <WrapperWithMarginTop>
                  Auto open dialog
                  <Toggle
                    isChecked={state.isAutoOpenDialog}
                    onChange={() => {
                      // Because the onFocus of this toggle, the `@atlaskit/popup` dialog
                      // closes itself right after it's opened, when the focus is shifted.
                      setTimeout(() => {
                        setState({
                          ...state,
                          isAutoOpenDialog: !state.isAutoOpenDialog,
                        });
                      }, 150);
                    }}
                  />
                </WrapperWithMarginTop>
                <WrapperWithMarginTop>
                  Custom Footer
                  <Toggle
                    isChecked={state.hasFooter}
                    onChange={() =>
                      setState({ ...state, hasFooter: !state.hasFooter })
                    }
                  />
                </WrapperWithMarginTop>
                <WrapperWithMarginTop>
                  Enable Smart User Picker
                  <Toggle
                    isChecked={state.enableSmartUserPicker}
                    onChange={() =>
                      setState({
                        ...state,
                        enableSmartUserPicker: !state.enableSmartUserPicker,
                      })
                    }
                  />
                </WrapperWithMarginTop>
                <WrapperWithMarginTop>
                  Share Fields Footer
                  <Toggle
                    isChecked={state.hasShareFieldsFooter}
                    onChange={() =>
                      setState({
                        ...state,
                        hasShareFieldsFooter: !state.hasShareFieldsFooter,
                      })
                    }
                  />
                </WrapperWithMarginTop>
                <WrapperWithMarginTop>
                  Dialog Placement
                  <Select
                    value={dialogPlacementOptions.find(
                      (option) => option.value === state.dialogPlacement,
                    )}
                    options={dialogPlacementOptions}
                    onChange={(option: any) =>
                      setState({ ...state, dialogPlacement: option.value })
                    }
                  />
                </WrapperWithMarginTop>
                <WrapperWithMarginTop>
                  Share config
                  <Select
                    value={configOptions[state.chosenConfig]}
                    options={configOptions}
                    onChange={(config: ConfigOption | null) => {
                      setState({
                        ...state,
                        chosenConfig:
                          configOptions.findIndex(
                            (option) => option.label === config?.label,
                          ) || 0,
                      });
                    }}
                  />
                </WrapperWithMarginTop>
                <WrapperWithMarginTop>
                  Trigger Button Style
                  <Select<TriggerButtonStyleOption>
                    value={{
                      label: state.triggerButtonStyle,
                      value: state.triggerButtonStyle,
                    }}
                    options={triggerButtonStyleOptions}
                    onChange={(option: any) =>
                      setState({ ...state, triggerButtonStyle: option.value })
                    }
                  />
                </WrapperWithMarginTop>
                <WrapperWithMarginTop>
                  Trigger Button Appearance
                  <Select<TriggerButtonAppearanceOption>
                    value={{
                      label: state.triggerButtonAppearance,
                      value: state.triggerButtonAppearance,
                    }}
                    options={triggerButtonAppearanceOptions}
                    onChange={(option: any) =>
                      setState({
                        ...state,
                        triggerButtonAppearance: option.value,
                      })
                    }
                  />
                </WrapperWithMarginTop>
                <WrapperWithMarginTop>
                  Trigger Button Tooltip Position
                  <Select<TriggerPositionOption>
                    value={{
                      label: state.triggerButtonTooltipPosition,
                      value: state.triggerButtonTooltipPosition,
                    }}
                    options={triggerButtonTooltipPositionOptions}
                    onChange={(option: any) =>
                      setState({
                        ...state,
                        triggerButtonTooltipPosition: option.value,
                      })
                    }
                  />
                </WrapperWithMarginTop>
                <WrapperWithMarginTop>
                  Product
                  <Select
                    value={{
                      label: state.product,
                      value: state.product,
                    }}
                    options={[
                      { label: 'confluence', value: 'confluence' },
                      { label: 'jira', value: 'jira' },
                    ]}
                    onChange={(option: any) =>
                      setState({
                        ...state,
                        product: option.value,
                      })
                    }
                  />
                </WrapperWithMarginTop>
                <WrapperWithMarginTop>
                  Locale
                  <Select
                    value={{
                      label: state.locale,
                      value: state.locale,
                    }}
                    options={localeOptions}
                    onChange={(option: any) =>
                      setState({
                        ...state,
                        locale: option.value,
                      })
                    }
                  />
                </WrapperWithMarginTop>
              </div>
            </>
          )}
        </App>
      </IntlProvider>
    </AnalyticsListener>
  );
}
