import type { AlignmentValue, NativeEmbedParameters } from '../utils/types';
import { getParameters } from '../utils/utils';

export const NATIVE_EMBED_INITIAL_LAYOUT_FALLBACK_ASPECT_RATIO = '760 / 600';

export type NativeEmbedInitialLayoutManifest = {
	lockResizeAspectRatio?: boolean | (() => boolean);
	parameterDefaults?: {
		height?: number;
		width?: number;
	};
	uiConfig?: {
		showBorder?: boolean;
	};
};

export type NativeEmbedInitialLayout = {
	alignment: AlignmentValue;
	effectiveHeight: number;
	effectiveWidth: number | undefined;
	hasEmbedBorder: boolean;
	lockAspectRatio: boolean;
	placeholderId?: string;
};

export type ResolveNativeEmbedInitialLayoutInput = {
	manifest?: NativeEmbedInitialLayoutManifest;
	parameters?: NativeEmbedParameters;
	placeholderId?: string;
};

/**
 * Resolve the dimensions needed to reserve native embed layout before the full iframe UI is ready.
 *
 * This intentionally depends only on ADF parameters and optional manifest-like metadata so it can be
 * reused by React, DOMOutputSpec, SSR, and renderer placeholders without importing iframe UI code.
 */
export const resolveNativeEmbedInitialLayout = ({
	manifest,
	parameters,
	placeholderId,
}: ResolveNativeEmbedInitialLayoutInput): NativeEmbedInitialLayout => {
	const { alignment, aspectRatio, height, width } = getParameters(parameters);
	const effectiveWidth = width ?? manifest?.parameterDefaults?.width;

	// `getParameters` always supplies default values, so inspect raw macroParams to distinguish
	// stored dimensions from package defaults. This prevents the default aspectRatio from affecting
	// older embeds that never persisted original dimensions.
	const macroParams = parameters?.macroParams;
	const heightExplicitlyStored = !!macroParams?.height;
	const aspectRatioExplicitlyStored = !!macroParams?.aspectRatio;

	const effectiveHeightRaw = heightExplicitlyStored
		? height
		: (manifest?.parameterDefaults?.height ?? null);

	const effectiveHeight =
		aspectRatioExplicitlyStored &&
		aspectRatio != null &&
		aspectRatio > 0 &&
		effectiveWidth != null &&
		!heightExplicitlyStored
			? Math.round(effectiveWidth / aspectRatio)
			: (effectiveHeightRaw ?? height);

	const lockAspectRatio =
		typeof manifest?.lockResizeAspectRatio === 'function'
			? manifest.lockResizeAspectRatio()
			: (manifest?.lockResizeAspectRatio ?? true);

	return {
		alignment,
		effectiveHeight,
		effectiveWidth,
		hasEmbedBorder: manifest?.uiConfig?.showBorder ?? true,
		lockAspectRatio,
		placeholderId,
	};
};
