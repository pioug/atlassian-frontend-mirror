# Prop guidance

- **id** - Unique identifier for the toggle
- **label** - Descriptive label for the toggle
- **isChecked** - Current checked state
- **onChange** - Handler called when toggle state changes
- **isDisabled** - Disable the toggle

# Translating from Tailwind

An example diff of a migration from Tailwind generated code to ADS generated code.

```diff
+import Toggle from '@atlaskit/toggle';

-<label className="relative inline-flex items-center cursor-pointer">
-  <input type="checkbox" className="sr-only peer" />
-  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
-  <span className="ml-3 text-sm font-medium text-gray-900">Enable notifications</span>
-</label>
+<Toggle
+  id="notifications"
+  label="Enable notifications"
+  isChecked={isEnabled}
+  onChange={setIsEnabled}
+/>

-<label className="relative inline-flex items-center cursor-pointer opacity-50">
-  <input type="checkbox" disabled className="sr-only peer" />
-  <div className="w-11 h-6 bg-gray-200 rounded-full"></div>
-  <span className="ml-3 text-sm font-medium text-gray-400">Disabled toggle</span>
-</label>
+<Toggle
+  id="disabled"
+  label="Disabled toggle"
+  isDisabled
+/>
```

## Motion

The `platform_design_system_toggle_motion` gate enables the `motion.input.toggle` semantic token.
The track colour, handle and icons transition for 150ms using practical ease-out in both directions.
The icons move with the handle: the check enters and exits through the left edge, and the cross
through the right edge, clipped to the rounded track as they fade. The native input and focus border
stay stationary. No public props change. With reduced motion, the handle and icon positions update
instantly while colour and opacity fades remain. Disabled controls do not transition. Existing
loading feedback is preserved. Gate-off behavior is unchanged.

Preview `examples/12-motion.tsx` with `featureFlag=platform_design_system_toggle_motion`.
