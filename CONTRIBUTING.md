# Contributing to Catcher

Thank you for your interest in contributing to Catcher! We welcome all contributions, from bug fixes to new features and documentation improvements.

## Development Workflow

This project is a monorepo managed by [pnpm](https://pnpm.io/).

### Prerequisites

- [Node.js](https://nodejs.org/) (latest LTS recommended)
- [pnpm](https://pnpm.io/installation)

### Getting Started

1. Clone the repository:
   ```bash
   git clone https://github.com/afraniocaires/catcher.git
   cd catcher
   ```

2. Install dependencies:
   ```bash
   pnpm install
   ```

3. Build all packages:
   ```bash
   pnpm build
   ```

### Project Structure

- `packages/catcher`: The core library (`@catcherjs/core`).
- `packages/docs`: The documentation website.

### Running Tests

We use [Vitest](https://vitest.dev/) for testing.

```bash
# Run tests for all packages
pnpm test

# Run tests in watch mode for the core library
pnpm --filter @catcherjs/core test:watch
```

### Linting and Formatting

We use [Oxc](https://oxc.rs/) tools (`oxlint` and `oxfmt`) for maximum performance.

```bash
# Lint all packages
pnpm lint

# Format all packages
pnpm format
```

## Pull Request Process

1. Create a new branch for your changes.
2. Ensure your changes follow the project's coding style and pass all tests.
3. Update the documentation if necessary.
4. Submit a pull request with a clear description of your changes.

## Code of Conduct

Please be respectful and professional in all your interactions within the project.

## License

By contributing to Catcher, you agree that your contributions will be licensed under the MIT License.
