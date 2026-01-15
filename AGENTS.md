# AGENTS.md

This file provides guidance for agentic coding assistants working on the StorageLayoutMapper project.

## Build Commands

- `npm run dev` - Start Vite development server
- `npm run build` - Compile TypeScript with `tsc` and build with Vite
- `npm run serve` - Preview the production build

**No testing framework is configured.** The project has no test files, linting, or type checking scripts. Add tests via your preferred framework.

## Project Overview

StorageLayoutMapper is a TypeScript web application for visualizing and mapping physical storage drive layouts. It allows users to create SVG representations of server chassis with configurable drive bays.

**Tech Stack:**
- TypeScript (strict mode)
- Vite (build tool)
- SVG.js (@svgdotjs/svg.js)
- svgson (SVG to JSON conversion)

## Code Style Guidelines

### Imports

- Use relative imports with `.ts` extension: `import { X } from "./module.ts"`
- Use package imports for dependencies: `import { SVG } from "@svgdotjs/svg.js"`
- Group imports: external packages first, then internal modules

### Naming Conventions

- **Classes**: PascalCase (`HardDrive`, `Server`)
- **Enums**: PascalCase (`DriveType`, `BoxType`)
- **Constants/Enums values**: PascalCase (`HDD35`, `Rackmount`)
- **Variables/Functions**: camelCase (`drawDriveLayout`, `server_obj`)
- **Interfaces**: PascalCase, no "I" prefix (`ServerConfig`, `HardDriveConfig`)

### Types and Type Safety

- Always define types for class properties
- Use `readonly` for immutable properties (see ServerConfig in server.ts:15)
- Prefer TypeScript's `optional chaining` and `nullish coalescing` over manual checks
- Use `interface` for object shapes, `enum` for fixed sets of values
- Avoid `@ts-ignore` - use type assertions or proper types instead
- When declaring types, export them for reuse across modules

### Variables and Declarations

- Prefer `const` over `let` when variables don't change
- Avoid `var` - use `let` or `const`
- Declare variables in the smallest scope possible
- Initialize variables at declaration when possible

### Classes and Objects

- Use TypeScript classes for models (`HardDrive`, `Server`)
- Implement interfaces for configs to ensure consistency
- Chain SVG.js methods fluently: `SVG().rect(width, height).fill("none").stroke({color:"#000", width:5}).radius(5)`
- Store SVG elements as properties on classes for manipulation

### Error Handling

- Use `console.log()` for debugging messages
- Use `console.error()` for error conditions (see server.ts:73,84,94)
- Validate constructor parameters with explicit checks
- Provide meaningful error messages indicating what's required

### File Organization

- `src/` - TypeScript source files
- `data/` - Sample SVG/XML data files
- `dist/` - Build output (gitignored)
- Each module exports a default class along with named exports for types/enums

### SVG.js Patterns

- Create SVG elements: `SVG().element()`
- Chain methods: `.attr({...}).fill("color").move(x, y)`
- Group elements: `SVG().group()`
- Add elements to groups: `group.add(element)`
- Use descriptive IDs for SVG elements: `"HD" + this.name`

### Module Structure

- Export types/enums alongside classes
- Example from harddrive.ts:
  ```typescript
  export enum DriveType { HDD35 = "3.5' HDD", ... }
  export interface HardDriveConfig { ... }
  export class HardDrive implements HardDriveConfig { ... }
  export { HardDrive as default }
  ```

### Window Global Extensions

When extending the `Window` interface for global functions (svg-layoutmapper.ts:9):
```typescript
declare global {
    interface Window {
        functionName: any;
    }
}
```

### Constants

- Define module-level constants at the top (U_HEIGHT= 48 in server.ts:12)
- Use `UPPER_SNAKE_CASE` for constants
- Document unit conversions with comments

### Adding Tests

To add testing (not currently configured):
1. Install a framework: `npm install -D jest @types/jest ts-jest`
2. Add `"test": "jest"` to package.json scripts
3. Create `__tests__/` directory alongside source files
4. Example single test: `npm test -- --testPathPattern=harddrive.test.ts`
5. Configure tsconfig for Jest if needed

### HTML/Integration

- Entry points: `index.html` and `StorageLayoutMapper.html`
- Use ES modules in script tags: `<script type="module" src="/src/svg-layoutmapper.ts"></script>`
- Expose functions to `window` object for HTML onclick handlers
- CSS files in `src/` for styles: `style.css`, `SLM-styles.css`

### Deployment

- Deploy script: `./deploy.sh`
- Builds and pushes to GitHub Pages (avengermojo.github.io)
- Vite base URL configured: `https://avengermojo.github.io/`
