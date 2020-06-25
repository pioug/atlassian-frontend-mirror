import { JsonLd } from 'json-ld-types';

type JsonLdType = JsonLd.Primitives.ObjectType | 'atlassian:Template';

export const extractorPriorityMap: Record<JsonLdType, number> = {
  Object: 0,
  Document: 5,
  'schema:TextDigitalDocument': 10,
  'schema:DigitalDocument': 10,
  'schema:BlogPosting': 10,
  'schema:SpreadsheetDigitalDocument': 10,
  'schema:PresentationDigitalDocument': 10,
  'atlassian:Task': 10,
  'atlassian:Project': 10,
  'atlassian:Template': 10,
  'atlassian:SourceCodeCommit': 10,
  'atlassian:SourceCodeRepository': 10,
  'atlassian:SourceCodePullRequest': 10,
  'atlassian:SourceCodeReference': 10,
  'atlassian:UndefinedLink': 10,
} as Record<JsonLdType, number>;
