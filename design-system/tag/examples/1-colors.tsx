/* eslint-disable @atlaskit/design-system/ensure-design-token-usage */
import React from 'react';

import RemovableTag from '../src/tag/removable-tag';
import Tag from '../src/tag/simple-tag';

export default () => (
  <div data-testid="wrapper">
    <table style={{ maxWidth: 700, margin: 30 }}>
      <caption>Non-interactive tags</caption>
      <tr>
        <th></th>
        <th>Standard</th>
        <th>Blue</th>
        <th>Red</th>
        <th>Yellow</th>
        <th>Green</th>
        <th>Teal</th>
        <th>Purple</th>
        <th>Grey</th>
      </tr>
      <tr>
        <th>Default</th>
        <td>
          <Tag text="Tag" color="standard" testId="nonInteractiveStandard" />
        </td>
        <td>
          <Tag text="Tag" color="blue" />
        </td>
        <td>
          <Tag text="Tag" color="red" />
        </td>
        <td>
          <Tag text="Tag" color="yellow" />
        </td>
        <td>
          <Tag text="Tag" color="green" />
        </td>
        <td>
          <Tag text="Tag" color="teal" />
        </td>
        <td>
          <Tag text="Tag" color="purple" />
        </td>
        <td>
          <Tag text="Tag" color="grey" />
        </td>
        <td></td>
      </tr>
      <tr>
        <th>Light</th>
        <td></td>
        <td>
          <Tag text="Tag" color="blueLight" />
        </td>
        <td>
          <Tag text="Tag" color="redLight" />
        </td>
        <td>
          <Tag text="Tag" color="yellowLight" />
        </td>
        <td>
          <Tag text="Tag" color="greenLight" />
        </td>
        <td>
          <Tag text="Tag" color="tealLight" />
        </td>
        <td>
          <Tag text="Tag" color="purpleLight" />
        </td>
        <td>
          <Tag text="Tag" color="greyLight" />
        </td>
      </tr>
    </table>

    <table style={{ maxWidth: 700, margin: 30 }}>
      <caption>Link tags</caption>
      <tr>
        <th></th>
        <th>Standard</th>
        <th>Blue</th>
        <th>Red</th>
        <th>Yellow</th>
        <th>Green</th>
        <th>Teal</th>
        <th>Purple</th>
        <th>Grey</th>
      </tr>
      <tr>
        <th>Default</th>
        <td>
          <Tag
            href="https://www.atlassian.com/search?query=Carrot%20cake"
            text="Tag"
            color="standard"
            testId="linkStandard"
          />
        </td>
        <td>
          <Tag
            href="https://www.atlassian.com/search?query=Carrot%20cake"
            text="Tag"
            color="blue"
          />
        </td>
        <td>
          <Tag
            href="https://www.atlassian.com/search?query=Carrot%20cake"
            text="Tag"
            color="red"
          />
        </td>
        <td>
          <Tag
            href="https://www.atlassian.com/search?query=Carrot%20cake"
            text="Tag"
            color="yellow"
          />
        </td>
        <td>
          <Tag
            href="https://www.atlassian.com/search?query=Carrot%20cake"
            text="Tag"
            color="green"
          />
        </td>
        <td>
          <Tag
            href="https://www.atlassian.com/search?query=Carrot%20cake"
            text="Tag"
            color="teal"
          />
        </td>
        <td>
          <Tag
            href="https://www.atlassian.com/search?query=Carrot%20cake"
            text="Tag"
            color="purple"
          />
        </td>
        <td>
          <Tag
            href="https://www.atlassian.com/search?query=Carrot%20cake"
            text="Tag"
            color="grey"
          />
        </td>
        <td></td>
      </tr>
      <tr>
        <th>Light</th>
        <td></td>
        <td>
          <Tag
            href="https://www.atlassian.com/search?query=Carrot%20cake"
            text="Tag"
            color="blueLight"
          />
        </td>
        <td>
          <Tag
            href="https://www.atlassian.com/search?query=Carrot%20cake"
            text="Tag"
            color="redLight"
          />
        </td>
        <td>
          <Tag
            href="https://www.atlassian.com/search?query=Carrot%20cake"
            text="Tag"
            color="yellowLight"
          />
        </td>
        <td>
          <Tag
            href="https://www.atlassian.com/search?query=Carrot%20cake"
            text="Tag"
            color="greenLight"
          />
        </td>
        <td>
          <Tag
            href="https://www.atlassian.com/search?query=Carrot%20cake"
            text="Tag"
            color="tealLight"
          />
        </td>
        <td>
          <Tag
            href="https://www.atlassian.com/search?query=Carrot%20cake"
            text="Tag"
            color="purpleLight"
          />
        </td>
        <td>
          <Tag
            href="https://www.atlassian.com/search?query=Carrot%20cake"
            text="Tag"
            color="greyLight"
          />
        </td>
      </tr>
    </table>

    <table style={{ maxWidth: 700, margin: 30 }}>
      <caption>Removable tags</caption>
      <tr>
        <th></th>
        <th>Standard</th>
        <th>Blue</th>
        <th>Red</th>
        <th>Yellow</th>
        <th>Green</th>
        <th>Teal</th>
        <th>Purple</th>
        <th>Grey</th>
      </tr>
      <tr>
        <th>Default</th>
        <td>
          <RemovableTag
            removeButtonLabel="Remove"
            text="Tag"
            color="standard"
          />
        </td>
        <td>
          <RemovableTag removeButtonLabel="Remove" text="Tag" color="blue" />
        </td>
        <td>
          <RemovableTag removeButtonLabel="Remove" text="Tag" color="red" />
        </td>
        <td>
          <RemovableTag removeButtonLabel="Remove" text="Tag" color="yellow" />
        </td>
        <td>
          <RemovableTag removeButtonLabel="Remove" text="Tag" color="green" />
        </td>
        <td>
          <RemovableTag removeButtonLabel="Remove" text="Tag" color="teal" />
        </td>
        <td>
          <RemovableTag removeButtonLabel="Remove" text="Tag" color="purple" />
        </td>
        <td>
          <RemovableTag removeButtonLabel="Remove" text="Tag" color="grey" />
        </td>
        <td></td>
      </tr>
      <tr>
        <th>Light</th>
        <td></td>
        <td>
          <RemovableTag
            removeButtonLabel="Remove"
            text="Tag"
            color="blueLight"
          />
        </td>
        <td>
          <RemovableTag
            removeButtonLabel="Remove"
            text="Tag"
            color="redLight"
          />
        </td>
        <td>
          <RemovableTag
            removeButtonLabel="Remove"
            text="Tag"
            color="yellowLight"
          />
        </td>
        <td>
          <RemovableTag
            removeButtonLabel="Remove"
            text="Tag"
            color="greenLight"
          />
        </td>
        <td>
          <RemovableTag
            removeButtonLabel="Remove"
            text="Tag"
            color="tealLight"
          />
        </td>
        <td>
          <RemovableTag
            removeButtonLabel="Remove"
            text="Tag"
            color="purpleLight"
          />
        </td>
        <td>
          <RemovableTag
            removeButtonLabel="Remove"
            text="Tag"
            color="greyLight"
          />
        </td>
      </tr>
    </table>

    <table style={{ maxWidth: 700, margin: 30 }}>
      <caption>Removable + link tags</caption>
      <tr>
        <th></th>
        <th>Standard</th>
        <th>Blue</th>
        <th>Red</th>
        <th>Yellow</th>
        <th>Green</th>
        <th>Teal</th>
        <th>Purple</th>
        <th>Grey</th>
      </tr>
      <tr>
        <th>Default</th>
        <td>
          <RemovableTag
            removeButtonLabel="Remove"
            href="https://www.atlassian.com/search?query=Carrot%20cake"
            text="Tag"
            color="standard"
          />
        </td>
        <td>
          <RemovableTag
            removeButtonLabel="Remove"
            href="https://www.atlassian.com/search?query=Carrot%20cake"
            text="Tag"
            color="blue"
          />
        </td>
        <td>
          <RemovableTag
            removeButtonLabel="Remove"
            href="https://www.atlassian.com/search?query=Carrot%20cake"
            text="Tag"
            color="red"
          />
        </td>
        <td>
          <RemovableTag
            removeButtonLabel="Remove"
            href="https://www.atlassian.com/search?query=Carrot%20cake"
            text="Tag"
            color="yellow"
          />
        </td>
        <td>
          <RemovableTag
            removeButtonLabel="Remove"
            href="https://www.atlassian.com/search?query=Carrot%20cake"
            text="Tag"
            color="green"
          />
        </td>
        <td>
          <RemovableTag
            removeButtonLabel="Remove"
            href="https://www.atlassian.com/search?query=Carrot%20cake"
            text="Tag"
            color="teal"
          />
        </td>
        <td>
          <RemovableTag
            removeButtonLabel="Remove"
            href="https://www.atlassian.com/search?query=Carrot%20cake"
            text="Tag"
            color="purple"
          />
        </td>
        <td>
          <RemovableTag
            removeButtonLabel="Remove"
            href="https://www.atlassian.com/search?query=Carrot%20cake"
            text="Tag"
            color="grey"
          />
        </td>
        <td></td>
      </tr>
      <tr>
        <th>Light</th>
        <td></td>
        <td>
          <RemovableTag
            removeButtonLabel="Remove"
            href="https://www.atlassian.com/search?query=Carrot%20cake"
            text="Tag"
            color="blueLight"
          />
        </td>
        <td>
          <RemovableTag
            removeButtonLabel="Remove"
            href="https://www.atlassian.com/search?query=Carrot%20cake"
            text="Tag"
            color="redLight"
          />
        </td>
        <td>
          <RemovableTag
            removeButtonLabel="Remove"
            href="https://www.atlassian.com/search?query=Carrot%20cake"
            text="Tag"
            color="yellowLight"
          />
        </td>
        <td>
          <RemovableTag
            removeButtonLabel="Remove"
            href="https://www.atlassian.com/search?query=Carrot%20cake"
            text="Tag"
            color="greenLight"
          />
        </td>
        <td>
          <RemovableTag
            removeButtonLabel="Remove"
            href="https://www.atlassian.com/search?query=Carrot%20cake"
            text="Tag"
            color="tealLight"
          />
        </td>
        <td>
          <RemovableTag
            removeButtonLabel="Remove"
            href="https://www.atlassian.com/search?query=Carrot%20cake"
            text="Tag"
            color="purpleLight"
          />
        </td>
        <td>
          <RemovableTag
            removeButtonLabel="Remove"
            href="https://www.atlassian.com/search?query=Carrot%20cake"
            text="Tag"
            color="greyLight"
          />
        </td>
      </tr>
    </table>

    <table style={{ maxWidth: 700, margin: 30 }}>
      <caption>Link + Element before tags</caption>
      <tr>
        <th></th>
        <th>Standard</th>
        <th>Blue</th>
        <th>Red</th>
        <th>Yellow</th>
        <th>Green</th>
        <th>Teal</th>
        <th>Purple</th>
        <th>Grey</th>
      </tr>
      <tr>
        <th>Default</th>
        <td>
          <Tag
            elemBefore={<span style={{ paddingLeft: 6 }}>#</span>}
            href="https://www.atlassian.com/search?query=Carrot%20cake"
            text="Tag"
            color="standard"
            testId="elemBeforeBlue"
          />
        </td>
        <td>
          <Tag
            elemBefore={<span style={{ paddingLeft: 6 }}>#</span>}
            href="https://www.atlassian.com/search?query=Carrot%20cake"
            text="Tag"
            color="blue"
          />
        </td>
        <td>
          <Tag
            elemBefore={<span style={{ paddingLeft: 6 }}>#</span>}
            href="https://www.atlassian.com/search?query=Carrot%20cake"
            text="Tag"
            color="red"
          />
        </td>
        <td>
          <Tag
            elemBefore={<span style={{ paddingLeft: 6 }}>#</span>}
            href="https://www.atlassian.com/search?query=Carrot%20cake"
            text="Tag"
            color="yellow"
          />
        </td>
        <td>
          <Tag
            elemBefore={<span style={{ paddingLeft: 6 }}>#</span>}
            href="https://www.atlassian.com/search?query=Carrot%20cake"
            text="Tag"
            color="green"
          />
        </td>
        <td>
          <Tag
            elemBefore={<span style={{ paddingLeft: 6 }}>#</span>}
            href="https://www.atlassian.com/search?query=Carrot%20cake"
            text="Tag"
            color="teal"
          />
        </td>
        <td>
          <Tag
            elemBefore={<span style={{ paddingLeft: 6 }}>#</span>}
            href="https://www.atlassian.com/search?query=Carrot%20cake"
            text="Tag"
            color="purple"
          />
        </td>
        <td>
          <Tag
            elemBefore={<span style={{ paddingLeft: 6 }}>#</span>}
            href="https://www.atlassian.com/search?query=Carrot%20cake"
            text="Tag"
            color="grey"
          />
        </td>
        <td></td>
      </tr>
      <tr>
        <th>Light</th>
        <td></td>
        <td>
          <Tag
            elemBefore={<span style={{ paddingLeft: 6 }}>#</span>}
            href="https://www.atlassian.com/search?query=Carrot%20cake"
            text="Tag"
            color="blueLight"
          />
        </td>
        <td>
          <Tag
            elemBefore={<span style={{ paddingLeft: 6 }}>#</span>}
            href="https://www.atlassian.com/search?query=Carrot%20cake"
            text="Tag"
            color="redLight"
          />
        </td>
        <td>
          <Tag
            elemBefore={<span style={{ paddingLeft: 6 }}>#</span>}
            href="https://www.atlassian.com/search?query=Carrot%20cake"
            text="Tag"
            color="yellowLight"
          />
        </td>
        <td>
          <Tag
            elemBefore={<span style={{ paddingLeft: 6 }}>#</span>}
            href="https://www.atlassian.com/search?query=Carrot%20cake"
            text="Tag"
            color="greenLight"
          />
        </td>
        <td>
          <Tag
            elemBefore={<span style={{ paddingLeft: 6 }}>#</span>}
            href="https://www.atlassian.com/search?query=Carrot%20cake"
            text="Tag"
            color="tealLight"
          />
        </td>
        <td>
          <Tag
            elemBefore={<span style={{ paddingLeft: 6 }}>#</span>}
            href="https://www.atlassian.com/search?query=Carrot%20cake"
            text="Tag"
            color="purpleLight"
          />
        </td>
        <td>
          <Tag
            elemBefore={<span style={{ paddingLeft: 6 }}>#</span>}
            href="https://www.atlassian.com/search?query=Carrot%20cake"
            text="Tag"
            color="greyLight"
          />
        </td>
      </tr>
    </table>

    <table style={{ maxWidth: 700, margin: 30 }}>
      <caption>Removable + Link + Element before tags</caption>
      <tr>
        <th></th>
        <th>Standard</th>
        <th>Blue</th>
        <th>Red</th>
        <th>Yellow</th>
        <th>Green</th>
        <th>Teal</th>
        <th>Purple</th>
        <th>Grey</th>
      </tr>
      <tr>
        <th>Default</th>
        <td>
          <RemovableTag
            elemBefore={<span style={{ paddingLeft: 6 }}>#</span>}
            href="https://www.atlassian.com/search?query=Carrot%20cake"
            text="Tag"
            color="standard"
            testId="elemBeforeBlue"
          />
        </td>
        <td>
          <RemovableTag
            elemBefore={<span style={{ paddingLeft: 6 }}>#</span>}
            href="https://www.atlassian.com/search?query=Carrot%20cake"
            text="Tag"
            color="blue"
          />
        </td>
        <td>
          <RemovableTag
            elemBefore={<span style={{ paddingLeft: 6 }}>#</span>}
            href="https://www.atlassian.com/search?query=Carrot%20cake"
            text="Tag"
            color="red"
          />
        </td>
        <td>
          <RemovableTag
            elemBefore={<span style={{ paddingLeft: 6 }}>#</span>}
            href="https://www.atlassian.com/search?query=Carrot%20cake"
            text="Tag"
            color="yellow"
          />
        </td>
        <td>
          <RemovableTag
            elemBefore={<span style={{ paddingLeft: 6 }}>#</span>}
            href="https://www.atlassian.com/search?query=Carrot%20cake"
            text="Tag"
            color="green"
          />
        </td>
        <td>
          <RemovableTag
            elemBefore={<span style={{ paddingLeft: 6 }}>#</span>}
            href="https://www.atlassian.com/search?query=Carrot%20cake"
            text="Tag"
            color="teal"
          />
        </td>
        <td>
          <RemovableTag
            elemBefore={<span style={{ paddingLeft: 6 }}>#</span>}
            href="https://www.atlassian.com/search?query=Carrot%20cake"
            text="Tag"
            color="purple"
          />
        </td>
        <td>
          <RemovableTag
            elemBefore={<span style={{ paddingLeft: 6 }}>#</span>}
            href="https://www.atlassian.com/search?query=Carrot%20cake"
            text="Tag"
            color="grey"
          />
        </td>
        <td></td>
      </tr>
      <tr>
        <th>Light</th>
        <td></td>
        <td>
          <RemovableTag
            elemBefore={<span style={{ paddingLeft: 6 }}>#</span>}
            href="https://www.atlassian.com/search?query=Carrot%20cake"
            text="Tag"
            color="blueLight"
          />
        </td>
        <td>
          <RemovableTag
            elemBefore={<span style={{ paddingLeft: 6 }}>#</span>}
            href="https://www.atlassian.com/search?query=Carrot%20cake"
            text="Tag"
            color="redLight"
          />
        </td>
        <td>
          <RemovableTag
            elemBefore={<span style={{ paddingLeft: 6 }}>#</span>}
            href="https://www.atlassian.com/search?query=Carrot%20cake"
            text="Tag"
            color="yellowLight"
          />
        </td>
        <td>
          <RemovableTag
            elemBefore={<span style={{ paddingLeft: 6 }}>#</span>}
            href="https://www.atlassian.com/search?query=Carrot%20cake"
            text="Tag"
            color="greenLight"
          />
        </td>
        <td>
          <RemovableTag
            elemBefore={<span style={{ paddingLeft: 6 }}>#</span>}
            href="https://www.atlassian.com/search?query=Carrot%20cake"
            text="Tag"
            color="tealLight"
          />
        </td>
        <td>
          <RemovableTag
            elemBefore={<span style={{ paddingLeft: 6 }}>#</span>}
            href="https://www.atlassian.com/search?query=Carrot%20cake"
            text="Tag"
            color="purpleLight"
          />
        </td>
        <td>
          <RemovableTag
            elemBefore={<span style={{ paddingLeft: 6 }}>#</span>}
            href="https://www.atlassian.com/search?query=Carrot%20cake"
            text="Tag"
            color="greyLight"
          />
        </td>
      </tr>
    </table>
  </div>
);
