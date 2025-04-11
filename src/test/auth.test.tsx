import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "../contexts/AuthContext";
import Login from "../pages/Login";
import Register from "../pages/Register";

// Mock navigation
const mockNavigate = vi.fn();
vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

// Mock Supabase auth calls
vi.mock("@supabase/supabase-js", () => ({
  createClient: () => ({
    auth: {
      signInWithPassword: vi.fn().mockResolvedValue({
        data: { user: { id: "1", email: "test@example.com" } },
        error: null,
      }),
      signUp: vi.fn().mockResolvedValue({
        data: { user: { id: "1", email: "test@example.com" } },
        error: null,
      }),
    },
  }),
}));

describe("Authentication", () => {
  const wrapper = ({ children }) => (
    <BrowserRouter>
      <AuthProvider>{children}</AuthProvider>
    </BrowserRouter>
  );

  describe("Login", () => {
    it("renders login form", () => {
      render(<Login />, { wrapper });
      expect(screen.getByText("Welcome Back")).toBeInTheDocument();
      expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    });

    it("handles successful login", async () => {
      render(<Login />, { wrapper });

      fireEvent.change(screen.getByLabelText(/email/i), {
        target: { value: "test@example.com" },
      });
      fireEvent.change(screen.getByLabelText(/password/i), {
        target: { value: "password123" },
      });

      fireEvent.click(screen.getByText(/sign in/i));

      await waitFor(() => {
        expect(mockNavigate).toHaveBeenCalledWith("/dashboard");
      });
    });
  });

  describe("Register", () => {
    it("renders registration form", () => {
      render(<Register />, { wrapper });
      expect(screen.getByText("Create an Account")).toBeInTheDocument();
      expect(screen.getByLabelText(/full name/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/^password$/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/confirm password/i)).toBeInTheDocument();
    });

    it("validates password match", async () => {
      render(<Register />, { wrapper });

      fireEvent.change(screen.getByLabelText(/full name/i), {
        target: { value: "Test User" },
      });
      fireEvent.change(screen.getByLabelText(/email/i), {
        target: { value: "test@example.com" },
      });
      fireEvent.change(screen.getByLabelText(/^password$/i), {
        target: { value: "password123" },
      });
      fireEvent.change(screen.getByLabelText(/confirm password/i), {
        target: { value: "password124" },
      });

      fireEvent.click(screen.getByText(/register/i));

      await waitFor(() => {
        expect(screen.getByText(/passwords don't match/i)).toBeInTheDocument();
      });
    });
  });
});
