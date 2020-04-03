import {
  NodeSerializerOpts,
  SmartCardWithDataAttributes,
  SmartCardWithUrlAttributes,
} from '../interfaces';
import { createTag } from '../create-tag';
import { createClassName } from '../styles/util';
import { B400 } from '@atlaskit/adf-schema';

const className = createClassName('inlineCard');

export const styles = `
.${className} {
  border-radius: 3px;
  -webkit-border-radius: 3px;
  -moz-border-radius: 3px;
  padding: 0px 0px 2px 0px;
  background-color: #e9eaee;
  line-height: 24px;
}
.${className}-link {
  color: ${B400};
  border: none;
  background: transparent;
  text-decoration: none;
}
`;

export default function inlineCard({ attrs }: NodeSerializerOpts) {
  let scAttrs: SmartCardWithDataAttributes | SmartCardWithUrlAttributes;
  let textContent: string;
  let href: string;

  if (attrs.data) {
    scAttrs = attrs as SmartCardWithDataAttributes;
    href = scAttrs.data.url;
    textContent = scAttrs.data.name;
  } else {
    scAttrs = attrs as SmartCardWithUrlAttributes;
    href = scAttrs.url;
    textContent = scAttrs.url;
  }

  const card = createTag(
    'span',
    { class: className },
    `&nbsp;${textContent}&nbsp;`,
  );
  const fontTag = createTag(
    'font',
    { color: B400, class: className + '-link' },
    card,
  );
  return href
    ? createTag('a', { href, class: className + '-link' }, fontTag)
    : fontTag;
}
