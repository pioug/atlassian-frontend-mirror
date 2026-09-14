import React from 'react';

import { IntlProvider, type WrappedComponentProps } from 'react-intl';

import { isFileIdentifier } from '@atlaskit/media-client';
import UFOLabel from '@atlaskit/react-ufo/label';

import { type CardProps } from '../types';
import { ExternalImageCard } from './externalImageCard';
import { FileCard } from './fileCard';

export const CardBase = ({
	identifier,
	...otherProps
}: CardBaseProps & WrappedComponentProps): React.JSX.Element => {
	const innerContent = isFileIdentifier(identifier) ? (
		<UFOLabel name="media-card-file-card">
			<FileCard {...otherProps} identifier={identifier} key={identifier.id} />
		</UFOLabel>
	) : (
		<UFOLabel name="media-card-external-image">
			<ExternalImageCard {...otherProps} identifier={identifier} key={identifier.dataURI} />
		</UFOLabel>
	);
	return otherProps.intl ? innerContent : <IntlProvider locale="en">{innerContent}</IntlProvider>;
};
export type CardBaseProps = CardProps & Partial<WrappedComponentProps>;
