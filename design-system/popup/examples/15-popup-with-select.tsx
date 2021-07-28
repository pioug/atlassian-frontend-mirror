/** @jsx jsx */
import { Fragment, useState } from 'react';

import { css, jsx } from '@emotion/core';

import Button from '@atlaskit/button/standard-button';
import MediaServicesAddCommentIcon from '@atlaskit/icon/glyph/media-services/add-comment';
import Select from '@atlaskit/select';

import Popup from '../src';

const selectContainerStyles = css({
  minWidth: 175,
  minHeight: 250,
});

export default () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Fragment>
      Popup with select
      <br />
      <Popup
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        placement="bottom-start"
        content={() => (
          <div css={selectContainerStyles}>
            <Select
              defaultValue={{ label: 'Brisbane', value: 'brisbane' }}
              options={[
                { label: 'Adelaide', value: 'adelaide', extra: 'extra' },
                { label: 'Brisbane', value: 'brisbane' },
                { label: 'Canberra', value: 'canberra' },
                { label: 'Darwin', value: 'darwin' },
                { label: 'Hobart', value: 'hobart' },
                { label: 'Melbourne', value: 'melbourne' },
                { label: 'Perth', value: 'perth' },
                { label: 'Sydney', value: 'sydney' },
              ]}
              isMulti
              isSearchable={false}
              placeholder="Choose a City"
            />
          </div>
        )}
        trigger={(triggerProps) => (
          <Button
            {...triggerProps}
            isSelected={isOpen}
            onClick={() => setIsOpen(!isOpen)}
            value="Add"
            iconBefore={<MediaServicesAddCommentIcon label="Add" />}
          />
        )}
      />
    </Fragment>
  );
};
