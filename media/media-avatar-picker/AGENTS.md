# media-avatar-picker — Agent Guide

> **Parent guide:** Always read [`../AGENTS.md`](../AGENTS.md) before working in this package — it
> contains workspace-wide rules covering platform guidelines, changeset workflow, accessibility
> standards, and the knowledge index protocol that applies to every Media package.

## Knowledge index

> Read, search, edit, investigate, and validate the repository knowledge index at
> `.agents/knowledge-index/`. ALWAYS use this skill before making ANY repo change, or when exploring
> the codebase. The knowledge index is the canonical starting point for every coding task in this
> repo, trigger this skill aggressively whenever the user mentions architecture, conventions,
> packages, modules, services, build, coding, writing code, APIs, feature flags, testing, or
> anything similar. Also trigger when "is the knowledge index up to date?" / "update the knowledge
> index" / "what does the knowledge index say about Y?" — even if they don't say the words
> "knowledge index". Also use it (via the `validate` subcommand) to detect drift between the
> codebase and the docs after any code change. Use the `generate` subcommand to bootstrap the index
> in a new repository.

**Entry point:** `.agents/knowledge-index/INDEX.md` **Unit doc:**
`.agents/knowledge-index/domains/media/units/atlaskit-media-avatar-picker.md` **CLI:**
`python3 .agents/skills/knowledge-index/scripts/kg.py {find,read,edit,investigate,validate,init,explore,generate} …`
**Refresh protocol:** never silently bump `Last verified` — always re-read the listed `Sources`
first, edit, then `kg.py edit <path> --message "<reason>"`.

---

# Media Avatar Picker - Agent Documentation

## Overview

The `@atlaskit/media-avatar-picker` package provides components for selecting, uploading, and
cropping avatar images. It includes both local image upload functionality and predefined avatar
selection.

## Key Components

### AvatarPickerDialog

Main dialog component that orchestrates the avatar selection experience.

### ImageCropper

Interactive component for cropping uploaded images with keyboard and mouse support.

### ImageNavigator

Component that handles image upload, display, and basic navigation controls.

## Accessibility Features

### Image Cropper Accessibility

The image cropper component has been designed with accessibility in mind:

- **Keyboard Navigation**: Users can navigate and crop images using arrow keys
- **Screen Reader Support**: Proper ARIA labels and roles for assistive technologies
- **Focus Management**: Clear focus indicators and logical tab order
- **Live Announcements**: Real-time feedback for image movements via aria-live regions

#### Recent Accessibility Improvements (2025)

- Fixed `aria-prohibited-attr` violation by adding `role="button"` to interactive cropping mask
  elements
- Ensured proper semantic meaning for focusable elements with ARIA labels
- Maintains WCAG Level A compliance

### Implementation Details

The image cropper mask elements use:

- `role="button"` - Identifies the element as an interactive button
- `tabIndex={0}` - Makes the element focusable via keyboard
- `aria-label` - Provides descriptive text for screen readers
- `onKeyDown` - Handles arrow key navigation for image positioning

## Testing

- All accessibility tests pass with zero violations
- Comprehensive keyboard navigation testing
- Screen reader compatibility verified
- Visual regression tests for different image orientations

## Known Limitations

- Only supports image/gif, image/jpeg, and image/png formats
- Maximum file size of 10MB
- SVG format not currently supported

## Recent Changes

- **2025-01**: Fixed accessibility violations in image cropper component
- Enhanced ARIA support for better screen reader experience
- Updated tests to reflect accessibility improvements

## Development Notes

- Follow WCAG guidelines when making changes to interactive elements
- Run accessibility tests before submitting changes
- Consider keyboard-only users when adding new features
- Ensure proper ARIA attributes for any new focusable elements
