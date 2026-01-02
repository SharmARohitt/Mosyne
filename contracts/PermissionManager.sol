// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "./RiskOracle.sol";

/**
 * @title PermissionManager
 * @notice Tracks user permission grants and auto-revokes suspicious approvals
 * Integration points for MetaMask Snap and ERC-7715 Advanced Permissions
 */
contract PermissionManager {
    RiskOracle public riskOracle;
    
    enum PermissionType {
        APPROVE,        // ERC20 approve
        PERMIT,         // ERC2612 permit
        SET_APPROVAL,   // ERC721/ERC1155 setApprovalForAll
        CUSTOM          // Other permission types
    }
    
    struct Permission {
        address user;
        address target; // Contract or address being granted permission
        PermissionType permissionType;
        bool isActive;
        uint256 grantedAt;
        uint256 expiresAt;
        bytes32 patternHash; // Associated pattern if any
    }

    // Storage
    mapping(address => mapping(address => Permission)) public permissions; // user => target => Permission
    mapping(address => address[]) public userPermissions; // user => array of target addresses
    mapping(bytes32 => Permission) public permissionByHash;
    
    // Events
    event PermissionGranted(
        address indexed user,
        address indexed target,
        PermissionType permissionType,
        bytes32 indexed permissionHash,
        uint256 expiresAt
    );
    
    event PermissionRevoked(
        address indexed user,
        address indexed target,
        bytes32 indexed permissionHash,
        string reason
    );
    
    event PermissionExpired(
        address indexed user,
        address indexed target,
        bytes32 indexed permissionHash
    );
    
    event PermissionRiskChecked(
        address indexed user,
        address indexed target,
        uint8 riskScore,
        bool allowed
    );

    constructor(address _riskOracle) {
        require(_riskOracle != address(0), "Invalid risk oracle");
        riskOracle = RiskOracle(_riskOracle);
    }

    /**
     * @notice Generate permission hash
     * @param user The user granting permission
     * @param target The target contract/address
     * @param permissionType The type of permission
     * @return hash The keccak256 hash
     */
    function getPermissionHash(
        address user,
        address target,
        PermissionType permissionType
    ) public pure returns (bytes32) {
        return keccak256(abi.encodePacked(user, target, permissionType));
    }

    /**
     * @notice Grant a permission (called when user approves a contract)
     * @param target The contract/address being granted permission
     * @param permissionType The type of permission
     * @param expiresAt Expiration timestamp (0 for no expiration)
     */
    function grantPermission(
        address target,
        PermissionType permissionType,
        uint256 expiresAt
    ) external {
        address user = msg.sender;
        bytes32 permissionHash = getPermissionHash(user, target, permissionType);
        
        // Check if permission already exists
        require(
            permissions[user][target].grantedAt == 0 || 
            !permissions[user][target].isActive,
            "Permission already granted"
        );
        
        // Check risk before granting
        (bool allowed, uint8 riskScore) = checkPermissionRisk(user, target);
        require(allowed, "Target address is high risk");
        
        Permission memory permission = Permission({
            user: user,
            target: target,
            permissionType: permissionType,
            isActive: true,
            grantedAt: block.timestamp,
            expiresAt: expiresAt,
            patternHash: bytes32(0) // Can be set by indexer later
        });
        
        permissions[user][target] = permission;
        permissionByHash[permissionHash] = permission;
        
        // Add to user's permission list if not already there
        bool exists = false;
        for (uint256 i = 0; i < userPermissions[user].length; i++) {
            if (userPermissions[user][i] == target) {
                exists = true;
                break;
            }
        }
        if (!exists) {
            userPermissions[user].push(target);
        }
        
        emit PermissionGranted(user, target, permissionType, permissionHash, expiresAt);
        emit PermissionRiskChecked(user, target, riskScore, true);
    }

    /**
     * @notice Revoke a permission
     * @param target The target contract/address
     * @param reason Reason for revocation
     */
    function revokePermission(address target, string memory reason) external {
        address user = msg.sender;
        bytes32 permissionHash = getPermissionHash(
            user, 
            target, 
            permissions[user][target].permissionType
        );
        
        require(permissions[user][target].isActive, "Permission not active");
        
        permissions[user][target].isActive = false;
        permissionByHash[permissionHash].isActive = false;
        
        emit PermissionRevoked(user, target, permissionHash, reason);
    }

    /**
     * @notice Check if a permission is valid (not expired, active, and safe)
     * @param user The user who granted permission
     * @param target The target contract/address
     * @return valid Whether the permission is valid
     */
    function checkPermission(address user, address target) external view returns (bool) {
        Permission memory permission = permissions[user][target];
        
        // Check if permission exists and is active
        if (!permission.isActive || permission.grantedAt == 0) {
            return false;
        }
        
        // Check expiration
        if (permission.expiresAt > 0 && block.timestamp > permission.expiresAt) {
            return false;
        }
        
        // Check risk
        (bool allowed, ) = checkPermissionRisk(user, target);
        return allowed;
    }

    /**
     * @notice Check permission risk and auto-revoke if high risk
     * @param user The user
     * @param target The target address
     * @return allowed Whether permission should be allowed
     * @return riskScore The risk score of the target
     */
    function checkPermissionRisk(
        address user,
        address target
    ) public view returns (bool allowed, uint8 riskScore) {
        riskScore = riskOracle.getRiskScore(target);
        allowed = riskScore < riskOracle.HIGH_RISK_THRESHOLD();
        
        emit PermissionRiskChecked(user, target, riskScore, allowed);
        
        return (allowed, riskScore);
    }

    /**
     * @notice Auto-revoke permission if target becomes high risk
     * @param user The user
     * @param target The target address
     */
    function autoRevokeIfHighRisk(address user, address target) external {
        bool isHighRiskAddr = riskOracle.isHighRisk(target);
        
        if (isHighRiskAddr && permissions[user][target].isActive) {
            permissions[user][target].isActive = false;
            bytes32 permissionHash = getPermissionHash(
                user,
                target,
                permissions[user][target].permissionType
            );
            permissionByHash[permissionHash].isActive = false;
            
            emit PermissionRevoked(
                user,
                target,
                permissionHash,
                "Auto-revoked: Target is high risk"
            );
        }
    }

    /**
     * @notice Get all permissions for a user
     * @param user The user address
     * @return targets Array of target addresses with active permissions
     */
    function getUserPermissions(address user) external view returns (address[] memory) {
        return userPermissions[user];
    }

    /**
     * @notice Get permission details
     * @param user The user address
     * @param target The target address
     * @return permission The permission struct
     */
    function getPermission(
        address user,
        address target
    ) external view returns (Permission memory) {
        return permissions[user][target];
    }

    /**
     * @notice Clean up expired permissions (anyone can call)
     * @param user The user address
     * @param target The target address
     */
    function cleanupExpiredPermission(address user, address target) external {
        Permission storage permission = permissions[user][target];
        
        if (
            permission.isActive &&
            permission.expiresAt > 0 &&
            block.timestamp > permission.expiresAt
        ) {
            permission.isActive = false;
            bytes32 permissionHash = getPermissionHash(user, target, permission.permissionType);
            permissionByHash[permissionHash].isActive = false;
            
            emit PermissionExpired(user, target, permissionHash);
        }
    }
}


