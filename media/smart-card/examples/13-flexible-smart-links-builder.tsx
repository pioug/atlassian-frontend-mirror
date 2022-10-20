/** @jsx jsx */
import { css, jsx } from '@emotion/react';
import React, { useCallback, useState } from 'react';
import { FlexibleTemplate } from './flexible-builder/types';
import Code from './flexible-builder/code';
import TemplateBuilder from './flexible-builder/template-builder';
import TemplateRenderer from './flexible-builder/template-renderer';
import {
  getExampleFromLocalStorage,
  setExampleToLocalStorage,
} from './flexible-builder/utils';
import JsonldEditor from './jsonld-editor/jsonld-editor';
import EditLink from './flexible-builder/edit-link';

const containerStyles = css`
  display: flex;
  gap: 1rem;
  justify-content: center;
  margin: 0 auto;
  max-width: 1200px;
  min-width: 30rem;
  padding: 1rem;
`;

const leftPanelStyles = css`
  flex: 1 1 70%;
  display: flex;
  flex-direction: column;
  gap: 0 1rem;
`;

const rightPanelStyles = css`
  flex: 0 1 30%;
`;

export default () => {
  const [template, setTemplate] = useState<FlexibleTemplate>(
    getExampleFromLocalStorage(),
  );

  const onChange = useCallback((updatedTemplate: FlexibleTemplate) => {
    setTemplate(updatedTemplate);
    setExampleToLocalStorage(updatedTemplate);
  }, []);

  return (
    <div css={containerStyles}>
      <div css={leftPanelStyles}>
        <JsonldEditor>
          {({
            ari,
            initialJson,
            json,
            jsonError,
            onJsonChange,
            onSubmitUrl,
            onTextChange,
            onUrlError,
            onUrlResolve,
            text,
            url,
            urlError,
          }) => (
            <React.Fragment>
              <TemplateRenderer
                template={template}
                ari={ari}
                json={json}
                onError={onUrlError}
                onResolve={onUrlResolve}
                url={url}
              />
              <Code template={template} />
              <EditLink
                initialJson={initialJson}
                jsonError={jsonError}
                onJsonChange={onJsonChange}
                onSubmitUrl={onSubmitUrl}
                onTextChange={onTextChange}
                text={text}
                urlError={urlError}
              />
            </React.Fragment>
          )}
        </JsonldEditor>
      </div>
      <div css={rightPanelStyles}>
        <h6>
          <a
            href="https://atlaskit.atlassian.com/packages/media/smart-card/docs/flexible"
            target="_blank"
          >
            go/flexible-smart-links-docs
          </a>
        </h6>
        <TemplateBuilder template={template} onChange={onChange} />
      </div>
    </div>
  );
};
