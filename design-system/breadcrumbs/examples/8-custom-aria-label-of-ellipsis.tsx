import React, { useState } from 'react';

import Breadcrumbs, { BreadcrumbsItem } from '../src';

export default () => {
  const [label, setLabel] = useState<string>('');

  return (
    // with many items, and a maximum to display set
    <div>
      <label
        htmlFor="label-input"
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
        }}
      >
        Ellipsis aria label:
        <input
          id="label-input"
          value={label}
          onChange={(e) => setLabel(e.target.value)}
        />
      </label>
      <hr style={{ margin: '15px 0px' }} />
      <div style={{ maxWidth: '500px' }}>
        <Breadcrumbs maxItems={5} ellipsisLabel={label}>
          <BreadcrumbsItem href="/item" text="Item" />
          <BreadcrumbsItem href="/item" text="Another item" />
          <BreadcrumbsItem href="/item" text="A third item" />
          <BreadcrumbsItem
            href="/item"
            text="A fourth item with a very long name"
          />
          <BreadcrumbsItem href="/item" text="Item 5" />
          <BreadcrumbsItem href="/item" text="Item 6" />
        </Breadcrumbs>
      </div>
    </div>
  );
};
