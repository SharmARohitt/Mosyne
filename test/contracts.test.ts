/**
 * Smart Contract Unit Tests
 * 
 * Tests the core MOSYNE contracts:
 * - MemoryRegistry: Pattern storage and detection
 * - RiskOracle: Risk scoring logic
 * - PermissionManager: ERC-7715 permission tracking
 * - PatternMatcher: Pattern matching algorithms
 */

import { expect } from "chai";
import { ethers } from "hardhat";
import { MemoryRegistry, RiskOracle, PermissionManager, PatternMatcher } from "../typechain-types";
import { SignerWithAddress } from "@nomicfoundation/hardhat-ethers/signers";

describe("MOSYNE Smart Contracts", function () {
  let memoryRegistry: MemoryRegistry;
  let riskOracle: RiskOracle;
  let permissionManager: PermissionManager;
  let patternMatcher: PatternMatcher;
  
  let owner: SignerWithAddress;
  let user: SignerWithAddress;
  let maliciousAddress: SignerWithAddress;

  before(async function () {
    [owner, user, maliciousAddress] = await ethers.getSigners();
  });

  describe("Contract Deployment", function () {
    it("Should deploy MemoryRegistry", async function () {
      const MemoryRegistryFactory = await ethers.getContractFactory("MemoryRegistry");
      memoryRegistry = await MemoryRegistryFactory.deploy();
      await memoryRegistry.waitForDeployment();
      
      expect(await memoryRegistry.getAddress()).to.be.properAddress;
    });

    it("Should deploy RiskOracle with MemoryRegistry reference", async function () {
      const RiskOracleFactory = await ethers.getContractFactory("RiskOracle");
      riskOracle = await RiskOracleFactory.deploy(await memoryRegistry.getAddress());
      await riskOracle.waitForDeployment();
      
      expect(await riskOracle.getAddress()).to.be.properAddress;
    });

    it("Should deploy PermissionManager with RiskOracle reference", async function () {
      const PermissionManagerFactory = await ethers.getContractFactory("PermissionManager");
      permissionManager = await PermissionManagerFactory.deploy(await riskOracle.getAddress());
      await permissionManager.waitForDeployment();
      
      expect(await permissionManager.getAddress()).to.be.properAddress;
    });

    it("Should deploy PatternMatcher with MemoryRegistry reference", async function () {
      const PatternMatcherFactory = await ethers.getContractFactory("PatternMatcher");
      patternMatcher = await PatternMatcherFactory.deploy(await memoryRegistry.getAddress());
      await patternMatcher.waitForDeployment();
      
      expect(await patternMatcher.getAddress()).to.be.properAddress;
    });
  });

  describe("MemoryRegistry", function () {
    it("Should register a new pattern", async function () {
      const patternHash = ethers.keccak256(ethers.toUtf8Bytes("rug-pull-pattern-1"));
      const name = "Rug Pull Sequence";
      const description = "Rapid approval followed by drain";
      const severity = 95;
      const category = "rug-pull";

      await expect(
        memoryRegistry.registerPattern(patternHash, name, description, severity, category)
      ).to.emit(memoryRegistry, "MemoryAdded")
        .withArgs(patternHash, name, severity, category, await ethers.provider.getBlock('latest').then(b => b!.timestamp + 1));

      const pattern = await memoryRegistry.patterns(patternHash);
      expect(pattern.name).to.equal(name);
      expect(pattern.severity).to.equal(severity);
      expect(pattern.isActive).to.be.true;
    });

    it("Should record pattern occurrence", async function () {
      const patternHash = ethers.keccak256(ethers.toUtf8Bytes("rug-pull-pattern-1"));
      
      await expect(
        memoryRegistry.recordPatternOccurrence(patternHash, user.address)
      ).to.emit(memoryRegistry, "PatternDetected");

      const pattern = await memoryRegistry.patterns(patternHash);
      expect(pattern.occurrences).to.be.gt(0);
    });

    it("Should query pattern by hash", async function () {
      const patternHash = ethers.keccak256(ethers.toUtf8Bytes("rug-pull-pattern-1"));
      const pattern = await memoryRegistry.queryPattern(patternHash);
      
      expect(pattern.isActive).to.be.true;
      expect(pattern.name).to.equal("Rug Pull Sequence");
    });

    it("Should not allow duplicate pattern registration", async function () {
      const patternHash = ethers.keccak256(ethers.toUtf8Bytes("rug-pull-pattern-1"));
      
      await expect(
        memoryRegistry.registerPattern(patternHash, "Duplicate", "Test", 50, "test")
      ).to.be.revertedWith("Pattern already exists");
    });

    it("Should deactivate pattern", async function () {
      const patternHash = ethers.keccak256(ethers.toUtf8Bytes("rug-pull-pattern-1"));
      
      await memoryRegistry.deactivatePattern(patternHash);
      
      const pattern = await memoryRegistry.patterns(patternHash);
      expect(pattern.isActive).to.be.false;
    });
  });

  describe("RiskOracle", function () {
    it("Should initialize with zero risk score", async function () {
      const riskScore = await riskOracle.getRiskScore(user.address);
      expect(riskScore).to.equal(0);
    });

    it("Should update risk score", async function () {
      const newRiskScore = 75;
      
      await expect(
        riskOracle.updateRiskScore(maliciousAddress.address, newRiskScore)
      ).to.emit(riskOracle, "RiskScoreUpdated")
        .withArgs(maliciousAddress.address, newRiskScore, await ethers.provider.getBlock('latest').then(b => b!.timestamp + 1));

      const riskScore = await riskOracle.getRiskScore(maliciousAddress.address);
      expect(riskScore).to.equal(newRiskScore);
    });

    it("Should identify high-risk addresses", async function () {
      const isHighRisk = await riskOracle.isHighRisk(maliciousAddress.address);
      expect(isHighRisk).to.be.true; // 75 >= 70 threshold
    });

    it("Should reject risk scores > 100", async function () {
      await expect(
        riskOracle.updateRiskScore(user.address, 101)
      ).to.be.revertedWith("Risk score must be <= 100");
    });

    it("Should update risk data", async function () {
      await riskOracle.updateRiskData(
        user.address,
        100, // total transactions
        5,   // flagged transactions
        await ethers.provider.getBlock('latest').then(b => b!.timestamp)
      );

      const riskData = await riskOracle.getRiskData(user.address);
      expect(riskData.totalTransactions).to.equal(100);
      expect(riskData.flaggedTransactions).to.equal(5);
    });
  });

  describe("PermissionManager", function () {
    const PERMISSION_TYPE_APPROVE = 0;
    const PERMISSION_TYPE_CUSTOM = 3;

    it("Should grant permission", async function () {
      const targetAddress = await memoryRegistry.getAddress();
      const permissionHash = ethers.keccak256(
        ethers.AbiCoder.defaultAbiCoder().encode(
          ["address", "address", "uint8"],
          [user.address, targetAddress, PERMISSION_TYPE_CUSTOM]
        )
      );

      await expect(
        permissionManager.connect(user).grantPermission(
          targetAddress,
          PERMISSION_TYPE_CUSTOM,
          permissionHash
        )
      ).to.emit(permissionManager, "PermissionGranted")
        .withArgs(
          user.address,
          targetAddress,
          PERMISSION_TYPE_CUSTOM,
          permissionHash,
          await ethers.provider.getBlock('latest').then(b => b!.timestamp + 1)
        );
    });

    it("Should check if permission exists", async function () {
      const targetAddress = await memoryRegistry.getAddress();
      const hasPermission = await permissionManager.checkPermission(
        user.address,
        targetAddress,
        PERMISSION_TYPE_CUSTOM
      );
      
      expect(hasPermission).to.be.true;
    });

    it("Should revoke permission", async function () {
      const targetAddress = await memoryRegistry.getAddress();
      const permissionHash = ethers.keccak256(
        ethers.AbiCoder.defaultAbiCoder().encode(
          ["address", "address", "uint8"],
          [user.address, targetAddress, PERMISSION_TYPE_CUSTOM]
        )
      );

      await expect(
        permissionManager.connect(user).revokePermission(permissionHash, "User requested")
      ).to.emit(permissionManager, "PermissionRevoked");

      const hasPermission = await permissionManager.checkPermission(
        user.address,
        targetAddress,
        PERMISSION_TYPE_CUSTOM
      );
      
      expect(hasPermission).to.be.false;
    });

    it("Should check permission risk", async function () {
      // Grant permission to high-risk address
      const targetAddress = maliciousAddress.address;
      const permissionHash = ethers.keccak256(
        ethers.AbiCoder.defaultAbiCoder().encode(
          ["address", "address", "uint8"],
          [user.address, targetAddress, PERMISSION_TYPE_APPROVE]
        )
      );

      await permissionManager.connect(user).grantPermission(
        targetAddress,
        PERMISSION_TYPE_APPROVE,
        permissionHash
      );

      const riskScore = await permissionManager.checkPermissionRisk(
        user.address,
        targetAddress,
        PERMISSION_TYPE_APPROVE
      );

      // Should return high risk score (we set maliciousAddress to 75 earlier)
      expect(riskScore).to.be.gte(70);
    });
  });

  describe("PatternMatcher", function () {
    it("Should match patterns for an address", async function () {
      // First register a pattern
      const patternHash = ethers.keccak256(ethers.toUtf8Bytes("test-pattern"));
      await memoryRegistry.registerPattern(
        patternHash,
        "Test Pattern",
        "Test description",
        60,
        "test"
      );

      // Record occurrence for user address
      await memoryRegistry.recordPatternOccurrence(patternHash, user.address);

      // Match patterns
      const matches = await patternMatcher.matchPatterns(user.address);
      
      // Should find at least one pattern
      expect(matches.length).to.be.gt(0);
    });

    it("Should detect and record pattern", async function () {
      const patternHash = ethers.keccak256(ethers.toUtf8Bytes("detection-test"));
      await memoryRegistry.registerPattern(
        patternHash,
        "Detection Test",
        "Test",
        70,
        "test"
      );

      await expect(
        patternMatcher.detectAndRecord(patternHash, user.address)
      ).to.emit(memoryRegistry, "PatternDetected");
    });
  });

  describe("Integration Tests", function () {
    it("Should handle full flow: pattern detection → risk scoring → permission check", async function () {
      // 1. Register a high-severity pattern
      const patternHash = ethers.keccak256(ethers.toUtf8Bytes("integration-test"));
      await memoryRegistry.registerPattern(
        patternHash,
        "Integration Test Pattern",
        "Full flow test",
        90,
        "exploit"
      );

      // 2. Detect pattern for malicious address
      await memoryRegistry.recordPatternOccurrence(patternHash, maliciousAddress.address);

      // 3. Update risk score based on pattern
      await riskOracle.updateRiskScore(maliciousAddress.address, 90);

      // 4. Check if user has permission to interact with risky address
      const permissionHash = ethers.keccak256(
        ethers.AbiCoder.defaultAbiCoder().encode(
          ["address", "address", "uint8"],
          [user.address, maliciousAddress.address, 0]
        )
      );

      // 5. Grant permission (should trigger risk check)
      await permissionManager.connect(user).grantPermission(
        maliciousAddress.address,
        0,
        permissionHash
      );

      // 6. Verify high risk is detected
      const riskScore = await permissionManager.checkPermissionRisk(
        user.address,
        maliciousAddress.address,
        0
      );

      expect(riskScore).to.equal(90);
    });

    it("Should prevent interaction with deactivated patterns", async function () {
      const patternHash = ethers.keccak256(ethers.toUtf8Bytes("deactivated-test"));
      
      await memoryRegistry.registerPattern(
        patternHash,
        "Deactivated Pattern",
        "Test",
        80,
        "test"
      );

      await memoryRegistry.deactivatePattern(patternHash);

      const pattern = await memoryRegistry.queryPattern(patternHash);
      expect(pattern.isActive).to.be.false;
    });
  });
});
