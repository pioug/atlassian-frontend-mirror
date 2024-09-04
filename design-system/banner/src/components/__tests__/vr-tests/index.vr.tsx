import { snapshot, type SnapshotTestOptions } from '@af/visual-regression';

import BannerBasic from '../../../../examples/00-basic-usage';
import BannerAnnouncement from '../../../../examples/announcement-banner';
import BannerLongText from '../../../../examples/announcement-banner-with-long-text';
import BannerWithLink from '../../../../examples/banner-with-link';
import BannerError from '../../../../examples/error-banner';

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
