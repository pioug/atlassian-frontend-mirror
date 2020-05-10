import React from 'react';
import {
  Parameters,
  ExtensionParams,
} from '@atlaskit/editor-common/extensions';

type Props = {
  node: ExtensionParams<Parameters>;
};

export default ({ node }: Props) => {
  return (
    <div>
      <p>THIS IS A FAKE VIEW FOR EXTENSIONS</p>
      <table>
        <thead style={{ fontWeight: 'bold' }}>
          <tr>
            {Object.keys(node).map(key => (
              <td key={key}>{key}</td>
            ))}
          </tr>
        </thead>
        <tbody>
          <tr>
            {Object.entries(node).map(([key, value]) => {
              return (
                <td key={key}>
                  {typeof value === 'object'
                    ? JSON.stringify(value, null, 3)
                    : value}
                </td>
              );
            })}
          </tr>
        </tbody>
      </table>
    </div>
  );
};
