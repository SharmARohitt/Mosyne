import { ethers } from "hardhat";
import * as fs from "fs";
import * as path from "path";

async function main() {
  // Load deployment addresses
  const deploymentPath = path.join(__dirname, "../deployments/sepolia.json");
  if (!fs.existsSync(deploymentPath)) {
    throw new Error("Deployment file not found. Please deploy contracts first.");
  }

  const deployment = JSON.parse(fs.readFileSync(deploymentPath, "utf-8"));
  const memoryRegistryAddress = deployment.contracts.MemoryRegistry;

  const MemoryRegistry = await ethers.getContractFactory("MemoryRegistry");
  const memoryRegistry = MemoryRegistry.attach(memoryRegistryAddress);

  console.log("Seeding patterns to MemoryRegistry at:", memoryRegistryAddress);

  // Common exploit patterns
  const patterns = [
    {
      name: "Flash Loan Exploit",
      description: "Pattern detected in flash loan manipulation attacks",
      severity: 85,
      category: "exploit",
    },
    {
      name: "Approval Drain Attack",
      description: "Pattern where contracts drain tokens via excessive approvals",
      severity: 90,
      category: "drain",
    },
    {
      name: "Reentrancy Attack",
      description: "Classic reentrancy vulnerability exploitation pattern",
      severity: 88,
      category: "exploit",
    },
    {
      name: "Rug Pull Pattern",
      description: "Liquidity removal and token dump pattern",
      severity: 95,
      category: "rug_pull",
    },
    {
      name: "MEV Sandwich Attack",
      description: "Front-running and back-running transaction pattern",
      severity: 60,
      category: "exploit",
    },
    {
      name: "Phishing Contract",
      description: "Contract designed to steal user approvals",
      severity: 92,
      category: "drain",
    },
    {
      name: "Governance Attack",
      description: "Malicious governance proposal pattern",
      severity: 75,
      category: "governance",
    },
    {
      name: "Safe Protocol Interaction",
      description: "Verified safe interaction with known protocols",
      severity: 5,
      category: "safe",
    },
  ];

  for (const pattern of patterns) {
    // Generate pattern hash from name and category
    const patternHash = ethers.keccak256(
      ethers.toUtf8Bytes(`${pattern.name}-${pattern.category}-${Date.now()}`)
    );

    try {
      const tx = await memoryRegistry.registerPattern(
        patternHash,
        pattern.name,
        pattern.description,
        pattern.severity,
        pattern.category
      );
      await tx.wait();
      console.log(`✅ Registered: ${pattern.name} (${patternHash.slice(0, 10)}...)`);
    } catch (error: any) {
      console.error(`❌ Failed to register ${pattern.name}:`, error.message);
    }
  }

  console.log("\n✅ Pattern seeding complete!");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });


