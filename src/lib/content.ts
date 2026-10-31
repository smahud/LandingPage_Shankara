export type Lang = "id" | "en";
export type L = { id: string; en: string };

export const CONTACT = {
  phoneDisplay: "+62 877-4276-5221",
  phoneHref: "tel:+6287742765221",
  waMain: "6287742765221",
  waService: "62895337256877",
  address: {
    line: "Jalan Lingkar Barat, Kehutanan, Kec. Batu, Kota Batu, Jawa Timur 65311",
    short: "Kota Batu, Jawa Timur",
  },
  mapsUrl:
    "https://www.google.com/maps/search/?api=1&query=Shankara+Wellness+%26+Sanctuary+Jalan+Lingkar+Barat+Kehutanan+Kota+Batu",
};

/** Build a WhatsApp deep-link with a pre-filled message (same pattern as the original site). */
export function waLink(number: string, message: string) {
  return `https://wa.me/${number}?text=${encodeURIComponent(message)}`;
}

export const WA_MESSAGES = {
  general: {
    id: "Halo Shankara Wellness & Sanctuary, saya ingin konsultasi terkait program wellness yang sesuai dengan kebutuhan saya. Mohon bantuannya untuk mendapatkan rekomendasi program yang tepat",
    en: "Hello Shankara Wellness & Sanctuary, I would like to consult about the wellness program that suits my needs. Please help me get the right program recommendation",
  },
  glamping: {
    id: "Halo Shankara Wellness & Sanctuary, saya tertarik dengan program Wellness & Glamping Experience. Boleh info lebih lanjut terkait detail program, fasilitas, dan jadwal yang tersedia?",
    en: "Hello Shankara Wellness & Sanctuary, I am interested in the Wellness & Glamping Experience program. Could I get more details about the program, facilities, and available schedule?",
  },
  reflexology: {
    id: "Halo Shankara Wellness & Sanctuary, saya ingin konsultasi untuk Reflexology & Healing Therapy. Boleh dibantu info terkait manfaat, proses, dan ketersediaan jadwal?",
    en: "Hello Shankara Wellness & Sanctuary, I would like to consult about Reflexology & Healing Therapy. Could you share the benefits, process, and schedule availability?",
  },
  yoga: {
    id: "Halo Shankara Wellness & Sanctuary, saya tertarik mengikuti Yoga & Meditation Program. Boleh info jadwal, program, dan cara bergabung?",
    en: "Hello Shankara Wellness & Sanctuary, I am interested in joining the Yoga & Meditation Program. Could you share the schedule, program, and how to join?",
  },
  workshop: {
    id: "Halo Shankara Wellness & Sanctuary, saya tertarik dengan program Workshop & Self Development. Apakah ada jadwal terdekat dan detail materinya?",
    en: "Hello Shankara Wellness & Sanctuary, I am interested in the Workshop & Self Development program. Are there any upcoming schedules and material details?",
  },
  program: {
    id: "Halo Shankara Wellness & Sanctuary, saya tertarik dengan Self Transformation Program (All-in). Boleh info detail paket 2 hari 1 malam, 3 hari 2 malam, dan 1 minggu?",
    en: "Hello Shankara Wellness & Sanctuary, I am interested in the Self Transformation Program (All-in). Could you share details about the 2-day, 3-day, and 1-week packages?",
  },
};

export const NAV: { id: string; label: L }[] = [
  { id: "home", label: { id: "Beranda", en: "Home" } },
  { id: "about", label: { id: "Tentang", en: "About" } },
  { id: "services", label: { id: "Layanan", en: "Services" } },
  { id: "program", label: { id: "Program", en: "Program" } },
  { id: "gallery", label: { id: "Galeri", en: "Gallery" } },
  { id: "contact", label: { id: "Kontak", en: "Contact" } },
];

export const UI = {
  book: { id: "Book An Appointment", en: "Book An Appointment" },
  seeMore: { id: "Lihat Selengkapnya", en: "See More" },
  close: { id: "Tutup", en: "Close" },
  viaWa: { id: "Booking via WhatsApp", en: "Book via WhatsApp" },
  callUs: { id: "Hubungi Kami", en: "Call Us" },
  facilities: { id: "Fasilitas", en: "Facilities" },
  capacity: { id: "Kapasitas", en: "Capacity" },
  size: { id: "Luas", en: "Size" },
  startingFrom: { id: "Mulai dari", en: "Starting from" },
  servicesLabel: { id: "Layanan", en: "Services" },
  benefits: { id: "Manfaat", en: "Benefits" },
};

