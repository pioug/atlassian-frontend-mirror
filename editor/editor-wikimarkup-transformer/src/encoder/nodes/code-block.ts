import { Node as PMNode } from 'prosemirror-model';
import { NodeEncoder } from '..';
import { inlines } from './inlines';

const supportedLanguageInWiki = [
  'actionscript',
  'ada',
  'applescript',
  'bash',
  'c',
  'c#',
  'c++',
  'cpp',
  'css',
  'erlang',
  'go',
  'groovy',
  'haskell',
  'html',
  'java',
  'javascript',
  'js',
  'json',
  'lua',
  'none',
  'nyan',
  'objc',
  'perl',
  'php',
  'python',
  'r',
  'rainbow',
  'ruby',
  'scala',
  'sh',
  'sql',
  'swift',
  'visualbasic',
  'xml',
  'yaml',
];

export const codeBlock: NodeEncoder = (node: PMNode): string => {
  let result = '';

  node.forEach((n) => {
    result += inlines(n, { parent: node });
  });

  if (supportedLanguageInWiki.indexOf(node.attrs.language) !== -1) {
    return `{code:${node.attrs.language}}${result}{code}`;
  } else {
    return `{noformat}${result}{noformat}`;
  }
};
