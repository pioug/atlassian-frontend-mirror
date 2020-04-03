const prefix = 'ak-editor-expand';

export const expandClassNames = {
  prefix,
  expanded: `${prefix}__expanded`,
  titleContainer: `${prefix}__title-container`,
  inputContainer: `${prefix}__input-container`,
  iconContainer: `${prefix}__icon-container`,
  icon: `${prefix}__icon`,
  titleInput: `${prefix}__title-input`,
  content: `${prefix}__content`,
  type: (type: string) => `${prefix}__type-${type}`,
};
