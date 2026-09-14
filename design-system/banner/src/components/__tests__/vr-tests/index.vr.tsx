import { snapshot, type SnapshotTestOptions } from '@af/visual-regression';

import BannerBasic from '../../../../examples/00-basic-usage.vr.ap';
import BannerLongText from '../../../../examples/announcement-banner-with-long-text.vr.ap';
import BannerAnnouncement from '../../../../examples/announcement-banner.vr.ap';
import BannerWithLink from '../../../../examples/banner-with-link.vr.ap';
import BannerError from '../../../../examples/error-banner.vr.ap';

const colorVariants: SnapshotTestOptions<{}>['variants'] = [
	{
		name: 'light',
		environment: {
			colorScheme: 'light',
		},
	},
	{
		name: 'none',
		environment: {
			colorScheme: 'no-preference',
		},
	},
];

snapshot(BannerBasic, { variants: colorVariants });
snapshot(BannerAnnouncement, { variants: colorVariants });
snapshot(BannerError, { variants: colorVariants });
snapshot(BannerWithLink, { variants: colorVariants });
snapshot(BannerLongText);
