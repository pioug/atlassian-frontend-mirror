/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import React from 'react';

import { css, jsx } from '@compiled/react';

import Breadcrumbs, { BreadcrumbsItem } from '@atlaskit/breadcrumbs';
import { BreadcrumbsCurrentItem } from '@atlaskit/breadcrumbs/breadcrumbs-current-item';
import { token } from '@atlaskit/tokens';

const resizableContainerStyles = css({
	boxSizing: 'border-box',
	width: '100%',
	minWidth: '160px',
	maxWidth: '100%',
	borderColor: token('color.border'),
	borderRadius: token('radius.small'),
	borderStyle: 'dashed',
	borderWidth: token('border.width'),
	overflow: 'auto',
	paddingBlock: token('space.100'),
	paddingInline: token('space.150'),
	resize: 'horizontal',
});

const BreadcrumbsRefreshOverflowExample = (): React.JSX.Element => {
	return (
		<div css={resizableContainerStyles}>
			<Breadcrumbs ellipsisLabel="Show more breadcrumbs">
				<BreadcrumbsItem href="/" text="Atlassian Design System" />
				<BreadcrumbsItem href="/components" text="Components" />
				<BreadcrumbsItem href="/components/breadcrumbs" text="Breadcrumbs" />
				<BreadcrumbsItem href="/components/breadcrumbs/examples" text="Examples" />
				<BreadcrumbsItem href="/components/breadcrumbs/code" text="Code" />
				<BreadcrumbsItem href="/components/breadcrumbs/usage" text="Usage" />
				<BreadcrumbsCurrentItem href="/components/breadcrumbs/accessibility" text="Accessibility" />
			</Breadcrumbs>
		</div>
	);
};

export default BreadcrumbsRefreshOverflowExample;
