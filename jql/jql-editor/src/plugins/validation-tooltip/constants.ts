import { PluginKey } from '@atlaskit/editor-prosemirror/state';

export const JQLValidationTooltipPluginKey = new PluginKey<boolean>(
  'jql-validation-tooltip-plugin',
);

export const TOOLTIP_CLASSNAME = 'jql-validation-tooltip';
export const TOOLTIP_ENTER_CLASSNAME = 'jql-validation-tooltip-enter';
export const TOOLTIP_EXIT_CLASSNAME = 'jql-validation-tooltip-exit';
