import type { JsonLd } from '@atlaskit/json-ld-types/jsonld';

export type LinkCommentType =
	| JsonLd.Data.Document
	| JsonLd.Data.Page
	| JsonLd.Data.Project
	| JsonLd.Data.SourceCodeCommit
	| JsonLd.Data.TaskType;

export type LinkProgrammingLanguageType =
	| JsonLd.Data.SourceCodeDocument
	| JsonLd.Data.SourceCodeCommit
	| JsonLd.Data.SourceCodePullRequest
	| JsonLd.Data.SourceCodeReference
	| JsonLd.Data.SourceCodeRepository;

export type LinkSubscriberType =
	| JsonLd.Data.SourceCodeRepository
	| JsonLd.Data.Task
	| JsonLd.Data.TaskType;

export type LinkAttachmentType =
	| JsonLd.Data.Document
	| JsonLd.Data.Task
	| JsonLd.Data.TaskType
	| JsonLd.Data.Project;
