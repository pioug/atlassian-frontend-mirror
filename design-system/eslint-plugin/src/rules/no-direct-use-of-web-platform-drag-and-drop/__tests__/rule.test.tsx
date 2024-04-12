import { tester } from '../../__tests__/utils/_tester';
import rule from '../index';
import {
  blockedEventNameLookup,
  blockedJSXAttributeLookup,
} from '../shared/blocked';

const blockedEventNames = Array.from(blockedEventNameLookup);
const blockedJSXAttributes = Array.from(blockedJSXAttributeLookup);

const someAllowedJSXAttributes = ['onClick', 'onKeyDown'];

const someIntrinsicReactElements = ['div', 'span', 'a', 'strong', 'small'];

tester.run('no-direct-use-of-web-platform-drag-and-drop', rule, {
  valid: [
    // JSX usage
    ...someIntrinsicReactElements
      .map((element) => {
        return someAllowedJSXAttributes.map((attribute) => ({
          name: `Allowing JSXAttribute on <${element}>: ${attribute}`,
          code: `<div ${attribute}={() => console.log('${attribute}')}>hi</div>`,
        }));
      })
      .flat(),
    ...someAllowedJSXAttributes.map((attribute) => ({
      name: `Allowing JSXAttribute on <Box>: ${attribute}`,
      code: `
        import {Box} from '@atlaskit/primitives';

        <Box ${attribute}={() => console.log('${attribute}')}>hi</Box>
      `,
    })),
    ...blockedJSXAttributes.map((attribute) => ({
      name: `Allowing blocked JSX attributes a non Design System <Box>: ${attribute}`,
      code: `
        import {Box} from 'my-cool-library';

        <Box ${attribute}={() => console.log('${attribute}')}>hi</Box>
      `,
    })),
    ...blockedJSXAttributes.map((attribute) => ({
      name: `Allowing blocked JSXAttributes on custom components: ${attribute}`,
      code: `<MyComponent ${attribute}={() => console.log('hi')} />`,
    })),
    {
      name: 'Allowed to use event listener for non blocked events',
      code: `element.addEventListener('click')`,
    },

    {
      name: 'using bind() is find if using an allowed event listener name',
      code: `
        import {bind} from 'bind-event-listener';

        bind(window, {type: 'click', listener: () => console.log('hi') });
      `,
    },

    {
      name: 'not checking bind() from another package',
      code: `
        import {bind} from 'some-other-import';

        bind(window, {type: 'dragstart', listener: () => console.log('hi') });
      `,
    },
    {
      name: 'not checking locally defined bind() functions',
      code: `
        function bind() {

        }

        bind(window, {type: 'dragstart', listener: () => console.log('hi') });
      `,
    },
    {
      name: 'bindAll() is fine without blocked names',
      code: `
        import {bindAll} from 'bind-event-listener';

        bindAll(window,
          [
            {type: 'click', listener: () => console.log('hi') },
            {type: 'keydown', listener: () => console.log('hi') },
          ]
        );
      `,
    },
    {
      name: 'not checking bindAll from another package',
      code: `
        import {bindAll} from 'some other package';

        bindAll(window,
          [
            {type: 'click', listener: () => console.log('hi') },
            {type: 'keydown', listener: () => console.log('hi') },
          ]
        );
      `,
    },
    {
      name: 'not checking a locally created bindAll()',
      code: `
        function bindAll() {};

        bindAll(window,
          [
            {type: 'click', listener: () => console.log('hi') },
            {type: 'keydown', listener: () => console.log('hi') },
          ]
        );
      `,
    },
  ],
  invalid: [
    ...someIntrinsicReactElements
      .map((element) => {
        return blockedJSXAttributes.map((attribute) => ({
          name: `Blocked JSXAttribute on <${element}>: ${attribute}`,
          code: `<div ${attribute}={() => console.log('${attribute}')}>hi</div>`,
          errors: [{ messageId: 'usePragmaticDnd' }],
        }));
      })
      .flat(),
    ...blockedJSXAttributes.map((attribute) => ({
      name: `Blocked JSXAttribute on <Box>: ${attribute}`,
      code: `
        import {Box} from '@atlaskit/primitives';

        <Box ${attribute}={() => console.log('${attribute}')}>hi</Box>
      `,
      errors: [{ messageId: 'usePragmaticDnd' }],
    })),

    // add event listener
    ...blockedEventNames.map((eventName) => ({
      name: `Blocking addingEventListener() for event: ${eventName}`,
      code: `element.addEventListener('${eventName}')`,
      errors: [{ messageId: 'usePragmaticDnd' }],
    })),
    ...blockedEventNames.map((eventName) => ({
      name: `Blocking bind() for "${eventName}"`,
      code: `
        import {bind} from 'bind-event-listener';

        bind(window, { type: '${eventName}', listener: () => console.log('hi') });
      `,
      errors: [{ messageId: 'usePragmaticDnd' }],
    })),
    ...blockedEventNames.map((eventName) => ({
      name: `Blocking bind() for "${eventName}" (reversed property order)`,
      code: `
        import {bind} from 'bind-event-listener';

        bind(window, { listener: () => console.log('hi'), type: '${eventName}' });
      `,
      errors: [{ messageId: 'usePragmaticDnd' }],
    })),
    ...blockedEventNames.map((eventName) => ({
      name: `Block bindAll() with "${eventName}"`,
      code: `
        import {bindAll} from 'bind-event-listener';

        bindAll(window,
          [
            {type: '${eventName}', listener: () => console.log('hi') },
          ]
        );
      `,
      errors: [{ messageId: 'usePragmaticDnd' }],
    })),
    ...blockedEventNames.map((eventName) => ({
      name: `Block bindAll() with "${eventName}" (including a valid binding)`,
      code: `
        import {bindAll} from 'bind-event-listener';

        bindAll(window,
          [
            // valid
            {type: 'click', listener: () => console.log('hi') },
            // invalid
            {type: '${eventName}', listener: () => console.log('hi') },
          ]
        );
      `,
      errors: [{ messageId: 'usePragmaticDnd' }],
    })),
    ...blockedEventNames.map((eventName) => ({
      name: `Block bindAll() with "${eventName}" (including a valid binding + reversed property order)`,
      code: `
        import {bindAll} from 'bind-event-listener';

        bindAll(window,
          [
            // valid
            {listener: () => console.log('hi'), type: 'click' },
            // invalid
            {listener: () => console.log('hi'), type: '${eventName}' },
          ]
        );
      `,
      errors: [{ messageId: 'usePragmaticDnd' }],
    })),
  ],
});
