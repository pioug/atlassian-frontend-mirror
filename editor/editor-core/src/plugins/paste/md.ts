import MarkdownIt from 'markdown-it';
import linkify from './linkify-md-plugin';

export const md = MarkdownIt('zero', { html: false });

md.enable([
  // Process html entity - &#123;, &#xAF;, &quot;, ...
  'entity',
  // Process escaped chars and hardbreaks
  'escape',

  'newline',
]);

// enable modified version of linkify plugin
// @see https://product-fabric.atlassian.net/browse/ED-3097
md.use(linkify);
