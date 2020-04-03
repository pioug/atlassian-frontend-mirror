import { code, md } from '@atlaskit/docs';

export default md`
## v5 to v6

### ✨ TypeScript support

Analytics-next is now completely written in TypeScript

### 🧠 HOC Type inference

In v5, the main problem areas for \`analytics-next\`, with regards to TypeScript, was \`withAnalyticsEvents\` and \`withAnalyticsContext\`.
These two HOCs never quite worked as expected, often relying on consumers to cast the return value of the
function back into the component they wish to export. Recently this was partially mitigated by accepting prop types as generics, returning TS type safety
 with one downside, props must be passed into every usage of our HOCs.

Now in v6, support for [type inference](https://www.typescriptlang.org/docs/handbook/type-inference.html) is built-in so you
no longer have to explicitly pass props as generic types.

### 📝 Renaming types and interfaces

\`analytics-next\` previously provided typings via a module declaration file (index.d.ts), which was actually slightly misaligned
with the source code. Some interfaces were used to describe classes, and some classes of the same name were also being exported to avoid name clashes.
v6 removes those discrepancies by renaming and removing misaligned type definitions. See breaking changes for more information.

### 💥 Breaking Changes:

- flow types have been removed
- \`withAnalyticsEvents\` now infers proptypes automatically, consumers no longer need to provide props as a generic type.
- \`withAnalyticsContext\` now infers proptypes automatically, consumers no longer need to provide props as a generic type.
- Type \`WithAnalyticsEventProps\` has been renamed to \`WithAnalyticsEventsProps\` to match source code
- Type \`CreateUIAnalyticsEventSignature\` has been renamed to \`CreateUIAnalyticsEvent\` to match source code
- Type \`UIAnalyticsEventHandlerSignature\` has been renamed to \`UIAnalyticsEventHandler\` to match source code
- Type \`AnalyticsEventsPayload\` has been renamed to \`AnalyticsEventPayload\`
- Type \`ObjectType\` has been removed, please use \`Record<string, any>\` or \`[key: string]: any\`
- Type \`UIAnalyticsEventInterface\` has been removed, please use \`UIAnalyticsEvent\`
- Type \`AnalyticsEventInterface\` has been removed, please use \`AnalyticsEvent\`
- Type \`CreateAndFireEventFunction\` removed and should now be inferred by TypeScript
- Type \`AnalyticsEventUpdater\` removed and should now be inferred by TypeScript

<br/>

---

### ⬆️ Upgrade guide
_Applicable to TypeScript users only_

#### Renaming types and interfaces

Most of the breaking changes above can be avoided with a 'find-and-replace' of the following types/interfaces:

- \`WithAnalyticsEventProps\` => \`WithAnalyticsEventsProps\`
- \`CreateUIAnalyticsEventSignature\` => \`CreateUIAnalyticsEvent\`
- \`UIAnalyticsEventHandlerSignature\` => \`UIAnalyticsEventHandler\`
- \`AnalyticsEventsPayload\` => \`AnalyticsEventPayload\`

Some interfaces were used to describe a class instance. This is no longer needed since a class in TypeScript can be used as a type.
These interfaces should be replaced by their class equivalents:

- \`UIAnalyticsEventInterface\` => \`UIAnalyticsEvent\`
- \`AnalyticsEventInterface\` => \`AnalyticsEvent\`

The following types have been removed from the library and can either be safely replaced with an alternate type or
removed entirely in favour of type inference:

- \`ObjectType\` => \`Record<string, any>\` or \`[key: string]: any\`
- \`CreateAndFireEventFunction\` now inferred by TypeScript
- \`AnalyticsEventUpdater\` now inferred by TypeScript

#### Using \`withAnalyticsEvents\` and \`withAnalyticsContext\` with type-safety

After upgrading to v6, you might now be greeted with TypeScript errors relating
to \`withAnalyticsEvents\` and \`withAnalyticsContext\`. As described above, there
have been a lot of changes to the way types are applied to these HOCs.

Previously, props needed to be explicitly defined and passed in as [generic type arguments](https://www.typescriptlang.org/docs/handbook/generics.html).
Now, you should be able to remove the generic types and let TypeScript do the heavy lifting.

For example:

**Before…**

${code`
withAnalyticsContext<ButtonProps>({})(Button);
withAnalyticsEvents<ButtonProps>({})(Button);
`}

**After…**

${code`
withAnalyticsContext({})(Button);
withAnalyticsEvents({})(Button);
`}

This does however require you to extend your component's props with \`WithAnalyticsEventProps\`.
A common pattern you’ll find with other HOC implementations, used to ensure you’re passing the correct super type to the HOC.

${code`
import { WithAnalyticsEventsProps } from '@atlaskit/analytics-next';

interface ButtonProps extends WithAnalyticsEventsProps {
  appearance: string,
}
`}

To provide additional flexibility, you can now opt-out of type inference if needed. It might be necessary in edge-cases
where TypeScript is not able to infer the prop types of the component you have supplied.
If that's the case, try passing in the generic type arguments to \`withAnalyticsEvents\`.

${code`
export default withAnalyticsContext({})(
  withAnalyticsEvents({})
  <
    ButtonProps,
    React.ComponentType<ButtonProps>
  >(Button),
);
`}


`;
