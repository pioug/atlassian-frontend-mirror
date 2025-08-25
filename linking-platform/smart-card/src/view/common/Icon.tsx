/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import React from 'react';

import { css, jsx } from '@compiled/react';
import ImageLoader from 'react-render-image';

import LinkIcon from '@atlaskit/icon/core/migration/link';

export interface IconProps {
	/* Element to be displayed as an icon if icon not provided or icon url request return error. */
	defaultIcon?: React.ReactNode;
	/* Element to be displayed as an icon. We naively render this if it is provided. Allows us to pass in AK icons */
	icon?: React.ReactNode;
	/* A prop to determine whether the icon is a Flexible UI rendered Icon, used internally by Flexible UI and Hover Preview */
	isFlexibleUi?: boolean;
	/* A `testId` prop is provided for specified elements, which is a unique string that appears as a data attribute `data-testid` in the rendered code, serving as a hook for automated tests. */
	testId?: string;
	/* Url of the icon to be displayed. Note that this is only used if a JSX element is not provided */
	url?: string;
}

/**
 * Class name for selecting non-flexible block card icon image
 *
 * @deprecated {@link https://hello.jira.atlassian.cloud/browse/ENGHEALTH-6878 Internal documentation for deprecation (no external access)}
 * Using this selctor is deprecated as once the flexible block card feature flag is removed, this class will no longer be used.
 */
export const blockCardIconImageClassName = 'block-card-icon-image';

const imageStyles = css({
	height: '16px',
	width: '16px',
});

const spanStyles = css({
	height: '20px',
	width: '16px',
	display: 'flex',
	alignItems: 'center',
	justifyContent: 'center',
});

export const Icon = ({
	url,
	icon,
	defaultIcon,
	testId = 'block-card-icon',
	isFlexibleUi = false,
}: IconProps) => {
	const placeholder = defaultIcon || (
		<LinkIcon label="link" LEGACY_size="small" testId={`${testId}-default`} color="currentColor" />
	);

	const image = url && (
		<ImageLoader
			src={url}
			loaded={
				<img css={isFlexibleUi && imageStyles} src={url} alt="" data-testid={`${testId}-image`} />
			}
			errored={placeholder}
		/>
	);

	return (
		<span
			css={isFlexibleUi && spanStyles}
			data-testid={testId}
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-classname-prop -- Ignored via go/DSP-18766
			className={blockCardIconImageClassName}
		>
			{icon || image || placeholder}
		</span>
	);
};
