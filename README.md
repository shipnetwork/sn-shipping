# ShipNetwork Calculator

A TypeScript calculator for shipping and fulfillment costs. Built with the Finsweet Developer Starter template.

## Features

- Calculates order handling costs based on packaging type and volume
- Calculates picking costs based on packaging, picks per order, and weight
- Calculates receiving costs based on SKU count and volume
- Calculates packaging material costs
- Applies volume-based discounts
- Real-time calculation with immediate feedback
- Confetti animation on submission

## Development

This project uses the Finsweet Developer Starter template. To get started:

1. Install dependencies:

```bash
pnpm install
```

2. Start development server:

```bash
pnpm dev
```

This will start a local server at `http://localhost:3000` with live reload enabled.

3. Build for production:

```bash
pnpm build
```

## Project Structure

- `src/index.ts` - Main entry point and form handling
- `src/utils/calculator.ts` - Core calculation functions
- `src/utils/constants.ts` - Rate tables and classifications
- `src/utils/types.ts` - TypeScript type definitions

## Integration

### Option 1: jsDelivr CDN (Recommended)

Once published to npm, you can use jsDelivr:

```html
<script
  defer
  src="https://cdn.jsdelivr.net/npm/sn-shipping-calculator@latest/dist/index.js"
></script>
```

### Option 2: Direct file hosting

Add the script to your project:

```html
<script defer src="https://your-domain.com/index.js"></script>
```

### Form Setup

Add the following attributes to your form elements:

- Form: `[fs-element="form"]`
- Order Handling Price: `[fs-element="order-handling-price"]`
- Pick Price: `[fs-element="pick-price"]`
- Receiving Price: `[fs-element="receiving-price"]`
- Packaging Price: `id="packaging-price-display"`
- Total Savings: `[fs-element="total-savings"]`
- Monthly Volume: `name="Monthly-Volume-price"`
- Packaging Type: `name="Most-Common-Packaging"`
- SKU Count: `name="Number-of-SKUs"`
- Picks: `name="Avg-Picks"`
- Weight: `name="Avg-Weight-Package"`

## Publishing to npm

1. Create an npm account if you don't have one
2. Login to npm: `npm login`
3. Build the project: `pnpm build`
4. Publish: `npm publish`

## License

ISC

# Finsweet Developer Starter

A starter template for both Client & Power projects.

Before starting to work with this template, please take some time to read through the documentation.

## Reference

