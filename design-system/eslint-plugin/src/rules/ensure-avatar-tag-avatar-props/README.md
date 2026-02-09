Ensures that the `avatar` prop on `AvatarTag` does not include controlled props (`size`,
`borderColor`, `appearance`) which are managed internally by `AvatarTag` based on the `type` prop.

## Examples

### Incorrect

```tsx
import { AvatarTag } from '@atlaskit/tag';
import Avatar from '@atlaskit/avatar';
import TeamAvatar from '@atlaskit/teams-avatar';

// ❌ size is controlled by AvatarTag
<AvatarTag type="user" text="John" avatar={(props) => <Avatar {...props} size="large" />} />

// ❌ appearance is controlled by AvatarTag
<AvatarTag type="agent" text="Rovo" avatar={(props) => <Avatar {...props} appearance="circle" />} />

// ❌ borderColor is controlled by AvatarTag
<AvatarTag type="other" text="Team" avatar={(props) => <TeamAvatar {...props} borderColor="red" />} />
```

### Correct

```tsx
import { AvatarTag } from '@atlaskit/tag';
import Avatar from '@atlaskit/avatar';
import TeamAvatar from '@atlaskit/teams-avatar';

// ✅ Simple Avatar usage
<AvatarTag type="user" text="John" avatar={(props) => <Avatar {...props} />} />

// ✅ Avatar with src
<AvatarTag type="user" text="John" avatar={(props) => <Avatar {...props} src="user.png" />} />

// ✅ TeamAvatar
<AvatarTag type="other" text="Team" avatar={(props) => <TeamAvatar {...props} />} />

// ✅ Passing the component directly
<AvatarTag type="user" text="John" avatar={Avatar} />
```

## Why?

`AvatarTag` determines the correct `size`, `appearance`, and `borderColor` based on its `type` prop:

- `type="user"` → `appearance="circle"`
- `type="agent"` → `appearance="hexagon"`
- `type="other"` → `appearance="square"`

All avatar types receive `size="xsmall"` and `borderColor="transparent"`.

Passing these props directly will be overridden by `AvatarTag`, creating confusing code.
