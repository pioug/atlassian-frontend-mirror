import * as ts from 'typescript';
import { getAttributePropertySignature } from './attribute';

import {
  AnalyticsSpec,
  AttributeSpec,
  EventDescriptor,
  EventSpec,
  NormalizedSpec,
} from './types';

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

const isEventSpec = (obj: Record<string, unknown>): obj is EventSpec => {
  return Boolean(obj.action && obj.actionSubject);
};

/**
 * Given events that could be an array or object, normalize into an array of events with 'identifiers'
 */
const normaliseEvents = (events: AnalyticsSpec['events']): EventSpec[] => {
  return events.map<EventSpec>(
    (event: EventSpec | Record<string, EventDescriptor>) => {
      if (isEventSpec(event)) {
        return event;
      }

      const [eventName, eventDescriptor] = Object.entries(event)[0];

      const match = eventName.match(
        /(?<actionSubject>[a-zA-Z]+)\s(?<action>[a-zA-Z]+)(?:\s\((?<actionSubjectId>[a-zA-Z]+)\))?/,
      );

      if (!match) {
        throw new Error(
          `Event name does not match the pattern \`actionSubject action\` or \`actionSubject action (actionSubjectId)\``,
        );
      }

      return {
        ...eventDescriptor,
        eventName,
        actionSubject: match[1],
        action: match[2],
        actionSubjectId: match[3],
      };
    },
  );
};

/**
 * Annotates all event attributes with the context in which they are provided by
 * This logic assumes that an attribute name will only be present in any single context
 * and that there will be no attribute name collisions
 */
export const preProcessSpec = (spec: AnalyticsSpec): NormalizedSpec => {
  const contexts = spec.context;
  const events = normaliseEvents(spec.events);

  return events.reduce<NormalizedSpec>(
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
