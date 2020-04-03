import {
  DecisionListDefinition,
  DecisionItemDefinition,
} from '@atlaskit/adf-schema';

export const decisionList = (attrs: DecisionListDefinition['attrs']) => (
  ...content: Array<DecisionItemDefinition>
): DecisionListDefinition => ({
  type: 'decisionList',
  attrs,
  content,
});
