/** @jsx jsx */
import { jsx } from '@emotion/core';
import React, { useCallback } from 'react';
import Button from '@atlaskit/button/standard-button';
import Form, { FormFooter } from '@atlaskit/form';
import { BlockTemplate, FlexibleTemplate } from '../types';
import UiBuilder from './ui-builder';
import BlockBuilder from './block-builder';
import { DefaultTemplate } from '../constants';

const TemplateBuilder: React.FC<{
  template: FlexibleTemplate;
  onChange: (template: FlexibleTemplate) => void;
}> = ({ template, onChange }) => {
  const handleOnUiChange = useCallback(
    (ui) => {
      if (Object.entries(ui).length > 0) {
        onChange({ ...template, ui });
      } else {
        const { ui, ...rest } = template;
        onChange(rest);
      }
    },
    [onChange, template],
  );

  const handleOnBlockChange = useCallback(
    (blocks: BlockTemplate[]) => {
      onChange({
        ...template,
        blocks,
      });
    },
    [onChange, template],
  );

  const handleOnReset = useCallback(() => {
    onChange({ ...DefaultTemplate });
  }, [onChange]);

  return (
    <Form onSubmit={console.log}>
      {({ formProps }) => (
        <form {...formProps}>
          <UiBuilder onChange={handleOnUiChange} ui={template.ui} />
          <BlockBuilder
            blocks={template.blocks}
            onChange={handleOnBlockChange}
            size={template?.ui?.size}
          />
          <FormFooter>
            <Button shouldFitContainer onClick={handleOnReset}>
              Reset
            </Button>
          </FormFooter>
        </form>
      )}
    </Form>
  );
};

export default TemplateBuilder;
