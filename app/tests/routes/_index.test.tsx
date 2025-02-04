import { vi } from "vitest";
import { useActionData } from "@remix-run/react";

// Mock setup must come before other imports
vi.mock("@remix-run/react", () => ({
  useActionData: vi.fn(),
  Form: ({ children, ...props }: any) => <form {...props}>{children}</form>,
  useNavigate: () => vi.fn(),
  useSubmit: () => vi.fn(),
  useLoaderData: vi.fn(),
  useDataRouterState: () => ({
    navigation: {
      state: "idle",
      location: undefined,
      formMethod: undefined,
      formAction: undefined,
      formEncType: undefined,
      formData: undefined,
    },
    location: { pathname: "/" },
    loaderData: {},
    actionData: null,
    errors: null,
  }),
  useNavigation: () => ({
    state: "idle",
    formData: null,
    location: undefined,
  }),
  useLocation: () => ({ pathname: "/" }),
  useMatches: () => [],
}));

vi.mock("~/.server/session", () => ({
  createUserSession: vi.fn(),
  getUserId: vi.fn(),
}));

vi.mock("~/.server/user", () => ({
  verifyLogin: vi.fn(),
}));

// Add mock for translation utility
vi.mock('~/src/utils/translate', () => ({
  t: (key: string) => {
    const translations: Record<string, string> = {
      'auth.errors.invalidCredentials': 'Invalid credentials',
      'auth.errors.credentialsRequired': 'Email and password are required'
    };
    return translations[key] || key;
  }
}));

// Now we can do our imports
import { render, screen, fireEvent } from "@testing-library/react";
import { redirect } from "@remix-run/node";
import { action, loader } from "~/routes/_index";
import Login from "~/routes/_index";

describe("Login Page", () => {
  describe("loader", () => {
    it("redirects to dashboard if user is already logged in", async () => {
      const { getUserId } = await import("~/.server/session");
      vi.mocked(getUserId).mockResolvedValueOnce(1);
      const request = new Request("http://localhost:3000/");
      const response = await loader({ request, context: {}, params: {} });

      expect(response).toEqual(redirect("/dashboard"));
    });

    it("returns null if user is not logged in", async () => {
      const { getUserId } = await import("~/.server/session");
      vi.mocked(getUserId).mockResolvedValueOnce(null);
      const request = new Request("http://localhost:3000/");
      const response = await loader({ request, context: {}, params: {} });

      expect(response).toBeNull();
    });
  });

  describe("action", () => {
    it("returns error for invalid credentials", async () => {
      const { verifyLogin } = await import("~/.server/user");
      vi.mocked(verifyLogin).mockResolvedValueOnce(null);

      const formData = new FormData();
      formData.append("email", "test@example.com");
      formData.append("password", "wrongpassword");

      const request = new Request("http://localhost:3000/", {
        method: "POST",
        body: formData,
      });

      const response = await action({ request, context: {}, params: {} });
      const responseData = await response.json();
      
      expect(responseData).toEqual({ error: 'Invalid credentials' });
      expect(response.status).toBe(400);
    });

    it("creates user session on successful login", async () => {
      const { verifyLogin } = await import("~/.server/user");
      const { createUserSession } = await import("~/.server/session");

      vi.mocked(verifyLogin).mockResolvedValueOnce({
        id: 1,
        email: "test@example.com",
        firstName: "Test",
        lastName: "User",
        phone: null,
      });
      vi.mocked(createUserSession).mockResolvedValueOnce(
        redirect("/dashboard")
      );

      const formData = new FormData();
      formData.append("email", "test@example.com");
      formData.append("password", "correctpassword");

      const request = new Request("http://localhost:3000/", {
        method: "POST",
        body: formData,
      });

      await action({ request, context: {}, params: {} });

      expect(createUserSession).toHaveBeenCalledWith(1, "/dashboard");
    });
  });

  describe("Login Component", () => {
    it("renders login form", () => {
      render(<Login />);

      expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
      expect(
        screen.getByRole("button", { name: /login/i })
      ).toBeInTheDocument();
    });

    it("displays error message when provided", () => {
      (useActionData as jest.Mock).mockReturnValue({
        error: "Test error message",
      });

      render(<Login />);
      expect(screen.getByText("Test error message")).toBeInTheDocument();
    });

    it("updates form fields on user input", () => {
      render(<Login />);

      const emailInput = screen.getByLabelText(/email/i);
      const passwordInput = screen.getByLabelText(/password/i);

      fireEvent.change(emailInput, { target: { value: "test@example.com" } });
      fireEvent.change(passwordInput, { target: { value: "password123" } });

      expect(emailInput).toHaveValue("test@example.com");
      expect(passwordInput).toHaveValue("password123");
    });
  });
});
