import { type RendererAppearance } from '../../ui/Renderer/types';

export const isFullWidthAppearance = (appearance: RendererAppearance) =>
	appearance === 'full-width';

export const isMaxWidthAppearance = (appearance: RendererAppearance) => appearance === 'max';

export const isFullPageAppearance = (appearance: RendererAppearance) => appearance === 'full-page';

export const isCommentAppearance = (appearance: RendererAppearance) => appearance === 'comment';

export const isFullWidthOrFullPageAppearance = (appearance: RendererAppearance) =>
	isFullPageAppearance(appearance) ||
	isFullWidthAppearance(appearance) ||
	isMaxWidthAppearance(appearance);
