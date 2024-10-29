/**
 * Enable media inline images feature based on
 * mediaOptions.featureFlags.mediaInline, mediaOptions.allowMediaInlineImages
 *
 * The reason not using mediaOption as param is because MediaOption is from editor-plugin-media
 * we want to avoid circular deps
 * @param allowMediaInline MediaOptions.featureFlags.mediaInline
 * @param allowMediaInlineImages MediaOptions.allowMediaInlineImages
 * @returns boolean
 */
export const mediaInlineImagesEnabled = (
	allowMediaInline?: boolean,
	allowMediaInlineImages?: boolean,
) => {
	return allowMediaInline && allowMediaInlineImages;
};
