import { MouseEventHandler } from 'react';

export const getLinkProps = (href: string, target?: string) => ({
  href,
  rel: target === '_blank' ? 'noopener noreferrer' : null,
  target,
});

export const getButtonProps = (
  onClick: MouseEventHandler,
  isDisabled?: boolean,
) => ({
  type: 'button',
  disabled: isDisabled,
  onClick,
});

export const getCustomElement = (
  href?: string,
  onClick?: MouseEventHandler,
) => {
  if (href) {
    return 'a';
  }

  if (onClick) {
    return 'button';
  }

  return 'span';
};
