import { tickBoxClassName, tickboxFixedStyles } from './tickBox/styles';

export const getSelectableTickBoxStyles = (isTickBoxSelectable: boolean): string => {
	if (!isTickBoxSelectable) {
		return '';
	}
	return `
    &:hover .${tickBoxClassName} {
      ${tickboxFixedStyles}
    }
  `;
};
