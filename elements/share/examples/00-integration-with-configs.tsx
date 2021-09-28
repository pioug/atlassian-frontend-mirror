import React from 'react';
import { IntlProvider, addLocaleData } from 'react-intl';
import styled from 'styled-components';
import Select from '@atlaskit/select';
import WorldIcon from '@atlaskit/icon/glyph/world';
import Toggle from '@atlaskit/toggle';
import { OptionData } from '@atlaskit/user-picker';
import { userPickerData } from '@atlaskit/util-data-test/user-picker-data';
import { setSmartUserPickerEnv } from '@atlaskit/user-picker';
import { Appearance } from '@atlaskit/button/types';
import SectionMessage from '@atlaskit/section-message';
import { AnalyticsListener, UIAnalyticsEvent } from '@atlaskit/analytics-next';

import App from '../example-helpers/AppWithFlag';
import ContentPerms from '../example-helpers/ContentPerms';
import RestrictionMessage from '../example-helpers/RestrictionMessage';
import { ProductName, ShareDialogContainer } from '../src';
import {
  Comment,
  Content,
  DialogPlacement,
  KeysOfType,
  MetaData,
  OriginTracing,
  RenderCustomTriggerButton,
  ShareButtonStyle,
  ShareClient,
  ShareResponse,
  TooltipPosition,
  User,
  Integration,
  IntegrationContentProps,
} from '../src/types';
import {
  ShortenResponse,
  UrlShortenerClient,
  ShortenRequest,
} from '../src/clients/AtlassianUrlShortenerClient';
import SlackIcon from '../src/components/monochromeSlackIcon';
import Icon from '@atlaskit/icon';

const supportedLocales = [
  'en-US',
  'cs-CZ',
  'da-DK',
  'de-DE',
  'es-ES',
  'et-EE',
  'fi-FI',
  'fr-FR',
  'hu-HU',
  'is-IS',
  'it-IT',
  'ja-JP',
  'ko-KR',
  'nb-NB',
  'nl-NL',
  'pl-PL',
  'pt-BR',
  'pt-PT',
  'ro-RO',
  'ru-RU',
  'sk-SK',
  'sv-SE',
  'tr-TR',
  'th-TH',
  'uk-UK',
  'vi-VI',
  'zh-TW',
  'zh-HK',
  'zh-ZH',
  'zh-CN',
];

const loadReactLocaleData = () => {
  supportedLocales.forEach((locale: string) => {
    const languageCode = locale.split('-')[0];
    const data = require(`react-intl/locale-data/${languageCode}`);
    addLocaleData(data);
  });
};
loadReactLocaleData();

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
  customButton: boolean;
  customTitle: boolean;
  contentPermissions: boolean;
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
  isSplitButton: boolean;
  shareIntegrations: Array<Integration>;
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

const IntegrationContent = ({ onClose }: IntegrationContentProps) => {
  return (
    <>
      <div>Share to Integration form</div>
      <button onClick={onClose}>Close</button>
    </>
  );
};

const IntegrationIcon = () => (
  <Icon glyph={SlackIcon} label="Integration icon" size="small" />
);

setSmartUserPickerEnv('local');

export default class Example extends React.Component<{}, State> {
  state: State = {
    isAutoOpenDialog: false,
    customButton: false,
    customTitle: false,
    contentPermissions: false,
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
    isSplitButton: false,
    shareIntegrations: [],
    locales: supportedLocales,
    locale: 'en-US',
  };

  key: number = 0;

