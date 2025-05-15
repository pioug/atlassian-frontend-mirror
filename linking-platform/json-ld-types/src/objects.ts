import type { JsonLd } from './jsonld';

export interface JsonLdBlogPostDocument {
	meta: JsonLd.Meta.BaseMeta;
	data: JsonLd.Data.BlogPostDocument;
}

export interface JsonLdDocument {
	meta: JsonLd.Meta.BaseMeta;
	data: JsonLd.Data.Document;
}

export interface JsonLdDocumentFolder {
	meta: JsonLd.Meta.BaseMeta;
	data: JsonLd.Data.DocumentFolder;
}

export interface JsonLdDocumentFolderPaged {
	meta: JsonLd.Meta.BaseMeta;
	data: JsonLd.Data.DocumentFolderPaged;
}

export interface JsonLdMessage {
	meta: JsonLd.Meta.BaseMeta;
	data: JsonLd.Data.Message;
}

export interface JsonLdPresentationDocument {
	meta: JsonLd.Meta.BaseMeta;
	data: JsonLd.Data.PresentationDocument;
}

export interface JsonLdGoal {
	meta: JsonLd.Meta.BaseMeta;
	data: JsonLd.Data.Goal;
}

export interface JsonLdObject {
	meta: JsonLd.Meta.BaseMeta;
	data: JsonLd.Data.Object;
}

export interface JsonLdType {
	meta: JsonLd.Meta.BaseMeta;
	data: JsonLd.Data.Type;
}

export interface JsonLdSchema {
	meta: JsonLd.Meta.BaseMeta;
	data: JsonLd.Data.Schema;
}

export interface JsonLdProject {
	meta: JsonLd.Meta.BaseMeta;
	data: JsonLd.Data.Project;
}

export interface JsonLdSourceCodeDocument {
	meta: JsonLd.Meta.BaseMeta;
	data: JsonLd.Data.SourceCodeDocument;
}

export interface JsonLdSourceCodeCommit {
	meta: JsonLd.Meta.BaseMeta;
	data: JsonLd.Data.SourceCodeCommit;
}

export interface JsonLdSourceCodePullRequest {
	meta: JsonLd.Meta.BaseMeta;
	data: JsonLd.Data.SourceCodePullRequest;
}

export interface JsonLdSourceCodeReference {
	meta: JsonLd.Meta.BaseMeta;
	data: JsonLd.Data.SourceCodeReference;
}

export interface JsonLdSourceCodeRepository {
	meta: JsonLd.Meta.BaseMeta;
	data: JsonLd.Data.SourceCodeRepository;
}

export interface JsonLdSpreadsheetDocument {
	meta: JsonLd.Meta.BaseMeta;
	data: JsonLd.Data.SpreadSheetDocument;
}

export interface JsonLdTask {
	meta: JsonLd.Meta.BaseMeta;
	data: JsonLd.Data.Task;
}

export interface JsonLdTemplate {
	meta: JsonLd.Meta.BaseMeta;
	data: JsonLd.Data.Template;
}

export interface JsonLdTextDocument {
	meta: JsonLd.Meta.BaseMeta;
	data: JsonLd.Data.TextDocument;
}

export interface JsonLdTaskType {
	meta: JsonLd.Meta.BaseMeta;
	data: JsonLd.Data.TaskType;
}

export interface JsonLdUndefinedLinkDocument {
	meta: JsonLd.Meta.BaseMeta;
	data: JsonLd.Data.UndefinedLinkDocument;
}
