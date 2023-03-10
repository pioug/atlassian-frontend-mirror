import { GenericPropertyValue } from './types';

export const isResponsiveStyleProp = (
  propertyValue: GenericPropertyValue,
): propertyValue is object => typeof propertyValue === 'object';

export const isStaticStyleProp = (
  propertyValue: GenericPropertyValue,
): propertyValue is string => typeof propertyValue === 'string';
