export const getLinkProps = (href: string, target?: string) => ({
  href,
  rel: target === '_blank' ? 'noopener noreferrer' : null,
  target,
});

export const getButtonProps = (isDisabled?: boolean) => ({
  type: 'button',
  disabled: isDisabled,
});

export const getCustomElement = (href?: string, onClick?: Function) => {
  if (href) {
    return 'a';
  }

  if (onClick) {
    return 'button';
  }

  return 'span';
};
