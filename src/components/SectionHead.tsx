import type { ReactNode } from "react";

type Props = {
  num: string;
  label: string;
  children: ReactNode;
};

export function SectionHead({ num, label, children }: Props) {
  return (
    <div
      className="
        mb-8 grid grid-cols-1 items-start gap-3 border-b border-white/[0.08] pb-6 text-center
        min-[700px]:mb-10 min-[700px]:gap-4 min-[700px]:pb-8
        min-[800px]:items-end min-[800px]:gap-12 min-[800px]:text-left min-[800px]:[grid-template-columns:200px_1fr]
        min-[900px]:mb-16 min-[900px]:pb-14
      "
    >
      <div className="font-display text-xs font-medium text-gray-500 min-[700px]:text-sm">
        <span className="text-accent">{num}</span>
        &nbsp;— {label}
      </div>
      <h2
        className="m-0 font-display font-semibold leading-[1.02] tracking-[-0.02em] text-white"
        style={{
          fontSize: "clamp(32px, 5.2vw, 76px)",
          textWrap: "pretty" as never,
        }}
      >
        {children}
      </h2>
    </div>
  );
}
