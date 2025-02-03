import { snapshot } from '@af/visual-regression';

import BreadcrumbsBasic from '../../../../examples/0-basic';
import BreadcrumbsExpandable, {
	BreadcrumbsExpandableDefaultIsExpanded,
} from '../../../../examples/1-long';
import BreadcrumbsTruncation from '../../../../examples/11-truncation';
import BreadcrumbsWithElementToSide from '../../../../examples/14-with-element-next-to-breadcrumbs';
import BreadcrumbsWithIcons from '../../../../examples/4-icons';
import BreadcrumbsWithMarkup from '../../../../examples/5-with-markup';
import BreadcrumbsWithManyItems from '../../../../examples/7-many-in-container';

snapshot(BreadcrumbsBasic, { description: 'basic' });

snapshot(BreadcrumbsExpandable, { description: 'collapsed' });

snapshot(BreadcrumbsExpandableDefaultIsExpanded, { description: 'expanded' });

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
});

snapshot(BreadcrumbsWithIcons, { description: 'with icons' });

// The value of this test seems a bit questionable, consider deleting
// or replacing with a unit test
snapshot(BreadcrumbsWithMarkup, { description: 'with markup' });

snapshot(BreadcrumbsWithManyItems, { description: 'with many items' });

snapshot(BreadcrumbsWithElementToSide, { description: 'with elements to side' });
