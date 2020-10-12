import { Product, SwitcherProductType } from '../../types';

export enum Environment {
  Staging = 'stg',
  Production = 'prod',
}

/**
 * Resolves product environment type,
 * Falls back to Environment.Staging
 *
 * !!! Trello only, other products to be added
 *
 * @param origin
 */
export const getEnvName = (origin: string = window.location.origin) =>
  ['https://trello.com'].includes(origin)
    ? Environment.Production
    : Environment.Staging;

const getProduct = (product: Product | SwitcherProductType | undefined) => {
  if (
    product === SwitcherProductType.JIRA_BUSINESS ||
    product === SwitcherProductType.JIRA_SERVICE_DESK ||
    product === SwitcherProductType.JIRA_SOFTWARE
  ) {
    return Product.JIRA;
  }

  return product && product.toLowerCase();
};

export const getLoginUrl = (
  productType: Product | SwitcherProductType | undefined,
  env: Environment = getEnvName(),
  continueUrl: string = String(window.location),
  loginHint?: string,
) => {
  const baseUrl =
    env === Environment.Production
      ? 'https://id.atlassian.com/login'
      : 'https://id.stg.internal.atlassian.com/login';
  const product = getProduct(productType);

  return `${baseUrl}?continue=${encodeURIComponent(continueUrl)}${
    product ? `&application=${encodeURIComponent(product)}` : ''
  }
  ${loginHint ? `&login_hint=${encodeURIComponent(loginHint)}` : ''}`;
};

export const getJoinUrl = (
  email: string,
  continueUrl: string,
  productType: SwitcherProductType,
) => {
  const origin =
    getEnvName(location.origin) === Environment.Production
      ? 'https://id.atlassian.com'
      : 'https://id.stg.internal.atlassian.com';
  const product = getProduct(productType);

  return `${origin}/signup?continue=${encodeURIComponent(continueUrl || '')}${
    product ? `&application=${encodeURIComponent(product)}` : ''
  }&email=${encodeURIComponent(email || '')}&disableEmailInput=true`;
};