export const HERO = {
  eyebrow: { id: "Wellness & Sanctuary · Kota Batu", en: "Wellness & Sanctuary · Batu City" },
  title1: { id: "Experience Your", en: "Experience Your" },
  title2: { id: "Self-Upgrade", en: "Self-Upgrade" },
  desc: {
    id: "Temukan kembali keseimbangan tubuh, ketenangan pikiran, dan kejernihan jiwa melalui pengalaman wellness terpadu yang dirancang khusus untuk dirimu.",
    en: "Rediscover body balance, peace of mind, and clarity of soul through an integrated wellness experience designed just for you.",
  },
  cta2: {
    id: "Jelajahi Layanan",
    en: "Explore Services",
  },
  scroll: { id: "Gulir ke bawah", en: "Scroll down" },
};

export const MARQUEE: L[] = [
  { id: "Keseimbangan Tubuh", en: "Body Balance" },
  { id: "Ketenangan Pikiran", en: "Peace of Mind" },
  { id: "Kejernihan Jiwa", en: "Clarity of Soul" },
  { id: "Pendekatan Holistik", en: "Holistic Approach" },
  { id: "Menyatu dengan Alam", en: "One with Nature" },
  { id: "Transformasi Nyata", en: "Real Transformation" },
];

export const ABOUT = {
  eyebrow: { id: "Tentang Kami", en: "About Us" },
  title: { id: "Well-Being-mu adalah Komitmen Kami", en: "Your Well-Being is Our Commitment" },
  subtitle: {
    id: "Ruang Transformasi untuk Keseimbangan Hidup",
    en: "A Transformation Space for Life Balance",
  },
  body1: {
    id: "Shankara Wellness & Sanctuary hadir sebagai ruang untuk kembali mengenal diri dan memulihkan keseimbangan hidup secara utuh. Kami percaya bahwa kesehatan sejati tidak hanya tentang tubuh yang bugar, tetapi juga pikiran yang tenang dan jiwa yang selaras. Oleh karena itu, setiap program dirancang dengan pendekatan personal dan holistik, menyesuaikan dengan kebutuhan unik setiap individu.",
    en: "Shankara Wellness & Sanctuary exists as a space to reconnect with yourself and restore life balance as a whole. We believe true health is not only about a fit body, but also a calm mind and a soul in harmony. Therefore, every program is designed with a personal and holistic approach, tailored to each individual's unique needs.",
  },
  storyTitle: { id: "Awal Perjalanan Kami", en: "How It All Began" },
  story1: {
    id: "Shankara didirikan dari kesadaran bahwa banyak orang menjalani hidup dalam tekanan, kelelahan, dan kehilangan arah — tanpa benar-benar memahami akar permasalahannya.",
    en: "Shankara was founded on the awareness that many people live under pressure, exhaustion, and lost direction — without truly understanding the root of their problems.",
  },
  story2: {
    id: "Berangkat dari visi untuk menghadirkan solusi yang lebih dalam dan bermakna, Shankara menggabungkan pendekatan ilmiah, praktik kesehatan alami, serta pengalaman berbasis alam untuk membantu setiap individu menemukan kembali keseimbangannya.",
    en: "Driven by a vision to offer a deeper, more meaningful solution, Shankara combines a scientific approach, natural health practices, and nature-based experiences to help each individual rediscover their balance.",
  },
  story3: {
    id: "Kami tidak hanya membantu orang merasa lebih baik, tetapi membantu mereka kembali menjadi versi terbaik dari dirinya.",
    en: "We do not merely help people feel better — we help them return to the best version of themselves.",
  },
  whyTitle: { id: "Kenapa Memilih Shankara", en: "Why Choose Shankara" },
  whyBody: {
    id: "Memilih Shankara berarti memilih perjalanan yang didukung oleh pendekatan yang tepat, bukan sekadar solusi instan. Kami menghadirkan pengalaman wellness yang terintegrasi dengan dukungan dari tim profesional yang terdiri dari ilmuwan, praktisi kesehatan, dan trainer berpengalaman.",
    en: "Choosing Shankara means choosing a journey supported by the right approach, not just an instant solution. We deliver an integrated wellness experience backed by a professional team of scientists, health practitioners, and experienced trainers.",
  },
  stats: [
    {
      value: 92,
      suffix: "%",
      title: { id: "Client Experience Improvement", en: "Client Experience Improvement" },
      desc: {
        id: "Sebagian besar peserta merasakan peningkatan signifikan dalam energi, ketenangan, dan kualitas hidup setelah mengikuti program.",
        en: "Most participants feel significant improvement in energy, calmness, and quality of life after completing a program.",
      },
    },
    {
      value: 88,
      suffix: "%",
      title: { id: "Sustainable Lifestyle Change", en: "Sustainable Lifestyle Change" },
      desc: {
        id: "Peserta mampu membangun kebiasaan sehat yang bertahan dalam jangka panjang.",
        en: "Participants build healthy habits that last over the long term.",
      },
    },
    {
      value: 82,
      suffix: "%",
      title: { id: "Deeper Self Awareness", en: "Deeper Self Awareness" },
      desc: {
        id: "Peserta mendapatkan pemahaman lebih dalam tentang diri, pola hidup, dan kebutuhan kesehatannya.",
        en: "Participants gain a deeper understanding of themselves, their lifestyle, and their health needs.",
      },
    },
  ],
};

