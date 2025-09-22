## 📋 System Architecture Overview

```mermaid
flowchart TD

    %% Client Layer
    subgraph Clients [Client Layer]
        A[Mobile App (React)]
        B[Web Browser (React)]
        C[Desktop App (Electron)]
    end

    A --> F
    B --> F
    C --> F

    %% Frontend Layer
    F[Frontend Layer
    - React + TypeScript
    - Tailwind CSS
    - PWA + Offline Mode]

    F --> G

    %% API Gateway
    G[API Gateway
    - Rate Limiting
    - Authentication
    - Load Balancing]

    G --> H
    G --> I
    G --> J

    %% Blockchain
    H[Blockchain
    - Polygon
    - Smart Contracts]

    %% Backend
    I[Backend APIs
    - Node.js
    - Supabase
    - Redis Cache]

    %% File Storage
    J[File Storage
    - IPFS / Pinata
    - Image CDN
    - Video Stream]
