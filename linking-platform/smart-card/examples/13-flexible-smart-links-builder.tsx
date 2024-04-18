/** @jsx jsx */
import { css, jsx } from '@emotion/react';
import React, { useCallback, useState } from 'react';
import { FlexibleTemplate } from './flexible-builder/types';
import TemplateBuilder from './flexible-builder/template-builder';
import TemplateRenderer from './flexible-builder/template-renderer';
import {
  getExampleFromLocalStorage,
  setExampleToLocalStorage,
} from './flexible-builder/utils';
import JsonldEditor from './jsonld-editor/jsonld-editor';
import EditLink from './flexible-builder/edit-link';

const containerStyles = css({
  display: 'flex',
  gap: '1rem',
  justifyContent: 'center',
  margin: '0 auto',
  maxWidth: '1200px',
  minWidth: '30rem',
  padding: '1rem',
});

const leftPanelStyles = css({
  flex: '1 1 70%',
  display: 'flex',
  flexDirection: 'column',
  gap: '0 1rem',
});

const rightPanelStyles = css({
  flex: '0 1 30%',
});

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
              <EditLink
                initialJson={initialJson}
                jsonError={jsonError}
                onJsonChange={onJsonChange}
                onSubmitUrl={onSubmitUrl}
                onTextChange={onTextChange}
                template={template}
                text={text}
                urlError={urlError}
              />
            </React.Fragment>
          )}
        </JsonldEditor>
      </div>
      <div css={rightPanelStyles}>
        <TemplateBuilder template={template} onChange={onChange} />
      </div>
    </div>
  );
};
