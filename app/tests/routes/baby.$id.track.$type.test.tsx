import { render, screen, fireEvent } from "@testing-library/react";
import { createRemixStub } from "@remix-run/testing";
import { vi, expect, describe, test } from "vitest";
import TrackEvent from "~/routes/baby.$id.track.$type";
import "@testing-library/jest-dom/vitest";
import { json } from "@remix-run/node";

const mockNavigate = vi.fn();

vi.mock("@remix-run/react", async () => {
  const actual = await vi.importActual("@remix-run/react");
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

describe("TrackEvent Component", () => {
  const mockBaby = {
    id: 1,
    firstName: "Test",
    lastName: "Baby",
  };

  function ErrorBoundary() {
    return <div>Error!</div>;
  }

  test("closes modal on escape key", async () => {
    const RemixStub = createRemixStub([
      {
        path: "/baby/:id/track/:type",
        Component: TrackEvent,
        ErrorBoundary,
        loader: async () =>
          json({
            baby: mockBaby,
            trackingConfig: {
              title: "Feeding",
              fields: [
                {
                  id: "timestamp",
                  label: "When",
                  type: "datetime-local",
                  required: true,
                },
              ],
            },
          }),
      },
    ]);

    render(<RemixStub initialEntries={["/baby/1/track/feeding"]} />);

    await screen.findByText("Track Feeding");
    fireEvent.keyDown(document, { key: "Escape", code: "Escape" });
    expect(mockNavigate).toHaveBeenCalledWith("/baby/1");
  });

  test("closes modal on clicking close button", async () => {
    const RemixStub = createRemixStub([
      {
        path: "/baby/:id/track/:type",
        Component: TrackEvent,
        ErrorBoundary,
        loader: async () =>
          json({
            baby: mockBaby,
            trackingConfig: {
              title: "Feeding",
              fields: [
                {
                  id: "timestamp",
                  label: "When",
                  type: "datetime-local",
                  required: true,
                },
              ],
            },
          }),
      },
    ]);

    render(<RemixStub initialEntries={["/baby/1/track/feeding"]} />);

    await screen.findByText("Track Feeding");
    fireEvent.click(screen.getByLabelText("close"));
    expect(mockNavigate).toHaveBeenCalledWith("/baby/1");
  });
});
