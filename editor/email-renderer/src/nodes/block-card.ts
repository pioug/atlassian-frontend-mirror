import {
  NodeSerializerOpts,
  SmartCardWithDataAttributes,
  SmartCardWithUrlAttributes,
} from '../interfaces';
import { createTag } from '../create-tag';
import { createTable } from '../table-util';
import { createClassName } from '../styles/util';

const className = createClassName('blockCard');

export const styles = `
.${className}-headingUrl {
  overflow: hidden;
  color: #000000;
  font-size: 14px;
  font-weight: 500;
  text-overflow: ellipsis;
  white-space: nowrap;
  text-decoration: none;
}
.${className}-outerTd  {
  border-radius: 3px;
  -webkit-border-radius: 3px;
  -moz-border-radius: 3px;
  padding: 2px 5px 5px 5px;
  margin: 0px;
  color: #000000;
  background-color: #F4F5F7;
  font-size: 12px;
}
.${className}-headingData  {
  font-size: 16px;
  line-height: 24px;
  font-weight: 500;
}
.${className}-contentTextWithData  {
  padding: 7px 0 0 0;
  color: #000000;
}
.${className}-block {
  width: 400px;
  min-width: 200px;
  max-width: 400px;
}
.${className}-cardContentTd {
  border-radius: 3px;
  -webkit-border-radius: 3px;
  -moz-border-radius: 3px;
  padding: 6px 12px 12px 12px;
  background: #FFFFFF;
  font-size: 12px;
  line-height: 18px;
  border: #ebedf0 solid 1px;
}
.${className}-cardHeaderTd {
  color: #5E6C84;
  font-size: 12px;
  line-height: 24px;
}
.${className}-link {
  border: none;
  background: transparent;
  color: #000000;
  text-decoration: none;
}
.${className}-headingUrl {
  overflow: hidden;
  color: #000000;
  font-size: 14px;
  font-weight: 500;
  text-overflow: ellipsis;
  white-space: nowrap;
  text-decoration: none;
}
`;

const renderBlockCardWithData = (attrs: SmartCardWithDataAttributes) => {
  const name = attrs.data.name;
  const summary = attrs.data.summary;
  const heading = createTag('div', { class: className + '-headingData' }, name);
  const text = createTag(
    'div',
    { class: className + '-contentTextWithData' },
    summary,
  );

  const blockContent = createTable(
    [
      [
        {
          attrs: { class: className + '-cardHeaderTd' },
          text: attrs.data.generator.name,
        },
      ],
      [
        {
          attrs: { class: className + '-cardContentTd' },
          text: `${heading}${text}`,
        },
      ],
    ],
    {},
    { class: className + '-block' },
  );

  return createTable(
    [
      [
        {
          text: blockContent,
          attrs: { class: className + '-outerTd' },
        },
      ],
    ],
    {},
    { class: className + '-block' },
  );
};

const renderBlockCard = (
  attrs: SmartCardWithUrlAttributes,
  text?: string | null,
) => {
  const title = text || attrs.url;
  const heading = createTag(
    'div',
    { class: `${className}-block ${className}-headingUrl` },
    title,
  );

  return createTable(
    [[{ attrs: { class: className + '-outerTd' }, text: heading }]],
    {},
    { class: className + '-block' },
  );
};

export default function blockCard({ attrs, text }: NodeSerializerOpts) {
  if (attrs.data) {
    const href = attrs.data.url;
    const card = renderBlockCardWithData(attrs as SmartCardWithDataAttributes);
    return href
      ? createTag('a', { href, class: className + '-link' }, card)
      : card;
  }

  const href = attrs.url;
  const card = renderBlockCard(attrs as SmartCardWithUrlAttributes, text);
  return href
    ? createTag('a', { href, class: className + '-link' }, card)
    : card;
}
