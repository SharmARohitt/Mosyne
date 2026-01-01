// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "./MemoryRegistry.sol";

/**
 * @title RiskOracle
 * @notice Calculates risk scores for addresses and contracts based on historical threat data
 */
contract RiskOracle {
    MemoryRegistry public memoryRegistry;
    
    struct RiskData {
        uint8 riskScore; // 0-100
        uint256 lastUpdate;
        uint256 totalTransactions;
        uint256 flaggedTransactions;
        bytes32[] threatPatterns;
    }

    // Storage
    mapping(address => RiskData) public riskData;
    address[] public trackedAddresses;
    
    // Configuration
    uint8 public constant MAX_RISK_SCORE = 100;
    uint8 public constant HIGH_RISK_THRESHOLD = 70;
    uint256 public riskDecayPeriod = 30 days; // Risk decreases over time
    
    // Events
    event RiskScoreUpdated(
        address indexed addr,
        uint8 newRiskScore,
        uint256 timestamp
    );
    
    event RiskDataUpdated(
        address indexed addr,
        uint256 totalTransactions,
        uint256 flaggedTransactions,
        uint256 timestamp
    );

    constructor(address _memoryRegistry) {
        require(_memoryRegistry != address(0), "Invalid memory registry");
        memoryRegistry = MemoryRegistry(_memoryRegistry);
    }

    /**
     * @notice Calculate and update risk score for an address
     * @param addr The address to calculate risk for
     * @return riskScore The calculated risk score (0-100)
     */
    function calculateRiskScore(address addr) public view returns (uint8) {
        bytes32[] memory patterns = memoryRegistry.getPatternHistory(addr);
        
        if (patterns.length == 0) {
            return 0;
        }
        
        uint256 totalSeverity = 0;
        uint256 patternCount = 0;
        uint256 recentPatterns = 0;
        
        for (uint256 i = 0; i < patterns.length; i++) {
            MemoryRegistry.Pattern memory pattern = memoryRegistry.queryPattern(patterns[i]);
            if (pattern.isActive) {
                totalSeverity += pattern.severity;
                patternCount++;
                
                // Weight recent patterns more heavily
                if (block.timestamp - pattern.lastSeen < riskDecayPeriod) {
                    recentPatterns++;
                    totalSeverity += pattern.severity; // Double weight for recent
                }
            }
        }
        
        if (patternCount == 0) {
            return 0;
        }
        
        // Calculate average severity with recent weighting
        uint256 avgSeverity = totalSeverity / (patternCount + recentPatterns);
        
        // Apply time decay
        RiskData memory data = riskData[addr];
        if (data.lastUpdate > 0 && block.timestamp > data.lastUpdate) {
            uint256 timeSinceUpdate = block.timestamp - data.lastUpdate;
            uint256 decayFactor = timeSinceUpdate > riskDecayPeriod 
                ? riskDecayPeriod 
                : timeSinceUpdate;
            
            uint256 decay = (avgSeverity * decayFactor) / riskDecayPeriod;
            if (decay < avgSeverity) {
                avgSeverity -= decay;
            } else {
                avgSeverity = 0;
            }
        }
        
        // Ensure score is within bounds
        if (avgSeverity > MAX_RISK_SCORE) {
            avgSeverity = MAX_RISK_SCORE;
        }
        
        return uint8(avgSeverity);
    }

    /**
     * @notice Get risk score for an address (cached or calculated)
     * @param addr The address to query
     * @return riskScore The risk score (0-100)
     */
    function getRiskScore(address addr) external view returns (uint8) {
        return calculateRiskScore(addr);
    }

    /**
     * @notice Update risk data for an address
     * @param addr The address to update
     * @param totalTxs Total transaction count
     * @param flaggedTxs Number of flagged transactions
     */
    function updateRiskData(
        address addr,
        uint256 totalTxs,
        uint256 flaggedTxs
    ) external {
        // Check if this is first time tracking this address
        bool isNew = riskData[addr].lastUpdate == 0;
        
        riskData[addr].totalTransactions = totalTxs;
        riskData[addr].flaggedTransactions = flaggedTxs;
        riskData[addr].lastUpdate = block.timestamp;
        
        // Get associated threat patterns
        bytes32[] memory patterns = memoryRegistry.getPatternHistory(addr);
        riskData[addr].threatPatterns = patterns;
        
        // Calculate and update risk score
        uint8 newRiskScore = calculateRiskScore(addr);
        riskData[addr].riskScore = newRiskScore;
        
        if (isNew) {
            trackedAddresses.push(addr);
        }
        
        emit RiskDataUpdated(addr, totalTxs, flaggedTxs, block.timestamp);
        emit RiskScoreUpdated(addr, newRiskScore, block.timestamp);
    }

    /**
     * @notice Check if an address is high risk
     * @param addr The address to check
     * @return true if risk score >= HIGH_RISK_THRESHOLD
     */
    function isHighRisk(address addr) external view returns (bool) {
        uint8 score = calculateRiskScore(addr);
        return score >= HIGH_RISK_THRESHOLD;
    }

    /**
     * @notice Get full risk data for an address
     * @param addr The address to query
     * @return data The risk data struct
     */
    function getRiskData(address addr) external view returns (RiskData memory) {
        RiskData memory data = riskData[addr];
        data.riskScore = calculateRiskScore(addr); // Ensure latest score
        return data;
    }

    /**
     * @notice Get count of tracked addresses
     * @return Count of addresses with risk data
     */
    function getTrackedAddressCount() external view returns (uint256) {
        return trackedAddresses.length;
    }
}

