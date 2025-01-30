/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { css, cssMap, jsx } from '@atlaskit/css';
import { token } from '@atlaskit/tokens';
import { type MediaType } from '@atlaskit/media-common';
import { getMimeIcon } from './util';
import { IconWrapper, MediaTypeIcon } from './media-type-icon';
import { fg } from '@atlaskit/platform-feature-flags';
type MediaTypeProps = {
	testId?: string;
	mediaType?: MediaType;
	mimeType?: string;
	name?: string;
	size?: 'small' | 'large';
};

const iconWrapperStyleMap = cssMap({
	small: {},
	large: {
		paddingTop: token('space.050', '4px'),
		paddingRight: token('space.050', '4px'),
		paddingBottom: token('space.050', '4px'),
		paddingLeft: token('space.050', '4px'),
	},
});

const iconWrapperStyles = css({
	display: 'inline-flex',
});

/*
 * Renders an icon. First, check if the mimeType corresponds to any of the special mimeType icons (.gif, .sketch, .exe, ect). If so, render that icon.
 * Else, render an icon corresponding to its mediaType (doc/audio/image/video/unknown)
 */
export const MimeTypeIcon = ({
	mediaType = 'unknown',
	mimeType = 'unknown',
	name = 'unknown',
	testId,
	size = 'large',
}: MediaTypeProps) => {
	// retrieve mimetype icon and label
	const iconInfo = getMimeIcon(mimeType, name);

	// a corresponding mimetype icon and label was found.
	if (iconInfo) {
		const Icon = iconInfo.icon;
		return fg('platform_media_compiled') ? (
			<div
				data-testid={testId}
				data-type={iconInfo.label}
				css={[iconWrapperStyles, iconWrapperStyleMap[size ?? 'small']]}
			>
				<Icon label={iconInfo.label} />
			</div>
		) : (
			<IconWrapper data-testid={testId} data-type={iconInfo.label} size={size}>
				<Icon label={iconInfo.label} />
			</IconWrapper>
		);
	}

	// no corresponding mimetype icon/label was found.
	// Hence, return a mediatype (image/doc/audio/video/unknown) icon
	return <MediaTypeIcon testId={testId} type={mediaType} size={size} />;
};
