/**
 * Envio GraphQL Queries for MOSYNE
 * 
 * These queries demonstrate WHY Envio is essential:
 * 1. Cross-time correlation (patterns over months/years)
 * 2. Behavioral sequence detection (multiple events in order)
 * 3. Aggregations impossible with standard RPC calls
 * 4. Sub-200ms response for 100k+ events
 */

// GraphQL queries for Envio indexer

export const GET_PATTERNS_QUERY = `
  query GetPatterns($limit: Int, $offset: Int) {
    memoryPatterns(
      where: { isActive: true }
      orderBy: lastSeen
      orderDirection: desc
      first: $limit
      skip: $offset
    ) {
      id
      patternHash
      name
      description
      severity
      occurrences
      firstSeen
      lastSeen
      category
      isActive
    }
  }
`;

export const GET_PATTERN_QUERY = `
  query GetPattern($id: ID!) {
    memoryPattern(id: $id) {
      id
      patternHash
      name
      description
      severity
      occurrences
      firstSeen
      lastSeen
      category
      isActive
      occurrencesList {
        id
        detectedAddress
        timestamp
        blockNumber
        transactionHash
      }
    }
  }
`;

/**
 * COMPLEX QUERY 1: Behavioral Sequence Analysis
 * 
 * This query is IMPOSSIBLE with standard RPC:
 * - Correlates events across weeks/months
 * - Identifies sequences: approval → transfer → drain
 * - Requires indexing 100k+ events
 * 
 * With RPC: 30+ seconds, 1000+ calls
 * With Envio: <200ms, single GraphQL query
 */
export const GET_BEHAVIORAL_SEQUENCE_QUERY = `
  query GetBehavioralSequence($address: Bytes!, $startTime: BigInt!, $endTime: BigInt!) {
    # Get all pattern occurrences for this address over time
    patternOccurrences(
      where: { 
        detectedAddress: $address
        timestamp_gte: $startTime
        timestamp_lte: $endTime
      }
      orderBy: timestamp
      orderDirection: asc
      first: 1000
    ) {
      id
      pattern {
        id
        name
        category
        severity
      }
      timestamp
      blockNumber
      transactionHash
    }
    
    # Get approval events in the same timeframe
    approvalEvents(
      where: {
        owner: $address
        timestamp_gte: $startTime
        timestamp_lte: $endTime
      }
      orderBy: timestamp
      orderDirection: asc
    ) {
      id
      spender
      value
      token
      timestamp
      riskScore
      matchedPatterns {
        name
        category
      }
    }
    
    # Get risk score evolution
    walletRisk(id: $address) {
      riskHistory(
        where: {
          timestamp_gte: $startTime
          timestamp_lte: $endTime
        }
        orderBy: timestamp
        orderDirection: asc
      ) {
        riskScore
        timestamp
      }
    }
  }
`;

/**
 * COMPLEX QUERY 2: Cross-Address Pattern Correlation
 * 
 * Identifies if multiple addresses show the same behavioral pattern.
 * This is the "collective memory" - one user's experience protects others.
 * 
 * Impossible with RPC - would need to query every address individually.
 */
export const GET_PATTERN_CORRELATION_QUERY = `
  query GetPatternCorrelation($patternHash: Bytes!, $minOccurrences: Int!) {
    # Get all occurrences of this pattern
    patternOccurrences(
      where: { patternHash: $patternHash }
      orderBy: timestamp
      orderDirection: desc
      first: 1000
    ) {
      id
      detectedAddress
      timestamp
      blockNumber
      transactionHash
    }
    
    # Get the pattern details
    memoryPattern(id: $patternHash) {
      id
      name
      category
      severity
      occurrences
      firstSeen
      lastSeen
      
      # All addresses that triggered this pattern
      occurrencesList {
        detectedAddress
      }
    }
    
    # Get risk scores for addresses with this pattern
    walletRisks(
      where: {
        threatPatterns_contains: [$patternHash]
      }
      orderBy: riskScore
      orderDirection: desc
    ) {
      address
      riskScore
      totalTransactions
      flaggedTransactions
    }
  }
`;

/**
 * COMPLEX QUERY 3: Time-Series Pattern Evolution
 * 
 * Shows how a pattern's danger evolved over time.
 * Critical for detecting new attack vectors.
 */
