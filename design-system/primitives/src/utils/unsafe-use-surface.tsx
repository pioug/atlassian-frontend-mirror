import { useSurface } from './surface-provider';
import type { BackgroundColorToken } from './types';

export const UNSAFE_useSurface: () => BackgroundColorToken = useSurface;
