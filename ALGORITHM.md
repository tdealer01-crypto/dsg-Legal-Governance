# DSG™ — Canonical Algorithm & Arithmetic Definition

*(Claim-Supporting, Non-Executable Form)*

## 1. Primitive Definitions

Let:
- $t$: temporal index
- $S_t$: system state at time $t$
- $\mathcal{S}$: total state space
- $\mathcal{I}$: invariant set
- $\mathcal{F}$: forbidden transition set
- $S^*$: last stable state
- $H$: deterministic hash function
- $\sigma_t$: stability statistics at time $t$

**Important:**
$S_t$ is an opaque state. There is no assumption regarding semantic, language, or meaning.

## 2. State Transition Proposal

Cognitive Engine proposes a new state:
$$ \hat{S}_{t+1} \in \mathcal{S} $$
*(DSG™ does not consider this state committed yet)*

## 3. Deterministic Gate Function (Core Claim Object)

Define function:
$$ G : (S_t, \hat{S}_{t+1}, t, \mathcal{I}, \mathcal{F}, S^*, \sigma_t) \rightarrow \{ \text{ALLOW}, \text{STABILIZE}, \text{BLOCK} \} $$
Where $G$ must be:
- Total
- Deterministic
- Side-effect free (logically)

## 4. Arithmetic / Logical Constraints (Claim Backbone)

### 4.1 Temporal Monotonicity Constraint
$$ t_{t+1} = t_t + 1 $$
If:
$$ t_{t+1} \le t_t \Rightarrow G = \text{BLOCK} $$

### 4.2 Duplicate State Constraint
$$ H(\hat{S}_{t+1}) = H(S_t) \Rightarrow G = \text{BLOCK} $$

### 4.3 Invariant Membership Constraint
$$ \hat{S}_{t+1} \notin \mathcal{I} \Rightarrow G = \text{BLOCK} $$

### 4.4 Forbidden Transition Constraint
$$ (S_t, \hat{S}_{t+1}) \in \mathcal{F} \Rightarrow G = \text{BLOCK} $$

## 5. Drift Arithmetic (Stabilization Trigger)

Let constant norm $\|\cdot\|$.
$$ D_t = \frac{\|\hat{S}_{t+1} - S^*\|}{\|S^*\|} $$
Let $\delta$ be the drift limit (constant).
If:
$$ D_t > \delta \Rightarrow G = \text{STABILIZE} $$

## 6. Oscillation Arithmetic (Stabilization Trigger)

Let:
$$ \Delta S_t = S_t - S_{t-1} $$
Define sign vector:
$$ \text{sgn}(\Delta S_t) $$
Let window $k$:
$$ O_t = \sum_{i=t-k}^{t} \mathbf{1}\big( \text{sgn}(\Delta S_i) \neq \text{sgn}(\Delta S_{i-1}) \big) $$
If:
$$ O_t > \Omega \Rightarrow G = \text{STABILIZE} $$

## 7. Decision Resolution (Exhaustive, No Fallback)

$$
G = \begin{cases} 
\text{BLOCK} & \text{if any hard constraint violated} \\ 
\text{STABILIZE} & \text{if drift or oscillation exceeded} \\ 
\text{ALLOW} & \text{otherwise} 
\end{cases}
$$

**Claim-critical:**
- No other branches
- No heuristics
- No probabilistic scoring

## 8. Commit Semantics (State Evolution)

### 8.1 ALLOW
$$ S_{t+1} := \hat{S}_{t+1} $$

### 8.2 STABILIZE
$$ S_{t+1} := S^* $$
$$ \sigma_{t+1} := 0 $$
*(No new state created; reassignment only)*

### 8.3 BLOCK
$$ \forall t' > t,\; S_{t'} \; \text{undefined} $$
*(BLOCK is an absorbing terminal condition)*

## 9. Hallucination Elimination (Claim-Level Definition)

**Definition:**
*Hallucinated State* is a state $\hat{S}_{t+1}$ that has no predecessor satisfying constraints 4.1–4.4.

From the definition of $G$:
$$ \neg \exists S_t \Rightarrow G = \text{BLOCK} $$

Therefore:
$$ \boxed{ \text{No hallucinated state can be committed} } $$

## 10. Determinism Claim (Reproducibility)

$$ (S_t, \hat{S}_{t+1}, \mathcal{I}, \mathcal{F}, S^*, \sigma_t) = (S'_t, \hat{S}'_{t+1}, \mathcal{I}, \mathcal{F}, S^*, \sigma_t) \Rightarrow G = G' $$

