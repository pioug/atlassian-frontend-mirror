import { ContentLink } from './link-parser';
import { Schema, Node as PMNode } from 'prosemirror-model';
import { Context } from '../../../interfaces';
import { Issue, buildInlineCard, getIssue } from '../issue-key';

export function issueLinkResolver(
  link: ContentLink,
  schema: Schema,
  context: Context,
): PMNode[] | undefined {
  const { originalLinkText, linkTitle, notLinkBody } = link;
  if (
    linkTitle === 'smart-card' ||
    linkTitle === 'block-link' // TODO: Depricated should be removed in the next major release
  ) {
    return [
      schema.nodes.blockCard.createChecked({
        url: notLinkBody,
      }),
    ];
  }
  if (linkTitle === 'smart-link') {
    return [
      schema.nodes.inlineCard.createChecked({
        url: notLinkBody,
      }),
    ];
  }
  if (linkTitle === 'smart-embed') {
    return [
      schema.nodes.embedCard.createChecked({
        url: notLinkBody,
      }),
    ];
  }
  const issue: Issue | null = getIssue(context, originalLinkText);

  if (issue) {
    return buildInlineCard(schema, issue);
  }

  return undefined;
}
