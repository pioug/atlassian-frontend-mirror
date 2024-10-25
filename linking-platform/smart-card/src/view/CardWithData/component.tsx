import React from 'react';

import { extractBlockProps } from '../../extractors/block';
import { extractInlineProps } from '../../extractors/inline';
import { getEmptyJsonLd } from '../../utils/jsonld';
import { BlockCardResolvedView } from '../BlockCard';
import { InlineCardResolvedView } from '../InlineCard/ResolvedView';

import { type CardWithDataContentProps as Props } from './types';

export class CardWithDataContent extends React.Component<Props> {
	render() {
		const { data: details, isSelected, appearance, onClick, onResolve, testId } = this.props;

		if (appearance === 'inline') {
			const props = extractInlineProps(details || getEmptyJsonLd());
			if (onResolve) {
				onResolve({ title: props.title });
			}

			return (
				<InlineCardResolvedView
					{...props}
					isSelected={isSelected}
					onClick={onClick}
					testId={testId}
				/>
			);
		} else {
			const props = extractBlockProps(details || getEmptyJsonLd());

			if (onResolve) {
				onResolve({ title: props.title });
			}

			return <BlockCardResolvedView {...props} isSelected={isSelected} onClick={onClick} />;
		}
	}
}
