import { CURRENT_SURFACE_CSS_VAR } from '@atlaskit/tokens/constants';

export const isCurrentSurfaceCustomPropertyName = (value: string): boolean =>
	value === 'CURRENT_SURFACE_CSS_VAR' || value === CURRENT_SURFACE_CSS_VAR;
