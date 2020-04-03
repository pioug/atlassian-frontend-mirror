import React from 'react';
import {
  BlockCardResolvedView,
  InlineCardResolvedView,
} from '@atlaskit/media-ui';
import { CardWithDataContentProps as Props } from './types';
import { extractInlinePropsFromJSONLD } from '../../extractors/inline';
import { extractBlockPropsFromJSONLD } from '../../extractors/block';

export class CardWithDataContent extends React.Component<Props> {
  render() {
    const {
      data: details,
      isSelected,
      appearance,
      onClick,
      onResolve,
      testId,
    } = this.props;

    if (appearance === 'inline') {
      const props = extractInlinePropsFromJSONLD(details || {});
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
      const props = extractBlockPropsFromJSONLD(details || {});
      if (onResolve) {
        onResolve({ title: props.title });
      }

      return (
        <BlockCardResolvedView
          {...props}
          isSelected={isSelected}
          onClick={onClick}
        />
      );
    }
  }
}
