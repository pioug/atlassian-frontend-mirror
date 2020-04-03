import { NodeSerializerOpts } from '../interfaces';
import { TableData, createTable } from '../table-util';
import { createTag } from '../create-tag';
import { createContentId } from '../static';
import { createClassName } from '../styles/util';

const className = createClassName('expand');

export const styles = `
.${className} {
  border: 1px solid rgba(9,30,66,0.25);
  border-radius: 4px;
}

.${className}-icon {
  width: 24px;
  height: 24px;
}

.${className}-iconWrapper {
  width: 24px;
  height: 24px;
  padding: 0 4px 0 8px;
}

.${className}-title {
  width: 100%;
  padding: 8px 0;
  color: rgba(9,30,66,0.60);
}

.${className}-content {
  font-size: 14px;
  line-height: 20px;
  padding: 4px 16px 8px 0;
}
`;

export default function expand({ attrs, text }: NodeSerializerOpts) {
  if (!text) {
    return '';
  }

  const expandIconTd: TableData = {
    text: createTag('img', {
      class: className + '-icon',
      src: createContentId('expand'),
    }),
    attrs: { class: className + '-iconWrapper' },
  };

  const expandTitleTd: TableData = {
    text: attrs.title || 'Click here to expand...',
    attrs: { class: className + '-title' },
  };

  const expandContentTd: TableData = {
    text,
    attrs: { class: className + '-content' },
  };

  return createTable(
    [
      [expandIconTd, expandTitleTd],
      [{}, expandContentTd],
    ],
    undefined,
    { class: className },
  );
}
