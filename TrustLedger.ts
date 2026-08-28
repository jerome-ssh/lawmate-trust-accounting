/**
 * LawMate Trust Accounting Engine (Sanitized for Portfolio)
 * 
 * Demonstrates double-entry ledger logic and ACID transaction compliance
 * for IOLTA (Interest on Lawyer Trust Accounts).
 */

import { db } from './db'; // Mock import for portfolio context

export class TrustLedgerService {
  /**
   * Processes a client retainer deposit using strict double-entry accounting.
   * Wrapped in an ACID transaction to prevent orphaned funds.
   */
  static async recordRetainerDeposit(clientId: string, amount: number, referenceId: string) {
    // Start database transaction
    const trx = await db.transaction();

    try {
      // 1. Credit the firm's global Trust Liability Account
      await trx('ledger_entries').insert({
        account_type: 'trust_liability',
        client_id: null,
        amount: amount, // Credit
        reference_id: referenceId,
        type: 'deposit',
        created_at: new Date()
      });

      // 2. Debit the specific Client's Matter Account
      await trx('ledger_entries').insert({
        account_type: 'client_matter',
        client_id: clientId,
        amount: -amount, // Debit
        reference_id: referenceId,
        type: 'deposit',
        created_at: new Date()
      });

      // Commit transaction only if both entries succeed
      await trx.commit();
      return true;

    } catch (error) {
      // Rollback on any failure to prevent financial data corruption
      await trx.rollback();
      throw new Error(`Failed to record deposit: ${error.message}`);
    }
  }

  /**
   * Dynamically calculates a client's true trust balance by aggregating
   * all immutable ledger entries. Never relies on a static 'balance' column.
   */
  static async getClientTrustBalance(clientId: string): Promise<number> {
    const result = await db('ledger_entries')
      .where({ client_id: clientId, account_type: 'client_matter' })
      .sum('amount as total_balance')
      .first();

    // Invert the debit sum to show a positive balance to the user
    return (result?.total_balance || 0) * -1;
  }
}
