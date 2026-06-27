export interface BusinessInput {
  businessName: string;
  industry: string;
  description: string;
  users: string; // e.g. Customers, Admin, Support
  techStack: string; // e.g. React, Node, PostgreSQL, AWS
  goals: string; // e.g. scale to 10k concurrent, strict data privacy
  complexity: 'simple' | 'medium' | 'enterprise';
}

export interface C4Node {
  id: string; // unique identifier (e.g., "customer", "payment_service")
  name: string;
  type: 'person' | 'software_system' | 'container';
  description: string;
  technology?: string; // only for containers
}

export interface C4Relation {
  sourceId: string;
  targetId: string;
  description: string;
  technology?: string;
}

export interface C4ModelData {
  nodes: C4Node[];
  relations: C4Relation[];
}

export interface LADR {
  id: string; // e.g., "LADR-001"
  title: string;
  status: 'Proposed' | 'Accepted' | 'Superceded' | 'Rejected';
  date: string;
  context: string;
  decision: string;
  consequences: string;
  tags: string[];
}

export interface ArchitecturalReport {
  businessName: string;
  industry: string;
  summary: string;
  c4Model: C4ModelData;
  structurizrDSL: string;
  ladrs: LADR[];
  recommendations: {
    scalability: string[];
    security: string[];
    resilience: string[];
  };
}
