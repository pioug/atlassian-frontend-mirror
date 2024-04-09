/** @jsx jsx */
import { jsx } from '@emotion/react';
import React, { useCallback, useMemo } from 'react';
import Button from '@atlaskit/button/new';
import Form, { FormFooter } from '@atlaskit/form';
import UiBuilder from './ui-builder';
import BlockBuilder from './block-builder';
import {
  BlockName,
  DefaultTemplate,
  FlexibleDefaultTemplate,
} from '../constants';
import CardBuilder from './card-builder';
import FlexibleToggle from './flexible-toggle';

import type { BlockTemplate, FlexibleTemplate } from '../types';
import type { CardProps } from '../../../src';
import { FlexibleUiOptions } from '../../../src/view/FlexibleCard/types';

const TemplateBuilder: React.FC<{
  template: FlexibleTemplate;
  onChange: (template: FlexibleTemplate) => void;
}> = ({ template, onChange }) => {
  const display = useMemo(
    () =>
      template?.blocks?.some((block) => block.name === BlockName.TitleBlock)
        ? 'flexible'
        : template?.cardProps?.appearance,
    [template?.blocks, template?.cardProps?.appearance],
  );
  const isFlexible = useMemo(() => display === 'flexible', [display]);

  const handleOnFlexibleChange = useCallback(() => {
    if (template?.blocks && template.blocks.length > 0) {
      const { blocks, ui, ...rest } = template;
      onChange({
        ...rest,
        cardProps: {
          ...rest.cardProps,
          appearance: 'inline',
        },
      });
    } else {
      onChange({
        ...template,
        ...FlexibleDefaultTemplate,
      });
    }
  }, [onChange, template]);

  const handleOnPropChange = useCallback(
    (cardProps: Partial<CardProps>) => {
      const isAppearanceChange =
        template?.cardProps?.appearance !== cardProps?.appearance;
      if (isAppearanceChange && cardProps?.appearance === 'embed') {
        // Update platform to web just to make life easier
        cardProps.platform = 'web';
      }

      if (Object.entries(cardProps).length > 0) {
        onChange({ ...template, cardProps });
      } else {
        const { cardProps, ...rest } = template;
        onChange(rest);
      }
    },
    [onChange, template],
  );

  const handleOnUiChange = useCallback(
    (ui: FlexibleUiOptions) => {
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
          <FlexibleToggle display={display} onChange={handleOnFlexibleChange} />
          <CardBuilder
            display={display}
            template={template.cardProps}
            onChange={handleOnPropChange}
          />
          {isFlexible && (
            <React.Fragment>
              <UiBuilder onChange={handleOnUiChange} template={template} />
              <BlockBuilder
                blocks={template.blocks}
                onChange={handleOnBlockChange}
                size={template?.ui?.size}
              />
            </React.Fragment>
          )}
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
