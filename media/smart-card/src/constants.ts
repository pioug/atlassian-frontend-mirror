export enum SmartLinkDirection {
  Horizontal = 'Horizontal',
  Vertical = 'Vertical',
}

export enum SmartLinkSize {
  XLarge = 'xlarge',
  Large = 'large',
  Medium = 'medium',
  Small = 'small',
}

export enum SmartLinkTheme {
  Black = 'Black',
  Link = 'Link',
}

export enum IconType {
  Archive = 'FileType:Archive',
  Audio = 'FileType:Audio',
  Blog = 'FileType:Blog',
  Code = 'FileType:Code',
  Document = 'FileType:Document',
  Executable = 'FileType:Executable',
  File = 'FileType:File',
  Folder = 'FileType:Folder',
  Generic = 'FileType:Generic',
  GIF = 'FileType:GIF',
  GoogleDocs = 'FileType:GoogleDocs',
  GoogleForms = 'FileType:GoogleForms',
  GoogleSheets = 'FileType:GoogleSheets',
  GoogleSlides = 'FileType:GoogleSlides',
  Image = 'FileType.Image',
  MSExcel = 'FileType:Excel',
  MSPowerpoint = 'FileType:Powerpoint',
  MSWord = 'FileType:WordDocument',
  PDF = 'FileType:PDF',
  Presentation = 'FileType:Presentation',
  Sketch = 'FileType:Sketch',
  Spreadsheet = 'FileType:Spreadsheet',
  Template = 'FileType:Template',
  Video = 'FileType:Video',

  // BitBucket?
  Branch = 'BitBucket:Branch',
  Commit = 'BitBucket:Commit',
  Project = 'BitBucket:Project',
  PullRequest = 'BitBucket:PullRequest',
  Repo = 'BitBucket:Repo',

  // Jira?
  Bug = 'Jira:Bug',
  Change = 'Jira:Change',
  Epic = 'Jira:Epic',
  Incident = 'Jira:Incident',
  Problem = 'Jira:Problem',
  ServiceRequest = 'Jira:ServiceRequest',
  Story = 'Jira:Story',
  SubTask = 'Jira:SubTask',
  Task = 'Jira:Task',

  // Provider
  Confluence = 'Provider:Confluence',
  Jira = 'Provider:Jira',
}
