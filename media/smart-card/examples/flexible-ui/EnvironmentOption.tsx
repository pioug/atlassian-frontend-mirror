/** @jsx jsx */
import React, { useState } from 'react';

import { css, jsx } from '@emotion/core';
import Button from '@atlaskit/button/standard-button';
import { RadioGroup } from '@atlaskit/radio';
import Textfield from '@atlaskit/textfield';

import {
  envOptions,
  exceptionUrls,
  handleOnChange,
  mockUrls,
  statusUrls,
} from './utils';
import { EnvironmentsKeys } from '../../src/client/types';

type EnvironmentOptionProps = {
  env: EnvironmentsKeys;
  url: string;
  setEnv: React.Dispatch<React.SetStateAction<EnvironmentsKeys>>;
  setUrl: React.Dispatch<React.SetStateAction<string>>;
};

const envExamples = {
  stg: 'https://pug.jira-dev.com/wiki/spaces/SLTEST/pages/452175069637',
};

const environmentStyles = css`
  display: flex;
  gap: 1rem;
  padding: 1rem 0;
`;

const exampleStyles = css`
  flex-wrap: wrap;
  display: flex;
  gap: 0.5rem;
`;

const expandStyles = css`
  flex: 1;
`;

const toExamples = (
  urls: { [key: string]: string },
  url: string,
  setUrl: React.Dispatch<React.SetStateAction<string>>,
) => (
  <div css={exampleStyles}>
    {Object.entries(urls).map(([key, value], idx) => (
      <Button
        testId={`mock-url-button-${key}`}
        key={idx}
        isSelected={value === url}
        onClick={() => setUrl(value)}
      >
        {key}
      </Button>
    ))}
  </div>
);

const EnvironmentOption: React.FC<EnvironmentOptionProps> = ({
  env,
  url,
  setEnv,
  setUrl,
}) => {
  const [isMock, setIsMock] = useState<boolean>(true);
  const [prevUrl, setPrevUrl] = useState<string>();
  const onEnvChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.currentTarget.value;
    if (value === 'mock') {
      setPrevUrl(url);
      setIsMock(true);
    } else {
      setEnv(value as EnvironmentsKeys);
      setUrl(prevUrl || envExamples[(env as keyof typeof envExamples) || '']);
      setIsMock(false);
    }
  };
  return (
    <div css={environmentStyles}>
      <div>
        <h6>Environment</h6>
        <RadioGroup
          defaultValue="mock"
          options={envOptions}
          onChange={onEnvChange}
        />
      </div>
      <div css={expandStyles}>
        {isMock && (
          <React.Fragment>
            <h6>Examples</h6>
            {toExamples(mockUrls, url, setUrl)}
            <hr />
            {toExamples(statusUrls, url, setUrl)}
            <hr />
            {toExamples(exceptionUrls, url, setUrl)}
          </React.Fragment>
        )}
        {!isMock && (
          <React.Fragment>
            <h6>URL</h6>
            <Textfield value={url} onChange={handleOnChange(setUrl)} />
            {env === 'stg' && (
              <p>
                <a
                  href="https://commerce-components-preview.dev.atlassian.com"
                  target="_blank"
                >
                  Please log in to staging environment.
                </a>
              </p>
            )}
          </React.Fragment>
        )}
      </div>
    </div>
  );
};

export default EnvironmentOption;
