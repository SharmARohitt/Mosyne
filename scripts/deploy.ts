import { ethers } from "hardhat";
import * as fs from "fs";
import * as path from "path";

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("Deploying contracts with account:", deployer.address);
  console.log("Account balance:", (await ethers.provider.getBalance(deployer.address)).toString());

  // Deploy MemoryRegistry
  console.log("\n1. Deploying MemoryRegistry...");
  const MemoryRegistry = await ethers.getContractFactory("MemoryRegistry");
  const memoryRegistry = await MemoryRegistry.deploy();
  await memoryRegistry.waitForDeployment();
  const memoryRegistryAddress = await memoryRegistry.getAddress();
  console.log("MemoryRegistry deployed to:", memoryRegistryAddress);

  // Deploy RiskOracle
  console.log("\n2. Deploying RiskOracle...");
  const RiskOracle = await ethers.getContractFactory("RiskOracle");
  const riskOracle = await RiskOracle.deploy(memoryRegistryAddress);
  await riskOracle.waitForDeployment();
  const riskOracleAddress = await riskOracle.getAddress();
  console.log("RiskOracle deployed to:", riskOracleAddress);

  // Deploy PermissionManager
  console.log("\n3. Deploying PermissionManager...");
  const PermissionManager = await ethers.getContractFactory("PermissionManager");
  const permissionManager = await PermissionManager.deploy(riskOracleAddress);
  await permissionManager.waitForDeployment();
  const permissionManagerAddress = await permissionManager.getAddress();
  console.log("PermissionManager deployed to:", permissionManagerAddress);

  // Deploy PatternMatcher
  console.log("\n4. Deploying PatternMatcher...");
  const PatternMatcher = await ethers.getContractFactory("PatternMatcher");
  const patternMatcher = await PatternMatcher.deploy(memoryRegistryAddress);
  await patternMatcher.waitForDeployment();
  const patternMatcherAddress = await patternMatcher.getAddress();
  console.log("PatternMatcher deployed to:", patternMatcherAddress);

  // Save deployment addresses
  const deploymentInfo = {
    network: "sepolia",
    chainId: 11155111,
    deployer: deployer.address,
    contracts: {
      MemoryRegistry: memoryRegistryAddress,
      RiskOracle: riskOracleAddress,
      PermissionManager: permissionManagerAddress,
      PatternMatcher: patternMatcherAddress,
    },
    deployedAt: new Date().toISOString(),
  };

  const outputPath = path.join(__dirname, "../deployments/sepolia.json");
  const outputDir = path.dirname(outputPath);
  
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }
  
  fs.writeFileSync(outputPath, JSON.stringify(deploymentInfo, null, 2));
  console.log("\n✅ Deployment addresses saved to:", outputPath);

  console.log("\n📋 Deployment Summary:");
  console.log("====================");
  console.log(`MemoryRegistry:     ${memoryRegistryAddress}`);
  console.log(`RiskOracle:         ${riskOracleAddress}`);
  console.log(`PermissionManager:  ${permissionManagerAddress}`);
  console.log(`PatternMatcher:     ${patternMatcherAddress}`);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

