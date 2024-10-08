# LegacyCustomIcons

A centralized place to store legacy custom icons.

## Usage

`import MyCustomIcon from '@atlaskit/legacy-custom-icons/my-custom-icon';`

### Creating a new icon

- Run `yarn generate-icon` from the package root
- Follow the prompts, provide a hyphen-case name for your icon
- A new icon will be generated in `src/ui/<your-icon-name>/index.tsx`. Open the file and edit the
  SVG as needed
- Run `yarn` from platform root
- Update the VR test from platform root:
  `yarn test:vr packages/design-system/legacy-custom-icons -u`
- Add the dependency to the package you need the icon in:
  `cd <package-you-are-updating> && yarn add @atlaskit/legacy-custom-icons`
- Your icon will now be available as:
  `import MyCustomIcon from '@atlaskit/legacy-custom-icons/my-custom-icon'`
