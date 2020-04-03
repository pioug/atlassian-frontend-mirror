import { NodeSerializerOpts } from '../interfaces';
import { createTable, TableData } from '../table-util';
import { createTag } from '../create-tag';
import { createContentId } from '../static';
import { createClassName } from '../styles/util';

enum DecisionState {
  DECIDED = 'DECIDED',
}

const className = createClassName('decision');
export const styles = `
.${className} {
  padding: 4px 0px 4px 0;
}
.${className}-content {
  border-radius: 3px;
  table-layout: fixed;
  line-height: 20px;
}
.${className}-icon {
  width: 16px;
  height: 16px;
}
.${className}-iconTd {
  vertical-align: top;
  padding: 11px 0px 0px 8px;
  width: 24px;
  height: 24px;
}
.${className}-textTd {
  font-size: 14px;
  padding: 8px 8px 8px 0;
}
`;

const icons: { [K in DecisionState]: string } = {
  DECIDED: createTag('img', {
    class: className + '-icon',
    src: createContentId('decision'),
  }),
};

interface DecisionItemAttrs {
  state: DecisionState;
  localId: string;
}

export default function decisionItem({ attrs, text }: NodeSerializerOpts) {
  // If there is no content, we shouldn't render anything
  if (!text) {
    return '';
  }

  const state = (attrs as DecisionItemAttrs).state;

  const iconTd: TableData = {
    text: icons[state],
    attrs: { class: className + '-iconTd' },
  };

  const textTd: TableData = {
    text,
    attrs: { class: className + '-textTd' },
  };

  const mainContentTable = createTable(
    [[iconTd, textTd]],
    {},
    { class: className + '-content' },
  );

  return createTable([
    [
      {
        text: mainContentTable,
        attrs: { class: className },
      },
    ],
  ]);
}
