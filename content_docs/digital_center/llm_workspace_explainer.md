# LLM Workspace — Feature Explainer & Architecture Blueprint

## 1. Purpose & Core Philosophy

The **LLM Workspace** is a dedicated, full-screen power-user environment accessible directly from the Digital Center’s main menu.

Traditional AI chat interfaces treat long conversations as flat, chronological message streams. While a chronological transcript records *what* was said, it completely fails to preserve the *structure* of the work being done: the branching ideas explored, architectural decisions reached, code artifacts produced, or context constraints introduced. As a conversation grows, it suffers from severe context pollution, forcing the user to spend half their time scrolling up and down or continuously re-explaining project rules to the model.

Within the Digital Center ecosystem, the LLM Workspace completely reimagines AI interaction by treating a conversation as a **structured workspace** rather than a text log.

Crucially, its value is magnified by the Digital Center's local data architecture. Instead of operating in an isolated silo, the LLM Workspace allows power users to explicitly pull in secure, local system objects—such as Unified Calendar blocks, entries from the Notes Pool, or items from the Archive Stream—and reason over them with a highly capable cloud model using the Google Gemini free API tier.

---

## 2. The Four-Layer Workspace Model

The internal engine of the LLM Workspace separates information into four distinct, structurally addressable layers. This ensures that details remain navigable, context remains controllable, and project reflection remains persistent.

```text
┌────────────────────────────────────────────────────────────────────────┐
│                          ORIENTATION LAYER                             │
│       - Persistent, Non-Mutating Cognitive Briefs & Constraints        │
├─────────────────────────────────────┬──────────────────────────────────┤
│             SOURCE LAYER            │          ARTIFACT LAYER          │
│                                     │                                  │
│   - Canonical Conversation Record   │   - Durable Outputs Produced     │
│   - Contained Branching Trees       │   - Code Specs, Drafts, Tables   │
└─────────────────────────────────────┴──────────────────────────────────┘
                  │                                  │
                  ▼                                  ▼
┌────────────────────────────────────────────────────────────────────────┐
│                        CONVERSATION MAP LAYER                          │
│         - Interactive Graph of Semantic Moves & Project Decisions      │
└────────────────────────────────────────────────────────────────────────┘
```

These layers are not only navigational views. They are also context-selection surfaces. The user can choose which transcript spans, artifacts, map nodes, orientation insights, or mounted Digital Center objects should be included in the next model request.

### I. The Source Layer: The Text Engine

The **Source Layer** preserves the canonical conversation record. Rather than a single linear timeline, it natively supports a branchable transcript tree. If a user wishes to test an alternate architectural approach or debugging path, they can branch the conversation at any point. This creates an alternate logical path in the local database without generating a disconnected, messy new "chat tab."

### II. The Artifact Layer: The Production Desk

Durable outputs created during the conversation—such as code implementations, API specs, content outlines, system drafts, or markdown tables—are automatically extracted from the chat stream and placed into the **Artifact Layer**. Artifacts live as independent objects alongside the transcript. A user can reference an artifact directly in a prompt, edit it, or click it to instantly snap the Source Layer back to the exact conversation turn that generated it.

### III. The Conversation Map Layer: The Flight Radar

Because long technical exchanges become dense and visually exhausting, this layer automatically maps the conversation's structural skeleton into an interactive visual graph. As the conversation progresses, it nodes and colors semantic moves:

* **Decisions:** Architecture patterns, logic parameters, or project boundaries.
* **Definitions:** Code rules, constraints, or feature descriptions.
* **Bugs/Fixes:** Identified code errors and remediation strategies.

Clicking any node on the Map Graph instantly navigates the user to that exact segment of the source text, making the deep history of a complex project navigable in seconds.

### IV. The Orientation Layer: The North Star

The **Orientation Layer** houses persistent, non-mutating reflective insights synthesized over the conversation, such as core assumptions, open questions, current implementation rules, and immediate next steps.

Unlike standard chat logs where important parameters get pushed out of the model's active memory context, the Orientation Layer is completely persistent. When a user requests an update to their active constraints or project brief, the system refines this layer directly without cluttering or dirtying the underlying source transcript file.

