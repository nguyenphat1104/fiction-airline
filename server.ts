import express from "express";
import path from "path";
import dotenv from "dotenv";
import { GoogleGenAI, Type } from "@google/genai";
import { createServer as createViteServer } from "vite";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Lazy-loaded Gemini AI client helper
function getGeminiClient() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY environment variable is not configured. Please add it via the Secrets panel in AI Studio.");
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        "User-Agent": "aistudio-build",
      },
    },
  });
}

// API endpoint for analyzing requirements and generating C4 models + DSL + LADRs
app.post("/api/analyze", async (req, res) => {
  try {
    const { businessName, industry, description, users, techStack, goals, complexity } = req.body;

    if (!businessName || !description) {
      res.status(400).json({ error: "Business name and description are required." });
      return;
    }

    const ai = getGeminiClient();

    // Construct a comprehensive and precise prompt
    const prompt = `
Analyze the following business and system requirements, map them into a C4 Model (up to Container level 2), generate Structurizr DSL code, and formulate 3 high-quality Lightweight Architecture Decision Records (LADRs) to document design traceability and decisions.

BUSINESS PROFILE:
- Business Name: ${businessName}
- Industry: ${industry}
- Key User Groups: ${users || "Not specified (assume standard user types based on industry)"}
- Core Operations / Processes: ${description}
- Preferred Tech Stack: ${techStack || "Not specified (propose optimal modern stack based on best practices)"}
- Key Architecture Goals: ${goals || "Ensure reliable performance, secure storage, and modular design"}
- Scale & Complexity Profile: ${complexity || "medium"}

REQUIRED OUTPUT STRUCTURE:
1. A summary describing the system vision, actors, and overall system bounds.
2. A list of C4 Model Nodes (including Persons, Software Systems, and key Containers inside the primary system).
3. A list of C4 Model Relations (connections between persons, systems, and containers, including descriptions and technologies).
4. A complete, syntactically valid Structurizr DSL string representing this architecture.
5. Three (3) Lightweight Architecture Decision Records (LADRs). The LADRs must cover critical decisions such as system style, database choice, or authentication mechanism.
6. Highly practical technical recommendations across Scalability, Security, and Resilience.

RULES FOR STRUCTURIZR DSL:
- It must start with 'workspace' and include 'model' and 'views' blocks.
- The primary system MUST be a softwareSystem with containers inside it.
- Ensure all identifiers are valid (no hyphens or spaces, e.g., use 'customer' or 'apiApplication', NOT 'api-application' or 'API Application' for variable names).
- Example layout:
  workspace "Name" "Description" {
      model {
          user = person "User" "Uses the system"
          system = softwareSystem "${businessName}" "Description" {
              web = container "Web App" "Interface" "React"
              api = container "API App" "Core Service" "Node.js"
              db = container "Database" "Data store" "PostgreSQL"
              web -> api "Queries" "JSON/HTTPS"
              api -> db "Reads/Writes" "SQL"
          }
          user -> web "Browses" "HTTPS"
      }
      views {
          systemContext system "SystemContext" {
              include *
              autolayout lr
          }
          container system "Containers" {
              include *
              autolayout lr
          }
          theme default
      }
  }
`;

    // Call Gemini with Structured JSON Output
    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        systemInstruction: "You are an expert Enterprise and Software Solutions Architect specializing in the C4 Model, Structurizr DSL, and Lightweight Architecture Decision Records (LADR). You deliver detailed, precise, and production-ready architectural diagrams and reports in JSON format.",
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            businessName: { type: Type.STRING },
            industry: { type: Type.STRING },
            summary: { type: Type.STRING, description: "A high-level summary of the system architecture and boundaries." },
            c4Model: {
              type: Type.OBJECT,
              properties: {
                nodes: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      id: { type: Type.STRING, description: "CamelCase or lower_snake_case id, e.g. webApp, customer" },
                      name: { type: Type.STRING, description: "Human readable name, e.g. Web Application" },
                      type: { type: Type.STRING, description: "Must be 'person', 'software_system', or 'container'" },
                      description: { type: Type.STRING },
                      technology: { type: Type.STRING, description: "Technology used, e.g. React, PostgreSQL, Docker (optional)" }
                    },
                    required: ["id", "name", "type", "description"]
                  }
                },
                relations: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      sourceId: { type: Type.STRING },
                      targetId: { type: Type.STRING },
                      description: { type: Type.STRING },
                      technology: { type: Type.STRING, description: "Technology used, e.g. HTTPS, gRPC, JDBC (optional)" }
                    },
                    required: ["sourceId", "targetId", "description"]
                  }
                }
              },
              required: ["nodes", "relations"]
            },
            structurizrDSL: { type: Type.STRING, description: "Valid Structurizr DSL block conforming to the schema and relations specified above." },
            ladrs: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  id: { type: Type.STRING, description: "LADR-001, LADR-002, etc." },
                  title: { type: Type.STRING },
                  status: { type: Type.STRING, description: "Proposed, Accepted, Superceded, or Rejected" },
                  date: { type: Type.STRING, description: "Today's date format (YYYY-MM-DD)" },
                  context: { type: Type.STRING, description: "What is the architectural context/problem we are solving?" },
                  decision: { type: Type.STRING, description: "What is the explicit technical decision being made?" },
                  consequences: { type: Type.STRING, description: "What are the positive/negative impacts of this decision?" },
                  tags: {
                    type: Type.ARRAY,
                    items: { type: Type.STRING }
                  }
                },
                required: ["id", "title", "status", "date", "context", "decision", "consequences", "tags"]
              }
            },
            recommendations: {
              type: Type.OBJECT,
              properties: {
                scalability: { type: Type.ARRAY, items: { type: Type.STRING } },
                security: { type: Type.ARRAY, items: { type: Type.STRING } },
                resilience: { type: Type.ARRAY, items: { type: Type.STRING } }
              },
              required: ["scalability", "security", "resilience"]
            }
          },
          required: ["businessName", "industry", "summary", "c4Model", "structurizrDSL", "ladrs", "recommendations"]
        }
      }
    });

    const resultText = response.text;
    if (!resultText) {
      throw new Error("Empty response from Gemini.");
    }

    const data = JSON.parse(resultText);
    res.json(data);
  } catch (error: any) {
    console.error("Analysis Error:", error);
    res.status(500).json({ error: error.message || "An error occurred during architectural analysis." });
  }
});

// Setup Vite Dev Server / Static Files Hosting
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    console.log("Loading Vite Dev Server...");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    console.log("Serving production static assets...");
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running at http://0.0.0.0:${PORT}`);
  });
}

startServer();
