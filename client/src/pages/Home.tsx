import { Button } from "@/components/ui/button";
import { Mail, MessageCircle } from "lucide-react";

export default function Home() {
  const whatsappNumber = "56934072459";
  const email = "vgarcesb@gmail.com";
  const domain = "totis.cl";

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background with 3D blue gradient */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-blue-100 to-blue-200"></div>
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>

      {/* Main Card */}
      <div className="relative z-10 max-w-md w-full">
        <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl p-8 md:p-10 space-y-8 border border-white/20">
          {/* Profile Section */}
          <div className="space-y-6 text-center">
            {/* Avatar with 3D effect */}
            <div className="flex justify-center">
              <div className="relative w-32 h-32">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full blur-xl opacity-50"></div>
                <div className="relative w-32 h-32 bg-gradient-to-br from-blue-500 to-blue-700 rounded-full flex items-center justify-center shadow-2xl border-4 border-white transform hover:scale-105 transition-transform duration-300">
                  <div className="text-5xl font-bold text-white">T</div>
                </div>
              </div>
            </div>

            {/* Name and Title */}
            <div className="space-y-2">
              <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
                Toti's
              </h1>
              <p className="text-lg md:text-xl font-semibold text-slate-700">
                Systems Developer
              </p>
            </div>

            {/* Description */}
            <p className="text-slate-600 text-base md:text-lg leading-relaxed">
              Troubleshooting Assistance | Full Stack
            </p>
          </div>

          {/* Contact Buttons Section */}
          <div className="space-y-4">
            {/* WhatsApp Button with 3D effect - Green */}
            <a
              href={`https://wa.me/${whatsappNumber}`}
              target="_blank"
              rel="noopener noreferrer"
              className="group relative block w-full"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-green-400 to-green-500 rounded-2xl blur-lg opacity-75 group-hover:opacity-100 transition-opacity duration-300"></div>
              <button className="relative w-full bg-white text-green-600 py-4 px-6 rounded-2xl font-bold text-lg flex items-center justify-center gap-3 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 active:scale-95 border-2 border-green-500">
                <MessageCircle size={24} />
                <span>WhatsApp</span>
              </button>
            </a>

            {/* Email Button with 3D effect - Blue */}
            <a
              href={`mailto:${email}`}
              className="group relative block w-full"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-blue-600 rounded-2xl blur-lg opacity-75 group-hover:opacity-100 transition-opacity duration-300"></div>
              <button className="relative w-full bg-white text-blue-600 py-4 px-6 rounded-2xl font-bold text-lg flex items-center justify-center gap-3 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 active:scale-95 border-2 border-blue-500">
                <Mail size={24} />
                <span>Email</span>
              </button>
            </a>
          </div>

          {/* Accent Elements with 3D Colors */}
          <div className="flex justify-center gap-4 pt-4">
            {/* Red 3D accent */}
            <div className="w-3 h-3 rounded-full bg-gradient-to-br from-red-400 to-red-600 shadow-lg transform hover:scale-125 transition-transform duration-300"></div>
            {/* Yellow 3D accent */}
            <div className="w-3 h-3 rounded-full bg-gradient-to-br from-yellow-400 to-yellow-600 shadow-lg transform hover:scale-125 transition-transform duration-300"></div>
            {/* Blue 3D accent */}
            <div className="w-3 h-3 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 shadow-lg transform hover:scale-125 transition-transform duration-300"></div>
          </div>

          {/* Footer */}
          <div className="pt-4 border-t border-slate-200">
            <p className="text-center text-slate-500 text-sm">
              © 2024 <span className="font-semibold text-slate-700">{domain}</span>
            </p>
          </div>
        </div>
      </div>

      {/* Floating decorative elements */}
      <div className="absolute top-10 right-10 w-20 h-20 bg-red-400 rounded-lg opacity-10 blur-xl animate-float"></div>
      <div className="absolute bottom-20 left-10 w-32 h-32 bg-yellow-400 rounded-full opacity-10 blur-2xl animate-float animation-delay-3000"></div>
    </div>
  );
}
