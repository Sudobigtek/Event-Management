describe("Authentication Flow", () => {
  beforeEach(() => {
    // Reset any previous state
    cy.clearLocalStorage();
    cy.clearCookies();
  });

  it("should allow user to register", () => {
    cy.visit("/register");

    // Fill out registration form
    cy.get('input[name="fullName"]').type("Test User");
    cy.get('input[name="email"]').type("test@example.com");
    cy.get('input[name="password"]').type("password123");
    cy.get('input[name="confirmPassword"]').type("password123");

    // Submit form
    cy.get('button[type="submit"]').click();

    // Should be redirected to login
    cy.url().should("include", "/login");
  });

  it("should allow user to login", () => {
    cy.visit("/login");

    // Fill out login form
    cy.get('input[name="email"]').type("test@example.com");
    cy.get('input[name="password"]').type("password123");

    // Submit form
    cy.get('button[type="submit"]').click();

    // Should be redirected to dashboard
    cy.url().should("include", "/dashboard");

    // Verify user is logged in
    cy.get("nav").should("contain", "Dashboard");
  });

  it("should show validation errors", () => {
    cy.visit("/login");

    // Try to submit empty form
    cy.get('button[type="submit"]').click();

    // Should show validation errors
    cy.get("form").should("contain", "Invalid email address");
    cy.get("form").should("contain", "Password must be at least 6 characters");
  });

  it("should handle incorrect credentials", () => {
    cy.visit("/login");

    // Fill out login form with incorrect credentials
    cy.get('input[name="email"]').type("wrong@example.com");
    cy.get('input[name="password"]').type("wrongpass");

    // Submit form
    cy.get('button[type="submit"]').click();

    // Should show error message
    cy.get("body").should("contain", "Invalid login credentials");
  });
});
