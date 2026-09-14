import type { ReactNode } from 'react';

import type { CardProps } from '../../../Card/types';

/** Props derived from <Card /> for base embed functionalities */
export type UnresolvedViewCardProps = Pick<
	CardProps,
	'frameStyle' | 'inheritDimensions' | 'isSelected' | 'onClick' | 'testId' | 'url'
>;

export type UnresolvedViewProps = UnresolvedViewCardProps & {
	/** An action button */
	button?: ReactNode;
	/** A detail and instruction of the unresolved link */
	description: ReactNode;
	/** A link icon displayed on embed frame */
	icon: string | ReactNode;
	/** A provider or visual aids for the unresolved link */
	image: string | ReactNode;
	/**
	 * Provider/generator icon. Unresolved frames show the provider name (no entity title),
	 * so this is preferred over the entity-type icon.
	 */
	providerIcon?: string | ReactNode;
	/** Accessible label for the provider/generator icon. */
	providerIconLabel?: string;
	/** A link text displayed on embed frame */
	text?: string;
	/** A title for the unresolved link */
	title: ReactNode;
};
