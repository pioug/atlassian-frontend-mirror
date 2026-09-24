import { token } from '@atlaskit/tokens';

export const center = `
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const borderRadius: string = `
  border-radius: ${token('radius.small', '3px')};
`;

export const borderRadiusBottom: string = `
  border-bottom-left-radius: ${token('radius.small', '3px')};
  border-bottom-right-radius: ${token('radius.small', '3px')};
`;

export const easeInOutCubic = 'cubic-bezier(0.645, 0.045, 0.355, 1)';
