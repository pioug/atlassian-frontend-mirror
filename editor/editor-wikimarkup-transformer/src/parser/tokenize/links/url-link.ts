import { ContentLink } from './link-parser';
import { TokenType } from '../index';
import { Context } from '../../../interfaces';
import { isSafeUrl } from '@atlaskit/adf-schema';
import { parseString } from '../../text';
import { hasAnyOfMarks } from '../../utils/text';
import { Node as PMNode, Schema } from 'prosemirror-model';

export function urlLinkResolver(
  link: ContentLink,
  schema: Schema,
  context: Context,
): PMNode[] | undefined {
  const output: PMNode[] = [];

  const url = link.notLinkBody;
  const textRepresentation = link.linkBody || link.notLinkBody;

  if (!isSafeUrl(url)) {
    return;
  }

  const ignoreTokenTypes = [
    TokenType.DOUBLE_DASH_SYMBOL,
    TokenType.TRIPLE_DASH_SYMBOL,
    TokenType.QUADRUPLE_DASH_SYMBOL,
    TokenType.LINK_TEXT,
    TokenType.ISSUE_KEY,
  ];

  const rawContent = parseString({
    ignoreTokenTypes,
    schema,
    context,
    input: textRepresentation.replace(/^mailto:/, ''),
  });

  const decoratedContent = rawContent.map((n) => {
    const mark = schema.marks.link.create({
      href: url,
    });

    // We don't want to mix `code` mark with others
    if (n.type.name === 'text' && !hasAnyOfMarks(n, ['link', 'code'])) {
      return n.mark([...n.marks, mark]);
    }
    return n;
  });

  output.push(...decoratedContent);
  if (!hasTextNode(rawContent)) {
    const mark = schema.marks.link.create({
      href: url,
    });

    const linkTextNode = schema.text(textRepresentation, [mark]);
    output.push(linkTextNode);
  }

  return output;
}

function hasTextNode(nodes: PMNode[]) {
  return nodes.find((n) => {
    return n.type.name === 'text';
  });
}
