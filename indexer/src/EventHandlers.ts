import { MemoryRegistry } from "../types/MemoryRegistry/MemoryRegistry";
import { RiskOracle } from "../types/RiskOracle/RiskOracle";
import { PermissionManager } from "../types/PermissionManager/PermissionManager";
import {
  MemoryPattern,
  PatternOccurrence,
  WalletRisk,
  RiskScoreUpdate,
  Permission,
  Transaction,
  ApprovalEvent,
} from "../types/schema";
import { BigInt, Bytes } from "@graphprotocol/graph-ts";

// MemoryRegistry Event Handlers

export function handleMemoryAdded(event: MemoryRegistry.MemoryAddedEvent): void {
  let pattern = new MemoryPattern(event.params.patternHash.toHex());
  pattern.patternHash = event.params.patternHash;
  pattern.name = event.params.name;
  pattern.severity = event.params.severity;
  pattern.category = event.params.category;
  pattern.occurrences = BigInt.fromI32(0);
  pattern.firstSeen = event.params.timestamp;
  pattern.lastSeen = event.params.timestamp;
  pattern.isActive = true;
  pattern.description = ""; // Will be set from contract if needed
  pattern.save();
}

export function handlePatternDetected(event: MemoryRegistry.PatternDetectedEvent): void {
  let patternHash = event.params.patternHash;
  let pattern = MemoryPattern.load(patternHash.toHex());
  
  if (pattern != null) {
    pattern.occurrences = pattern.occurrences.plus(BigInt.fromI32(1));
    pattern.lastSeen = event.params.timestamp;
    pattern.save();
  }

  // Create occurrence record
  let occurrenceId = patternHash.toHex() + "-" + event.transaction.hash.toHex() + "-" + event.logIndex.toString();
  let occurrence = new PatternOccurrence(occurrenceId);
  occurrence.pattern = patternHash.toHex();
  occurrence.patternHash = patternHash;
  occurrence.detectedAddress = event.params.detectedAddress;
  occurrence.timestamp = event.params.timestamp;
  occurrence.blockNumber = event.block.number;
  occurrence.transactionHash = event.transaction.hash;
  occurrence.severity = event.params.severity;
  occurrence.save();
}

export function handlePatternOccurrence(event: MemoryRegistry.PatternOccurrenceEvent): void {
  let pattern = MemoryPattern.load(event.params.patternHash.toHex());
  if (pattern != null) {
    pattern.occurrences = event.params.newOccurrenceCount;
    pattern.lastSeen = event.params.timestamp;
    pattern.save();
  }
}

export function handleThreatBlocked(event: MemoryRegistry.ThreatBlockedEvent): void {
  // Record threat blocking event
  // Could create a separate entity for blocked threats if needed
}

// RiskOracle Event Handlers

export function handleRiskScoreUpdated(event: RiskOracle.RiskScoreUpdatedEvent): void {
  let address = event.params.addr;
  let wallet = WalletRisk.load(address.toHex());
  
  if (wallet == null) {
    wallet = new WalletRisk(address.toHex());
    wallet.address = address;
    wallet.totalTransactions = BigInt.fromI32(0);
    wallet.flaggedTransactions = BigInt.fromI32(0);
    wallet.threatPatterns = [];
  }

  wallet.riskScore = event.params.newRiskScore;
  wallet.lastUpdate = event.params.timestamp;
  wallet.lastActivity = event.params.timestamp;
  wallet.save();

  // Record risk score history
  let updateId = address.toHex() + "-" + event.params.timestamp.toString();
  let update = new RiskScoreUpdate(updateId);
  update.wallet = address.toHex();
  update.riskScore = event.params.newRiskScore;
  update.timestamp = event.params.timestamp;
  update.blockNumber = event.block.number;
  update.save();
}

export function handleRiskDataUpdated(event: RiskOracle.RiskDataUpdatedEvent): void {
  let address = event.params.addr;
  let wallet = WalletRisk.load(address.toHex());
  
  if (wallet == null) {
    wallet = new WalletRisk(address.toHex());
    wallet.address = address;
    wallet.riskScore = 0;
    wallet.threatPatterns = [];
  }

  wallet.totalTransactions = event.params.totalTransactions;
  wallet.flaggedTransactions = event.params.flaggedTransactions;
  wallet.lastUpdate = event.params.timestamp;
  wallet.lastActivity = event.params.timestamp;
  wallet.save();
}

// PermissionManager Event Handlers

export function handlePermissionGranted(event: PermissionManager.PermissionGrantedEvent): void {
  let permission = new Permission(event.params.permissionHash.toHex());
  permission.permissionHash = event.params.permissionHash;
  permission.user = event.params.user;
  permission.target = event.params.target;
  permission.permissionType = getPermissionTypeName(event.params.permissionType);
  permission.isActive = true;
  permission.grantedAt = event.block.timestamp;
  permission.expiresAt = event.params.expiresAt;
  permission.save();
}

export function handlePermissionRevoked(event: PermissionManager.PermissionRevokedEvent): void {
  let permission = Permission.load(event.params.permissionHash.toHex());
  if (permission != null) {
    permission.isActive = false;
    permission.revokedAt = event.block.timestamp;
    permission.revokeReason = event.params.reason;
    permission.save();
  }
}

// Helper function
function getPermissionTypeName(type: i32): string {
  if (type == 0) return "APPROVE";
  if (type == 1) return "PERMIT";
  if (type == 2) return "SET_APPROVAL";
  if (type == 3) return "CUSTOM";
  return "UNKNOWN";
}


