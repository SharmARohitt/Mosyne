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

