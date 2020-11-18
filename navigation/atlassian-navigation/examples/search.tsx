import React, { useState } from 'react';

import { AtlassianNavigation, Search } from '../src';

export default () => {
  const DefaultSearch = () => {
    const [value, setValue] = useState('');
    const onChange = (event: any) => {
      console.log('search clicked with value: ', event.target.value);
      setValue(event.target.value);
    };

    return (
      <Search
        onClick={onChange}
        placeholder="Search..."
        tooltip="Search"
        label="Search"
        value={value}
      />
    );
  };

  return (
    <AtlassianNavigation
      label="site"
      renderProductHome={() => null}
      renderSearch={DefaultSearch}
      primaryItems={[]}
    />
  );
};
