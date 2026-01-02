/**
 * Contract ABI Export Script
 * 
 * Run this after compilation to copy ABIs to the frontend
 * Usage: npm run export-abis
 */

import * as fs from 'fs';
import * as path from 'path';

const ARTIFACTS_DIR = path.join(__dirname, '../artifacts/contracts');
const ABI_OUTPUT_DIR = path.join(__dirname, '../src/lib/contracts/abi');

// Contracts to export
const CONTRACTS = [
  'MemoryRegistry',
  'RiskOracle',
  'PermissionManager',
  'PatternMatcher',
];

function exportABI(contractName: string) {
  const artifactPath = path.join(ARTIFACTS_DIR, `${contractName}.sol`, `${contractName}.json`);
  const outputPath = path.join(ABI_OUTPUT_DIR, `${contractName}.json`);

  try {
    // Read the artifact
    const artifact = JSON.parse(fs.readFileSync(artifactPath, 'utf8'));
    
    // Extract just the ABI
    const abi = artifact.abi;
    
    // Write to output directory
    if (!fs.existsSync(ABI_OUTPUT_DIR)) {
      fs.mkdirSync(ABI_OUTPUT_DIR, { recursive: true });
    }
    
    fs.writeFileSync(outputPath, JSON.stringify(abi, null, 2));
    console.log(`✅ Exported ABI for ${contractName}`);
  } catch (error) {
    console.error(`❌ Failed to export ABI for ${contractName}:`, error);
  }
}

// Export all contracts
console.log('📦 Exporting contract ABIs...\n');

for (const contract of CONTRACTS) {
  exportABI(contract);
}

console.log('\n✅ ABI export complete!');
console.log(`📁 ABIs saved to: ${ABI_OUTPUT_DIR}`);
