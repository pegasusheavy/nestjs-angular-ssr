# Contributing to @pegasus-heavy/nestjs-angular-ssr

Thank you for your interest in contributing! This document provides guidelines and information for contributors.

## Code of Conduct

By participating in this project, you agree to maintain a respectful and inclusive environment for everyone.

## Getting Started

### Prerequisites

- Node.js >= 18.0.0
- pnpm >= 10.0.0
- Git

### Setup

1. Fork the repository
2. Clone your fork:
   ```bash
   git clone https://github.com/YOUR_USERNAME/nestjs-angular-ssr.git
   cd nestjs-angular-ssr
   ```
3. Install dependencies:
   ```bash
   pnpm install
   ```
4. Create a branch for your changes:
   ```bash
   git checkout -b feat/your-feature-name
   ```

## Development Workflow

### Available Scripts

| Command              | Description                    |
| -------------------- | ------------------------------ |
| `pnpm build`         | Build the project              |
| `pnpm test`          | Run tests                      |
| `pnpm test:watch`    | Run tests in watch mode        |
| `pnpm test:coverage` | Run tests with coverage report |
| `pnpm lint`          | Run ESLint                     |
| `pnpm lint:fix`      | Run ESLint with auto-fix       |
| `pnpm format`        | Format code with Prettier      |
| `pnpm format:check`  | Check code formatting          |
| `pnpm typecheck`     | Run TypeScript type checking   |

### Making Changes

1. **Write code** following the existing code style
2. **Add tests** for new functionality
3. **Update documentation** if needed
4. **Run all checks** before committing:
   ```bash
   pnpm lint
   pnpm test
   pnpm build
   ```

### Commit Guidelines

We use [Conventional Commits](https://www.conventionalcommits.org/) for commit messages. This enables automatic changelog generation and semantic versioning.

#### Commit Format

```
type(scope): subject

body (optional)

footer (optional)
```

#### Commit Types

| Type       | Description                           |
| ---------- | ------------------------------------- |
| `feat`     | New feature                           |
| `fix`      | Bug fix                               |
| `docs`     | Documentation only changes            |
| `style`    | Code style changes (formatting, etc.) |
| `refactor` | Code refactoring                      |
| `perf`     | Performance improvement               |
| `test`     | Adding or updating tests              |
| `build`    | Build system or dependencies          |
| `ci`       | CI configuration changes              |
| `chore`    | Other changes                         |
| `revert`   | Revert a previous commit              |

#### Examples

```bash
feat: add custom cache key generator support
fix: handle null response from Angular SSR engine
docs: update README with async configuration example
test: add tests for error handling in middleware
```

### Pull Request Process

1. **Create a pull request** against the `main` branch
2. **Fill out the PR template** completely
3. **Ensure CI passes** - all checks must be green
4. **Request review** from maintainers
5. **Address feedback** promptly
6. **Squash commits** if requested

### Code Review

All submissions require review. We use GitHub pull requests for this purpose. Expect feedback and be prepared to make changes.

## Testing

### Running Tests

```bash
# Run all tests
pnpm test

# Run tests in watch mode
pnpm test:watch

# Run tests with coverage
pnpm test:coverage
```

### Writing Tests

- Place test files next to the source files with `.spec.ts` extension
- Use descriptive test names
- Follow the AAA pattern (Arrange, Act, Assert)
- Aim for 90%+ code coverage

### Test Structure

```typescript
describe('ComponentName', () => {
  describe('methodName()', () => {
    it('should do something specific', () => {
      // Arrange
      const input = 'test';

      // Act
      const result = component.method(input);

      // Assert
      expect(result).toBe('expected');
    });
  });
});
```

## Documentation

- Update the README.md for user-facing changes
- Add JSDoc comments for public APIs
- Include code examples where helpful

## Reporting Issues

### Bug Reports

Use the [Bug Report template](https://github.com/PegasusHeavyIndustries/nestjs-angular-ssr/issues/new?template=bug_report.yml) and include:

- Clear description of the bug
- Steps to reproduce
- Expected vs actual behavior
- Version information

### Feature Requests

Use the [Feature Request template](https://github.com/PegasusHeavyIndustries/nestjs-angular-ssr/issues/new?template=feature_request.yml) and include:

- Problem statement
- Proposed solution
- Use cases

## Security

For security vulnerabilities, please see our [Security Policy](SECURITY.md).

## Questions?

Feel free to open a [Discussion](https://github.com/PegasusHeavyIndustries/nestjs-angular-ssr/discussions) for questions or ideas.

## License

By contributing, you agree that your contributions will be licensed under the MIT License.

---

Thank you for contributing! 🎉
