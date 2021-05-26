# @atlaskit/editor-slack-transformer

## 1.0.0
### Major Changes

- [`944b9d04d22`](https://bitbucket.org/atlassian/atlassian-frontend/commits/944b9d04d22) - [ux] TI-210 Implemented a converter to support ADF to Slack markdown transformation.
  Supported bold, italic and strikethrough text, links, quotes, inline code blocks, code blocks, emojis. Mentions are serialise as @id.
  There’s no specific list syntax in app-published text, but we can mimic list (bullet, numbered) formatting. Also there’s no specific syntax for headers, images/files (will be converted to [image attached] or [media attached] as a link).
