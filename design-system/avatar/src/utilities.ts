// eslint-disable-next-line @repo/internal/fs/filename-pattern-match
import { MouseEventHandler } from 'react';

export const getLinkProps = (href: string, target?: string) => ({
  href,
  rel: target === '_blank' ? 'noopener noreferrer' : null,
  target,
});

export const getButtonProps = (onClick: MouseEventHandler) => ({
  type: 'button',
  onClick,
});

export const getCustomElement = (
  isDisabled?: boolean,
  href?: string,
  onClick?: MouseEventHandler,
) => {
  if (href && !isDisabled) {
    return 'a';
  }
  if (onClick || isDisabled) {
    return 'button';
  }
  return 'span';
};
