import { N0, N100 } from '@atlaskit/theme/colors';
import { token } from '@atlaskit/tokens';

export const tickBoxClassName = 'media-card-tickbox';

export const tickboxFixedStyles: string = `
  background-color: ${token('color.background.input', N0)};
  color: ${token('color.icon.subtle', N100)};
`;
