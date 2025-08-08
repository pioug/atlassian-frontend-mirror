import React from 'react';

import Breadcrumbs, { BreadcrumbsItem } from '@atlaskit/breadcrumbs';
import ImageIcon from '@atlaskit/icon/core/image';
import { AtlassianIcon } from '@atlaskit/logo';
import { Stack } from '@atlaskit/primitives/compiled';

const TestIcon = <AtlassianIcon label="" size="small" />;

export default () => (
	<Stack space="space.100">
		<p>@atlaskit/logo</p>
		<Breadcrumbs label="@atlaskit/logo">
			<BreadcrumbsItem href="/item" text="No icon" />
			<BreadcrumbsItem href="/item" iconBefore={TestIcon} text="Before" />
			<BreadcrumbsItem href="/item" iconAfter={TestIcon} text="After" />
			<BreadcrumbsItem
				href="/item"
				iconBefore={TestIcon}
				iconAfter={TestIcon}
				text="Before and after"
			/>
			<BreadcrumbsItem
				href="/item"
				iconBefore={TestIcon}
				iconAfter={TestIcon}
				text="Long content, icons before and after"
			/>
			<BreadcrumbsItem
				href="/item"
				iconBefore={TestIcon}
				iconAfter={TestIcon}
				text="Truncated content, icons before and after"
				truncationWidth={100}
			/>
		</Breadcrumbs>
		<p>@atlaskit/icon - no spacing</p>
		<Breadcrumbs label="@atlaskit/icon - no spacing">
			<BreadcrumbsItem href="/item" text="No icon" />
			<BreadcrumbsItem href="/item" iconBefore={<ImageIcon label="" />} text="Before" />
			<BreadcrumbsItem href="/item" iconAfter={<ImageIcon label="" />} text="After" />
			<BreadcrumbsItem
				href="/item"
				iconBefore={<ImageIcon label="" />}
				iconAfter={<ImageIcon label="" />}
				text="Before and after"
			/>
			<BreadcrumbsItem
				href="/item"
				iconBefore={<ImageIcon label="" />}
				iconAfter={<ImageIcon label="" />}
				text="Long content, icons before and after"
			/>
			<BreadcrumbsItem
				href="/item"
				iconBefore={<ImageIcon label="" />}
				iconAfter={<ImageIcon label="" />}
				text="Truncated content, icons before and after"
				truncationWidth={100}
			/>
		</Breadcrumbs>
		<p>@atlaskit/icon - spacing spacious</p>
		<Breadcrumbs label="@atlaskit/icon - spacing spacious">
			<BreadcrumbsItem href="/item" text="No icon" />
			<BreadcrumbsItem
				href="/item"
				iconBefore={<ImageIcon label="" spacing="spacious" />}
				text="Before"
			/>
			<BreadcrumbsItem
				href="/item"
				iconAfter={<ImageIcon label="" spacing="spacious" />}
				text="After"
			/>
			<BreadcrumbsItem
				href="/item"
				iconBefore={<ImageIcon label="" spacing="spacious" />}
				iconAfter={<ImageIcon label="" spacing="spacious" />}
				text="Before and after"
			/>
			<BreadcrumbsItem
				href="/item"
				iconBefore={<ImageIcon label="" spacing="spacious" />}
				iconAfter={<ImageIcon label="" spacing="spacious" />}
				text="Long content, icons before and after"
			/>
			<BreadcrumbsItem
				href="/item"
				iconBefore={<ImageIcon label="" spacing="spacious" />}
				iconAfter={<ImageIcon label="" spacing="spacious" />}
				text="Truncated content, icons before and after"
				truncationWidth={100}
			/>
		</Breadcrumbs>
	</Stack>
);
