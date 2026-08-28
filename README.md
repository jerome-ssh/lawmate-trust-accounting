# <img src="https://api.iconify.design/lucide/landmark.svg?color=%238a8a8a" width="32" align="top"> LawMate Trust Accounting Engine

> <img src="https://api.iconify.design/lucide/book-open.svg?color=%238a8a8a" width="18" align="top"> **Read the full case study on my portfolio:** [jerome-emmanuel.dev](https://jerome-emmanuel.dev)

This repository highlights the IOLTA-compliant accounting module I built for [LawMate](https://lawmate.site), a legal practice management platform. 

While many SaaS applications can rely on standard Stripe integrations for billing, legal software requires strict, domain-specific financial controls. This module handles the complex logic required for legal trust accounting.

## <img src="https://api.iconify.design/lucide/alert-circle.svg?color=%238a8a8a" width="24" align="top"> The Business & Technical Problem

Lawyers are legally required to hold client retainers in specialized trust accounts (IOLTA). They cannot mix client money with the firm's operating money.

To remain compliant and avoid disbarment, a firm must perform "Three-Way Reconciliation" every month, proving that:
1. The **Bank Statement Balance** matches...
2. The **Internal Trust Ledger Balance**, which must match...
3. The **Sum of all Individual Client Matter Balances**.

Building this requires strict double-entry accounting logic. A simple CRUD application where a balance is just a standard integer field (`balance: 5000`) is highly vulnerable to race conditions and data corruption, which is unacceptable for financial compliance.

## <img src="https://api.iconify.design/lucide/scale.svg?color=%238a8a8a" width="24" align="top"> The Solution: Immutable Ledgers

Instead of updating a single balance field, I designed an immutable, double-entry ledger system. Every financial event (e.g., a client paying a retainer, or the firm billing against that retainer) creates paired transactional records (credits and debits). 

A client's balance is never stored as a raw number that can be overwritten; it is dynamically calculated as the aggregate sum of their immutable ledger entries.

## <img src="https://api.iconify.design/lucide/layers.svg?color=%238a8a8a" width="24" align="top"> Architecture & Tech Stack

*   **ACID Transactions (PostgreSQL):** All ledger entries are written inside strict database transactions. If a credit succeeds but the matching debit fails, the entire transaction rolls back, preventing orphaned funds.
*   **Double-Entry Schema Design:** The database is structured to track `Operating`, `Trust`, and `Client` accounts, ensuring money always flows perfectly between source and destination accounts.
*   **Automated Reconciliation Engine:** A backend service that automatically aggregates the matter-level balances and compares them against the firm's global trust ledger, flagging any discrepancies (e.g., a bank fee that threw off the balance) instantly.

## <img src="https://api.iconify.design/lucide/lightbulb.svg?color=%238a8a8a" width="24" align="top"> Why This Matters

Building this engine proved that I can translate strict, real-world regulatory requirements into bulletproof software architecture. It demonstrates a deep understanding of database integrity, transactional safety, and the ability to build complex business logic that cannot simply be outsourced to a third-party API.
