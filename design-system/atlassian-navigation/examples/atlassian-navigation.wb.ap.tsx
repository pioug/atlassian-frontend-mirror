import { wb, type WorkbenchExample } from '@atlassian/workbench';

import JiraIntegrationExampleSource from './00-jira-integration-example';
import NestedMenuExampleSource from './01-nested-menu-example';
import AuthenticatedExampleSource from './10-authenticated-example';
import CustomLogoWithCustomMaxWidthExample from './100-custom-logo-with-custom-max-width';
import JiraWithSearchInDropdownExampleSource from './110-jira-with-search-in-dropdown-example';
import AnonymousExampleSource from './20-anonymous-example';
import CustomProductHomeTestingExample from './25-custom-product-home-testing';
import CustomProductHomeExampleSource from './30-custom-product-home-example';
import InteractiveSkeletonExampleSource from './40-interactive-skeleton-example';
import ThemingExampleSource from './50-theming-example';
import ThemingTestingExample from './55-theming-testing';
import ThemingTestingAppHomeExample from './56-theming-testing-app-home';
import ThemedSkeletonExampleSource from './60-themed-skeleton-example';
import AnalyticsExampleSource from './70-analytics-example';
import SkeletonButtonsExample from './80-skeleton-buttons';
import WideCustomLogoExample from './90-wide-custom-logo';
import AdaptiveItemsExample from './adaptive-items';
import AppSwitcherExample from './app-switcher';
import AsyncItemsExample from './async-items';
import BarebonesExample from './barebones';
import CreateExample from './create';
import CreateWithLinkExample from './create-with-link';
import CustomProductHomeSource from './custom-product-home';
import DifferentLanguagesExample from './different-languages';
import DifferentLanguagesTestingExample from './different-languages-testing';
import FalsyItemsExample from './falsy-items';
import HelpButtonExample from './help-button';
import LogoMaxWidthExample from './logo-max-width';
import LogoMaxWidthTestingExample from './logo-max-width-testing';
import NotificationsExample from './notifications';
import OverflowMenuExample from './overflow-menu';
import PrimaryButtonExample from './primary-button';
import PrimaryDropdownButtonExample from './primary-dropdown-button';
import ProductHomeExample from './product-home';
import ProfileExample from './profile';
import SearchExample from './search';
import ServerSideRenderingExample from './server-side-rendering';
import SettingsExample from './settings';
import SignInExample from './sign-in';
import SkeletonCreateAndIconButtonsExample from './skeleton-create-and-icon-buttons';
import SkeletonPrimaryButtonsExample from './skeleton-primary-buttons';
import ThemedNavigationExample from './themed-navigation';

const JiraIntegrationExample: WorkbenchExample = wb(JiraIntegrationExampleSource);

export default JiraIntegrationExample;
export const NestedMenuExample: WorkbenchExample = wb(NestedMenuExampleSource);
export const AuthenticatedExample: WorkbenchExample = wb(AuthenticatedExampleSource);
export const CustomLogoWithCustomMaxWidth: WorkbenchExample = wb(
	CustomLogoWithCustomMaxWidthExample,
);
export const JiraWithSearchInDropdownExample: WorkbenchExample = wb(
	JiraWithSearchInDropdownExampleSource,
);
export const AnonymousExample: WorkbenchExample = wb(AnonymousExampleSource);
export const CustomProductHomeTesting: WorkbenchExample = wb(CustomProductHomeTestingExample);
export const CustomProductHomeExample: WorkbenchExample = wb(CustomProductHomeExampleSource);
export const InteractiveSkeletonExample: WorkbenchExample = wb(InteractiveSkeletonExampleSource);
export const ThemingExample: WorkbenchExample = wb(ThemingExampleSource);
export const ThemingTesting: WorkbenchExample = wb(ThemingTestingExample);
export const ThemingTestingAppHome: WorkbenchExample = wb(ThemingTestingAppHomeExample);
export const ThemedSkeletonExample: WorkbenchExample = wb(ThemedSkeletonExampleSource);
export const AnalyticsExample: WorkbenchExample = wb(AnalyticsExampleSource);
export const SkeletonButtons: WorkbenchExample = wb(SkeletonButtonsExample);
export const WideCustomLogo: WorkbenchExample = wb(WideCustomLogoExample);
export const AdaptiveItems: WorkbenchExample = wb(AdaptiveItemsExample);
export const AppSwitcher: WorkbenchExample = wb(AppSwitcherExample);
export const AsyncItems: WorkbenchExample = wb(AsyncItemsExample);
export const Barebones: WorkbenchExample = wb(BarebonesExample);
export const Create: WorkbenchExample = wb(CreateExample);
export const CreateWithLink: WorkbenchExample = wb(CreateWithLinkExample);
export const CustomProductHome: WorkbenchExample = wb(CustomProductHomeSource);
export const DifferentLanguages: WorkbenchExample = wb(DifferentLanguagesExample);
export const DifferentLanguagesTesting: WorkbenchExample = wb(DifferentLanguagesTestingExample);
export const FalsyItems: WorkbenchExample = wb(FalsyItemsExample);
export const HelpButton: WorkbenchExample = wb(HelpButtonExample);
export const LogoMaxWidth: WorkbenchExample = wb(LogoMaxWidthExample);
export const LogoMaxWidthTesting: WorkbenchExample = wb(LogoMaxWidthTestingExample);
export const Notifications: WorkbenchExample = wb(NotificationsExample);
export const OverflowMenu: WorkbenchExample = wb(OverflowMenuExample);
export const PrimaryButton: WorkbenchExample = wb(PrimaryButtonExample);
export const PrimaryDropdownButton: WorkbenchExample = wb(PrimaryDropdownButtonExample);
export const ProductHome: WorkbenchExample = wb(ProductHomeExample);
export const Profile: WorkbenchExample = wb(ProfileExample);
export const Search: WorkbenchExample = wb(SearchExample);
export const ServerSideRendering: WorkbenchExample = wb(ServerSideRenderingExample);
export const Settings: WorkbenchExample = wb(SettingsExample);
export const SignIn: WorkbenchExample = wb(SignInExample);
export const SkeletonCreateAndIconButtons: WorkbenchExample = wb(
	SkeletonCreateAndIconButtonsExample,
);
export const SkeletonPrimaryButtons: WorkbenchExample = wb(SkeletonPrimaryButtonsExample);
export const ThemedNavigation: WorkbenchExample = wb(ThemedNavigationExample);
