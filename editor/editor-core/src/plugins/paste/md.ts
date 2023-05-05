// File has been copied to packages/editor/editor-plugin-ai/src/provider/markdown-transformer/md/index.ts
// If changes are made to this file, please make the same update in the linked file.

import MarkdownIt from 'markdown-it';
import linkify from './linkify-md-plugin';
import newline from './newline-md-plugin';
import paragraph from './paragraph-md-plugin';

export const md = MarkdownIt('zero', { html: false });

md.enable([
  // Process html entity - &#123;, &#xAF;, &quot;, ...
  'entity',
  // Process escaped chars and hardbreaks
  'escape',

  'newline',
]);

md.use(paragraph);

// enable modified version of linkify plugin
// @see https://product-fabric.atlassian.net/browse/ED-3097
md.use(linkify);

md.use(newline);