- [Included tools](#included-tools)
- [Requirements](#requirements)
- [Getting started](#getting-started)
  - [Installing](#installing)
  - [Building](#building)
    - [Serving files on development mode](#serving-files-on-development-mode)
    - [Building multiple files](#building-multiple-files)
    - [Setting up a path alias](#setting-up-a-path-alias)
- [Contributing guide](#contributing-guide)
- [Pre-defined scripts](#pre-defined-scripts)
- [CI/CD](#cicd)
  - [Continuous Integration](#continuous-integration)
  - [Continuous Deployment](#continuous-deployment)
  - [How to automatically deploy updates to npm](#how-to-automatically-deploy-updates-to-npm)

## Included tools

This template contains some preconfigured development tools:

- [Typescript](https://www.typescriptlang.org/): A superset of Javascript that adds an additional layer of Typings, bringing more security and efficiency to the written code.
- [Prettier](https://prettier.io/): Code formatting that assures consistency across all Finsweet's projects.
- [ESLint](https://eslint.org/): Code linting that enforces industries' best practices. It uses [our own custom configuration](https://github.com/finsweet/eslint-config) to maintain consistency across all Finsweet's projects.
- [Playwright](https://playwright.dev/): Fast and reliable end-to-end testing.
- [esbuild](https://esbuild.github.io/): Javascript bundler that compiles, bundles and minifies the original Typescript files.
- [Changesets](https://github.com/changesets/changesets): A way to manage your versioning and changelogs.
- [Finsweet's TypeScript Utils](https://github.com/finsweet/ts-utils): Some utilities to help you in your Webflow development.

## Requirements

This template requires the use of [pnpm](https://pnpm.js.org/en/). You can [install pnpm](https://pnpm.io/installation) with:

```bash
npm i -g pnpm
```

To enable automatic deployments to npm, please read the [Continuous Deployment](#continuous-deployment) section.

## Getting started

The quickest way to start developing a new project is by [creating a new repository from this template](https://docs.github.com/en/github/creating-cloning-and-archiving-repositories/creating-a-repository-from-a-template#creating-a-repository-from-a-template).

Once the new repository has been created, update the `package.json` file with the correct information, specially the name of the package which has to be unique.

### Installing

After creating the new repository, open it in your terminal and install the packages by running:

```bash
pnpm install
```

If this is the first time using Playwright and you want to use it in this project, you'll also have to install the browsers by running:

```bash
pnpm playwright install
```

You can read more about the use of Playwright in the [Testing](#testing) section.

It is also recommended that you install the following extensions in your VSCode editor:

- [Prettier - Code formatter](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode)
- [ESLint](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint)

### Building

To build the files, you have two defined scripts:

- `pnpm dev`: Builds and creates a local server that serves all files (check [Serving files on development mode](#serving-files-on-development-mode) for more info).
- `pnpm build`: Builds to the production directory (`dist`).

### Serving files on development mode

When you run `pnpm dev`, two things happen:

- esbuild is set to `watch` mode. Every time that you save your files, the project will be rebuilt.
- A local server is created under `http://localhost:3000` that serves all your project files. You can import them in your Webflow projects like:

```html
<script defer src="http://localhost:3000/{FILE_PATH}.js"></script>
```

- Live Reloading is enabled by default, meaning that every time you save a change in your files, the website you're working on will reload automatically. You can disable it in `/bin/build.js`.

### Building multiple files

If you need to build multiple files into different outputs, you can do it by updating the build settings.

In `bin/build.js`, update the `ENTRY_POINTS` array with any files you'd like to build:

```javascript
const ENTRY_POINTS = [
  'src/home/index.ts',
  'src/contact/whatever.ts',
  'src/hooyah.ts',
  'src/home/other.ts',
];
```

This will tell `esbuild` to build all those files and output them in the `dist` folder for production and in `http://localhost:3000` for development.

### Building CSS files

CSS files are also supported by the bundler. When including a CSS file as an entry point, the compiler will generate a minified version in your output folder.

You can define a CSS entry point by either:

- Manually defining it in the `bin/build.js` config. [See previous section](#building-multiple-files) for reference.
- Or importing the file inside any of your JavaScript / TypeScript files:

```typescript
// src/index.ts
import './index.css';
```

CSS outputs are also available in `localhost` during [development mode](#serving-files-on-development-mode).

### Setting up a path alias

Path aliases are very helpful to avoid code like:

```typescript
import example from '../../../../utils/example';
```

Instead, we can create path aliases that map to a specific folder, so the code becomes cleaner like:

```typescript
import example from '$utils/example';
```

You can set up path aliases using the `paths` setting in `tsconfig.json`. This template has an already predefined path as an example:

```json
{
  "paths": {
    "$utils/*": ["src/utils/*"]
  }
}
```

To avoid any surprises, take some time to familiarize yourself with the [tsconfig](/tsconfig.json) enabled flags.

## Testing

As previously mentioned, this library has [Playwright](https://playwright.dev/) included as an automated testing tool.

All tests are located under the `/tests` folder. This template includes a test spec example that will help you catch up with Playwright.

After [installing the dependencies](#installing), you can try it out by running `pnpm test`.
Make sure you replace it with your own tests! Writing proper tests will help improve the maintainability and scalability of your project in the long term.

By default, Playwright will also run `pnpm dev` in the background while the tests are running, so [your files served](#serving-files-on-development-mode) under `localhost:3000` will run as usual.
You can disable this behavior in the `playwright.config.ts` file.

If you project doesn't require any testing, you should disable the Tests job in the [CI workflow](#continuous-integration) by commenting it out in the `.github/workflows/ci.yml` file.
This will prevent the tests from running when you open a Pull Request.

## Contributing guide

In general, your development workflow should look like this:

1. Create a new branch where to develop a new feature or bug fix.
2. Once you've finished the implementation, [create a Changeset](#continuous-deployment) (or multiple) explaining the changes that you've made in the codebase.
3. Open a Pull Request and wait until the [CI workflows](#continuous-integration) finish. If something fails, please try to fix it before merging the PR.
   If you don't want to wait for the CI workflows to run on GitHub to know if something fails, it will be always faster to run them in your machine before opening a PR.
4. Merge the Pull Request. The Changesets bot will automatically open a new PR with updates to the `CHANGELOG.md`, you should also merge that one. If you have [automatic npm deployments](#how-to-automatically-deploy-updates-to-npm) enabled, Changesets will also publish this new version on npm.

If you need to work on several features before publishing a new version on npm, it is a good practise to create a `development` branch where to merge all the PR's before pushing your code to master.

## Pre-defined scripts

This template contains a set of predefined scripts in the `package.json` file:

- `pnpm dev`: Builds and creates a local server that serves all files (check [Serving files on development mode](#serving-files-on-development-mode) for more info).
- `pnpm build`: Builds to the production directory (`dist`).
- `pnpm lint`: Scans the codebase with ESLint and Prettier to see if there are any errors.
- `pnpm lint:fix`: Fixes all auto-fixable issues in ESLint.
- `pnpm check`: Checks for TypeScript errors in the codebase.
- `pnpm format`: Formats all the files in the codebase using Prettier. You probably won't need this script if you have automatic [formatting on save](https://www.digitalocean.com/community/tutorials/code-formatting-with-prettier-in-visual-studio-code#automatically-format-on-save) active in your editor.
- `pnpm test`: Will run all the tests that are located in the `/tests` folder.
- `pnpm test:headed`: Will run all the tests that are located in the `/tests` folder visually in headed browsers.
- `pnpm release`: This command is defined for [Changesets](https://github.com/changesets/changesets). You don't have to interact with it.
- `pnpm run update`: Scans the dependencies of the project and provides an interactive UI to select the ones that you want to update.

## CI/CD

This template contains a set of helpers with proper CI/CD workflows.

### Continuous Integration

When you open a Pull Request, a Continuous Integration workflow will run to:

- Lint & check your code. It uses the `pnpm lint` and `pnpm check` commands under the hood.
- Run the automated tests. It uses the `pnpm test` command under the hood.

If any of these jobs fail, you will get a warning in your Pull Request and should try to fix your code accordingly.

**Note:** If your project doesn't contain any defined tests in the `/tests` folder, you can skip the Tests workflow job by commenting it out in the `.github/workflows/ci.yml` file. This will significantly improve the workflow running times.

### Continuous Deployment

[Changesets](https://github.com/changesets/changesets) allows us to generate automatic changelog updates when merging a Pull Request to the `master` branch.

Before starting, make sure to [enable full compatibility with Changesets in the repository](#how-to-enable-continuous-deployment-with-changesets).

To generate a new changelog, run:

```bash
pnpm changeset
```

You'll be prompted with a few questions to complete the changelog.

Once the Pull Request is merged into `master`, a new Pull Request will automatically be opened by a changesets bot that bumps the package version and updates the `CHANGELOG.md` file.
You'll have to manually merge this new PR to complete the workflow.

If an `NPM_TOKEN` secret is included in the repository secrets, Changesets will automatically deploy the new package version to npm.
See [how to automatically deploy updates to npm](#how-to-automatically-deploy-updates-to-npm) for more info.

#### How to enable Continuous Deployment with Changesets

Some repositories may not have the required permissions to let Changesets interact with the repository.

To enable full compatibility with Changesets, go to the repository settings (`Settings > Actions > General > Workflow Permissions`) and define:

- ✅ Read and write permissions.
- ✅ Allow GitHub Actions to create and approve pull requests.

Enabling this setting for your organization account (`Account Settings > Actions > General`) could help streamline the process. By doing so, any new repos created under the org will automatically inherit the setting, which can save your teammates time and effort. This can only be applied to organization accounts at the time.

#### How to automatically deploy updates to npm

As mentioned before, Changesets will automatically deploy the new package version to npm if an `NPM_TOKEN` secret is provided.

This npm token should be:

- From Finsweet's npm organization if this repository is meant for internal/product development.
- From a client's npm organization if this repository is meant for client development. In this case, you should ask the client to [create an npm account](https://www.npmjs.com/signup) and provide you the credentials (or the npm token, if they know how to get it).

Once you're logged into the npm account, you can get an access token by following [this guide](https://docs.npmjs.com/creating-and-viewing-access-tokens).

The access token must be then placed in a [repository secret](https://docs.github.com/en/codespaces/managing-codespaces-for-your-organization/managing-encrypted-secrets-for-your-repository-and-organization-for-codespaces#adding-secrets-for-a-repository) named `NPM_TOKEN`.
