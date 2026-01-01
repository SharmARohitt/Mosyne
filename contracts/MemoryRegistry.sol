// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title MemoryRegistry
 * @notice Stores pattern hashes and metadata for the MOSYNE Collective On-Chain Memory Engine
 */
contract MemoryRegistry {
    struct Pattern {
        bytes32 patternHash;
        string name;
        string description;
        uint8 severity; // 0-100
        uint256 occurrences;
        uint256 firstSeen;
        uint256 lastSeen;
        string category;
        bool isActive;
    }

    // Storage
    mapping(bytes32 => Pattern) public patterns;
    mapping(address => bytes32[]) public addressPatterns; // Patterns associated with addresses
    bytes32[] public patternHashes;
    
    // Events
    event PatternDetected(
        bytes32 indexed patternHash,
        address indexed detectedAddress,
        uint8 severity,
        uint256 timestamp
    );
    
    event ThreatBlocked(
        bytes32 indexed patternHash,
        address indexed blockedAddress,
        address indexed user,
        uint256 timestamp
    );
    
    event MemoryAdded(
        bytes32 indexed patternHash,
        string name,
        uint8 severity,
        string category,
        uint256 timestamp
    );
    
    event PatternOccurrence(
        bytes32 indexed patternHash,
        uint256 newOccurrenceCount,
        uint256 timestamp
    );

    // Modifiers
    modifier onlyValidPattern(bytes32 patternHash) {
        require(patterns[patternHash].patternHash != bytes32(0), "Pattern does not exist");
        _;
    }

    /**
     * @notice Register a new memory pattern
     * @param patternHash The hash of the pattern
     * @param name Human-readable name
     * @param description Pattern description
     * @param severity Risk severity (0-100)
     * @param category Pattern category (e.g., "exploit", "rug_pull", "drain")
     */
    function registerPattern(
        bytes32 patternHash,
        string memory name,
        string memory description,
        uint8 severity,
        string memory category
    ) external {
        require(patterns[patternHash].patternHash == bytes32(0), "Pattern already exists");
        require(severity <= 100, "Severity must be <= 100");
        
        uint256 timestamp = block.timestamp;
        patterns[patternHash] = Pattern({
            patternHash: patternHash,
            name: name,
            description: description,
            severity: severity,
            occurrences: 0,
            firstSeen: timestamp,
            lastSeen: timestamp,
            category: category,
            isActive: true
        });
        
        patternHashes.push(patternHash);
        
        emit MemoryAdded(patternHash, name, severity, category, timestamp);
    }

    /**
     * @notice Record a pattern occurrence (called by indexer or permission manager)
     * @param patternHash The pattern that was detected
     * @param detectedAddress The address where the pattern was detected
     */
    function recordPatternOccurrence(
        bytes32 patternHash,
        address detectedAddress
    ) external onlyValidPattern(patternHash) {
        Pattern storage pattern = patterns[patternHash];
        require(pattern.isActive, "Pattern is not active");
        
        pattern.occurrences++;
        pattern.lastSeen = block.timestamp;
        
        // Track pattern for this address
        addressPatterns[detectedAddress].push(patternHash);
        
        emit PatternDetected(patternHash, detectedAddress, pattern.severity, block.timestamp);
        emit PatternOccurrence(patternHash, pattern.occurrences, block.timestamp);
    }

    /**
     * @notice Query pattern information
     * @param patternHash The pattern hash to query
     * @return pattern The pattern struct
     */
    function queryPattern(bytes32 patternHash) external view returns (Pattern memory) {
        require(patterns[patternHash].patternHash != bytes32(0), "Pattern does not exist");
        return patterns[patternHash];
    }

    /**
     * @notice Get pattern history for an address
     * @param addr The address to query
     * @return patternHashesArray Array of pattern hashes associated with the address
     */
    function getPatternHistory(address addr) external view returns (bytes32[] memory) {
        return addressPatterns[addr];
    }

    /**
     * @notice Get all pattern hashes
     * @return Array of all registered pattern hashes
     */
    function getAllPatternHashes() external view returns (bytes32[] memory) {
        return patternHashes;
    }

    /**
     * @notice Get pattern count
     * @return Total number of registered patterns
     */
    function getPatternCount() external view returns (uint256) {
        return patternHashes.length;
    }

    /**
     * @notice Check if a pattern exists
     * @param patternHash The pattern hash to check
     * @return true if pattern exists
     */
    function patternExists(bytes32 patternHash) external view returns (bool) {
        return patterns[patternHash].patternHash != bytes32(0);
    }

    /**
     * @notice Toggle pattern active status (admin function)
     * @param patternHash The pattern to toggle
     */
    function togglePatternActive(bytes32 patternHash) external onlyValidPattern(patternHash) {
        patterns[patternHash].isActive = !patterns[patternHash].isActive;
    }
}