export const SECTION_SERVICES = {
  eyebrow: { id: "Layanan", en: "Services" },
  title: { id: "Ciptakan hidup yang ingin kamu jalani", en: "Create the life you want to live" },
  desc: {
    id: "Empat pilar layanan holistik yang dirancang saling melengkapi — dari menginap di alam, terapi pemulihan, gerak & meditasi, hingga pengembangan diri.",
    en: "Four holistic service pillars designed to complement each other — from a nature stay, restorative therapy, movement & meditation, to self development.",
  },
};

export type ServiceItem = { name: L; desc: L };
export type Service = {
  id: string;
  title: L;
  short: L;
  tagline: L;
  price: L;
  priceNote: L;
  image: string;
  imageAlt: L;
  icon: "tent" | "hand" | "flower" | "sparkles";
  items: ServiceItem[];
  facilities: L[];
  extras?: { title: L; rows: { label: L; note: L }[] };
  waKey: keyof typeof WA_MESSAGES;
};

export const SERVICES: Service[] = [
  {
    id: "glamping",
    title: { id: "Wellness & Glamping Experience", en: "Wellness & Glamping Experience" },
    short: {
      id: "Rasakan ketenangan alam melalui pengalaman menginap yang dirancang untuk membantu tubuh dan pikiran kembali seimbang.",
      en: "Experience the serenity of nature through a stay designed to help your body and mind return to balance.",
    },
    tagline: {
      id: "Menginap di tengah alam untuk memulihkan energi, menjernihkan pikiran, dan mengembalikan keseimbangan hidup.",
      en: "Stay in the heart of nature to restore energy, clear the mind, and bring life back into balance.",
    },
    price: { id: "Mulai dari Rp 500.000", en: "Starting from Rp 500,000" },
    priceNote: { id: "per unit / malam", en: "per unit / night" },
    image: "/images/pyramid-white.webp",
    imageAlt: { id: "Bangunan piramida glamping Shankara", en: "Shankara pyramid glamping building" },
    icon: "tent",
    items: [
      {
        name: { id: "Pyramid Building", en: "Pyramid Building" },
        desc: {
          id: "Bangunan geometris piramida 5×5 (25 m²) berkapasitas 2–3 orang. Fasilitas: smart TV, mini yoga & meditation space, wi-fi, aromatherapy, organic shower amenities, dan free relaxation treatment. Bentuk piramida dipercaya menghimpun dan memperkuat energi — simbol kekuatan, stabilitas, dan fokus pada satu titik puncak — sehingga membantu percepatan healing dan balancing.",
          en: "A 5×5 (25 m²) geometric pyramid building for 2–3 guests. Facilities: smart TV, mini yoga & meditation space, wi-fi, aromatherapy, organic shower amenities, and a free relaxation treatment. The pyramid form is believed to gather and strengthen energy — a symbol of power, stability, and single-point focus — supporting faster healing and balancing.",
        },
      },
      {
        name: { id: "Tent", en: "Tent" },
        desc: {
          id: "Tenda 14 m² berkapasitas 3–7 orang. Fasilitas: mini bed set, mini projector, grill/BBQ set (add), bahan BBQ (add), api unggun (add). Konsep menyatu dengan alam sambil menjaga kenyamanan dan ketenangan — membantu proses grounding, pengendalian pikiran, dan releasing.",
          en: "A 14 m² tent for 3–7 guests. Facilities: mini bed set, mini projector, grill/BBQ set (add-on), BBQ ingredients (add-on), bonfire (add-on). Blending into nature while keeping you comfortable and calm — supporting grounding, mind control, and the releasing process.",
        },
      },
    ],
    facilities: [
      { id: "Smart TV & Wi-Fi", en: "Smart TV & Wi-Fi" },
      { id: "Mini Yoga & Meditation Space", en: "Mini Yoga & Meditation Space" },
      { id: "Aromatherapy & Organic Amenities", en: "Aromatherapy & Organic Amenities" },
      { id: "Free Relaxation Treatment", en: "Free Relaxation Treatment" },
      { id: "Grill/BBQ & Api Unggun (add-on)", en: "Grill/BBQ & Bonfire (add-on)" },
    ],
    waKey: "glamping",
  },
  {
    id: "reflexology",
    title: { id: "Reflexology & Healing Therapy", en: "Reflexology & Healing Therapy" },
    short: {
      id: "Terapi pemulihan yang membantu melancarkan energi tubuh, mengurangi ketegangan, dan meningkatkan kualitas kesehatan secara menyeluruh.",
      en: "A restorative therapy that improves the body's energy, reduces tension, and enhances overall health.",
    },
    tagline: {
      id: "Terapi pemulihan tubuh yang membantu melancarkan energi, meredakan ketegangan, dan meningkatkan kualitas kesehatan secara alami.",
      en: "Restorative body therapy that improves energy flow, eases tension, and naturally raises your health quality.",
    },
    price: { id: "Mulai dari Rp 150.000", en: "Starting from Rp 150,000" },
    priceNote: { id: "per sesi treatment", en: "per treatment session" },
    image: "/images/foot-massage.webp",
    imageAlt: { id: "Sesi refleksi kaki di Shankara", en: "Foot reflexology session at Shankara" },
    icon: "hand",
    items: [
      {
        name: { id: "Full Body Traditional Massage", en: "Full Body Traditional Massage" },
        desc: {
          id: "Torap relaksasi untuk melancarkan peredaran darah dan mengurangi ketegangan otot dari kepala sampai kaki.",
          en: "A relaxing stroke therapy to improve blood circulation and reduce muscle tension from head to toe.",
        },
      },
      {
        name: { id: "Full Body T. + R. Kepala", en: "Full Body T. + Head Reflexology" },
        desc: {
          id: "Refleksi kepala dengan teknik reflexology yang fokus pada titik refleksi di kepala, dahi, punggung, dan kulit kepala yang terhubung dengan organ tubuh dan sistem saraf.",
          en: "Head reflexology focusing on reflex points on the head, forehead, back, and scalp that are connected to body organs and the nervous system.",
        },
      },
      {
        name: { id: "Full Body T. + Urat", en: "Full Body T. + Nerve Pathways" },
        desc: {
          id: "Pijat tradisional yang fokus pada urat dan jalur saraf untuk mengatasi ketegangan, ketarik, atau tidak lancarnya aliran darah/energi di tubuh.",
          en: "A traditional massage focusing on nerve pathways and channels to resolve tension, strains, and blocked blood/energy flow.",
        },
      },
      {
        name: { id: "Full Body T. + R. Kaki", en: "Full Body T. + Foot Reflexology" },
        desc: {
          id: "Refleksi kaki dengan teknik pijat yang fokus pada titik refleksi di telapak kaki yang dipercaya terhubung dengan organ tubuh tertentu.",
          en: "Foot reflexology focusing on reflex points on the soles of the feet, believed to connect to specific body organs.",
        },
      },
      {
        name: { id: "Full Body T. + Kerokan Gua Sha", en: "Full Body T. + Gua Sha Scraping" },
        desc: {
          id: "Teknik tradisional dari Tiongkok yang menggosok kulit menggunakan alat khusus untuk melancarkan aliran darah dan energi tubuh.",
          en: "A traditional Chinese technique of rubbing the skin with a special tool to improve blood flow and body energy.",
        },
      },
      {
        name: { id: "Full Body T. + Turun Peranakan", en: "Full Body T. + Postpartum Care" },
        desc: {
          id: "Pijat tradisional yang membantu mengurangi ketidaknyamanan akibat melemahnya otot dan jaringan penyangga di panggul.",
          en: "A traditional massage that helps ease discomfort caused by weakened muscles and supporting tissues in the pelvic area.",
        },
      },
      {
        name: { id: "Full Body T. + Totok Punggung", en: "Full Body T. + Back Acupressure" },
        desc: {
          id: "Teknik terapi dengan penekanan pada titik tertentu di area punggung untuk melancarkan aliran energi saraf dan peredaran darah.",
          en: "A therapy applying pressure to specific back points to smooth nerve-energy flow and blood circulation.",
        },
      },
      {
        name: { id: "Full Body T. + Scrub Special", en: "Full Body T. + Scrub Special" },
        desc: {
          id: "Perawatan tubuh dengan lulur/scrub plus terapi khusus yang lebih lengkap untuk mengangkat sel kulit mati dan memberikan relaksasi.",
          en: "A body treatment with a special scrub plus more complete therapy to lift dead skin cells and provide deep relaxation.",
        },
      },
      {
        name: { id: "Full Body T. + Totok Wajah", en: "Full Body T. + Facial Acupressure" },
        desc: {
          id: "Perawatan dengan menekan titik akupresur di wajah untuk melancarkan peredaran darah, merelaksasi otot wajah, dan membantu kesehatan kulit.",
          en: "A treatment pressing facial acupressure points to boost circulation, relax facial muscles, and support skin health.",
        },
      },
    ],
    facilities: [
      { id: "Ruang Massage & Therapy", en: "Massage & Therapy Room" },
      { id: "Ruang Sauna & Jacuzzi", en: "Sauna & Jacuzzi Room" },
    ],
    waKey: "reflexology",
  },
  {
    id: "movement",
    title: { id: "Holistic Body Movement & Meditation", en: "Holistic Body Movement & Meditation" },
    short: {
      id: "Latihan kesadaran untuk menenangkan pikiran, memperkuat koneksi diri, dan menciptakan ketenangan dari dalam.",
      en: "Mindfulness exercises to calm the mind, strengthen self-connection, and create inner calm.",
    },
    tagline: {
      id: "Latihan kesadaran yang membantu menenangkan pikiran, mengurangi stres, dan memperkuat koneksi dengan diri sendiri.",
      en: "Mindful practice that calms the mind, lowers stress, and deepens your connection with yourself.",
    },
    price: { id: "Mulai dari Rp 150.000", en: "Starting from Rp 150,000" },
    priceNote: { id: "per kelas / sesi", en: "per class / session" },
    image: "/images/yoga-studio.webp",
    imageAlt: { id: "Kelas yoga dalam ruangan Shankara", en: "Indoor yoga class at Shankara" },
    icon: "flower",
    items: [
      {
        name: { id: "Latihan Pernafasan", en: "Breathing Practice" },
        desc: {
          id: "Melatih tubuh dengan gerakan dan pengaturan napas. Manfaat: kesehatan tubuh yang harmonis dan simultan, mengaktivasi 7 titik kelenjar hormon, serta menyeimbangkan aspek control–sensitivity–power.",
          en: "Training the body with movement and breath control. Benefits: whole-body harmony, activating and optimizing 7 hormone-gland points, and balancing control–sensitivity–power.",
        },
      },
      {
        name: { id: "Core & Flexibility Training", en: "Core & Flexibility Training" },
        desc: {
          id: "Fokus pada penguatan otot inti dan kelenturan tubuh. Manfaat: memperbaiki postur, mencegah sakit punggung, dan meningkatkan ruang gerak sendi.",
          en: "Focused on core strength and flexibility. Benefits: better posture, back-pain prevention, and greater joint range of motion.",
        },
      },
      {
        name: { id: "Latihan Beban / Weight Training", en: "Weight Training" },
        desc: {
          id: "Latihan menggunakan beban (seperti kettlebell) untuk melatih kekuatan otot. Manfaat: membentuk tonus otot, meningkatkan kepadatan tulang, dan mempercepat pembakaran lemak.",
          en: "Training with weights (such as kettlebells) to build strength. Benefits: muscle tone, better bone density, and faster fat burning.",
        },
      },
      {
        name: { id: "Cardio Boxing", en: "Cardio Boxing" },
        desc: {
          id: "Gerakan tinju dinamis yang mengombinasikan kekuatan dan kecepatan. Manfaat: pembakaran kalori tinggi, melatih koordinasi, dan sangat efektif sebagai sarana stress release.",
          en: "Dynamic boxing moves combining power and speed. Benefits: high calorie burn, better coordination, and a highly effective stress release.",
        },
      },
      {
        name: { id: "Mobility & Endurance", en: "Mobility & Endurance" },
        desc: {
          id: "Latihan untuk meningkatkan daya tahan dan kelincahan tubuh. Manfaat: meningkatkan stamina harian agar tidak mudah lelah dan menjaga kebugaran jantung.",
          en: "Exercises to build stamina and agility. Benefits: higher daily stamina, less fatigue, and better cardiovascular fitness.",
        },
      },
      {
        name: { id: "Meditasi Relaksasi", en: "Relaxation Meditation" },
        desc: {
          id: "Duduk bersila dengan posisi napas dan tubuh rileks. Manfaat: melatih rasa tenang dan damai untuk diimplementasikan dalam kehidupan sehari-hari.",
          en: "Sitting cross-legged with relaxed breath and posture. Benefits: cultivating calm and peace to carry into daily life.",
        },
      },
    ],
    facilities: [
      { id: "Ruang Yoga & Meditasi", en: "Yoga & Meditation Room" },
      { id: "Taman / Lapangan Senam", en: "Garden / Exercise Field" },
    ],
    waKey: "yoga",
  },
  {
    id: "workshop",
    title: { id: "Workshop & Self Development", en: "Workshop & Self Development" },
    short: {
      id: "Program pengembangan diri seperti public speaking, mindset, dan kesadaran diri untuk membantu kamu bertumbuh secara personal dan profesional.",
      en: "Self-development programs such as public speaking, mindset, and self-awareness to help you grow personally and professionally.",
    },
    tagline: {
      id: "Program pengembangan diri yang dirancang untuk membantu kamu bertumbuh secara personal maupun profesional.",
      en: "Self-development programs designed to help you grow both personally and professionally.",
    },
    price: { id: "Mulai dari Rp 250.000", en: "Starting from Rp 250,000" },
    priceNote: { id: "per workshop", en: "per workshop" },
    image: "/images/workshop-audience.webp",
    imageAlt: { id: "Workshop pengembangan diri Shankara", en: "Self development workshop at Shankara" },
    icon: "sparkles",
    items: [
      {
        name: { id: "Pelatihan Public Speaking", en: "Public Speaking Training" },
        desc: {
          id: "Latihan berbicara di depan umum untuk membangun kepercayaan diri, struktur pesan yang jelas, dan kehadiran yang tenang.",
          en: "Public speaking practice to build confidence, clear message structure, and a calm stage presence.",
        },
      },
      {
        name: { id: "Pelatihan Mekanika & Robotika", en: "Mechanics & Robotics Training" },
        desc: {
          id: "Pelatihan keterampilan praktis mekanika dan robotika untuk mengasah logika, kreativitas, dan kemampuan problem solving.",
          en: "Hands-on mechanics and robotics training to sharpen logic, creativity, and problem-solving skills.",
        },
      },
      {
        name: { id: "Pelatihan Eco Enzyme", en: "Eco Enzyme Training" },
        desc: {
          id: "Pelatihan membuat eco enzyme dari limbah organik rumah tangga — gaya hidup ramah lingkungan yang bisa langsung dipraktikkan.",
          en: "Training to make eco enzyme from household organic waste — a sustainable lifestyle you can practice right away.",
        },
      },
    ],
    facilities: [
      { id: "Aula 15×5 m (75 m²)", en: "Hall 15×5 m (75 m²)" },
      { id: "Kapasitas hingga 50 orang", en: "Capacity up to 50 people" },
    ],
    waKey: "workshop",
  },
];

