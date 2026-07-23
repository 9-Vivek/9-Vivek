---
title: Human-Anchored Byzantine Fault Tolerant Network
description: A conceptual network-layer specification that anchors node creation to finite human attention while separating identity, routing, and encrypted storage.
publishDate: 2026-01-28
tags: [Byzantine Fault Tolerance, Zero Knowledge, Network Security]
summary: A proposal for human-bounded node authority, unlinkable credentials, and client-encrypted infrastructure.
featured: true
status: Conceptual whitepaper
category: Research / H-BFT
---

The Human-Anchored Byzantine Fault Tolerant Network (H-BFT) is a conceptual network architecture for limiting automated Sybil attacks without binding activity to a conventional public identity.

The proposal changes what counts as a network node. Instead of treating an account, address, or API credential as atomic, it defines an active node as a persistent cryptographic Root Seed whose creation and continued attestation require a bounded unit of human attention called **one-unit-focus (1uf)**.

## Human-bounded node authority

Digital identifiers can be copied at negligible cost. H-BFT attempts to make active node creation proportional to a physically scarce input: human time and attention. A person may maintain several independent Root Seeds for different parts of digital life, but each seed requires its own human-attested lease.

The intended security argument is that the global population of active, honestly maintained seeds can satisfy the classical Byzantine fault-tolerance condition `n ≥ 3f + 1` because attackers cannot automate seed creation without acquiring equivalent human effort.

This depends on a difficult unresolved premise: the 1uf interaction must remain easy for humans, expensive to automate, inexpensive to verify, accessible, and resistant to outsourced solving. Establishing that property is a central research problem rather than an assumed result.

## Cryptographic layers

Each Root Seed remains inside a hardware enclave and derives domain-separated keys for individual services. An authentication secret and a data-encryption key can be generated for one domain without exposing the seed or creating an obvious link to credentials used elsewhere.

A zero-knowledge proof of personhood (ZKPoP) is generated during a session handshake. After verification, ordinary symmetric encryption carries the data plane so that proof generation does not occur for every packet.

The proposal separates three broad functions:

- **Human identity layer:** 1uf creation and periodic re-attestation of independent Root Seeds.
- **Routing and control layer:** zero-knowledge handshakes, human-verified nodes, and Byzantine consensus for network state rather than packet contents.
- **Storage and access layer:** client-encrypted shards, threshold policies, and service providers that store ciphertext without holding decryption keys.

## Directory, storage, and recovery

A Decentralized Directory Ledger (DDL) stores cryptographic file identifiers, commitments to access policies, and blinded shard maps. Public participants can coordinate directory state without learning human-readable filenames, ownership, or shard locations.

High-value seeds may use Shamir secret sharing for threshold recovery across trusted guardians or secondary devices. Lower-value seeds can remain disposable. This allows identity to be partitioned rather than concentrated into one permanent universal credential.

## Scope of the proposal

The whitepaper also explores mixnet routing, metadata normalization, trusted execution environments for outsourced computation, and an asynchronous control plane using validator subcommittees. These are proposed components, not independently validated implementations.

H-BFT should currently be read as a research program and threat-modeling exercise. Its human-attestation assumption, privacy guarantees, hardware trust, consensus performance, accessibility, economic incentives, and legal claims all require formal analysis and empirical validation before the architecture could support production security decisions.

## Big-picture position

H-BFT is the most speculative infrastructure branch of the ACC direction. It asks what identity, routing, storage, and recovery would need to look like if sensitive cognitive state were treated as sovereign data rather than ordinary platform telemetry. Within the professional portfolio, it broadens the work from interface and application architecture into cryptographic threat modeling, distributed consensus, and the disciplined evaluation of ambitious systems claims.