---

### 3. Integration with the Digital Center Ecosystem

The true leverage of housing this workspace inside the Digital Center is the fluid cross-pollination of local data. Users can tightly control and craft the exact context window sent to the model by explicitly mounting native system objects directly into the workspace.

The LLM Workspace does not assume that every request should use the full conversation history. Instead, it gives the user direct control over the context packet being sent to the model.

### Native Context Sources

* **The Archive Pipeline:** A user can select technical documentation, engineering papers, saved URLs, or durable reference material from the **Archive Stream** and mount them directly into the active LLM Workspace session to anchor the model's reasoning.

* **The Note Staging Area:** Unstructured brain dumps from the **Notes Pool** can be explicitly fed into the workspace, allowing the model to analyze raw, fleeting thoughts and refit them into structured task blocks, design notes, implementation plans, or system specs.

* **The Calendar Anchor:** Time constraints, scheduling parameters, task windows, and milestone deadlines can be pulled from the **Unified Calendar** to inform project roadmaps, sprint planning, and prioritization logic.

* **The Extensions Layer:** External signals from connected tools can be pulled into the workspace as controlled context objects. These may include saved emails, GitHub issues, webhook events, Discord or Slack messages, imported Planner/Trello data, feed posts, or other extension-provided objects. This allows the model to reason over the actual project environment without forcing the user to manually copy scattered external information into the chat.

### Explicit Context Control

The LLM Workspace treats context as a user-controlled input, not an invisible side effect of the chat history.

Before sending a request, the user can choose what the model should reason over. Supported context modes may include:

* **Current Prompt Only:** The model receives only the latest user message.
* **Full Conversation:** The model receives the complete active conversation history.
* **Current Branch Only:** The model receives the selected branch path from the Source Layer.
* **Selected Messages:** The user manually selects specific source messages or spans.
* **Selected Map Nodes:** The user selects semantic nodes from the Conversation Map Layer.
* **Selected Map Cluster:** The user sends an entire conceptual cluster, such as a decision chain or debugging thread.
* **Selected Artifact:** The user focuses the model on a produced object such as a code file, spec, draft, or table.
* **Selected Orientation Insight:** The user sends an active assumption set, constraint list, decision summary, or State Insight.
* **Selected Digital Center Objects:** The user mounts notes, archive items, calendar blocks, extension objects, or task records.
* **Custom Context Bundle:** The user combines multiple selected sources into a named reusable packet.

This makes the LLM Workspace useful for both continuity and precision. A user can continue a long-running project conversation when needed, but can also temporarily narrow the model's attention to a single artifact, branch, map cluster, or external object without polluting the source transcript.

---

## 4. The Switchboard Interface Handshake: State Insights

While the full-screen LLM Workspace is designed for heavy, deep-thinking architectural execution, it leaves a lightweight, visual footprint within the project's **Switchboard Context Space**.

1. **The Grid Preview:** When reviewing a project space within the main Switchboard view, the lower-right sector displays the **LLM Workspace Preview**. This panel visualizes the real-time health of the active Conversation Map and houses a direct pointer to click through to the full-screen engine.
2. **The Overlay Projection:** When working in external applications like PyCharm, the user can toggle their Left Accordion Overlay Panel. The bottom card is the **LLM Workspace Snapshot**. To maximize screen real estate and keep the cockpit quiet, this card displays the active, high-level **State Insight** from a relevant chat's Orientation Layer.
3. **Context Packet Handoff:** A Switchboard Context Space can pass its active Cognitive Brief, current objective, task block, relevant archive items, notes, extension objects, calendar constraints, and LLM State Insight into the LLM Workspace as a preassembled context bundle. This lets the user jump from execution mode into deep AI reasoning without manually reconstructing the project state.

The power user can instantly read the exact macro-state of their AI alignment without opening a dense text interface. If they need to perform a deep technical pivot, clicking the snapshot passes a local Inter-Process Communication (IPC) event, hides the overlays, and instantly boots the main Digital Center application directly into the full-screen, multi-layered LLM Workspace.
