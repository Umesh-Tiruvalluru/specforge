import type { Template } from "./types";

export const templates: Template[] = [
  {
    name: "Web App",
    description: "Standard web application with auth, dashboard, and API",
    defaults: {
      productType: "web-app",
      technicalConstraints: "React/Next.js frontend, REST API, PostgreSQL database",
      successCriteria: "Sub-2s page loads, 99.9% uptime, mobile-responsive design",
    },
  },
  {
    name: "Mobile App",
    description: "Native or cross-platform mobile application",
    defaults: {
      productType: "mobile-app",
      technicalConstraints: "React Native, offline-first, iOS and Android support",
      successCriteria: "4.5+ App Store rating, <3s cold start, offline capability",
    },
  },
  {
    name: "Internal Tool",
    description: "Admin dashboard or internal team productivity tool",
    defaults: {
      productType: "web-app",
      technicalConstraints: "SSO/LDAP auth, role-based access, audit logging",
      successCriteria: "90% team adoption within 2 weeks, reduces manual work by 50%",
    },
  },
  {
    name: "API / Backend",
    description: "REST or GraphQL API service with integrations",
    defaults: {
      productType: "api",
      technicalConstraints: "RESTful design, rate limiting, versioned endpoints, OpenAPI spec",
      successCriteria: "<100ms p95 latency, 99.99% uptime, comprehensive API docs",
    },
  },
  {
    name: "SaaS Product",
    description: "Multi-tenant SaaS with billing, onboarding, and analytics",
    defaults: {
      productType: "saas",
      technicalConstraints: "Multi-tenant architecture, Stripe billing, usage analytics",
      successCriteria: "10% free-to-paid conversion, <5% monthly churn, NPS 40+",
    },
  },
];