  share = (
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

  shareClient: ShareClient = {
    share: this.share,
  };

  urlShortenerClient: UrlShortenerClient = new MockUrlShortenerClient();

  render() {
    const {
      isAutoOpenDialog,
      customButton,
      customTitle,
      contentPermissions,
      customTooltipText,
      customTriggerButtonIcon,
      dialogPlacement,
      escapeOnKeyPress,
      hasFooter,
      triggerButtonAppearance,
      triggerButtonStyle,
      triggerButtonTooltipPosition,
      product,
      restrictionMessage,
      useUrlShortener,
      shortLinkData,
      enableSmartUserPicker,
      hasShareFieldsFooter,
      isCopyDisabled,
      isPublicLink,
      isSplitButton,
      shareIntegrations,
      locales,
      locale,
    } = this.state;

    const localeOptions = locales.map((l) => ({
      label: l,
      value: l,
    }));

    this.key++;
    return (
      <AnalyticsListener onEvent={listenerHandler} channel="fabric-elements">
        <IntlProvider locale={locale}>
          <App>
            {(showFlags) => (
              <>
                <h4>Share Component</h4>
                <WrapperWithMarginTop>
                  <ShareDialogContainer
                    isAutoOpenDialog={isAutoOpenDialog}
                    key={`key-${this.key}`}
                    shareClient={this.shareClient}
                    urlShortenerClient={this.urlShortenerClient}
                    cloudId={JDOG_CLOUD_ID}
                    dialogPlacement={dialogPlacement}
                    loadUserOptions={loadUserOptions}
                    originTracingFactory={originTracingFactory}
                    productId="confluence"
                    renderCustomTriggerButton={
                      customButton ? renderCustomTriggerButton : undefined
                    }
                    shareAri="ari"
                    shareContentType="issue"
                    shareFormTitle={customTitle ? 'Custom Title' : undefined}
                    contentPermissions={
                      contentPermissions ? <ContentPerms /> : undefined
                    }
                    shareTitle="My Share"
                    shouldCloseOnEscapePress={escapeOnKeyPress}
                    showFlags={showFlags}
                    enableSmartUserPicker={enableSmartUserPicker}
                    triggerButtonAppearance={triggerButtonAppearance}
                    triggerButtonIcon={
                      customTriggerButtonIcon ? WorldIcon : undefined
                    }
                    triggerButtonStyle={triggerButtonStyle}
                    triggerButtonTooltipText={
                      customTooltipText ? 'Custom Tooltip Text' : undefined
                    }
                    triggerButtonTooltipPosition={triggerButtonTooltipPosition}
                    bottomMessage={
                      restrictionMessage ? <RestrictionMessage /> : null
                    }
                    useUrlShortener={useUrlShortener}
                    shortLinkData={shortLinkData}
                    product={product}
                    customFooter={hasFooter ? <CustomFooter /> : undefined}
                    onUserSelectionChange={console.log}
                    shareFieldsFooter={
                      hasShareFieldsFooter ? <ShareFieldsFooter /> : undefined
                    }
                    onDialogOpen={() => {
                      console.log('Share Dialog Opened');
                    }}
                    isCopyDisabled={isCopyDisabled}
                    isPublicLink={isPublicLink}
                    shareIntegrations={
                      isSplitButton ? shareIntegrations : undefined
                    }
                  />
                </WrapperWithMarginTop>
                <h4>Options</h4>
                <div>
                  <WrapperWithMarginTop>
                    Is Public Link
                    <Toggle
                      isChecked={isPublicLink}
                      onChange={() =>
                        this.setState({ isPublicLink: !isPublicLink })
                      }
                    />
                  </WrapperWithMarginTop>
                  <WrapperWithMarginTop>
                    Is Copy Disabled
                    <Toggle
                      isChecked={isCopyDisabled}
                      onChange={() =>
                        this.setState({ isCopyDisabled: !isCopyDisabled })
                      }
                    />
                  </WrapperWithMarginTop>
                  <WrapperWithMarginTop>
                    Close Share Dialog on escape key press
                    <Toggle
                      isChecked={escapeOnKeyPress}
                      onChange={() =>
                        this.setState({ escapeOnKeyPress: !escapeOnKeyPress })
                      }
                    />
                  </WrapperWithMarginTop>
                  <WrapperWithMarginTop>
                    Custom Share Dialog Trigger Button
                    <Toggle
                      isChecked={customButton}
                      onChange={() =>
                        this.setState({ customButton: !customButton })
                      }
                    />
                  </WrapperWithMarginTop>
                  <WrapperWithMarginTop>
                    Custom Share Dialog Title
                    <Toggle
                      isChecked={customTitle}
                      onChange={() =>
                        this.setState({ customTitle: !customTitle })
                      }
                    />
                  </WrapperWithMarginTop>
                  <WrapperWithMarginTop>
                    Content Permissions in Share Dialog title
                    <Toggle
                      isChecked={contentPermissions}
                      onChange={() =>
                        this.setState({
                          contentPermissions: !contentPermissions,
                        })
                      }
                    />
                  </WrapperWithMarginTop>
                  <WrapperWithMarginTop>
                    Custom Trigger Button Tooltip Text
                    <Toggle
                      isChecked={customTooltipText}
                      onChange={() =>
                        this.setState({ customTooltipText: !customTooltipText })
                      }
                    />
                  </WrapperWithMarginTop>
                  <WrapperWithMarginTop>
                    Custom Trigger Button Icon
                    <Toggle
                      isChecked={customTriggerButtonIcon}
                      onChange={() =>
                        this.setState({
                          customTriggerButtonIcon: !customTriggerButtonIcon,
                        })
                      }
                    />
                  </WrapperWithMarginTop>
                  <WrapperWithMarginTop>
                    Show Restriction Message
                    <Toggle
                      isChecked={restrictionMessage}
                      onChange={() =>
                        this.setState({
                          restrictionMessage: !restrictionMessage,
                        })
                      }
                    />
                  </WrapperWithMarginTop>
                  <WrapperWithMarginTop>
                    Use URL shortener
                    <Toggle
                      isChecked={!!shortLinkData}
                      onChange={() =>
                        this.setState({
                          shortLinkData: shortLinkData
                            ? undefined
                            : {
                                product,
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
                      isChecked={useUrlShortener}
                      onChange={() =>
                        this.setState({ useUrlShortener: !useUrlShortener })
                      }
                    />
                  </WrapperWithMarginTop>
                  <WrapperWithMarginTop>
                    Auto open dialog
                    <Toggle
                      isChecked={isAutoOpenDialog}
                      onChange={() => {
                        // Because the onFocus of this toggle, the `@atlaskit/popup` dialog
                        // closes itself right after it's opened, when the focus is shifted.
                        setTimeout(() => {
                          this.setState({
                            isAutoOpenDialog: !isAutoOpenDialog,
                          });
                        }, 150);
                      }}
                    />
                  </WrapperWithMarginTop>
                  <WrapperWithMarginTop>
                    Custom Footer
                    <Toggle
                      isChecked={hasFooter}
                      onChange={() => this.setState({ hasFooter: !hasFooter })}
                    />
                  </WrapperWithMarginTop>
                  <WrapperWithMarginTop>
                    Enable Smart User Picker
                    <Toggle
                      isChecked={enableSmartUserPicker}
                      onChange={() =>
                        this.setState({
                          enableSmartUserPicker: !enableSmartUserPicker,
                        })
                      }
                    />
                  </WrapperWithMarginTop>
                  <WrapperWithMarginTop>
                    Share Fields Footer
                    <Toggle
                      isChecked={hasShareFieldsFooter}
                      onChange={() =>
                        this.setState({
                          hasShareFieldsFooter: !hasShareFieldsFooter,
                        })
                      }
                    />
                  </WrapperWithMarginTop>
                  <WrapperWithMarginTop>
                    Enable Split Button
                    <Toggle
                      isChecked={isSplitButton}
                      onChange={() =>
                        this.setState({
                          isSplitButton: !isSplitButton,
                          shareIntegrations: [
                            {
                              type: 'Slack',
                              Icon: IntegrationIcon,
                              Content: IntegrationContent,
                            },
                          ],
                        })
                      }
                    />
                  </WrapperWithMarginTop>
                  <WrapperWithMarginTop>
                    Dialog Placement
                    <Select
                      value={dialogPlacementOptions.find(
                        (option) => option.value === dialogPlacement,
                      )}
                      options={dialogPlacementOptions}
                      onChange={(option: any) =>
                        this.setState({ dialogPlacement: option.value })
                      }
                    />
                  </WrapperWithMarginTop>
                  <WrapperWithMarginTop>
                    Trigger Button Style
                    <Select<TriggerButtonStyleOption>
                      value={{
                        label: triggerButtonStyle,
                        value: triggerButtonStyle,
                      }}
                      options={triggerButtonStyleOptions}
                      onChange={(option: any) =>
                        this.setState({ triggerButtonStyle: option.value })
                      }
                    />
                  </WrapperWithMarginTop>
                  <WrapperWithMarginTop>
                    Trigger Button Appearance
                    <Select<TriggerButtonAppearanceOption>
                      value={{
                        label: triggerButtonAppearance,
                        value: triggerButtonAppearance,
                      }}
                      options={triggerButtonAppearanceOptions}
                      onChange={(option: any) =>
                        this.setState({ triggerButtonAppearance: option.value })
                      }
                    />
                  </WrapperWithMarginTop>
                  <WrapperWithMarginTop>
                    Trigger Button Tooltip Position
                    <Select<TriggerPositionOption>
                      value={{
                        label: triggerButtonTooltipPosition,
                        value: triggerButtonTooltipPosition,
                      }}
                      options={triggerButtonTooltipPositionOptions}
                      onChange={(option: any) =>
                        this.setState({
                          triggerButtonTooltipPosition: option.value,
                        })
                      }
                    />
                  </WrapperWithMarginTop>
                  <WrapperWithMarginTop>
                    Product
                    <Select
                      value={{
                        label: product,
                        value: product,
                      }}
                      options={[
                        { label: 'confluence', value: 'confluence' },
                        { label: 'jira', value: 'jira' },
                      ]}
                      onChange={(option: any) =>
                        this.setState({
                          product: option.value,
                        })
                      }
                    />
                  </WrapperWithMarginTop>
                  <WrapperWithMarginTop>
                    Locale
                    <Select
                      value={{
                        label: locale,
                        value: locale,
                      }}
                      options={localeOptions}
                      onChange={(option: any) =>
                        this.setState({
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
}