export const PROGRAM = {
  eyebrow: { id: "Program Andalan", en: "Signature Program" },
  title: { id: "Self Transformation Program", en: "Self Transformation Program" },
  badge: { id: "All-in Program", en: "All-in Program" },
  desc: {
    id: "Program terpadu yang menggabungkan seluruh pilar Shankara — menginap, terapi, gerak & meditasi, dan workshop — dalam satu perjalanan transformasi yang dipandu tim profesional.",
    en: "An integrated program combining all Shankara pillars — stay, therapy, movement & meditation, and workshops — in one guided transformation journey.",
  },
  note: {
    id: "Booking via WhatsApp admin",
    en: "Booking via WhatsApp admin",
  },
  durations: [
    { id: "2 Hari 1 Malam", en: "2 Days 1 Night" },
    { id: "3 Hari 2 Malam", en: "3 Days 2 Nights" },
    { id: "1 Minggu", en: "1 Week" },
  ],
  cta: { id: "Konsultasi Program", en: "Consult The Program" },
  image: "/images/meditation.webp",
  imageAlt: { id: "Meditasi di taman Shankara", en: "Meditation in the Shankara garden" },
};

export const GALLERY = {
  eyebrow: { id: "Galeri", en: "Gallery" },
  title: { id: "Suasana Shankara", en: "Life at Shankara" },
  desc: {
    id: "Sekilas suasana sanctuary kami — dari bangunan piramida, tenda alami, ruang terapi, hingga area workshop.",
    en: "A glimpse of our sanctuary — from pyramid buildings and natural tents to therapy rooms and workshop spaces.",
  },
  items: [
    { src: "/images/hero-yoga.webp", alt: { id: "Yoga di taman terbuka", en: "Outdoor yoga on the lawn" } },
    { src: "/images/pyramid-white.webp", alt: { id: "Piramida glamping putih", en: "White glamping pyramid" } },
    { src: "/images/tent-lounge.webp", alt: { id: "Tenda lounge di taman", en: "Garden lounge tent" } },
    { src: "/images/garden-path.webp", alt: { id: "Jalan taman berpaving", en: "Paved garden path" } },
    { src: "/images/pavilion.webp", alt: { id: "Paviliun beratap alang-alang", en: "Thatched-roof pavilion" } },
    { src: "/images/foot-massage.webp", alt: { id: "Terapi refleksi kaki", en: "Foot reflexology therapy" } },
    { src: "/images/yoga-studio.webp", alt: { id: "Studio yoga dalam ruangan", en: "Indoor yoga studio" } },
    { src: "/images/outdoor-session.webp", alt: { id: "Sesi kelompok di dek kayu", en: "Group session on the deck" } },
    { src: "/images/indoor-seminar.webp", alt: { id: "Seminar di aula", en: "Seminar in the hall" } },
    { src: "/images/healthy-meal.webp", alt: { id: "Sajian makanan sehat", en: "Healthy meal serving" } },
  ],
};

