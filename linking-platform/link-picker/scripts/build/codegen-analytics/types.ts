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

export type EventSpec = {
  action: string;
  actionSubject: string;
  actionSubjectId?: string;
  type: EventType;
  description: string;
  attributes: Record<string, AnnotatedAttributeSpec>;
};

export type AnalyticsSpec = {
  events: EventSpec[];
  context: Record<string, Record<string, AttributeSpec>>;
};
