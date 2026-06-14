import React from 'react';
import { X } from 'lucide-react';

interface RegistrationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const RegistrationModal = ({ isOpen, onClose }: RegistrationModalProps) => {
  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/50 p-4 backdrop-blur-sm"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
    >
      <div 
        className="w-full max-w-md sm:w-96 rounded-2xl bg-card p-6 shadow-2xl max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-6 flex items-start justify-between">
          <div className="text-left">
            <h2 className="text-2xl font-bold font-serif text-foreground">Pendaftaran Siswa Baru</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Informasi pendaftaran kelas VII SMP PUI HAURGEULIS — isi formulir resmi atau hubungi Tata Usaha.
            </p>
          </div>
          <button
            onClick={onClose}
            className="rounded-full bg-secondary p-2 text-foreground hover:bg-secondary/80 transition-colors"
            aria-label="Tutup modal"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="flex flex-col gap-4">
          <a
            href="#kontak"
            onClick={onClose}
            className="flex items-center justify-center rounded-lg bg-primary px-6 py-3 text-primary-foreground transition hover:bg-primary/90 font-semibold text-center"
          >
            Hubungi Tata Usaha &amp; Jadwal Pendaftaran
          </a>
          <p className="text-center text-xs text-muted-foreground">
            Ganti tautan di atas dengan formulir Google Forms resmi sekolah bila sudah tersedia.
          </p>
        </div>

        <button
          onClick={onClose}
          className="mt-6 w-full text-sm text-muted-foreground hover:text-foreground underline transition-colors"
        >
          Tutup
        </button>
      </div>
    </div>
  );
};

export default RegistrationModal;
