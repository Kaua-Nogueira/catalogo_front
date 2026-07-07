import { createFileRoute, redirect } from "@tanstack/react-router";
import { AdminLayout } from "@/components/admin/admin-layout";
import { useAuth } from "@/stores/auth";

export const Route = createFileRoute("/admin")({
  beforeLoad: () => {
    if (typeof window !== "undefined" && !useAuth.getState().token) {
      throw redirect({ to: "/login" });
    }
  },
  head: () => ({
    meta: [{ title: "Admin — Nimbus Store" }, { name: "robots", content: "noindex" }],
  }),
  component: AdminLayout,
});
