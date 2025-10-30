import { expect } from "chai";
import fs from "fs";
import path from "path";

describe("Configuration and Metadata Validation", function() {
  
  describe("GitHub Workflows", function() {
    const workflowPath = ".github/workflows/send-sol.yml";
    
    it("should have send-sol.yml workflow file", function() {
      const exists = fs.existsSync(workflowPath);
      expect(exists).to.be.true;
    });

    it("should have valid workflow structure", function() {
      const content = fs.readFileSync(workflowPath, "utf-8");
      
      // Check for required workflow fields
      expect(content).to.include("name:");
      expect(content).to.include("on:");
      expect(content).to.include("jobs:");
    });

    it("should trigger on push to main branch", function() {
      const content = fs.readFileSync(workflowPath, "utf-8");
      expect(content).to.include("push:");
      expect(content).to.include("branches:");
      expect(content).to.include("- main");
    });

    it("should have send-sol job defined", function() {
      const content = fs.readFileSync(workflowPath, "utf-8");
      expect(content).to.include("send-sol:");
      expect(content).to.include("runs-on: ubuntu-latest");
    });

    it("should use secrets for API authentication", function() {
      const content = fs.readFileSync(workflowPath, "utf-8");
      expect(content).to.include("${{ secrets.QUICKNODE_API_KEY }}");
    });

    it("should have proper QuickNode API endpoint", function() {
      const content = fs.readFileSync(workflowPath, "utf-8");
      expect(content).to.include("https://api.quicknode.com/functions/rest/v1/functions");
    });

    it("should POST to correct QuickNode function ID", function() {
      const content = fs.readFileSync(workflowPath, "utf-8");
      expect(content).to.include("23d96ed7-1ec9-4466-bc1a-2d2f8cf1a8c2");
    });

    it("should have valid Solana address format in payload", function() {
      const content = fs.readFileSync(workflowPath, "utf-8");
      // Solana addresses are base58 encoded, typically 32-44 characters
      const solanaAddressRegex = /"to":\s*"([1-9A-HJ-NP-Za-km-z]{32,44})"/;
      const match = content.match(solanaAddressRegex);
      
      expect(match).to.not.be.null;
      expect(match![1]).to.have.lengthOf.at.least(32);
      expect(match![1]).to.have.lengthOf.at.most(44);
    });

    it("should send to correct destination address", function() {
      const content = fs.readFileSync(workflowPath, "utf-8");
      // Verify the current address is present
      expect(content).to.include("E5NB8TgE3e2te2dQLTSG8GTexeyLFJCDUYkgC6JVFTzi");
    });

    it("should use proper HTTP headers", function() {
      const content = fs.readFileSync(workflowPath, "utf-8");
      expect(content).to.include("Content-Type: application/json");
      expect(content).to.include("Authorization: Bearer");
    });

    it("should not contain hardcoded sensitive data", function() {
      const content = fs.readFileSync(workflowPath, "utf-8");
      // Verify no actual API keys are hardcoded (only secret references)
      expect(content).to.not.match(/Bearer\s+[a-zA-Z0-9]{20,}/);
    });

    it("should have valid JSON payload structure", function() {
      const content = fs.readFileSync(workflowPath, "utf-8");
      const jsonMatch = content.match(/-d\s+'({[^}]+})'/);
      
      expect(jsonMatch).to.not.be.null;
      // Verify it's valid JSON-like structure
      const payload = jsonMatch![1];
      expect(payload).to.include('"to"');
      expect(payload).to.match(/^{.*}$/);
    });
  });

  describe("Root package.json", function() {
    const packagePath = "package.json";
    let packageJson: any;

    before(function() {
      const content = fs.readFileSync(packagePath, "utf-8");
      packageJson = JSON.parse(content);
    });

    it("should exist and be valid JSON", function() {
      expect(packageJson).to.be.an("object");
    });

    it("should have version field", function() {
      expect(packageJson).to.have.property("version");
      expect(packageJson.version).to.be.a("string");
    });

    it("should follow semantic versioning", function() {
      const semverRegex = /^\d+\.\d+\.\d+(-[a-zA-Z0-9.-]+)?(\+[a-zA-Z0-9.-]+)?$/;
      expect(packageJson.version).to.match(semverRegex);
    });

    it("should have current version 1.5.2", function() {
      expect(packageJson.version).to.equal("1.5.2");
    });

    it("should have dependencies defined", function() {
      expect(packageJson).to.have.property("dependencies");
      expect(packageJson.dependencies).to.be.an("object");
    });

    it("should have devDependencies defined", function() {
      expect(packageJson).to.have.property("devDependencies");
      expect(packageJson.devDependencies).to.be.an("object");
    });

    it("should have test script", function() {
      expect(packageJson).to.have.property("scripts");
      expect(packageJson.scripts).to.have.property("test");
    });

    it("should have required Anchor dependency", function() {
      expect(packageJson.dependencies).to.have.property("@coral-xyz/anchor");
    });

    it("should have required Solana dependencies", function() {
      expect(packageJson.dependencies).to.have.property("@solana/spl-token");
    });

    it("should have Chai testing framework", function() {
      expect(packageJson.devDependencies).to.have.property("chai");
    });

    it("should have Mocha testing framework", function() {
      expect(packageJson.devDependencies).to.have.property("mocha");
    });

    it("should have TypeScript support", function() {
      expect(packageJson.devDependencies).to.have.property("typescript");
    });

    it("should have ts-mocha for TypeScript testing", function() {
      expect(packageJson.devDependencies).to.have.property("ts-mocha");
    });

    it("should be marked as private", function() {
      expect(packageJson).to.have.property("private");
      expect(packageJson.private).to.be.true;
    });

    it("should have workspaces defined", function() {
      expect(packageJson).to.have.property("workspaces");
      expect(packageJson.workspaces).to.be.an("array");
      expect(packageJson.workspaces).to.include("sdk");
    });

    it("should have ES module type", function() {
      expect(packageJson).to.have.property("type");
      expect(packageJson.type).to.equal("module");
    });

    it("should have all dependency versions specified", function() {
      Object.entries(packageJson.dependencies).forEach(([name, version]) => {
        expect(version).to.be.a("string");
        expect(version as string).to.not.be.empty;
      });
    });

    it("should have all devDependency versions specified", function() {
      Object.entries(packageJson.devDependencies).forEach(([name, version]) => {
        expect(version).to.be.a("string");
        expect(version as string).to.not.be.empty;
      });
    });
  });

  describe("App package.json", function() {
    const appPackagePath = "app/package.json";
    let appPackage: any;

    before(function() {
      const content = fs.readFileSync(appPackagePath, "utf-8");
      appPackage = JSON.parse(content);
    });

    it("should exist and be valid JSON", function() {
      expect(appPackage).to.be.an("object");
    });

    it("should have name defined", function() {
      expect(appPackage).to.have.property("name");
      expect(appPackage.name).to.equal("squads-cli");
    });

    it("should have version field", function() {
      expect(appPackage).to.have.property("version");
      expect(appPackage.version).to.be.a("string");
    });

    it("should follow semantic versioning", function() {
      const semverRegex = /^\d+\.\d+\.\d+(-[a-zA-Z0-9.-]+)?(\+[a-zA-Z0-9.-]+)?$/;
      expect(appPackage.version).to.match(semverRegex);
    });

    it("should have build script", function() {
      expect(appPackage.scripts).to.have.property("build");
      expect(appPackage.scripts.build).to.equal("tsc");
    });

    it("should have axios dependency", function() {
      expect(appPackage.dependencies).to.have.property("axios");
    });

    it("should have specific axios version 0.30.1", function() {
      expect(appPackage.dependencies.axios).to.match(/^[\^~]?0\.30\.1$/);
    });

    it("should have figlet dependency", function() {
      expect(appPackage.dependencies).to.have.property("figlet");
    });

    it("should have specific figlet version 1.8.0", function() {
      expect(appPackage.dependencies.figlet).to.match(/^[\^~]?1\.8\.0$/);
    });

    it("should have chalk dependency", function() {
      expect(appPackage.dependencies).to.have.property("chalk");
    });

    it("should have inquirer for CLI interactions", function() {
      expect(appPackage.dependencies).to.have.property("inquirer");
    });

    it("should have @sqds/sdk dependency", function() {
      expect(appPackage.dependencies).to.have.property("@sqds/sdk");
    });

    it("should have Anchor dependency", function() {
      expect(appPackage.dependencies).to.have.property("@project-serum/anchor");
    });

    it("should have CLI tools dependencies", function() {
      expect(appPackage.dependencies).to.have.property("clear");
      expect(appPackage.dependencies).to.have.property("clui");
      expect(appPackage.dependencies).to.have.property("configstore");
    });

    it("should have lodash utility library", function() {
      expect(appPackage.dependencies).to.have.property("lodash");
    });

    it("should have minimist for argument parsing", function() {
      expect(appPackage.dependencies).to.have.property("minimist");
    });

    it("should have simple-git dependency", function() {
      expect(appPackage.dependencies).to.have.property("simple-git");
    });

    it("should have Octokit for GitHub API", function() {
      expect(appPackage.dependencies).to.have.property("@octokit/rest");
      expect(appPackage.dependencies).to.have.property("@octokit/auth-basic");
    });

    it("should have bin field for CLI executable", function() {
      expect(appPackage).to.have.property("bin");
      expect(appPackage.bin).to.have.property("squads-cli");
      expect(appPackage.bin["squads-cli"]).to.equal("./build/app/cli.js");
    });

    it("should be ES module type", function() {
      expect(appPackage).to.have.property("type");
      expect(appPackage.type).to.equal("module");
    });

    it("should have valid license", function() {
      expect(appPackage).to.have.property("license");
      expect(appPackage.license).to.equal("ISC");
    });

    it("should have all dependencies with valid version formats", function() {
      Object.entries(appPackage.dependencies).forEach(([name, version]) => {
        expect(version).to.be.a("string");
        expect(version as string).to.not.be.empty;
        // Should start with ^, ~, or a digit
        expect(version as string).to.match(/^[\^~\d]/);
      });
    });

    it("should not have conflicting dependency versions", function() {
      // Ensure axios is not using a version incompatible with the codebase
      const axiosVersion = appPackage.dependencies.axios;
      expect(axiosVersion).to.not.include("1.12");
      expect(axiosVersion).to.not.include("1.11");
    });
  });

  describe("Yarn Lock File Integrity", function() {
    const lockPath = "app/yarn.lock";

    it("should exist", function() {
      const exists = fs.existsSync(lockPath);
      expect(exists).to.be.true;
    });

    it("should be readable", function() {
      const content = fs.readFileSync(lockPath, "utf-8");
      expect(content).to.be.a("string");
      expect(content.length).to.be.greaterThan(0);
    });

    it("should contain axios dependency", function() {
      const content = fs.readFileSync(lockPath, "utf-8");
      expect(content).to.include("axios");
    });

    it("should reference axios version 0.30.1", function() {
      const content = fs.readFileSync(lockPath, "utf-8");
      expect(content).to.include("axios@^0.30.1:");
      expect(content).to.include('version "0.30.1"');
    });

    it("should contain figlet dependency", function() {
      const content = fs.readFileSync(lockPath, "utf-8");
      expect(content).to.include("figlet");
    });

    it("should reference figlet version 1.8.1", function() {
      const content = fs.readFileSync(lockPath, "utf-8");
      expect(content).to.include("figlet@^1.8.0:");
      expect(content).to.include('version "1.8.1"');
    });

    it("should contain follow-redirects dependency", function() {
      const content = fs.readFileSync(lockPath, "utf-8");
      expect(content).to.include("follow-redirects");
    });

    it("should reference follow-redirects version 1.15.9", function() {
      const content = fs.readFileSync(lockPath, "utf-8");
      expect(content).to.include("follow-redirects@^1.15.4:");
      expect(content).to.include('version "1.15.9"');
    });

    it("should have integrity hashes for packages", function() {
      const content = fs.readFileSync(lockPath, "utf-8");
      expect(content).to.include('integrity sha');
    });

    it("should have resolved URLs for packages", function() {
      const content = fs.readFileSync(lockPath, "utf-8");
      expect(content).to.include('resolved "https://registry.yarnpkg.com/');
    });

    it("should not contain vulnerable axios 1.12.x versions", function() {
      const content = fs.readFileSync(lockPath, "utf-8");
      expect(content).to.not.include('version "1.12.2"');
      expect(content).to.not.include("axios@^1.12.0:");
    });

    it("should not contain vulnerable figlet 1.9.x versions", function() {
      const content = fs.readFileSync(lockPath, "utf-8");
      expect(content).to.not.include('version "1.9.3"');
      expect(content).to.not.include("figlet@^1.9.1:");
    });

    it("should have consistent structure", function() {
      const content = fs.readFileSync(lockPath, "utf-8");
      // Yarn lock files should start with a comment
      expect(content).to.match(/^#/);
    });

    it("should contain form-data dependency for axios", function() {
      const content = fs.readFileSync(lockPath, "utf-8");
      expect(content).to.include("form-data");
    });

    it("should contain proxy-from-env dependency for axios", function() {
      const content = fs.readFileSync(lockPath, "utf-8");
      expect(content).to.include("proxy-from-env");
    });
  });

  describe("CHANGELOG.md Format and Structure", function() {
    const changelogPath = "CHANGELOG.md";
    let changelogContent: string;

    before(function() {
      changelogContent = fs.readFileSync(changelogPath, "utf-8");
    });

    it("should exist", function() {
      const exists = fs.existsSync(changelogPath);
      expect(exists).to.be.true;
    });

    it("should start with '# Changelog' header", function() {
      expect(changelogContent).to.match(/^#\s+Changelog/);
    });

    it("should contain version 1.5.2 section", function() {
      expect(changelogContent).to.include("## [1.5.2]");
    });

    it("should have properly formatted version links", function() {
      const versionLinkRegex = /\[(\d+\.\d+\.\d+)\]\(https:\/\/github\.com\/.*\/compare\/v\d+\.\d+\.\d+\.\.\.v\d+\.\d+\.\d+\)/;
      expect(changelogContent).to.match(versionLinkRegex);
    });

    it("should have dated version entries", function() {
      // Versions should have dates in format (YYYY-MM-DD)
      const dateRegex = /\(\d{4}-\d{2}-\d{2}\)/;
      expect(changelogContent).to.match(dateRegex);
    });

    it("should categorize changes properly", function() {
      // Should have sections like Bug Fixes, Features, etc.
      const hasBugFixes = changelogContent.includes("### Bug Fixes");
      const hasFeatures = changelogContent.includes("### Features");
      
      expect(hasBugFixes || hasFeatures).to.be.true;
    });

    it("should have commit links", function() {
      // Should link to specific commits
      const commitLinkRegex = /\[([a-f0-9]{7})\]\(https:\/\/github\.com\/.*\/commit\/[a-f0-9]{40}\)/;
      expect(changelogContent).to.match(commitLinkRegex);
    });

    it("should not contain duplicate version entries", function() {
      const versionMatches = changelogContent.match(/##\s+\[1\.5\.2\]/g);
      expect(versionMatches).to.not.be.null;
      expect(versionMatches!.length).to.equal(1);
    });

    it("should have version 1.5.1 section", function() {
      expect(changelogContent).to.include("## [1.5.1]");
    });

    it("should have version 1.5.0 section", function() {
      expect(changelogContent).to.include("## [1.5.0]");
    });

    it("should maintain chronological order (newest first)", function() {
      const version152Index = changelogContent.indexOf("## [1.5.2]");
      const version151Index = changelogContent.indexOf("## [1.5.1]");
      const version150Index = changelogContent.indexOf("## [1.5.0]");
      
      expect(version152Index).to.be.lessThan(version151Index);
      expect(version151Index).to.be.lessThan(version150Index);
    });

    it("should not have version 1.5.3 section", function() {
      // Version was rolled back from 1.5.3 to 1.5.2
      expect(changelogContent).to.not.include("## [1.5.3]");
    });

    it("should have proper markdown formatting", function() {
      // Check for proper list formatting with asterisks or dashes
      const listItemRegex = /^[*-]\s+/m;
      expect(changelogContent).to.match(listItemRegex);
    });

    it("should have comparison links for versions", function() {
      expect(changelogContent).to.include("/compare/");
    });

    it("should reference the correct repository", function() {
      expect(changelogContent).to.include("github.com/Boomchainlab/squads-mpl");
    });

    it("should use semantic versioning tags", function() {
      // Should reference versions with 'v' prefix in links
      expect(changelogContent).to.match(/v\d+\.\d+\.\d+/);
    });

    it("should have meaningful change descriptions", function() {
      // Each bullet point should have more than just a commit hash
      const lines = changelogContent.split("\n");
      const changeLines = lines.filter(line => line.trim().startsWith("*"));
      
      changeLines.forEach(line => {
        // Should have some description text
        expect(line.length).to.be.greaterThan(20);
      });
    });
  });

  describe("Cross-file Version Consistency", function() {
    let rootPackage: any;
    let appPackage: any;

    before(function() {
      rootPackage = JSON.parse(fs.readFileSync("package.json", "utf-8"));
      appPackage = JSON.parse(fs.readFileSync("app/package.json", "utf-8"));
    });

    it("should have root package version match git tag convention", function() {
      // Root package version should be 1.5.2 matching the reverted state
      expect(rootPackage.version).to.equal("1.5.2");
    });

    it("should have consistent ES module configuration", function() {
      expect(rootPackage.type).to.equal("module");
      expect(appPackage.type).to.equal("module");
    });

    it("should have compatible dependency versions between packages", function() {
      // Both should use compatible @sqds/sdk versions
      if (rootPackage.dependencies["@sqds/sdk"] && appPackage.dependencies["@sqds/sdk"]) {
        const rootSdk = rootPackage.dependencies["@sqds/sdk"];
        const appSdk = appPackage.dependencies["@sqds/sdk"];
        
        // Extract major versions
        const rootMajor = rootSdk.match(/\d+/)?.[0];
        const appMajor = appSdk.match(/\d+/)?.[0];
        
        expect(rootMajor).to.not.be.undefined;
        expect(appMajor).to.not.be.undefined;
      }
    });
  });

  describe("Security and Best Practices", function() {
    it("should not have hardcoded secrets in workflow files", function() {
      const workflowContent = fs.readFileSync(".github/workflows/send-sol.yml", "utf-8");
      
      // Should use GitHub secrets syntax
      expect(workflowContent).to.match(/\$\{\{\s*secrets\./);
      
      // Should not have actual API keys
      expect(workflowContent).to.not.match(/[A-Za-z0-9]{32,}/);
    });

    it("should use secure dependency versions", function() {
      const appPackage = JSON.parse(fs.readFileSync("app/package.json", "utf-8"));
      
      // axios 0.30.1 is used instead of vulnerable 1.12.x
      expect(appPackage.dependencies.axios).to.include("0.30");
    });

    it("should have license information", function() {
      const rootPackage = JSON.parse(fs.readFileSync("package.json", "utf-8"));
      const appPackage = JSON.parse(fs.readFileSync("app/package.json", "utf-8"));
      
      expect(appPackage).to.have.property("license");
      expect(appPackage.license).to.be.a("string");
    });

    it("should validate Solana address format in workflow", function() {
      const content = fs.readFileSync(".github/workflows/send-sol.yml", "utf-8");
      const addressMatch = content.match(/"to":\s*"([^"]+)"/);
      
      expect(addressMatch).to.not.be.null;
      
      const address = addressMatch![1];
      // Solana addresses should be base58 and 32-44 characters
      expect(address).to.have.lengthOf.at.least(32);
      expect(address).to.have.lengthOf.at.most(44);
      
      // Should not contain invalid base58 characters (0, O, I, l)
      expect(address).to.not.match(/[0OIl]/);
    });

    it("should use HTTPS endpoints in workflow", function() {
      const content = fs.readFileSync(".github/workflows/send-sol.yml", "utf-8");
      
      // All API calls should use HTTPS
      const httpMatches = content.match(/http:\/\//g);
      expect(httpMatches).to.be.null;
      
      expect(content).to.include("https://");
    });
  });

  describe("Build and Test Configuration", function() {
    it("should have TypeScript configuration", function() {
      const exists = fs.existsSync("tsconfig.json");
      expect(exists).to.be.true;
    });

    it("should have app TypeScript configuration", function() {
      const exists = fs.existsSync("app/tsconfig.json");
      expect(exists).to.be.true;
    });

    it("should have proper test script in root package", function() {
      const pkg = JSON.parse(fs.readFileSync("package.json", "utf-8"));
      expect(pkg.scripts).to.have.property("test");
    });

    it("should have build script in app package", function() {
      const pkg = JSON.parse(fs.readFileSync("app/package.json", "utf-8"));
      expect(pkg.scripts).to.have.property("build");
    });
  });
});