# Prop guidance

- **onClose** - Required handler for closing the modal
- **isOpen** - Control modal visibility
- **shouldCloseOnOverlayClick** - Allow closing by clicking outside
- **shouldCloseOnEscapePress** - Allow closing with ESC key

# Translating from Tailwind

An example diff of a migration from Tailwind generated code to ADS generated code.

```diff
+import Modal, { ModalBody, ModalFooter, ModalHeader, ModalTitle, ModalTransition } from '@atlaskit/modal-dialog';

-{isOpen && (
-  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
-    <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
-      <div className="px-6 py-4 border-b">
-        <h3 className="text-lg font-medium text-gray-900">Modal Title</h3>
-      </div>
-      <div className="px-6 py-4">
-        <p>Modal content goes here</p>
-      </div>
-      <div className="px-6 py-4 bg-gray-50 flex justify-end space-x-3">
-        <button className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50">
-          Cancel
-        </button>
-        <button className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700">
-          Save
-        </button>
-      </div>
-    </div>
-  </div>
-)}
+<ModalTransition>
+  {isOpen && (
+    <Modal onClose={handleClose}>
+      <ModalHeader>
+        <ModalTitle>Modal Title</ModalTitle>
+      </ModalHeader>
+      <ModalBody>
+        <p>Modal content goes here</p>
+      </ModalBody>
+      <ModalFooter>
+        <Button appearance="subtle" onClick={handleClose}>Cancel</Button>
+        <Button appearance="primary" onClick={handleSave}>Save</Button>
+      </ModalFooter>
+    </Modal>
+  )}
+</ModalTransition>
```
