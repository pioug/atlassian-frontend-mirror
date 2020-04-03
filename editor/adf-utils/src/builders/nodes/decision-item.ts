import { DecisionItemDefinition, Inline } from '@atlaskit/adf-schema';

export const decisionItem = (attrs: DecisionItemDefinition['attrs']) => (
  ...content: Array<Inline>
): DecisionItemDefinition => ({
  type: 'decisionItem',
  attrs,
  content,
});