- No randomness
- No learning
- No adaptive threshold

## 11. Claim-Ready Summary

A deterministic gate function evaluates proposed state transitions using fixed arithmetic constraints on temporal ordering, invariant membership, forbidden transitions, drift magnitude, and oscillatory behavior, and permits, stabilizes, or blocks the transition without inspecting semantic content of the state.

---

## 12. Containment Boundary Analysis (Layered Architecture)

*(Formal Reasoning for Non-Deterministic Cognitive Engine Containment)*

### 12.1 System Model
Let $\mathcal{S}$ be the state space.
System state $S_t \in \mathcal{S}$.
Proposal from agent $\hat{S}_{t+1}$.
DSG gate $G(S_t,\hat{S}_{t+1}) \in \{\text{ALLOW}, \text{STABILIZE}, \text{BLOCK}\}$.
Commit rule:
$$
S_{t+1} =
\begin{cases}
\hat S_{t+1} & \text{ALLOW} \\
S^* & \text{STABILIZE} \\
\bot & \text{BLOCK}
\end{cases}
$$

### 12.2 Safe Region
Define $\mathcal{R}_{safe}$ as the set of states considered safe.
Let $\mathcal{I}$ be the invariant set of DSG.
Desired safety condition:
$$ \mathcal{R}_{safe} \subseteq \mathcal{I} $$

### 12.3 Containment Definition
The system has a containment boundary if:
$$ \forall t: S_t \in \mathcal{R}_{safe} $$
When starting from $S_0 \in \mathcal{R}_{safe}$.

### 12.4 Gate Property
From DSG constraints, a committed transition must pass:
- Invariant constraint: $\hat S_{t+1} \in \mathcal I$
- Forbidden edge constraint: $(S_t,\hat S_{t+1}) \notin \mathcal F$
- Drift bound: $D_t \le \delta$

### 12.5 Reachable State Set
Define reachable states $Reach(S_0)$ as states that can be generated from transitions allowed by DSG:
$$ S_0 \rightarrow S_1 \rightarrow \dots \rightarrow S_n $$
Where $G(S_i,S_{i+1}) = \text{ALLOW}$.

### 12.6 Containment Condition
DSG establishes a containment boundary if and only if:
$$ Reach(S_0) \subseteq \mathcal{R}_{safe} $$

### 12.7 Theorem (Ideal Containment)
If $\mathcal{R}_{safe} = \mathcal{I}$ and $\mathcal{F}$ blocks transitions exiting the safe region, then:
$$ Reach(S_0) \subseteq \mathcal{R}_{safe} $$
Therefore, DSG can enforce containment.

### 12.8 Practical Limitation (Multi-Step Escape)
In real-world systems, $\mathcal{R}_{safe} \subsetneq \mathcal{I}$ (the invariant set is larger than the strictly safe region).
Thus, there exists $S_u \in \mathcal I$ but $S_u \notin \mathcal R_{safe}$.
This state will be ALLOWED by a single DSG gate.

An agent can construct a sequence:
$$ S_0 \rightarrow S_1 \rightarrow \dots \rightarrow S_n $$
Where for every step $S_i \in \mathcal I$, but $S_n \notin \mathcal R_{safe}$.
This results in **Containment Escape**.

### 12.9 Containment Strengthening (Layered DSG)
To close this vector, a history constraint must be added:
$$ H_t = (S_{t-k}, \dots, S_t) $$
New gate function: $G_h(H_t, \hat S_{t+1})$.

**Reachability Constraint:**
Must satisfy:
$$ FutureReach(S_t) \subseteq \mathcal{R}_{safe} $$
Or at minimum $FutureReach(S_t, h)$ for horizon $h$.

### 12.10 Containment Architecture
The architecture capable of establishing a true boundary:
1. Agent
2. $\downarrow$ DSG Local Gate
3. $\downarrow$ DSG History Gate
4. $\downarrow$ DSG Reachability Gate
5. $\downarrow$ Commit

### 12.11 Containment Theorem (Practical)
If:
1. Invariant set $\approx$ Safe set
2. Forbidden transitions block unsafe edges
3. History window $\ge$ Attacker planning horizon

Then:
$$ Reach(S_0) \subseteq \mathcal{R}_{safe} $$
And the system possesses a **Containment Boundary**.

### 12.12 Final Result
A single-gate DSG cannot guarantee AGI containment. However, a **Layered DSG Architecture** can establish a Deterministic Containment Boundary under the conditions of correct invariants, sufficient history windows, and forbidden transition coverage. DSG acts as a deterministic containment governor that restricts the state space of unbounded agents.
