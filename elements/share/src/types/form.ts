export type FormChildrenArgs<T> = {
  formProps: React.DetailedHTMLProps<
    React.FormHTMLAttributes<HTMLFormElement>,
    HTMLFormElement
  >;
  getValues: () => T;
};
