/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import React, { useCallback, useState } from 'react';
import { JsonLd } from 'json-ld-types';
import Button, { ButtonGroup } from '@atlaskit/button';
import LoadLinkForm from '../jsonld-editor/load-link-form';
import JsonldExample from '../jsonld-editor/jsonld-example';
import JsonldEditorInput from '../jsonld-editor/jsonld-editor-input';

const buttonGroupStyles = css`
  text-align: right;
`;

const EditLink: React.FC<{
  initialJson: JsonLd.Response;
  jsonError?: string;
  onJsonChange: (json: JsonLd.Response) => void;
  onSubmitUrl: (url: string) => void;
  onTextChange: (str: string) => void;
  text: string;
  urlError?: string;
}> = ({
  initialJson,
  jsonError,
  onJsonChange,
  onSubmitUrl,
  onTextChange,
  text,
  urlError,
}) => {
  const [showEditLink, setShowEditLink] = useState<boolean>(false);
  const [showJsonld, setShowJsonld] = useState<boolean>(false);

  const onShowEditLinkClick = useCallback(
    () => setShowEditLink(!showEditLink),
    [showEditLink],
  );

  const onShowJsonldClick = useCallback(() => setShowJsonld(!showJsonld), [
    showJsonld,
  ]);

  return (
    <React.Fragment>
      <div css={buttonGroupStyles}>
        <ButtonGroup appearance="subtle-link">
          <Button onClick={onShowEditLinkClick} spacing="compact">
            Change link
          </Button>
          <Button onClick={onShowJsonldClick} spacing="compact">
            Edit JSON-LD
          </Button>
        </ButtonGroup>
      </div>
      {showEditLink && (
        <React.Fragment>
          <LoadLinkForm onSubmit={onSubmitUrl} error={urlError} />
          <JsonldExample
            defaultValue={initialJson.data as JsonLd.Data.BaseData}
            onSelect={onJsonChange}
          />
        </React.Fragment>
      )}
      {showJsonld && (
        <JsonldEditorInput
          error={jsonError}
          onChange={onTextChange}
          value={text}
        />
      )}
    </React.Fragment>
  );
};

export default EditLink;
