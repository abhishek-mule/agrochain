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
    F[Frontend Layer\n- React + TypeScript\n- Tailwind CSS\n- PWA + Offline Mode]

    F --> G

    %% API Gateway
    G[API Gateway\n- Rate Limiting\n- Authentication\n- Load Balancing]

    G --> H
    G --> I
    G --> J

    %% Blockchain
    H[Blockchain\n- Polygon\n- Smart Contracts]

    %% Backend
    I[Backend APIs\n- Node.js\n- Supabase\n- Redis Cache]

    %% File Storage
    J[File Storage\n- IPFS / Pinata\n- Image CDN\n- Video Stream]
