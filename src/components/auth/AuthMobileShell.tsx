import Logo from "@/components/brand/Logo";

export default function AuthMobileShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-dvh min-w-0 w-full flex-col px-0 pb-[calc(1.25rem+env(safe-area-inset-bottom))] pt-[calc(1rem+env(safe-area-inset-top))] lg:hidden">
      <div className="flex min-w-0 flex-1 flex-col">
        <div className="flex flex-col items-center text-center">
          <Logo />
        </div>
        <div className="auth-mobile-content mx-auto flex min-h-0 min-w-0 w-full max-w-[380px] flex-1 flex-col pt-[clamp(1.75rem,6vh,3.5rem)] text-center">
          {children}
        </div>
      </div>
    </div>
  );
}
