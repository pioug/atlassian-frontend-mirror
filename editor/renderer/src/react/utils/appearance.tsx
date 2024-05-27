import { type RendererAppearance } from '../../ui/Renderer/types';

export const isFullWidthAppearance = (appearance: RendererAppearance) =>
  appearance === 'full-width';

export const isFullPageAppearance = (appearance: RendererAppearance) =>
  appearance === 'full-page';

export const isFullWidthOrFullPageAppearance = (
  appearance: RendererAppearance,
) => isFullPageAppearance(appearance) || isFullWidthAppearance(appearance);
