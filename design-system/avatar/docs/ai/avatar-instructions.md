# Prop guidance

- **name** - Always provide for accessibility (use full names when possible)
- **size** - xsmall (inline), small (compact), medium (standard), large (prominent), xlarge (hero),
  xxlarge (marketing)
- **presence** - Use sparingly for real-time status (online, busy, focus, offline)
- **status** - For approval states (approved, declined, locked)
- **appearance** - Use "square" for non-circular avatars

# Translating from Tailwind

An example diff of a migration from Tailwind generated code to ADS generated code.

```diff
+import Avatar from '@atlaskit/avatar';
-<img
-  src="/avatar.jpg"
-  alt="User"
-  className="w-10 h-10 rounded-full"
-/>
+<Avatar src="/avatar.jpg" name="John Doe" />

-<div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm font-medium">
-  JD
-</div>
+<Avatar name="John Doe" />

-<div className="relative">
-  <img src="/avatar.jpg" alt="User" className="w-10 h-10 rounded-full" />
-  <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
-</div>
+<Avatar
+  src="/avatar.jpg"
+  name="John Doe"
+  presence="online"
+/>
```
