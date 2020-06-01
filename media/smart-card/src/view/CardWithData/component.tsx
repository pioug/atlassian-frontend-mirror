import React from 'react';
import {
  BlockCardResolvedView,
  InlineCardResolvedView,
} from '@atlaskit/media-ui';

import { CardWithDataContentProps as Props } from './types';
import { getEmptyJsonLd } from '../../utils/jsonld';
import { extractInlineProps } from '../../extractors/inline';
import { extractBlockProps } from '../../extractors/block';

export class CardWithDataContent extends React.Component<Props> {
  render() {
    const {
      data: details,
      isSelected,
      appearance,
      onClick,
      onResolve,
      testId,
      showActions,
    } = this.props;

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

      return (
        <BlockCardResolvedView
          {...props}
          isSelected={isSelected}
          onClick={onClick}
          showActions={showActions}
        />
      );
    }
  }
}
