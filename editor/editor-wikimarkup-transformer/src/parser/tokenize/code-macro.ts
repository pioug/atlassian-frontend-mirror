import { Node as PMNode, Schema } from 'prosemirror-model';
import { Token, TokenParser } from '.';
import { commonMacro } from './common-macro';
import { parseAttrs } from '../utils/attrs';
import { title } from '../utils/title';

const SUPPORTED_CODEBOCK_LANGUAGES = [
  'abap',
  'actionscript',
  'ada',
  'arduino',
  'autoit',
  'c',
  'c++',
  'clojure',
  'coffeescript',
  'csharp',
  'css',
  'cuda',
  'd',
  'dart',
  'delphi',
  'elixir',
  'erlang',
  'fortran',
  'foxpro',
  'go',
  'groovy',
  'haskell',
  'haxe',
  'html',
  'java',
  'javascript',
  'json',
  'julia',
  'kotlin',
  'latex',
  'livescript',
  'lua',
  'mathematica',
  'matlab',
  'objective-c',
  'objective-j',
  'objectpascal',
  'ocaml',
  'octave',
  'perl',
  'php',
  'powershell',
  'prolog',
  'puppet',
  'python',
  'qml',
  'r',
  'racket',
  'restructuredtext',
  'ruby',
  'rust',
  'sass',
  'scala',
  'scheme',
  'shell',
  'smalltalk',
  'sql',
  'standardml',
  'swift',
  'tcl',
  'tex',
  'typescript',
  'vala',
  'vbnet',
  'verilog',
  'vhdl',
  'xml',
  'xquery',
];

export const codeMacro: TokenParser = ({
  input,
  position,
  schema,
  context,
}) => {
  return commonMacro(input.substring(position), schema, {
    keyword: 'code',
    paired: true,
    context,
    rawContentProcessor,
  });
};

const rawContentProcessor = (
  rawAttrs: string,
  rawContent: string,
  length: number,
  schema: Schema,
): Token => {
  const output: PMNode[] = [];
  const { codeBlock } = schema.nodes;

  const parsedAttrs = parseAttrs(rawAttrs);
  const trimedContent = rawContent.replace(/^\s+|\s+$/g, '');
  const textNode = trimedContent.length
    ? schema.text(trimedContent)
    : undefined;
  if (parsedAttrs.title) {
    output.push(title(parsedAttrs.title, schema));
  }

  const nodeAttrs = {
    ...parsedAttrs,
    language: getCodeLanguage(parsedAttrs),
  };

  output.push(codeBlock.createChecked(nodeAttrs, textNode));

  return {
    type: 'pmnode',
    nodes: output,
    length,
  };
};

function getCodeLanguage(attrs: { [key: string]: string }): string {
  const keys = Object.keys(attrs).map((key) => key.toLowerCase());

  for (const language of SUPPORTED_CODEBOCK_LANGUAGES) {
    if (keys.indexOf(language) !== -1) {
      return language;
    }
  }

  if (keys.indexOf('objc') !== -1) {
    return 'objective-c';
  }

  return 'java';
}
