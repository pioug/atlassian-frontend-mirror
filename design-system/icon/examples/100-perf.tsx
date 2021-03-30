import React from 'react';
import metadata from '../src/metadata';
const IconComponents = Object.keys(metadata).map((name: string) => {
  const icon = require(`../glyph/${name}.js`);
  return icon.default;
});
export default function AllIcons() {
  return (
    <>
      {IconComponents.map((Icon, index) => (
        <Icon index={index} />
      ))}
    </>
  );
}
