import React from 'react';

export type SubSupType = 'sub' | 'sup';

const isSub = (type: SubSupType): type is 'sub' => {
  return type === 'sub';
};

export default function SubSup(props: { type: SubSupType } & React.Props<any>) {
  if (isSub(props.type)) {
    return <sub>{props.children}</sub>;
  }

  return <sup>{props.children}</sup>;
}
