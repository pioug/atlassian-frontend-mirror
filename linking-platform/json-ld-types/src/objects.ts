import type { JsonLd } from './jsonld';

export interface JsonLdBlogPostDocument {
	data: JsonLd.Data.BlogPostDocument;
	meta: JsonLd.Meta.BaseMeta;
}

export interface JsonLdDocument {
	data: JsonLd.Data.Document;
	meta: JsonLd.Meta.BaseMeta;
}

export interface JsonLdDocumentFolder {
	data: JsonLd.Data.DocumentFolder;
	meta: JsonLd.Meta.BaseMeta;
}

export interface JsonLdDocumentFolderPaged {
	data: JsonLd.Data.DocumentFolderPaged;
	meta: JsonLd.Meta.BaseMeta;
}

export interface JsonLdMessage {
	data: JsonLd.Data.Message;
	meta: JsonLd.Meta.BaseMeta;
}

export interface JsonLdPresentationDocument {
	data: JsonLd.Data.PresentationDocument;
	meta: JsonLd.Meta.BaseMeta;
}

export interface JsonLdGoal {
	data: JsonLd.Data.Goal;
	meta: JsonLd.Meta.BaseMeta;
}

export interface JsonLdObject {
	data: JsonLd.Data.Object;
	meta: JsonLd.Meta.BaseMeta;
}

export interface JsonLdType {
	data: JsonLd.Data.Type;
	meta: JsonLd.Meta.BaseMeta;
}

export interface JsonLdSchema {
	data: JsonLd.Data.Schema;
	meta: JsonLd.Meta.BaseMeta;
}

export interface JsonLdProject {
	data: JsonLd.Data.Project;
	meta: JsonLd.Meta.BaseMeta;
}

export interface JsonLdSourceCodeDocument {
	data: JsonLd.Data.SourceCodeDocument;
	meta: JsonLd.Meta.BaseMeta;
}

export interface JsonLdSourceCodeCommit {
	data: JsonLd.Data.SourceCodeCommit;
	meta: JsonLd.Meta.BaseMeta;
}

export interface JsonLdSourceCodePullRequest {
	data: JsonLd.Data.SourceCodePullRequest;
	meta: JsonLd.Meta.BaseMeta;
}

export interface JsonLdSourceCodeReference {
	data: JsonLd.Data.SourceCodeReference;
	meta: JsonLd.Meta.BaseMeta;
}

export interface JsonLdSourceCodeRepository {
	data: JsonLd.Data.SourceCodeRepository;
	meta: JsonLd.Meta.BaseMeta;
}

export interface JsonLdSpreadsheetDocument {
	data: JsonLd.Data.SpreadSheetDocument;
	meta: JsonLd.Meta.BaseMeta;
}

export interface JsonLdTask {
	data: JsonLd.Data.Task;
	meta: JsonLd.Meta.BaseMeta;
}

export interface JsonLdTemplate {
	data: JsonLd.Data.Template;
	meta: JsonLd.Meta.BaseMeta;
}

export interface JsonLdTextDocument {
	data: JsonLd.Data.TextDocument;
	meta: JsonLd.Meta.BaseMeta;
}

export interface JsonLdTaskType {
	data: JsonLd.Data.TaskType;
	meta: JsonLd.Meta.BaseMeta;
}

export interface JsonLdUndefinedLinkDocument {
	data: JsonLd.Data.UndefinedLinkDocument;
	meta: JsonLd.Meta.BaseMeta;
}
