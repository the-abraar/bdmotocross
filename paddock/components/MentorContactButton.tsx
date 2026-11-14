import React from "react";

interface MentorContactButtonProps {
  mentorName: string;
  whatsappNumber?: string;
}

export function MentorContactButton({
  mentorName,
  whatsappNumber = "+8801975376114",
}: MentorContactButtonProps) {
  const cleanNumber = whatsappNumber.replace(/[^0-9]/g, "");
  const text = encodeURIComponent(
    `Hello BMCA, I would like to book a coaching session with mentor ${mentorName}.`
  );

  return (
    <a
      href={`https://wa.me/${cleanNumber}?text=${text}`}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold rounded-lg shadow-md transition-colors"
    >
      <span>Contact Mentor on WhatsApp</span>
    </a>
  );
}
