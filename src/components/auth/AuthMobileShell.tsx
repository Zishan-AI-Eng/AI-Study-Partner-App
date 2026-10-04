import Logo from "@/components/brand/Logo";

export default function AuthMobileShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-dvh flex-col px-5 pb-[calc(1.25rem+env(safe-area-inset-bottom))] pt-[calc(1.25rem+env(safe-area-inset-top))] lg:hidden">
      <div className="flex flex-1 flex-col">
        <div className="flex flex-col items-center text-center">
          <Logo />
        </div>
        <div className="auth-mobile-content flex min-h-0 flex-1 flex-col pt-[clamp(2rem,8vh,4.5rem)] text-center">
          {children}
        </div>
      </div>
    </div>
  );
}
