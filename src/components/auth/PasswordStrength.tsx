export default function PasswordStrength({ password }: { password: string }) {
  const score = Number(password.length >= 6) + Number(password.length >= 10) + Number(/[A-Z]/.test(password)) + Number(/[0-9]/.test(password));
  const labels = ["", "Weak", "Fair", "Good", "Strong"];
  const tone = score <= 1 ? "var(--danger)" : score === 2 ? "var(--warning)" : "var(--success)";
  return (
    <div className="mt-2" aria-live="polite">
      <div className="flex gap-1" aria-hidden="true">
        {[0, 1, 2, 3].map((segment) => <span key={segment} className="h-1 flex-1 rounded-full bg-[var(--surface-muted)]" style={segment < score ? { backgroundColor: tone } : undefined} />)}
      </div>
      <div className="mt-1 flex items-center justify-between text-xs text-[var(--muted)]">
        {!password ? <span>Use at least 6 characters.</span> : <span>{labels[score]}</span>}
      </div>
    </div>
  );
}

