import { STATUS_LABELS, type RequestStatus } from "@contracts/naeya";

const STYLES: Record<RequestStatus, string> = {
  RECUE: "bg-[#173DFF]/10 text-[#173DFF] border-[#173DFF]/30",
  EN_ETUDE: "bg-[#F08A24]/15 text-[#9A5410] border-[#F08A24]/40",
  DOCUMENTS_ATTENDUS: "bg-[#F08A24]/15 text-[#9A5410] border-[#F08A24]/40",
  EN_INSTRUCTION: "bg-[#173DFF]/10 text-[#173DFF] border-[#173DFF]/30",
  FINALISEE: "bg-[#17233D] text-[#F1EBDD] border-[#17233D]",
  REJETEE: "bg-[#B42318]/10 text-[#B42318] border-[#B42318]/30",
};

export default function StatusBadge({ status }: { status: RequestStatus }) {
  return (
    <span
      className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold ${STYLES[status]}`}
    >
      {STATUS_LABELS[status]}
    </span>
  );
}
