import { B50, R50, Y50, G50, P50 } from '@atlaskit/adf-schema';

import { NodeSerializerOpts } from '../interfaces';
import { createTable, TableData } from '../table-util';
import { createTag } from '../create-tag';
import { createContentId } from '../static';
import { createClassName } from '../styles/util';
import { fontFamily, fontSize, lineHeight, fontWeight } from '../styles/common';

type PanelType =
  | 'info'
  | 'note'
  | 'tip'
  | 'success'
  | 'warning'
  | 'error'
  | 'custom';

export const className = createClassName('panel');

export const styles = `
.${className} {
  font-family: ${fontFamily};
  font-size: ${fontSize};
  line-height: ${lineHeight};
  font-weight: ${fontWeight};
  padding: 8px 0px 8px 0px;
  margin: 0px;
  width: 100%;
}
.${className}-innerTable {
  font-family: ${fontFamily};
  font-size: ${fontSize};
  line-height: ${lineHeight};
  font-weight: ${fontWeight};
  border-radius: 3px;
  -webkit-border-radius: 3px;
  -moz-border-radius: 3px;
  table-layout: fixed;
  line-height: 20px;
}
.${className}-inner {
  font-family: ${fontFamily};
  font-size: ${fontSize};
  line-height: ${lineHeight};
  font-weight: ${fontWeight};
  font-size: 14px;
  width: 100%;
  padding: 1px 8px 1px 0;
  margin: 0px;
}
.${className}-icon {
  width: 16px;
  height: 16px;
}
.${className}-iconTd {
  vertical-align: top;
  width: 24px;
  height: 24px;
  padding: 12px 0px 0px 8px;
}
.${className}-type-info {
    background: ${B50};
}
.${className}-type-note {
    background: ${P50};
}
.${className}-type-tip {
    background: ${G50};
}
.${className}-type-success {
    background: ${G50};
}
.${className}-type-warning {
    background: ${Y50};
}
.${className}-type-error {
    background: ${R50};
}
.${className}-type-custom {
  background: ${B50};
}
`;

export default function panel({ attrs, text }: NodeSerializerOpts) {
  const type: PanelType = attrs.panelType;

  const panelIcon = createTag('img', {
    class: className + '-icon',
    src: createContentId(type),
    width: 16,
    height: 16,
  });

  const iconTd: TableData = {
    text: panelIcon,
    attrs: { class: className + '-iconTd' },
  };

  const textTd: TableData = {
    text,
    attrs: { class: className + '-inner' },
  };

  const innerTable = createTable(
    [[iconTd, textTd]],
    {},
    { class: `${className}-innerTable ${className}-type-${type}` },
  );
  return createTable([[{ attrs: { class: className }, text: innerTable }]]);
}
