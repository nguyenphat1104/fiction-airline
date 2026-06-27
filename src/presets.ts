import { BusinessInput } from "./types";

export const BUSINESS_PRESETS: (BusinessInput & { label: string })[] = [
  {
    label: "ShopSphere (E-Commerce Platform)",
    businessName: "ShopSphere",
    industry: "Retail / E-Commerce",
    description: "An online marketplace featuring catalog browsing, cart management, stripe checkout integration, inventory management, and shipping dispatch coordination.",
    users: "Customers, Store Admins, Warehouse Staff",
    techStack: "Next.js, Node.js, PostgreSQL, Redis, Stripe API, AWS ECS",
    goals: "Handle 10,000 concurrent pageviews, integrate PCI-compliant payment gateways, and achieve sub-second cart updates.",
    complexity: "enterprise"
  },
  {
    label: "PayLink (Fintech Transfer Network)",
    businessName: "PayLink",
    industry: "Finance / Payments",
    description: "A fast, secure peer-to-peer digital wallet allowing instantaneous money transfers, bank deposits, merchant ledger tracking, and automated fraud transaction audits.",
    users: "Retail Users, Merchants, Risk & Compliance Officers",
    techStack: "React Native, Go, PostgreSQL, Apache Kafka, Firebase Auth, Plaid",
    goals: "Adhere to strict PCI-DSS compliance, guarantee sub-500ms transaction confirmations, and record audit trails.",
    complexity: "enterprise"
  },
  {
    label: "CarePulse (Telehealth consultations)",
    businessName: "CarePulse",
    industry: "Healthcare",
    description: "A secure patient-doctor workspace offering online appointment scheduling, high-availability WebRTC video consultation, and digital health prescription records.",
    users: "Patients, Licensed Doctors, Clinic Admins",
    techStack: "React, Python FastAPI, MongoDB, WebRTC, AWS S3",
    goals: "Achieve strict HIPAA compliance, implement robust patient record encryption, and maintain zero-lag video logs.",
    complexity: "medium"
  },
  {
    label: "SyncBoard (SaaS Collaborative Workspace)",
    businessName: "SyncBoard",
    industry: "Productivity / SaaS",
    description: "A real-time project planning workspace with drag-and-drop Kanban boards, team live chat, shared document workspaces, and webhook notifications.",
    users: "Workspace Owners, Team Members, External Guests",
    techStack: "React, NestJS, PostgreSQL, Socket.io, Redis",
    goals: "Facilitate multi-user concurrent updates, support instant drag-and-drop sync, and deliver real-time push alerts.",
    complexity: "simple"
  }
];
