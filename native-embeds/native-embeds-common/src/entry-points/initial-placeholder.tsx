/**
 * @jsxRuntime classic
 * @jsx jsx
 */

import React from 'react';

import { css, jsx } from '@compiled/react';
// eslint-disable-next-line @atlaskit/ui-styling-standard/no-global-styles, @atlaskit/ui-styling-standard/use-compiled -- Native embed placement must style renderer/editor ancestor wrappers that this component does not own.
import { Global } from '@emotion/react';

import { token } from '@atlaskit/tokens';

import {
	NATIVE_EMBED_INITIAL_LAYOUT_FALLBACK_ASPECT_RATIO,
	resolveNativeEmbedInitialLayout,
	type NativeEmbedInitialLayout,
	type ResolveNativeEmbedInitialLayoutInput,
} from './initial-layout';
import { nativeEmbedAlignmentStyles } from './native-embed-styles';

export { resolveNativeEmbedInitialLayout, type NativeEmbedInitialLayout };

const placeholderFrameStyles = css({
	boxSizing: 'border-box',
	maxWidth: '100%',
	overflow: 'hidden',
	backgroundColor: token('elevation.surface.sunken'),
});

const borderedPlaceholderFrameStyles = css({
	borderStyle: 'solid',
	borderWidth: token('border.width'),
	borderColor: token('color.border'),
	borderRadius: token('radius.xlarge'),
});

const borderlessPlaceholderFrameStyles = css({
	borderRadius: token('radius.small'),
});

export type NativeEmbedInitialPlaceholderFrameProps = Pick<
	NativeEmbedInitialLayout,
	'effectiveHeight' | 'effectiveWidth' | 'lockAspectRatio'
> & {
	hasEmbedBorder?: boolean;
	placeholderId?: string;
	testId?: string;
};

export const NativeEmbedInitialPlaceholderFrame = ({
	effectiveHeight,
	effectiveWidth,
	hasEmbedBorder = true,
	lockAspectRatio,
	placeholderId,
	testId = 'native-embed-initial-placeholder',
}: NativeEmbedInitialPlaceholderFrameProps): React.JSX.Element => {
	const placeholderStyle = {
		width: effectiveWidth ? `${effectiveWidth}px` : '100%',
		height: lockAspectRatio ? 'auto' : `${effectiveHeight}px`,
		aspectRatio: lockAspectRatio
			? effectiveWidth && effectiveHeight
				? `${effectiveWidth} / ${effectiveHeight}`
				: NATIVE_EMBED_INITIAL_LAYOUT_FALLBACK_ASPECT_RATIO
			: undefined,
	};

	return (
		<div
			css={[
				placeholderFrameStyles,
				hasEmbedBorder ? borderedPlaceholderFrameStyles : borderlessPlaceholderFrameStyles,
			]}
			data-testid={testId}
			{...(placeholderId && { 'data-ssr-placeholder': placeholderId })}
			// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- width/height/aspectRatio are dynamic ADF + manifest-derived layout values
			style={placeholderStyle}
		/>
	);
};

export type NativeEmbedInitialPlaceholderProps = ResolveNativeEmbedInitialLayoutInput & {
	firstPaint?: boolean;
	testId?: string;
};

/**
 * Renders the shared native embed placeholder contract used by editor loading, renderer interim,
 * and Confluence SSR paths. The data attributes let the same ancestor placement styles apply before
 * the full native embed UI is available.
 */
export const NativeEmbedInitialPlaceholder = ({
	firstPaint = false,
	manifest,
	parameters,
	placeholderId,
	testId,
}: NativeEmbedInitialPlaceholderProps): React.JSX.Element => {
	const {
		alignment,
		effectiveHeight,
		effectiveWidth,
		hasEmbedBorder,
		lockAspectRatio,
		placeholderId: resolvedPlaceholderId,
	} = resolveNativeEmbedInitialLayout({ manifest, parameters, placeholderId });

	return (
		<div
			data-native-embed-alignment={alignment}
			data-native-embed-first-paint-placeholder={firstPaint ? 'true' : undefined}
			data-native-embed-initial-placeholder="true"
			data-native-embed-width={effectiveWidth}
			data-native-embed-show-border={hasEmbedBorder ? 'true' : 'false'}
		>
			<Global styles={nativeEmbedAlignmentStyles} />
			<NativeEmbedInitialPlaceholderFrame
				effectiveHeight={effectiveHeight}
				effectiveWidth={effectiveWidth}
				hasEmbedBorder={hasEmbedBorder}
				lockAspectRatio={lockAspectRatio}
				placeholderId={resolvedPlaceholderId}
				testId={testId}
			/>
		</div>
	);
};
