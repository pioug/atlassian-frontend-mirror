/** @jsx jsx */
import { jsx } from '@emotion/react';
import React, { useCallback } from 'react';
import Button from '@atlaskit/button/standard-button';
import Form, { FormFooter } from '@atlaskit/form';
import { BlockTemplate, FlexibleTemplate, CardBuilderProps } from '../types';
import UiBuilder from './ui-builder';
import BlockBuilder from './block-builder';
import { DefaultTemplate } from '../constants';
import CardBuilder from './card-builder';

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

  const handleOnPropChange = useCallback(
    (cardProps: CardBuilderProps) => {
      if (Object.entries(cardProps).length > 0) {
        onChange({ ...template, cardProps });
      } else {
        const { cardProps, ...rest } = template;
        onChange(rest);
      }
    },
    [onChange, template],
  );

  return (
    <Form onSubmit={console.log}>
      {({ formProps }) => (
        <form {...formProps}>
          <UiBuilder onChange={handleOnUiChange} ui={template.ui} />
          <CardBuilder
            template={template.cardProps}
            onChange={handleOnPropChange}
          />
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
