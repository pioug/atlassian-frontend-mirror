import { createTransformer } from '@atlaskit/codemod-utils';

import { wrapAkThemeProvider } from '../migrations/wrap-ak-theme-provider';

const transformer = createTransformer([wrapAkThemeProvider]);

const defineInlineTest = require('jscodeshift/dist/testUtils').defineInlineTest;

describe('convert ak-theme-provider usage', () => {
  const supportedParsers = ['tsx', 'babylon'];

  supportedParsers.forEach((parser) => {
    describe(`parser: ${parser}`, () => {
      defineInlineTest(
        { default: transformer, parser },
        {},
        `
import { AtlaskitThemeProvider } from '@atlaskit/theme';

const Element = () => (
  <AtlaskitThemeProvider />
);`,
        `
import { ThemeProvider as StyledThemeProvider } from "styled-components";
import DeprecatedThemeProvider from "@atlaskit/theme/deprecated-provider-please-do-not-use";

const Element = () => (
  <DeprecatedThemeProvider provider={StyledThemeProvider} />
);
`,
        'should change import if no props',
      );

      defineInlineTest(
        { default: transformer, parser },
        {},
        `
import { AtlaskitThemeProvider } from '@atlaskit/theme';

const Element = () => (
  <AtlaskitThemeProvider mode="light" />
);`,
        `
import { ThemeProvider as StyledThemeProvider } from "styled-components";
import DeprecatedThemeProvider from "@atlaskit/theme/deprecated-provider-please-do-not-use";

const Element = () => (
  <DeprecatedThemeProvider mode="light" provider={StyledThemeProvider} />
);`,
        'should change import if props are provided',
      );

      defineInlineTest(
        { default: transformer, parser },
        {},
        `
import { AtlaskitThemeProvider } from '@atlaskit/theme';

const Element = () => (
  <AtlaskitThemeProvider>
    <App />
  </AtlaskitThemeProvider>
);`,
        `
import { ThemeProvider as StyledThemeProvider } from "styled-components";
import DeprecatedThemeProvider from "@atlaskit/theme/deprecated-provider-please-do-not-use";

const Element = () => (
  <DeprecatedThemeProvider provider={StyledThemeProvider}>
    <App />
  </DeprecatedThemeProvider>
);
`,
        'should change import if no props with children',
      );

      defineInlineTest(
        { default: transformer, parser },
        {},
        `
import { AtlaskitThemeProvider } from '@atlaskit/theme';

const Element = () => (
  <AtlaskitThemeProvider mode="light">
    <App />
  </AtlaskitThemeProvider>
);`,
        `
import { ThemeProvider as StyledThemeProvider } from "styled-components";
import DeprecatedThemeProvider from "@atlaskit/theme/deprecated-provider-please-do-not-use";

const Element = () => (
  <DeprecatedThemeProvider mode="light" provider={StyledThemeProvider}>
    <App />
  </DeprecatedThemeProvider>
);`,
        'should change import if props are provided with children',
      );
      defineInlineTest(
        { default: transformer, parser },
        {},
        `
import { AtlaskitThemeProvider, colors } from "@atlaskit/theme";

const Element = () => (
  <AtlaskitThemeProvider mode="light">
    <App color={colors.red} />
  </AtlaskitThemeProvider>
);`,
        `
import { ThemeProvider as StyledThemeProvider } from "styled-components";
import DeprecatedThemeProvider from "@atlaskit/theme/deprecated-provider-please-do-not-use";
import { colors } from "@atlaskit/theme";

const Element = () => (
  <DeprecatedThemeProvider mode="light" provider={StyledThemeProvider}>
    <App color={colors.red} />
  </DeprecatedThemeProvider>
);`,
        'should only remove AKThemeProvider if AKThemeProvider is not only import from "theme"',
      );

      defineInlineTest(
        { default: transformer, parser },
        {},
        `
import styled, { ThemeProvider as StyledThemeProvider } from "styled-components";
import { AtlaskitThemeProvider } from "@atlaskit/theme";

const Element = () => (
  <AtlaskitThemeProvider mode="light">
    <App />
  </AtlaskitThemeProvider>
);`,
        `
import styled, { ThemeProvider as StyledThemeProvider } from "styled-components";
import { AtlaskitThemeProvider } from "@atlaskit/theme";

const Element = () => (
  <AtlaskitThemeProvider mode="light">
    <App />
  </AtlaskitThemeProvider>
);`,
        'should abort if styled-components ThemeProvider is already imported',
      );

      defineInlineTest(
        { default: transformer, parser },
        {},
        `
import styled, { ThemeProvider as StyledThemeProvider } from "styled-components";
import { themed } from "@atlaskit/theme/components";
import DeprecatedThemeProvider from "@atlaskit/theme/deprecated-provider-please-do-not-use";

const Element = () => (
  <DeprecatedThemeProvider mode="light" provider={StyledThemeProvider}>
    <App />
  </DeprecatedThemeProvider>
);`,
        `
import styled, { ThemeProvider as StyledThemeProvider } from "styled-components";
import { themed } from "@atlaskit/theme/components";
import DeprecatedThemeProvider from "@atlaskit/theme/deprecated-provider-please-do-not-use";

const Element = () => (
  <DeprecatedThemeProvider mode="light" provider={StyledThemeProvider}>
    <App />
  </DeprecatedThemeProvider>
);`,
        'should abort if the codemod has already changed usage to "@atlaskit/theme/deprecated-provider-please-do-not-use"',
      );

      defineInlineTest(
        { default: transformer, parser },
        {},
        `
        import React, { FC, Fragment, useEffect, useState } from "react";
        import { Subscribe } from "unstated";

        import { AtlaskitThemeProvider } from "@atlaskit/theme/components";
        import { BannerStateContainer } from "@confluence/banners";
        import { Attribution, ErrorBoundary } from "@confluence/error-boundary";
        import { NavigationIntegration } from "@confluence/navigation-integration";
        import { WebPanelLocation } from "@confluence/web-panel-location";
        import { ReturnToMobile } from "@confluence/return-to-mobile";
        import { PerformanceEnd, PERFORMANCE_SUBJECTS } from "@confluence/performance";
        import { ExperimentsController } from "@confluence/experiment-react";
        import { useBooleanFeatureFlag } from "@confluence/session-data";
        import { useRightSidebarContext } from "@confluence/page-layout-context";

        import { MainLayoutQuery_space_lookAndFeel_content_screen as MainLayoutScreenType } from "./__types__/MainLayoutQuery";
        import {
          ContentBodyWrapper,
          MainContentContainer,
          WebPanelWrapper,
          ContentBody,
          GlobalImagePreviewStyling,
        } from "./styledComponents";

        const WEB_FRAGMENT_LOCATIONS = {
          ATL_GENERAL: "atl.general",
          ATL_FOOTER: "atl.footer",
        };

        export type MainLayoutComponentProps = {
          children: React.ReactElement;
          enableNavigation?: boolean;
          disableMinWidth?: boolean;
          screen?: MainLayoutScreenType;
          navView?: string;
        };

        export const MainLayoutComponent: FC<MainLayoutComponentProps> = ({
          navView,
          enableNavigation = true,
          disableMinWidth,
          screen,
          children,
        }) => {
          const isEnableRightSidebarEnabled = useBooleanFeatureFlag(
            "confluence.frontend.in-product.help"
          );
          const rightSidebarContext = useRightSidebarContext();
          const [enableRightSidebarCSS, setEnableRightSidebarCSS] = useState(false);

          const topElementStyle = {};
          if (screen) {
            for (const key in screen) {
              if (screen.hasOwnProperty(key)) {
                if (key.startsWith("background")) {
                  topElementStyle[key] = screen[key];
                }
              }
            }
          }

          useEffect(() => {
            if (isEnableRightSidebarEnabled && rightSidebarContext.getCurrent()) {
              setEnableRightSidebarCSS(true);
            }
          }, [isEnableRightSidebarEnabled, rightSidebarContext]);

          const content = children ? (
            <ErrorBoundary attribution={Attribution.BACKBONE}>
              <MainContentContainer
                isEnableRightSidebarEnabled={enableRightSidebarCSS}
                disableMinWidth={disableMinWidth || !enableNavigation}
                data-test-id="confluence-main-content"
              >
                <WebPanelWrapper>
                  <WebPanelLocation location={WEB_FRAGMENT_LOCATIONS.ATL_GENERAL} />
                </WebPanelWrapper>
                {/*Banner to allow user to switch from desktop to mobile version*/}
                <ReturnToMobile />

                <AtlaskitThemeProvider mode="light">
                  <Subscribe to={[BannerStateContainer]}>
                    {(bannerState: BannerStateContainer) => (
                      <ContentBodyWrapper>
                        <ContentBody
                          id="content-body"
                          topElementStyle={topElementStyle}
                          bannerHeight={bannerState.getTotalHeight()}
                        >
                          {children}
                        </ContentBody>
                      </ContentBodyWrapper>
                    )}
                  </Subscribe>
                  <WebPanelWrapper>
                    <WebPanelLocation location={WEB_FRAGMENT_LOCATIONS.ATL_FOOTER} />
                  </WebPanelWrapper>
                </AtlaskitThemeProvider>
              </MainContentContainer>
            </ErrorBoundary>
          ) : null;

          return (
            <Fragment>
              <ExperimentsController>
                <Fragment>
                  {enableNavigation ? (
                    <NavigationIntegration view={navView}>
                      {content}
                    </NavigationIntegration>
                  ) : (
                    content
                  )}
                </Fragment>
              </ExperimentsController>
              <GlobalImagePreviewStyling />
              <PerformanceEnd subject={PERFORMANCE_SUBJECTS.mainLayout} />
            </Fragment>
          );
        };
        `,
        `
        import React, { FC, Fragment, useEffect, useState } from "react";
        import { Subscribe } from "unstated";

        import { ThemeProvider as StyledThemeProvider } from "styled-components";
        import DeprecatedThemeProvider from "@atlaskit/theme/deprecated-provider-please-do-not-use";
        import { BannerStateContainer } from "@confluence/banners";
        import { Attribution, ErrorBoundary } from "@confluence/error-boundary";
        import { NavigationIntegration } from "@confluence/navigation-integration";
        import { WebPanelLocation } from "@confluence/web-panel-location";
        import { ReturnToMobile } from "@confluence/return-to-mobile";
        import { PerformanceEnd, PERFORMANCE_SUBJECTS } from "@confluence/performance";
        import { ExperimentsController } from "@confluence/experiment-react";
        import { useBooleanFeatureFlag } from "@confluence/session-data";
        import { useRightSidebarContext } from "@confluence/page-layout-context";

        import { MainLayoutQuery_space_lookAndFeel_content_screen as MainLayoutScreenType } from "./__types__/MainLayoutQuery";
        import {
          ContentBodyWrapper,
          MainContentContainer,
          WebPanelWrapper,
          ContentBody,
          GlobalImagePreviewStyling,
        } from "./styledComponents";

        const WEB_FRAGMENT_LOCATIONS = {
          ATL_GENERAL: "atl.general",
          ATL_FOOTER: "atl.footer",
        };

        export type MainLayoutComponentProps = {
          children: React.ReactElement;
          enableNavigation?: boolean;
          disableMinWidth?: boolean;
          screen?: MainLayoutScreenType;
          navView?: string;
        };

        export const MainLayoutComponent: FC<MainLayoutComponentProps> = ({
          navView,
          enableNavigation = true,
          disableMinWidth,
          screen,
          children,
        }) => {
          const isEnableRightSidebarEnabled = useBooleanFeatureFlag(
            "confluence.frontend.in-product.help"
          );
          const rightSidebarContext = useRightSidebarContext();
          const [enableRightSidebarCSS, setEnableRightSidebarCSS] = useState(false);

          const topElementStyle = {};
          if (screen) {
            for (const key in screen) {
              if (screen.hasOwnProperty(key)) {
                if (key.startsWith("background")) {
                  topElementStyle[key] = screen[key];
                }
              }
            }
          }

          useEffect(() => {
            if (isEnableRightSidebarEnabled && rightSidebarContext.getCurrent()) {
              setEnableRightSidebarCSS(true);
            }
          }, [isEnableRightSidebarEnabled, rightSidebarContext]);

          const content = children ? (
            <ErrorBoundary attribution={Attribution.BACKBONE}>
              <MainContentContainer
                isEnableRightSidebarEnabled={enableRightSidebarCSS}
                disableMinWidth={disableMinWidth || !enableNavigation}
                data-test-id="confluence-main-content"
              >
                <WebPanelWrapper>
                  <WebPanelLocation location={WEB_FRAGMENT_LOCATIONS.ATL_GENERAL} />
                </WebPanelWrapper>
                {/*Banner to allow user to switch from desktop to mobile version*/}
                <ReturnToMobile />

                <DeprecatedThemeProvider mode="light" provider={StyledThemeProvider}>
                  <Subscribe to={[BannerStateContainer]}>
                    {(bannerState: BannerStateContainer) => (
                      <ContentBodyWrapper>
                        <ContentBody
                          id="content-body"
                          topElementStyle={topElementStyle}
                          bannerHeight={bannerState.getTotalHeight()}
                        >
                          {children}
                        </ContentBody>
                      </ContentBodyWrapper>
                    )}
                  </Subscribe>
                  <WebPanelWrapper>
                    <WebPanelLocation location={WEB_FRAGMENT_LOCATIONS.ATL_FOOTER} />
                  </WebPanelWrapper>
                </DeprecatedThemeProvider>
              </MainContentContainer>
            </ErrorBoundary>
          ) : null;

          return (
            <Fragment>
              <ExperimentsController>
                <Fragment>
                  {enableNavigation ? (
                    <NavigationIntegration view={navView}>
                      {content}
                    </NavigationIntegration>
                  ) : (
                    content
                  )}
                </Fragment>
              </ExperimentsController>
              <GlobalImagePreviewStyling />
              <PerformanceEnd subject={PERFORMANCE_SUBJECTS.mainLayout} />
            </Fragment>
          );
        };
        `,
        'should cleanup correctly in complex example"',
      );

      defineInlineTest(
        { default: transformer, parser },
        {},
        `
        import React from "react";
        import { FormattedMessage, IntlProvider } from "react-intl-next";
        import { render, screen } from '@testing-library/react';
        import { AtlaskitThemeProvider } from "@atlaskit/theme";
        import { Link } from "@confluence/route-manager";
        import {
          mockAndMount,
          nextTick,
          getWindowLocationMocks,
          mockWindowLocationMethods,
          unmockWindowLocationMethods,
        } from "@confluence/testing-utils";
        import { setSuperAdminClaim } from "@confluence/super-admin-claim";
        import { FlagsStateContainer } from "@confluence/flags";
        import {
          confluenceLocalStorageInstance as localStorage,
          initializeStorageManager,
        } from "@confluence/storage-manager";
        import { AdminKeyMessageCard } from "../AdminKeyMessageCard";
        import {
          superAdminEntryPoint,
          superAdminEntryPointSuccess,
          superAdminEntryPointFailure,
          superAdminEntryPointFailureWithFlag,
          superAdminEntryPointSuccessWithFlag,
        } from "../__fixtures__/SuperAdminEntryPoint-fixture";
        import {
          EntryPointActions,
          SuperAdminEntryPointComponent,
        } from "../SuperAdminEntryPoint";

        initializeStorageManager({ userId: "testId" });

        beforeAll(mockWindowLocationMethods);
        afterAll(unmockWindowLocationMethods);

        jest.mock("@confluence/super-admin-claim", () => ({
          setSuperAdminClaim: jest.fn(),
        }));

        const flags = new FlagsStateContainer();
        let superAdminEntryPointComponent;

        beforeEach(async () => {
          superAdminEntryPointComponent = await mockAndMount(superAdminEntryPoint);
        });

        it("snapshot", () => {
          const intlProvider = new IntlProvider({ locale: "en" }, {});
          const { intl } = intlProvider.getChildContext();

          render(
            <SuperAdminEntryPointComponent
              intl={intl}
              createAnalyticsEvent={jest.fn()}
            />
          );
          expect(screen).toMatchSnapshot();
        });

        describe("i18n", () => {
          it("should render the 'start session' action with correct text", async () => {
            expect(
              superAdminEntryPointComponent
                .find(AtlaskitThemeProvider)
                .find(EntryPointActions)
                .find("ForwardRef(CustomThemeButton)")
                .find(FormattedMessage)
                .at(0)
                .props().id
            ).toBe("super-admin.start.session");
          });
        });`,
        `
        import React from "react";
        import { FormattedMessage, IntlProvider } from "react-intl-next";
        import { render, screen } from '@testing-library/react';
        import { AtlaskitThemeProvider } from "@atlaskit/theme";
        import { Link } from "@confluence/route-manager";
        import {
          mockAndMount,
          nextTick,
          getWindowLocationMocks,
          mockWindowLocationMethods,
          unmockWindowLocationMethods,
        } from "@confluence/testing-utils";
        import { setSuperAdminClaim } from "@confluence/super-admin-claim";
        import { FlagsStateContainer } from "@confluence/flags";
        import {
          confluenceLocalStorageInstance as localStorage,
          initializeStorageManager,
        } from "@confluence/storage-manager";
        import { AdminKeyMessageCard } from "../AdminKeyMessageCard";
        import {
          superAdminEntryPoint,
          superAdminEntryPointSuccess,
          superAdminEntryPointFailure,
          superAdminEntryPointFailureWithFlag,
          superAdminEntryPointSuccessWithFlag,
        } from "../__fixtures__/SuperAdminEntryPoint-fixture";
        import {
          EntryPointActions,
          SuperAdminEntryPointComponent,
        } from "../SuperAdminEntryPoint";

        initializeStorageManager({ userId: "testId" });

        beforeAll(mockWindowLocationMethods);
        afterAll(unmockWindowLocationMethods);

        jest.mock("@confluence/super-admin-claim", () => ({
          setSuperAdminClaim: jest.fn(),
        }));

        const flags = new FlagsStateContainer();
        let superAdminEntryPointComponent;

        beforeEach(async () => {
          superAdminEntryPointComponent = await mockAndMount(superAdminEntryPoint);
        });

        it("snapshot", () => {
          const intlProvider = new IntlProvider({ locale: "en" }, {});
          const { intl } = intlProvider.getChildContext();

          render(
            <SuperAdminEntryPointComponent
              intl={intl}
              createAnalyticsEvent={jest.fn()}
            />
          );
          expect(screen).toMatchSnapshot();
        });

        describe("i18n", () => {
          it("should render the 'start session' action with correct text", async () => {
            expect(
              superAdminEntryPointComponent
                .find(AtlaskitThemeProvider)
                .find(EntryPointActions)
                .find("ForwardRef(CustomThemeButton)")
                .find(FormattedMessage)
                .at(0)
                .props().id
            ).toBe("super-admin.start.session");
          });
        });`,
        'should deal with non-jsx usage, eg in tests"',
      );
    });
  });
});
