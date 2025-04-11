/// <reference types="cypress" />

declare namespace Cypress {
  interface Chainable {
    login(email: string, password: string): Chainable<void>;
    mockSupabase(): Chainable<void>;
  }
}

// Login command
Cypress.Commands.add("login", (email: string, password: string) => {
  cy.visit("/login");
  cy.get('input[name="email"]').type(email);
  cy.get('input[name="password"]').type(password);
  cy.get('button[type="submit"]').click();
});

// Mock Supabase for E2E tests
Cypress.Commands.add("mockSupabase", () => {
  cy.intercept("POST", "/auth/v1/token*", {
    statusCode: 200,
    body: {
      access_token: "test-token",
      token_type: "bearer",
      user: {
        id: "1",
        email: "test@example.com",
        role: "user",
      },
    },
  });
});
