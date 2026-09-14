import { wb, type WorkbenchExample } from '@atlassian/workbench';

import BasicUsageVrExample from './00-basic-usage.vr.ap';
import AnnouncementBannerWithLongTextVrExample from './announcement-banner-with-long-text.vr.ap';
import AnnouncementBannerVrExample from './announcement-banner.vr.ap';
import BannerWithLinkVrExample from './banner-with-link.vr.ap';
import ErrorBannerVrExample from './error-banner.vr.ap';
import OpenCloseExampleSource from './open-close-example';
import OverflowExampleSource from './overflow-example';
import TestingExample from './testing';

const BasicUsageVr: WorkbenchExample = wb(BasicUsageVrExample);

export default BasicUsageVr;
export const AnnouncementBannerWithLongTextVr: WorkbenchExample = wb(
	AnnouncementBannerWithLongTextVrExample,
);
export const AnnouncementBannerVr: WorkbenchExample = wb(AnnouncementBannerVrExample);
export const BannerWithLinkVr: WorkbenchExample = wb(BannerWithLinkVrExample);
export const ErrorBannerVr: WorkbenchExample = wb(ErrorBannerVrExample);
export const OpenCloseExample: WorkbenchExample = wb(OpenCloseExampleSource);
export const OverflowExample: WorkbenchExample = wb(OverflowExampleSource);
export const Testing: WorkbenchExample = wb(TestingExample);
