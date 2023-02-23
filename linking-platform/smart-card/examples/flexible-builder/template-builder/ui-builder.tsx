/** @jsx jsx */
import { jsx } from '@emotion/react';
import React from 'react';
import EnumOption from './inputs/enum-option';
import { SmartLinkSize, SmartLinkTheme } from '../../../src';
import { FlexibleUiOptions } from '../../../src/view/FlexibleCard/types';
import CheckboxOption from './inputs/checkbox-option';

const UiBuilder: React.FC<{
  onChange: (ui: FlexibleUiOptions) => void;
  ui?: FlexibleUiOptions;
}> = ({ onChange, ui = {} }) => (
  <React.Fragment>
    <EnumOption
      defaultValue={SmartLinkTheme.Link}
      label="Theme"
      name="ui.theme"
      onChange={onChange}
      propName="theme"
      source={SmartLinkTheme}
      template={ui}
    />
    <EnumOption
      defaultValue={SmartLinkSize.Medium}
      label="Size (inherit)"
      name="ui.size"
      onChange={onChange}
      propName="size"
      source={SmartLinkSize}
      template={ui}
    />
    <CheckboxOption
      label="Hide background"
      name="ui.hideBackground"
      onChange={onChange}
      propName="hideBackground"
      template={ui}
    />
    <CheckboxOption
      label="Hide elevation"
      name="ui.hideElevation"
      onChange={onChange}
      propName="hideElevation"
      template={ui}
    />
    <CheckboxOption
      label="Hide padding"
      name="ui.hidePadding"
      onChange={onChange}
      propName="hidePadding"
      template={ui}
    />
    <CheckboxOption
      label="Container is clickable as link"
      name="ui.clickableContainer"
      onChange={onChange}
      propName="clickableContainer"
      template={ui}
    />
    <CheckboxOption
      label="Hide Hover Card Preview Button"
      name="ui.hideHoverCardPreviewButton"
      onChange={onChange}
      propName="hideHoverCardPreviewButton"
      template={ui}
    />
  </React.Fragment>
);

export default UiBuilder;
