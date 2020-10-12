export const getTag = (onClick?: (arg: any) => void, href?: string) => {
  if (href) {
    return 'a';
  }

  if (onClick) {
    return 'button';
  }

  return 'div';
};
