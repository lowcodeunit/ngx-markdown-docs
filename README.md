# LowCodeUnit - Markdown Documentation

An easy, and vibrant way to display documentation is always a must, when managing Open Source projects it is important to include documentation alongside the developed code. It is often fairly standard to utilize the Markdown syntax to easily manage these documents in tandom with the code.

The purpose of the @lowcodeunit/ngx-markdown-docs control is to bring a set of publicially hosted Markdown files into an application that loads as HTML and navigates through linked Markdown files within

## How it Works

### The Libraries

ngx-markdown - Supported Markdown syntax reference

@angular

### Markdown Syntax

### Documentation Configuration

...

## Development

The Workspace is made up of 2 main projects, the actual control library and a demo app.

### Development server

In order to run the development server, it is recommended to also build the docs library. To do so, Run `ng build docs && ng serve docs-demo` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files in the demo app, however if you change the Library, you will need to stop serving the app and re-run the command.

As a shorthand alternative, run `npm run serve`.

### Code scaffolding

As previously discussed, the Workspace is an Angular workspace powered by the angular-cli, and therefore all angular cli commands can be use for scaffolding.

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

### Build

Run `ng build docs` to build the docs library project. The build artifacts will be stored in the `dist/docs` directory.

Run `ng build docs-demo` to build the docs library project. The build artifacts will be stored in the `dist/docs-demo` directory. Use the `--prod` flag for a production build.

### Running unit tests

TODO:  No tests written or working
Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

### Running end-to-end tests

TODO:  No tests written or working
Run `ng e2e` to execute the end-to-end tests via [Protractor](http://www.protractortest.org/).

## Further help

To get further help please leverage the GitHub Issue Tracker.
