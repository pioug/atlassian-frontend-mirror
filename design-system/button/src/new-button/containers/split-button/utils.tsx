import { Children, type ReactNode } from 'react';

export const getActions: (children: ReactNode) => {
	PrimaryAction:
		| string
		| number
		| import('react').ReactElement<any, string | import('react').JSXElementConstructor<any>>
		| Iterable<ReactNode>
		| import('react').ReactPortal;
	SecondaryAction:
		| string
		| number
		| import('react').ReactElement<any, string | import('react').JSXElementConstructor<any>>
		| Iterable<ReactNode>
		| import('react').ReactPortal;
} = (children: ReactNode) => {
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
