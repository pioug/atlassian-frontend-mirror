/** @jsx jsx */
import { css, jsx } from '@emotion/react';
import React, { useCallback } from 'react';
import * as examples from '../../examples-helpers/_jsonLDExamples';
import Button from '@atlaskit/button/new';
import { getJsonLdResponse } from '../utils/flexible-ui';
import { ResolveResponse } from '../../src';

const jsonldExampleStyles = css({
  display: 'flex',
  flexWrap: 'wrap',
  gap: '0.25rem',
  margin: '0.75rem 0',
});

const JsonldExample: React.FC<{
  defaultValue: ResolveResponse;
  onSelect: (response: ResolveResponse) => void;
}> = ({ defaultValue, onSelect }) => {
  const handleOnClick = useCallback(
    ({ data, meta }: any) => {
      const response = getJsonLdResponse(data.url, meta, data);
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
