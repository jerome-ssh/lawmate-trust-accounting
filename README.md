# <img src="https://api.iconify.design/lucide/landmark.svg?color=%238a8a8a" width="32" align="top"> LawMate Trust Accounting Engine

> <img src="https://api.iconify.design/lucide/book-open.svg?color=%238a8a8a" width="18" align="top"> **Read the full case study on my portfolio:** [jerome-emmanuel.dev](https://jerome-emmanuel.dev)

This covers the IOLTA-compliant accounting module I built for [LawMate](https://lawmate.site). 

While there are excellent, industry-standard solutions specifically built for legal trust accounting (like LawPay), I chose to build this core financial engine from scratch. Building an in-house reconciliation system was a deliberate architectural challenge to prove I can handle complex, highly-regulated financial data and double-entry accounting logic.

## <img src="https://api.iconify.design/lucide/alert-circle.svg?color=%238a8a8a" width="24" align="top"> The Business Problem

Lawyers are legally required to hold client retainers in specialized trust accounts (IOLTA). They cannot mix client money with the firm's operating money.

To remain compliant and avoid disbarment, a firm must perform "Three-Way Reconciliation" every month, proving that:
1. The **Bank Statement Balance** matches...
2. The **Internal Trust Ledger Balance**, which matches...
3. The **Sum of all Individual Client Matter Balances**.

Building this requires strict double-entry accounting logic. A simple CRUD application where a balance is just a standard integer field (`balance: 5000`) doesn't work for strict financial compliance, as it's vulnerable to race conditions and data corruption.

## <img src="https://api.iconify.design/lucide/scale.svg?color=%238a8a8a" width="24" align="top"> The Solution: Immutable Ledgers

Instead of updating a single balance field, I set up an immutable, double-entry ledger system. Every financial event (like a client paying a retainer, or the firm billing against that retainer) creates paired transactional records (credits and debits). 

A client's balance is never stored as a raw number that can be directly edited; it's dynamically calculated as the aggregate sum of their ledger entries.

## <img src="https://api.iconify.design/lucide/layers.svg?color=%238a8a8a" width="24" align="top"> Tech Stack

*   **ACID Transactions (PostgreSQL):** All ledger entries are written inside database transactions. If a credit succeeds but the matching debit fails, the entire transaction rolls back, preventing orphaned funds.
*   **Double-Entry Schema Design:** The database tracks `Operating`, `Trust`, and `Client` accounts, ensuring money always flows perfectly between source and destination accounts.
*   **Reconciliation Jobs:** A backend service that aggregates the matter-level balances and compares them against the firm's global trust ledger to flag discrepancies.

## <img src="https://api.iconify.design/lucide/lightbulb.svg?color=%238a8a8a" width="24" align="top"> Why This Matters

Building this accounting engine from scratch was a great way to prove I can handle strict regulatory rules and complex database states. It shows I can write safe, transactional logic rather than just plugging into third-party APIs.
