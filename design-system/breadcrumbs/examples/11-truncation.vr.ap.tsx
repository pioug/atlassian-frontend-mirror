import React from 'react';

import Breadcrumbs, { BreadcrumbsItem } from '@atlaskit/breadcrumbs';
import { BreadcrumbsCurrentItem } from '@atlaskit/breadcrumbs/breadcrumbs-current-item';
import ImageIcon from '@atlaskit/icon/core/image';
import { AtlassianIcon } from '@atlaskit/logo/atlassian-icon';
import { Box, Stack } from '@atlaskit/primitives/compiled';

const TestIcon = <AtlassianIcon label="" size="small" />;

export default (): React.JSX.Element => (
	// with trunaction and icons
	<div>
		<Breadcrumbs testId="MyBreadcrumbsTestId" defaultExpanded>
			<BreadcrumbsItem
				truncationWidth={200}
				href="/long"
				testId="truncation-tooltip-target"
				text="Supercalifragilisticexpialidocious"
			/>
			<BreadcrumbsItem truncationWidth={200} href="/short" text="Item" />
			<BreadcrumbsItem truncationWidth={200} href="/short" text="Another item" />
			<BreadcrumbsItem
				truncationWidth={200}
				href="/long"
				text="Long item name which should be truncated"
			/>
			<BreadcrumbsItem
				truncationWidth={200}
				href="/item"
				elemBefore={TestIcon}
				iconAfter={TestIcon}
				text="Before and after"
			/>
			<BreadcrumbsItem
				truncationWidth={200}
				href="/long"
				text="Another long item name which should be truncated"
			/>
			<BreadcrumbsItem truncationWidth={200} href="/short" text="Short item" />
			<BreadcrumbsItem
				truncationWidth={200}
				href="/item"
				elemBefore={TestIcon}
				iconAfter={TestIcon}
				text="Long content, icons before and after"
			/>
			<BreadcrumbsItem
				truncationWidth={300}
				href="/item"
				elemBefore={TestIcon}
				text="Before with text that could break truncation"
			/>
			<BreadcrumbsCurrentItem
				href="/current-page"
				text="Current page with a very long title that should be truncated"
				truncationWidth={200}
			/>
		</Breadcrumbs>
	</div>
);

export function ScalableBreadcrumbIcons(): React.JSX.Element {
	return (
		<Box padding="space.100">
			<Stack space="space.200">
				{(['medium', 'small'] as const).map((size) => (
					<Breadcrumbs key={size} size={size}>
						<BreadcrumbsItem
							href="/item"
							elemBefore={<ImageIcon label="" />}
							text="Project settings"
							truncationWidth={140}
							testId={`scalable-${size}`}
						/>
					</Breadcrumbs>
				))}
			</Stack>
		</Box>
	);
}