export const FAQ = {
  eyebrow: { id: "FAQ", en: "FAQ" },
  title: { id: "Pertanyaan Umum", en: "Frequently Asked" },
  items: [
    {
      q: { id: "Bagaimana cara booking di Shankara?", en: "How do I book at Shankara?" },
      a: {
        id: "Semua booking dilakukan melalui WhatsApp admin. Klik tombol “Book An Appointment” atau nomor telepon di situs ini, dan Anda akan langsung terhubung dengan admin kami beserta pesan yang sudah terisi otomatis.",
        en: "All bookings go through our admin on WhatsApp. Tap any “Book An Appointment” button or the phone number on this site and you will be connected instantly with a pre-filled message.",
      },
    },
    {
      q: { id: "Berapa harga layanannya?", en: "How much do the services cost?" },
      a: {
        id: "Wellness & Glamping Experience mulai dari Rp 500.000. Reflexology & Healing Therapy mulai dari Rp 150.000. Holistic Body Movement & Meditation mulai dari Rp 150.000. Workshop & Self Development mulai dari Rp 250.000. Harga dapat berubah — silakan konfirmasi ke admin untuk penawaran terbaru.",
        en: "Wellness & Glamping Experience starts from Rp 500,000. Reflexology & Healing Therapy starts from Rp 150,000. Holistic Body Movement & Meditation starts from Rp 150,000. Workshop & Self Development starts from Rp 250,000. Prices may change — please confirm with our admin for the latest offers.",
      },
    },
    {
      q: { id: "Di mana lokasi Shankara?", en: "Where is Shankara located?" },
      a: {
        id: "Kami berada di Jalan Lingkar Barat, Kehutanan, Kec. Batu, Kota Batu, Jawa Timur 65311 — di kawasan alam yang sejuk di Kota Batu.",
        en: "We are located on Jalan Lingkar Barat, Kehutanan, Kec. Batu, Batu City, East Java 65311 — in the cool natural area of Batu.",
      },
    },
    {
      q: { id: "Berapa kapasitas akomodasi glamping?", en: "What is the glamping capacity?" },
      a: {
        id: "Pyramid Building (25 m²) menampung 2–3 orang, sedangkan Tent (14 m²) menampung 3–7 orang. Tersedia juga fasilitas tambahan seperti grill/BBQ set dan api unggun.",
        en: "The Pyramid Building (25 m²) hosts 2–3 guests, while the Tent (14 m²) hosts 3–7 guests. Add-ons such as a grill/BBQ set and bonfire are available.",
      },
    },
    {
      q: { id: "Apakah ada program paket jangka panjang?", en: "Is there a long-stay package program?" },
      a: {
        id: "Ada — Self Transformation Program (All-in Program) tersedia dalam durasi 2 hari 1 malam, 3 hari 2 malam, dan 1 minggu. Booking via WhatsApp admin.",
        en: "Yes — the Self Transformation Program (All-in) is available in 2 days 1 night, 3 days 2 nights, and 1 week durations. Booking via our WhatsApp admin.",
      },
    },
    {
      q: { id: "Program apa saja yang tersedia untuk pengembangan diri?", en: "What self-development programs are available?" },
      a: {
        id: "Kami menyelenggarakan Pelatihan Public Speaking, Pelatihan Mekanika & Robotika, dan Pelatihan Eco Enzyme, dengan dukungan aula berkapasitas 50 orang.",
        en: "We hold Public Speaking Training, Mechanics & Robotics Training, and Eco Enzyme Training, supported by a hall with a 50-person capacity.",
      },
    },
  ],
};

