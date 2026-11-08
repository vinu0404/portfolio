import DecryptedText from "@/components/reactbits/DecryptedText";

export default function SectionLabel({ index, text }: { index: string; text: string }) {
  return (
    <p className="label flex items-center gap-3">
      <span className="text-cyan">{index}</span>
      <span aria-hidden="true" className="h-px w-8 bg-line-strong" />
      <DecryptedText text={text} />
    </p>
  );
}
