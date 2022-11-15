/** @jsx jsx */
import { css, jsx } from '@emotion/react';
import React, { useCallback } from 'react';
import { JsonLd } from 'json-ld-types';
import * as examples from '../../examples-helpers/_jsonLDExamples';
import Button from '@atlaskit/button';
import { getJsonLdResponse } from '../utils/flexible-ui';

const jsonldExampleStyles = css`
  display: flex;
  flex-wrap: wrap;
  gap: 0.25rem;
  margin: 0.75rem 0;
`;

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
        🦄
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
