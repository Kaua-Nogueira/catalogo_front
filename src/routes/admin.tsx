import { createFileRoute } from "@tanstack/react-router";
import { AdminLayout } from "@/components/admin/admin-layout";

export const Route = createFileRoute("/admin")({
  head: () => ({ meta: [{ title: "Admin — Nimbus Store" }, { name: "robots", content: "noindex" }] }),
  component: AdminLayout,
});
