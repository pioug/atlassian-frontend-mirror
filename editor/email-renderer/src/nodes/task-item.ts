import { NodeSerializerOpts } from '../interfaces';
import { TableData, createTable } from '../table-util';
import { createTag } from '../create-tag';
import { createContentId } from '../static';
import { createClassName } from '../styles/util';

enum TaskState {
  TODO = 'TODO',
  DONE = 'DONE',
}

const className = createClassName('taskItem');

export const styles = `
.${className}-img {
  width: 16px;
  height: 16px;
}
.${className}-iconTd {
  vertical-align: top;
  padding: 10px 0px 0px 8px;
  line-height: 20px;
  width: 24px;
  height: 24px;
}
.${className}-textTd {
  font-size: 14px;
  line-height: 20px;
  padding: 8px 8px 8px 0;
}
.${className}-mainContent {
  border-radius: 3px;
  table-layout: fixed;
  line-height: 20px;
}
.${className}-wrapper {
  padding: 4px 0px 4px 0;
}
`;

const icons: { [K in TaskState]: string } = {
  TODO: createTag('img', {
    class: className + '-img',
    src: createContentId('taskItemUnchecked'),
  }),
  DONE: createTag('img', {
    class: className + '-img',
    src: createContentId('taskItemChecked'),
  }),
};

interface TaskItemAttrs {
  state: TaskState;
  localId: string;
}

export default function taskItem({ attrs, text }: NodeSerializerOpts) {
  // If there is no content, we shouldn't render anything
  if (!text) {
    return '';
  }

  const state = (attrs as TaskItemAttrs).state;

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
    { class: `${className}-mainContent` },
  );

  return createTable([
    [
      {
        text: mainContentTable,
        attrs: { class: `${className}-wrapper` },
      },
    ],
  ]);
}