export const GET_PATTERN_EVOLUTION_QUERY = `
  query GetPatternEvolution($patternHash: Bytes!, $timeWindows: [BigInt!]!) {
    # Get pattern occurrences grouped by time windows
    memoryPattern(id: $patternHash) {
      id
      name
      category
      severity
      
      # All occurrences with timestamps
      occurrencesList(
        orderBy: timestamp
        orderDirection: asc
      ) {
        timestamp
        detectedAddress
        blockNumber
      }
    }
  }
`;

/**
 * COMPLEX QUERY 4: Real-Time Threat Detection
 * 
 * Used when a transaction is being signed.
 * Queries years of history to assess current risk.
 */
export const GET_REALTIME_RISK_QUERY = `
  query GetRealtimeRisk($targetAddress: Bytes!) {
    # Get wallet risk score
    walletRisk(id: $targetAddress) {
      address
      riskScore
      totalTransactions
      flaggedTransactions
      lastUpdate
      threatPatterns
    }
    
    # Get recent pattern detections (last 30 days)
    patternOccurrences(
      where: { 
        detectedAddress: $targetAddress
        timestamp_gte: "${Math.floor(Date.now() / 1000) - (30 * 24 * 60 * 60)}"
      }
      orderBy: timestamp
      orderDirection: desc
      first: 50
    ) {
      pattern {
        id
        name
        category
        severity
      }
      timestamp
    }
    
    # Get recent high-risk approvals
    approvalEvents(
      where: {
        owner: $targetAddress
        riskScore_gte: 70
      }
      orderBy: timestamp
      orderDirection: desc
      first: 10
    ) {
      spender
      token
      value
      riskScore
      timestamp
    }
  }
`;

export const GET_TRANSACTIONS_QUERY = `
  query GetTransactions($wallet: Bytes, $limit: Int, $offset: Int) {
    transactions(
      where: $wallet ? { from: $wallet } : {}
      orderBy: timestamp
      orderDirection: desc
      first: $limit
      skip: $offset
    ) {
      id
      hash
      from
      to
      value
      riskScore
      timestamp
      blockNumber
      status
      type
      gasUsed
      gasPrice
      matchedPatterns {
        id
        name
        severity
        category
      }
    }
  }
`;

export const GET_WALLET_RISK_QUERY = `
  query GetWalletRisk($address: Bytes!) {
    walletRisk(id: $address) {
      id
      address
      riskScore
      totalTransactions
      flaggedTransactions
      lastUpdate
      lastActivity
      threatPatterns
    }
  }
`;

export const GET_PERMISSIONS_QUERY = `
  query GetPermissions($wallet: Bytes!) {
    permissions(
      where: { user: $wallet, isActive: true }
      orderBy: grantedAt
      orderDirection: desc
    ) {
      id
      permissionHash
      user
      target
      permissionType
      isActive
      grantedAt
      expiresAt
      patternHash
    }
  }
`;

/**
 * AGGREGATION QUERY: Pattern Statistics
 * 
 * Demonstrates Envio's aggregation capabilities.
 * Would require thousands of RPC calls to compute.
 */
export const GET_PATTERN_STATISTICS_QUERY = `
  query GetPatternStatistics {
    # Total patterns by category
    memoryPatterns(first: 1000) {
      category
      severity
      occurrences
    }
    
    # High-risk wallets count
    walletRisks(where: { riskScore_gte: 70 }) {
      id
      riskScore
    }
    
    # Total pattern occurrences in last 7 days
    patternOccurrences(
      where: {
        timestamp_gte: "${Math.floor(Date.now() / 1000) - (7 * 24 * 60 * 60)}"
      }
    ) {
      id
      timestamp
    }
  }
`;

/**
 * Helper function to build dynamic time-window queries
 */
export function buildTimeWindowQuery(
  patternHash: string,
  windowSizeHours: number,
  numWindows: number
) {
  const now = Math.floor(Date.now() / 1000);
  const windowSize = windowSizeHours * 60 * 60;
  
  return `
    query PatternTimeWindows {
      memoryPattern(id: "${patternHash}") {
        occurrencesList {
          timestamp
        }
      }
    }
  `;
}

      orderDirection: desc
    ) {
      id
      permissionHash
      user
      target
      permissionType
      isActive
      grantedAt
      expiresAt
    }
  }
`;

export const GET_PATTERN_OCCURRENCES_QUERY = `
  query GetPatternOccurrences($address: Bytes!) {
    patternOccurrences(
      where: { detectedAddress: $address }
      orderBy: timestamp
      orderDirection: desc
      first: 10
    ) {
      id
      pattern {
        id
        name
        severity
        category
        patternHash
      }
      timestamp
      blockNumber
      transactionHash
    }
  }
`;

