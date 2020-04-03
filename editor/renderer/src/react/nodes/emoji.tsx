import React from 'react';
import { EmojiAttributes } from '@atlaskit/adf-schema';
import { PureComponent } from 'react';
import { ProviderFactory } from '@atlaskit/editor-common';
import { Emoji } from '@atlaskit/editor-common';

export interface EmojiProps extends EmojiAttributes {
  providers?: ProviderFactory;
  fitToHeight?: number;
}

export default class EmojiItem extends PureComponent<EmojiProps, {}> {
  render() {
    const { id, providers, shortName, text, fitToHeight } = this.props;

    return (
      <Emoji
        allowTextFallback={true}
        id={id}
        shortName={shortName}
        fallback={text}
        providers={providers}
        fitToHeight={fitToHeight}
      />
    );
  }
}
