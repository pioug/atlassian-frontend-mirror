/** @jsx jsx */
import { css, jsx } from '@emotion/core';

import { VRTestWrapper } from './utils/vr-test';
import { FlexibleUiContext } from '../src/state/flexible-ui-context';
import { SmartLinkSize } from '../src/constants';
import { getContext } from './utils/flexible-ui';
import { DeleteAction } from '../src/view/FlexibleCard/components/actions';
import TrashIcon from '@atlaskit/icon/glyph/trash';

const containerStyles = css({
  display: 'flex',
  flexWrap: 'wrap',
  gap: '5px',
  padding: '5px',
});

const context = getContext();
let onClick = () => {
  console.log('Testing Delete Action...');
};

export default () => (
  <VRTestWrapper title="Flexible UI: Action: DeleteAction">
    <FlexibleUiContext.Provider value={context}>
      <table>
        <thead>
          <tr>
            <th>Size</th>
            <th>Default</th>
            <th>No content</th>
            <th>No icon</th>
            <th>Custom icon</th>
            <th>Custom text</th>
          </tr>
        </thead>
        <tbody>
          {Object.values(SmartLinkSize).map((size) => {
            return (
              <tr>
                <td>{size}</td>
                <td>
                  <div css={containerStyles}>
                    <DeleteAction
                      size={size}
                      onClick={onClick}
                      testId="vr-test-delete-action"
                    />
                    <DeleteAction
                      size={size}
                      onClick={onClick}
                      appearance="default"
                      testId="vr-test-delete-action"
                    />
                  </div>
                </td>
                <td>
                  <div css={containerStyles}>
                    <DeleteAction
                      size={size}
                      onClick={onClick}
                      content={undefined}
                      testId="vr-test-delete-action"
                    />
                    <DeleteAction
                      size={size}
                      onClick={onClick}
                      content={undefined}
                      appearance="default"
                      testId="vr-test-delete-action"
                    />
                  </div>
                </td>
                <td>
                  <div css={containerStyles}>
                    <DeleteAction
                      size={size}
                      onClick={onClick}
                      icon={undefined}
                      testId="vr-test-delete-action"
                    />
                    <DeleteAction
                      size={size}
                      onClick={onClick}
                      icon={undefined}
                      appearance="default"
                      testId="vr-test-delete-action"
                    />
                  </div>
                </td>
                <td>
                  <div css={containerStyles}>
                    <DeleteAction
                      size={size}
                      onClick={onClick}
                      icon={<TrashIcon label="Trash" />}
                      testId="vr-test-delete-action"
                    />
                    <DeleteAction
                      size={size}
                      onClick={onClick}
                      icon={<TrashIcon label="Trash" />}
                      appearance="default"
                      testId="vr-test-delete-action"
                    />
                  </div>
                </td>
                <td>
                  <div css={containerStyles}>
                    <DeleteAction
                      size={size}
                      onClick={onClick}
                      content="Remove"
                      testId="vr-test-delete-action"
                    />
                    <DeleteAction
                      size={size}
                      onClick={onClick}
                      content="Remove"
                      appearance="default"
                      testId="vr-test-delete-action"
                    />
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </FlexibleUiContext.Provider>
  </VRTestWrapper>
);
