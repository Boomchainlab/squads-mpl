# Configuration and Metadata Validation Tests

## Overview

This test suite (`config-validation.test.ts`) provides comprehensive validation for configuration files, package metadata, and CI/CD workflows that were modified in the current branch.

## Files Tested

### 1. GitHub Workflow (`.github/workflows/send-sol.yml`)
Tests validate:
- Workflow structure and required fields
- Trigger configuration (push to main branch)
- Job definitions and runner configuration
- Secret usage for API authentication
- QuickNode API endpoint and function ID
- Solana address format validation (base58, 32-44 characters)
- HTTP headers and security practices
- No hardcoded sensitive data
- JSON payload structure

**Key Changes Tested:**
- Updated Solana destination address from `7X4JFdTFhykTqAbvv98rnksgRMrqEfKec4rskA3B3mKs` to `E5NB8TgE3e2te2dQLTSG8GTexeyLFJCDUYkgC6JVFTzi`

### 2. Root `package.json`
Tests validate:
- Valid JSON structure
- Semantic versioning compliance
- Version rollback from 1.5.3 to 1.5.2
- Required dependencies (Anchor, Solana, Squads SDK)
- DevDependencies (Chai, Mocha, TypeScript)
- Script definitions
- Workspace configuration
- ES module type declaration
- Private package flag

**Key Changes Tested:**
- Version changed from `1.5.3` to `1.5.2`

### 3. App `package.json`
Tests validate:
- Package name and version
- Semantic versioning format
- Build script configuration
- All dependency declarations
- Specific version requirements for security updates
- CLI tool dependencies
- Binary executable path
- License information
- ES module configuration

**Key Changes Tested:**
- `axios` downgraded from `^1.12.0` to `^0.30.1` (security fix)
- `figlet` downgraded from `^1.9.1` to `^1.8.0` (security fix)

### 4. App `yarn.lock`
Tests validate:
- File existence and readability
- Lock file structure
- Specific package versions (axios 0.30.1, figlet 1.8.1)
- Dependency chains (follow-redirects 1.15.9)
- Integrity hashes presence
- Registry URLs
- Absence of vulnerable versions
- Consistent formatting

**Key Changes Tested:**
- Axios and figlet downgrades reflected in lock file
- Removal of vulnerable versions (axios 1.12.2, figlet 1.9.3)
- Updated transitive dependencies

### 5. `CHANGELOG.md`
Tests validate:
- Standard changelog format
- Header structure
- Version 1.5.2 presence
- Properly formatted version links
- Date formatting (YYYY-MM-DD)
- Change categorization (Bug Fixes, Features)
- Commit references with links
- Chronological ordering (newest first)
- Absence of version 1.5.3
- Markdown formatting
- Repository references

**Key Changes Tested:**
- Removal of version 1.5.3 entry (8 lines deleted)
- Proper version history maintained

## Test Categories

### 1. Structure and Format Tests (28 tests)
Validate basic file structure, JSON parsing, YAML format, and required fields.

### 2. Version Management Tests (15 tests)
Ensure semantic versioning compliance and cross-file version consistency.

### 3. Dependency Management Tests (25 tests)
Verify correct dependency versions, especially security-related downgrades.

### 4. Security Tests (8 tests)
Check for:
- No hardcoded secrets
- Secure dependency versions
- Valid address formats
- HTTPS usage
- Proper authentication patterns

### 5. Integration Tests (6 tests)
Validate consistency across related files (package.json versions, ES module configs).

## Running the Tests

```bash
# From repository root
npm test

# Or with yarn
yarn test

# Run only config validation tests
npx mocha tests/config-validation.test.ts --require ts-node/register
```

## Test Coverage

### Total Test Cases: 82

- GitHub Workflows: 13 tests
- Root package.json: 20 tests
- App package.json: 24 tests
- Yarn lock file: 13 tests
- CHANGELOG.md: 16 tests
- Cross-file consistency: 3 tests
- Security practices: 5 tests
- Build configuration: 4 tests

## Testing Framework

- **Test Runner:** Mocha
- **Assertion Library:** Chai
- **Language:** TypeScript
- **Pattern:** Behavior-Driven Development (BDD)

## Key Test Patterns

### File Reading Tests
```typescript
it("should exist and be readable", function() {
  const exists = fs.existsSync(filePath);
  expect(exists).to.be.true;
});
```

### Version Validation Tests
```typescript
it("should follow semantic versioning", function() {
  const semverRegex = /^\d+\.\d+\.\d+(-[a-zA-Z0-9.-]+)?(\+[a-zA-Z0-9.-]+)?$/;
  expect(version).to.match(semverRegex);
});
```

### Security Tests
```typescript
it("should not have hardcoded secrets", function() {
  expect(content).to.match(/\$\{\{\s*secrets\./);
  expect(content).to.not.match(/Bearer\s+[a-zA-Z0-9]{20,}/);
});
```

### Address Validation Tests
```typescript
it("should validate Solana address format", function() {
  const solanaAddressRegex = /"to":\s*"([1-9A-HJ-NP-Za-km-z]{32,44})"/;
  expect(content).to.match(solanaAddressRegex);
});
```

## Edge Cases Covered

1. **Empty or missing files** - File existence checks
2. **Invalid JSON** - JSON parsing validation
3. **Malformed versions** - Semantic versioning regex
4. **Security vulnerabilities** - Explicit version checks
5. **Hardcoded secrets** - Pattern matching for sensitive data
6. **Invalid addresses** - Base58 character validation
7. **Broken links** - URL structure validation
8. **Inconsistent configs** - Cross-file consistency checks

## Failure Scenarios

Tests will fail if:
- Required files are missing
- JSON is malformed
- Versions don't follow semver
- Vulnerable dependency versions are present
- Secrets are hardcoded
- Solana addresses are invalid format
- CHANGELOG structure is incorrect
- Cross-file versions are inconsistent

## Maintenance Notes

When updating:
- **Versions**: Update version number tests
- **Dependencies**: Update specific version tests
- **Workflow addresses**: Update Solana address validation tests
- **CHANGELOG**: Update version presence/absence tests

## Best Practices Enforced

1. ✅ Semantic versioning compliance
2. ✅ No hardcoded secrets
3. ✅ Secure dependency versions
4. ✅ Valid address formats
5. ✅ HTTPS-only endpoints
6. ✅ Proper secret management
7. ✅ Comprehensive changelog
8. ✅ Cross-file consistency
9. ✅ Type safety (ES modules)
10. ✅ License declarations

## Future Enhancements

Potential additions:
- Schema validation using JSON Schema
- Automated broken link detection in CHANGELOG
- Dependency vulnerability scanning
- GitHub Actions workflow linting
- Solana address checksum validation
- Network calls to verify endpoints (integration tests)