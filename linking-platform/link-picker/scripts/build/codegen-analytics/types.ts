export type EventType = 'ui' | 'screen' | 'operational' | 'track';

export type AttributeSpec = {
  type: 'string' | 'number' | string[];
  required?: boolean;
  description: string;
};

export type AnnotatedAttributeSpec = AttributeSpec & {
  /** Name of the context that provides the attribute */
  context?: string;
};

export type EventIdentifier = {
  action: string;
  actionSubject: string;
  actionSubjectId?: string;
};

export type EventDescriptor = {
  type: EventType;
  description: string;
  attributes: Record<string, AnnotatedAttributeSpec>;
};

export type EventSpec = EventIdentifier & EventDescriptor;

export type AnalyticsSpec = {
  events: (EventSpec | Record<string, EventDescriptor>)[];
  context: Record<string, Record<string, AttributeSpec>>;
};

export type NormalizedSpec = {
  events: EventSpec[];
  context: Record<string, Record<string, AttributeSpec>>;
};
