import { defaultTransitionDuration } from './styles';

export const transition: any = (propertyName = 'all') => `
  transition: ${propertyName} ${defaultTransitionDuration};
`;
