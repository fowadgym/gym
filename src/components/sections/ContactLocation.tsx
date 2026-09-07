import { Phone, MapPin, Mail, Clock } from 'lucide-react';

export function ContactLocation() {
  return (
    <section id="contact" className="py-20 bg-neutral-950">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-black uppercase text-white mb-4 tracking-tight">
            المقر & <span className="text-amber-500">الجدول</span>
          </h2>
          <p className="text-zinc-400 max-w-2xl mx-auto">
            ابحث عنا. تدرب معنا. لا أعذار.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
          
          {/* Schedule & Contact Info */}
          <div className="flex flex-col gap-8">
            <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-8">
              <h3 className="text-2xl font-bold text-white uppercase tracking-wider mb-6 flex items-center gap-3">
                <Clock className="text-amber-500" />
                ساعات العمل
              </h3>
              <ul className="flex flex-col gap-4 text-zinc-300">
                <li className="flex justify-between items-center border-b border-neutral-800 pb-3">
                  <span className="font-semibold">كل أيام الأسبوع</span>
                  <span>10:00 ص - 10:00 م</span>
                </li>
                <li className="flex justify-between items-center pt-2">
                  <span className="font-semibold text-amber-500">الجمعة</span>
                  <span className="text-amber-500">مغلق</span>
                </li>
              </ul>
            </div>

            <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-8">
              <h3 className="text-2xl font-bold text-white uppercase tracking-wider mb-6">
                تواصل معنا
              </h3>
              <div className="flex flex-col gap-4">
                <a href="#" className="flex items-center gap-4 text-zinc-300 hover:text-amber-500 transition-colors group">
                  <div className="p-3 bg-neutral-950 rounded-full group-hover:bg-amber-500/10">
                    <MapPin className="text-amber-500" size={20} />
                  </div>
                  <span className="font-medium">كركوك - حي الواسطي - مقابل دائرة المعوقين</span>
                </a>
              </div>
            </div>
          </div>

          {/* Embed Map */}
          <div className="w-full h-full min-h-[400px] aspect-video lg:aspect-auto rounded-2xl overflow-hidden border border-neutral-800 relative">
            <iframe 
              src="https://maps.google.com/maps?q=35.41806934732523,44.356789874861555&t=&z=15&ie=UTF8&iwloc=&output=embed" 
              className="absolute inset-0 w-full h-full border-0" 
              allowFullScreen={false} 
              loading="lazy" 
              referrerPolicy="no-referrer-when-downgrade"
              title="Gym Location Map"
            ></iframe>
          </div>

        </div>
      </div>
    </section>
  );
}
