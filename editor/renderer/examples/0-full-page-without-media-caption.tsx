import React from 'react';
import RendererDemo from './helper/RendererDemo';
import type { MediaOptions } from '@atlaskit/editor-core';
import { getSchemaBasedOnStage } from '@atlaskit/adf-schema/schema-default';
import adf from './helper/media-without-caption.adf.json';

const Example = () => {
  const mediaOptions: MediaOptions = { allowCaptions: false };

  return (
    <RendererDemo
      appearance="full-page"
      serializer="react"
      allowHeadingAnchorLinks
      allowColumnSorting={true}
      useSpecBasedValidator={true}
      adfStage={'stage0'}
      schema={getSchemaBasedOnStage('stage0')}
      mediaOptions={mediaOptions}
      document={adf}
    />
  );
};

export default Example;
