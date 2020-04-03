interface Props {
  children: Function;
  props: Record<string, any> | string;
  theme: Record<string, any>;
}

export default ({ children, props, theme }: Props) => {
  const appearance = typeof props === 'object' ? 'default' : props;
  const merged = typeof props === 'object' ? { ...props } : {};
  Object.keys(theme).forEach(key => {
    if (!(key in merged)) {
      merged[key] = theme[key]({ appearance });
    }
  });
  return children(merged);
};
