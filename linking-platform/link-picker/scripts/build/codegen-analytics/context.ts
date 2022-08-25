import * as ts from 'typescript';
import { getAttributePropertySignature } from './attribute';

import { AnalyticsSpec, AttributeSpec, EventSpec } from './types';

const getAttributeContext = (
  attributeName: string,
  contexts: [string, Record<string, AttributeSpec>][],
) => {
  return contexts.find(([_, attributes]) => {
    return Object.keys(attributes).some(n => n === attributeName);
  })?.[0];
};

const annotateEventAttributesWithContext = (
  event: EventSpec,
  contexts: AnalyticsSpec['context'],
): EventSpec => {
  const contextEntries = Object.entries(contexts);
  return Object.entries(event.attributes).reduce(
    (acc, [name, attribute]) => {
      return {
        ...acc,
        attributes: {
          ...acc.attributes,
          [name]: {
            ...attribute,
            context: getAttributeContext(name, contextEntries),
          },
        },
      };
    },
    { ...event, attributes: {} },
  );
};

/**
 * Annotates all event attributes with the context in which they are provided by
 * This logic assumes that an attribute name will only be present in any single context
 * and that there will be no attribute name collisions
 */
export const annotateContextualAttributes = (spec: AnalyticsSpec) => {
  const contexts = spec.context;

  if (!contexts) {
    return spec;
  }

  return spec.events.reduce<AnalyticsSpec>(
    (acc, event) => {
      const annotatedEvent = annotateEventAttributesWithContext(
        event,
        contexts,
      );
      return {
        ...acc,
        events: [...acc.events, annotatedEvent],
      };
    },
    { ...spec, events: [] },
  );
};

export const generateContextDataTypeAliases = (spec: AnalyticsSpec) => {
  return Object.entries(spec.context).map(([name, attributes]) => {
    return ts.factory.createTypeAliasDeclaration(
      undefined,
      [ts.factory.createToken(ts.SyntaxKind.ExportKeyword)],
      `${name}Type`,
      undefined,
      ts.factory.createTypeLiteralNode(
        attributes
          ? Object.entries(attributes).map(getAttributePropertySignature)
          : [],
      ),
    );
  });
};
