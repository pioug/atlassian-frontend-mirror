import { MarkSerializerOpts } from '../interfaces';
import { createTable } from '../table-util';
import { createClassName } from '../styles/util';

export const styles = `
.${createClassName('mark-indentation-1')} {
  padding-left: 30px;
}
.${createClassName('mark-indentation-2')} {
  padding-left: 60px;
}
.${createClassName('mark-indentation-3')} {
  padding-left: 90px;
}
.${createClassName('mark-indentation-4')} {
  padding-left: 120px;
}
.${createClassName('mark-indentation-5')} {
  padding-left: 150px;
}
.${createClassName('mark-indentation-6')} {
  padding-left: 180px;
}
`;

export default function code({ mark, text }: MarkSerializerOpts) {
  // Outlook accepts padding on <td> element, thus we wrap it with table here
  return createTable([
    [
      {
        text,
        attrs: {
          class: createClassName(`mark-indentation-${mark.attrs.level}`),
        },
      },
    ],
  ]);
}
