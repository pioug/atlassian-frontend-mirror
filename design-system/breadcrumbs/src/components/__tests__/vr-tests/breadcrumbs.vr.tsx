import { snapshot } from '@af/visual-regression';

import BreadcrumbsBasic from '../../../../examples/0-basic';
import BreadcrumbsExpandable, {
	BreadcrumbsExpandableDefaultIsExpanded,
} from '../../../../examples/1-long';
import BreadcrumbsTruncation from '../../../../examples/11-truncation';
import BreadcrumbsWithElementToSide from '../../../../examples/14-with-element-next-to-breadcrumbs';
import BreadcrumbsWithIcons from '../../../../examples/4-icons';
import BreadcrumbsWithManyItems from '../../../../examples/7-many-in-container';

snapshot(BreadcrumbsBasic, {
	description: 'basic',
	featureFlags: {
		platform_dst_breadcrumbs_step_conversion: [true, false],
	},
});

snapshot(BreadcrumbsExpandable, {
	description: 'collapsed',
	featureFlags: {
		platform_dst_breadcrumbs_step_conversion: [true, false],
	},
});

snapshot(BreadcrumbsExpandableDefaultIsExpanded, {
	description: 'expanded',
	featureFlags: {
		platform_dst_breadcrumbs_step_conversion: [true, false],
	},
});

snapshot(BreadcrumbsTruncation, {
	description: 'truncation tooltip',
	drawsOutsideBounds: true,
	states: [
		{
			state: 'hovered',
			selector: {
				byRole: 'link',
				options: {
					name: 'Long item name which should be truncated',
					exact: true,
				},
			},
		},
	],
	featureFlags: {
		platform_dst_breadcrumbs_step_conversion: [true, false],
	},
});

snapshot(BreadcrumbsWithIcons, {
	description: 'with icons',
	featureFlags: {
		platform_dst_breadcrumbs_step_conversion: [true, false],
	},
});

snapshot(BreadcrumbsWithManyItems, {
	description: 'with many items',
	featureFlags: {
		platform_dst_breadcrumbs_step_conversion: [true, false],
	},
});

snapshot(BreadcrumbsWithElementToSide, {
	description: 'with elements to side',
	featureFlags: {
		platform_dst_breadcrumbs_step_conversion: [true, false],
	},
});
