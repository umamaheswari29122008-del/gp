import { MessageCircle } from 'lucide-react';
import { useContent } from '../context/ContentContext';

export function WhatsAppButton() {
  const { site } = useContent();
  return (
    <a
      href={site.whatsapp_number}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 px-4 py-3 rounded-2xl bg-green-500 text-white font-semibold text-sm shadow-2xl shadow-green-500/40 hover:bg-green-400 hover:shadow-green-400/50 hover:-translate-y-1 transition-all duration-300"
    >
      <MessageCircle className="w-5 h-5" />
      <span className="hidden sm:inline">WhatsApp Us</span>
    </a>
  );
}