export const CTA_BAND = {
  title: { id: "Transformasikan Hidupmu Melalui Wellness Holistik", en: "Transform Your Life Through Holistic Wellness" },
  desc: {
    id: "Kami membantu setiap individu mengalami transformasi nyata melalui pendekatan personal dan menyeluruh — kombinasi konsultasi ahli, terapi, aktivitas kesadaran, serta lingkungan alami.",
    en: "We help each individual experience real transformation through a personal, comprehensive approach — expert consultation, therapy, mindfulness activities, and a natural environment.",
  },
};

export const CONTACT_SECTION = {
  eyebrow: { id: "Kontak", en: "Contact" },
  title: { id: "Mulai Perjalanan Wellness-mu", en: "Begin Your Wellness Journey" },
  desc: {
    id: "Punya pertanyaan atau ingin mengetahui program yang paling sesuai untukmu? Tim kami siap membantu kamu memulai perjalanan menuju hidup yang lebih seimbang.",
    en: "Have questions or want to know which program suits you best? Our team is ready to help you start your journey to a more balanced life.",
  },
  formTitle: { id: "Kirim Pesan Cepat", en: "Drop Us A Line" },
  formDesc: {
    id: "Isi formulir di bawah — pesan akan langsung terkirim ke WhatsApp kami.",
    en: "Fill in the form below — your message goes straight to our WhatsApp.",
  },
  name: { id: "Nama", en: "Your Name" },
  namePh: { id: "Nama lengkap Anda", en: "Your full name" },
  interest: { id: "Minat Program", en: "Program Interest" },
  message: { id: "Pesan", en: "Message" },
  messagePh: {
    id: "Ceritakan kebutuhan Anda…",
    en: "Tell us what you need…",
  },
  send: { id: "Kirim via WhatsApp", en: "Send via WhatsApp" },
  sending: { id: "Membuka WhatsApp…", en: "Opening WhatsApp…" },
  addressLabel: { id: "Alamat", en: "Address" },
  phoneLabel: { id: "Telepon / WhatsApp", en: "Phone / WhatsApp" },
  hoursLabel: { id: "Jam Operasional", en: "Operating Hours" },
  hours: { id: "Setiap hari · 08.00 – 20.00 WIB", en: "Daily · 08:00 – 20:00 GMT+7" },
  hoursNote: {
    id: "Kunjungan di luar jam tersedia dengan perjanjian.",
    en: "Visits outside hours available by appointment.",
  },
  waGreeting: {
    id: "Halo Shankara Wellness & Sanctuary! Saya",
    en: "Hello Shankara Wellness & Sanctuary! I am",
  },
  waInterest: {
    id: "Saya tertarik dengan program:",
    en: "I am interested in this program:",
  },
};

export const FOOTER = {
  company: { id: "Perusahaan", en: "Company" },
  services: { id: "Layanan", en: "Services" },
  address: { id: "Alamat", en: "Address" },
  tagline: {
    id: "Ruang transformasi holistik untuk kembali mengenal diri dan memulihkan keseimbangan hidup.",
    en: "A holistic transformation space to reconnect with yourself and restore life balance.",
  },
  rights: { id: "Seluruh hak cipta dilindungi.", en: "All rights reserved." },
  builtNote: {
    id: "Dibangun ulang dengan ♥ — lebih indah, lebih cepat.",
    en: "Rebuilt with ♥ — more beautiful, faster.",
  },
};
