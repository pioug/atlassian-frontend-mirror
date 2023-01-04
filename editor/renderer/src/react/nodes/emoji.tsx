import React from 'react';
import { EmojiAttributes } from '@atlaskit/adf-schema';
import { EmojiResourceConfig } from '@atlaskit/emoji/resource';
import { PureComponent } from 'react';
import { ProviderFactory } from '@atlaskit/editor-common/provider-factory';
import { Emoji } from '@atlaskit/editor-common/emoji';

export interface EmojiProps extends EmojiAttributes {
  providers?: ProviderFactory;
  resourceConfig?: EmojiResourceConfig;
  fitToHeight?: number;
}

export default class EmojiItem extends PureComponent<EmojiProps, {}> {
  render() {
    const { id, providers, shortName, text, fitToHeight, resourceConfig } =
      this.props;

    return (
      <Emoji
        allowTextFallback={true}
        id={id}
        shortName={shortName}
        fallback={text}
        providers={providers}
        fitToHeight={fitToHeight}
        resourceConfig={resourceConfig}
      />
    );
  }
}
