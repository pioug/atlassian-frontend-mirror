/** @jsx jsx */
import { jsx } from '@emotion/core';
import React, { useCallback } from 'react';
import { JsonLd } from 'json-ld-types';
import * as examples from '../../examples-helpers/_jsonLDExamples';
import Button from '@atlaskit/button';
import { jsonldExampleStyles } from './styled';
import { getJsonLdResponse } from '../utils/flexible-ui';

const JsonldExample: React.FC<{
  defaultValue: JsonLd.Data.BaseData;
  onSelect: (response: JsonLd.Response) => void;
}> = ({ defaultValue, onSelect }) => {
  const handleOnClick = useCallback(
    (data) => {
      const response = getJsonLdResponse(data.url, undefined, data);
      onSelect(response);
    },
    [onSelect],
  );

  return (
    <div css={jsonldExampleStyles}>
      <Button onClick={() => handleOnClick(defaultValue)} spacing="compact">
        Start
      </Button>
      {Object.entries(examples).map(([key, data], idx) => (
        <Button key={idx} onClick={() => handleOnClick(data)} spacing="compact">
          {key}
        </Button>
      ))}
    </div>
  );
};

export default JsonldExample;
