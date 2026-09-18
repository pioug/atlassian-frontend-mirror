import { snapshot } from '@af/visual-regression';

import BreadcrumbsBasic from '../../../../examples/0-basic.vr.ap';
import BreadcrumbsExpandable, {
	BreadcrumbsExpandableDefaultIsExpanded,
} from '../../../../examples/1-long.vr.ap';
import BreadcrumbsWithIcons from '../../../../examples/4-icons.vr.ap';
import BreadcrumbsPrimitives from '../../../../examples/6-primitives.vr.ap';
import BreadcrumbsWithManyItems from '../../../../examples/7-many-in-container.vr.ap';
import BreadcrumbsTruncation from '../../../../examples/11-truncation.vr.ap';
import BreadcrumbsSkeleton from '../../../../examples/12-skeleton.vr.ap';
import BreadcrumbsWithElementToSide from '../../../../examples/14-with-element-next-to-breadcrumbs.vr.ap';

const refreshFlagVariants = {
	'platform_dst_breadcrumbs-refresh': [false, true],
} as const;

snapshot(BreadcrumbsBasic, {
	description: 'basic',
	featureFlags: refreshFlagVariants,
});

snapshot(BreadcrumbsExpandable, {
	description: 'collapsed',
	featureFlags: refreshFlagVariants,
});

snapshot(BreadcrumbsExpandableDefaultIsExpanded, {
	description: 'expanded',
	featureFlags: refreshFlagVariants,
});

snapshot(BreadcrumbsTruncation, {
	description: 'truncation tooltip',
	drawsOutsideBounds: true,
	featureFlags: refreshFlagVariants,
	states: [
		{
			state: 'hovered',
			selector: {
				byTestId: 'truncation-tooltip-target',
			},
		},
	],
});

snapshot(BreadcrumbsSkeleton, {
	description: 'skeleton',
});

snapshot(BreadcrumbsWithIcons, {
	description: 'with icons',
	featureFlags: refreshFlagVariants,
});

snapshot(BreadcrumbsPrimitives, {
	description: 'primitives',
	featureFlags: refreshFlagVariants,
});

snapshot(BreadcrumbsWithManyItems, {
	description: 'with many items',
	featureFlags: refreshFlagVariants,
});

snapshot(BreadcrumbsWithElementToSide, {
	description: 'with elements to side',
	featureFlags: refreshFlagVariants,
});
