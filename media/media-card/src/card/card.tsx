import { isFileIdentifier } from '@atlaskit/media-client';
import { withMediaAnalyticsContext } from '@atlaskit/media-common';
import React from 'react';
import { IntlProvider, type WrappedComponentProps, injectIntl } from 'react-intl-next';
import { type CardProps } from '../types';
import { ExternalImageCard } from './externalImageCard';
import { FileCard } from './fileCard';

const packageName = process.env._PACKAGE_NAME_ as string;
const packageVersion = process.env._PACKAGE_VERSION_ as string;

export type CardBaseProps = CardProps & Partial<WrappedComponentProps>;

export const CardBase = ({ identifier, ...otherProps }: CardBaseProps & WrappedComponentProps) => {
	const innerContent = isFileIdentifier(identifier) ? (
		<FileCard {...otherProps} identifier={identifier} key={identifier.id} />
	) : (
		<ExternalImageCard {...otherProps} identifier={identifier} key={identifier.dataURI} />
	);
	return otherProps.intl ? innerContent : <IntlProvider locale="en">{innerContent}</IntlProvider>;
};

export const Card: React.ComponentType<CardBaseProps> = withMediaAnalyticsContext({
	packageVersion,
	packageName,
	componentName: 'mediaCard',
	component: 'mediaCard',
})(
	injectIntl(CardBase, {
		enforceContext: false,
	}),
);
