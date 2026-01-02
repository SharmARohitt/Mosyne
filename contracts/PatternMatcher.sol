// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "./MemoryRegistry.sol";

/**
 * @title PatternMatcher
 * @notice Pattern detection logic for on-chain pattern matching
 */
contract PatternMatcher {
    MemoryRegistry public memoryRegistry;
    
    // Events
    event PatternMatchDetected(
        bytes32 indexed patternHash,
        address indexed matchedAddress,
        bytes txData,
        uint256 timestamp
    );

    constructor(address _memoryRegistry) {
        require(_memoryRegistry != address(0), "Invalid memory registry");
        memoryRegistry = MemoryRegistry(_memoryRegistry);
    }

    /**
     * @notice Match a transaction against known patterns
     * @param to Target address
     * @param data Transaction data
     * @return matchedPatterns Array of matched pattern hashes
     */
    function matchPatterns(
        address to,
        bytes calldata data
    ) external view returns (bytes32[] memory) {
        bytes32[] memory allPatterns = memoryRegistry.getAllPatternHashes();
        bytes32[] memory matches = new bytes32[](allPatterns.length);
        uint256 matchCount = 0;
        
        // Get patterns associated with this address
        bytes32[] memory addressPatterns = memoryRegistry.getPatternHistory(to);
        
        for (uint256 i = 0; i < addressPatterns.length; i++) {
            MemoryRegistry.Pattern memory pattern = memoryRegistry.queryPattern(addressPatterns[i]);
            
            if (pattern.isActive && patternMatches(pattern, to, data)) {
                matches[matchCount] = pattern.patternHash;
                matchCount++;
            }
        }
        
        // Resize array to actual match count
        bytes32[] memory result = new bytes32[](matchCount);
        for (uint256 i = 0; i < matchCount; i++) {
            result[i] = matches[i];
        }
        
        return result;
    }

    /**
     * @notice Internal pattern matching logic
     * @param pattern The pattern to match against
     * @param to Target address
     * @param data Transaction data
     * @return matches Whether the pattern matches
     */
    function patternMatches(
        MemoryRegistry.Pattern memory pattern,
        address to,
        bytes calldata data
    ) internal pure returns (bool) {
        // Basic pattern matching - can be extended with more sophisticated logic
        // For now, if address has pattern history, it's considered a match
        // In production, this would analyze function selectors, parameter patterns, etc.
        
        // Simple heuristic: if pattern exists for this address, it matches
        // More sophisticated matching would analyze:
        // - Function selector patterns
        // - Parameter value ranges
        // - Call sequence patterns
        // - Gas usage patterns
        
        return true; // Simplified for MVP
    }

    /**
     * @notice Detect and record pattern match
     * @param to Target address
     * @param data Transaction data
     */
    function detectAndRecord(address to, bytes calldata data) external {
        bytes32[] memory matches = matchPatterns(to, data);
        
        for (uint256 i = 0; i < matches.length; i++) {
            memoryRegistry.recordPatternOccurrence(matches[i], to);
            emit PatternMatchDetected(matches[i], to, data, block.timestamp);
        }
    }
}


