import { Children, type ReactNode } from 'react';

export const getActions = (children: ReactNode) => {
	const [PrimaryAction, SecondaryAction] = Children.toArray(children);

	if (
		typeof process !== 'undefined' &&
		process.env.NODE_ENV === 'development' &&
		(!PrimaryAction || !SecondaryAction)
	) {
		// TODO: i18n?
		throw new SyntaxError('SplitButton requires two children to be provided');
	}

	return { PrimaryAction, SecondaryAction };
};
