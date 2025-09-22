## 📋 System Architecture Overview

```mermaid
flowchart TD

    %% Client Layer
    subgraph Clients [Client Layer]
        A[📱 Mobile App<br/>(React)]
        B[💻 Web Browser<br/>(React)]
        C[🖥 Desktop App<br/>(Electron)]
    end

    A --> F
    B --> F
    C --> F

    %% Frontend Layer
    F[🌐 Frontend Layer<br/>• React + TypeScript<br/>• Tailwind CSS<br/>• PWA + Offline Mode]

    F --> G

    %% API Gateway
    G[🚪 API Gateway<br/>• Rate Limiting<br/>• Authentication<br/>• Load Balancing]

    G --> H
    G --> I
    G --> J


    %% Blockchain
    H[⛓ Blockchain<br/>• Polygon<br/>• Smart Contracts]

    %% Backend
    I[⚙️ Backend APIs<br/>• Node.js<br/>• Supabase<br/>• Redis Cache]

    %% File Storage
    J[🗄 File Storage<br/>• IPFS / Pinata<br/>• Image CDN<br/>• Video Stream]

✅ Advantages:
- Uses **icons + labels** for readability.  
- Automatically aligned by Mermaid (no messy ASCII spacing).  
- Easy to expand (just add more nodes/edges).  
- Works **directly in GitHub README**.  

Do you want me to also add a **horizontal layered architecture view** (like stacked layers: Client → Frontend → Gateway → Backend/Blockchain/Storage)? That usually looks super clean in Mermaid.
