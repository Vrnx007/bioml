import { Suspense } from "react";
import { LoginForm } from "./login-form";

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="ui-container py-24 text-text-muted">…</div>}>
      <LoginForm />
    </Suspense>
  );
}
