import React, { useState } from 'react';

import Tag from '../src/tag/removable-tag';

export default () => {
  const ref = React.createRef();
  const [count, setCount] = useState(0);

  const beforeRemove = () => {
    console.log(ref.current);
    setCount(count + 1);
  };

  return (
    <div>
      <Tag
        text={count !== 1 ? 'Click remove button' : 'Click again to close'}
        testId="linkTag"
        removeButtonLabel="remove button"
        ref={ref}
        onBeforeRemoveAction={() => {
          beforeRemove();
          return count === 1;
        }}
      />
    </div>
  );
};
