import { code, md } from '@atlaskit/docs';

export default md`
  ## Duration

  There are three durations available,
  each size increases in duration.
  Use a larger duration for an element that moves a large distance,
  or is a large element.

  <br />

  ${code`
import {
  durationStep,
  smallDurationMs,
  mediumDurationMs,
  largeDurationMs,
} from '@atlaskit/motion';
  `}

  <br />

  All durations are multiples of \`durationStep\`.
  Do the current durations not fit your purpose?
  No worries! Make sure to create a custom one from \`durationStep\`.

  ### Duration decision matrix

  Use this table if you're unsure what duration you should use.

  <br />

  <table>
    <thead>
      <tr>
        <th></th>
        <th>Small element</th>
        <th>Large element</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td><strong>Short distance</strong></td>
        <td><code>smallDurationMs</code></td>
        <td><code>mediumDurationMs</code></td>
      </tr>
      <tr>
        <td><strong>Long distance</strong></td>
        <td><code>mediumDurationMs</code></td>
        <td><code>largeDurationMs</code></td>
      </tr>
    </tbody>
  </table>

  ## Curves

  There are three curves available,
  each used for a particular user interaction,
  or how the element appears.

  <br />

  ${code`
import { easeInOut, easeIn, easeOut } from '@atlaskit/motion';
  `}

  <br />

  ### Curves decision matrix

  Use this table if you're unsure what curve you should use.

  <br />

  <table>
    <thead>
      <tr style="vertical-align: top;">
        <th></th>
        <th><code>easeInOut</code></th>
        <th><code>easeOut</code></th>
        <th><code>easeIn</code></th>
      </tr>
    </thead>
    <tbody>
      <tr style="vertical-align: top;">
        <td><i>When to use</i></td>
        <td>When an element has been interacted with indirectly.</td>
        <td>When an element has been interacted with directly. <br/>When an element appears from off screen.</td>
        <td>Use rarely. Only used if an element is moving indirectly entirely off the screen.</td>
      </tr>
      <tr style="vertical-align: top;">
        <td><i>Example use case</i></td>
        <td>A user clicks a button, and a separate element moves.</td>
        <td>A user clicks an element, and that same element moves. <br/>A drawer appears from off screen.</td>
        <td>A user clicks a button which spins and waits. After the operation is finished the button enters a confirmed state and the modal slides entirely off the screen.</td>
      </tr>
    </tbody>
  </table>
`;
