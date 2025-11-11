import { useQuery } from '@tanstack/react-query';
import { getQueryFn } from '@/lib/queryClient';

// Fallback hackathons
const fallbackHackathons = [
  {
    id: 1,
    name: 'InnoVyuh Hackathon 2025',
    role: 'Developer, Team Supreme',
    organizer: 'Organized by Google Developer Groups, MIT ACSC, Alandi',
    side: 'left',
    delay: 0,
    certificateUrl: 'https://drive.google.com/file/d/16tVLHuNttEHEsJAURV9k3YPMwkEn-Ncm/view?usp=sharing'
  },
  {
    id: 2,
    name: 'INNERVE 9.0',
    role: 'Finalist (Online Mode) – Team Bit Benders',
    organizer: 'Hosted by AIT Pune',
    side: 'right',
    delay: 200,
    certificateUrl: 'https://drive.google.com/file/d/1EaJ9H9mLKvg_NzEKcLUNfiUbvagQdTLU/view?usp=drive_link'
  },
  {
    id: 3,
    name: 'Odoo National Hackathon',
    role: 'Finalist (Leader) – Team Bit Benders',
    organizer: 'Hosted by Odoo India',
    side: 'left',
    delay: 400,
    certificateUrl: 'https://drive.google.com/file/d/1hR1J2oFTHPu6ythBNm_yEBXozjcQBoui/view?usp=sharing'
  },
  {
    id: 5,
    name: 'Google Cloud Agentic AI Day',
    role: ' Participant :- Team Bit Benders',
    organizer: 'Google Cloud and Hack2Skill',
    side: 'right',
    delay: 600,
    certificateUrl: 'https://drive.google.com/file/d/1HPbWanT4vxANgU_Oigb4qAdTfAAy5AtU/view?usp=drive_link'
  },
  {
    id: 6,
    name: 'Google Developer Groups (GDG) Solution Challenge ',
    role: ' Participant :- Team Bit Benders',
    organizer: 'Google Developer Groups and Hack2Skill',
    side: 'left',
    delay: 600,
    certificateUrl: 'https://drive.google.com/file/d/1efFBIWuVTiIOmnTBMSeKGX14l7Z34GzK/view?usp=sharing'
  },
  {
    id: 7,
    name: 'Generative AI Buildathon',
    role: 'Participant',
    organizer: 'Hosted by  NxtWave & OpenAI Academy Learning Community!',
    side: 'right',
    delay: 600,
    certificateUrl: 'https://drive.google.com/file/d/1LS821o4PwOGpdEIezd-I2WplaZJ_LwZs/view?usp=drive_link'
  },
  {
    id: 8,
    name: 'Eureka 2025 E-Cell (IIT Bombay)',
    role: 'Zonalist (Leader) – Team Bit Benders',
    organizer: 'Hosted by E-Cell IIT Bombay',
    side: 'left',
    delay: 600,
    certificateUrl: 'https://example.com/eureka-certificate'
  }
];

export default function Hackathons() {
  const { data: hackathonsData } = useQuery<any[]>({
    queryKey: ['/api/hackathons'],
    queryFn: getQueryFn({ on401: 'returnNull' }),
  });

  const hackathons = hackathonsData && hackathonsData.length > 0 
    ? hackathonsData 
    : fallbackHackathons;         

  return (
    <section id="hackathons" className="py-20 lg:py-32 bg-gray-900 bg-opacity-50 scroll-mt-20">
      <div className="max-w-7xl mx-auto px-6 sm:px-8">
        <div className="section-reveal">
          <div className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl font-bold mb-6 text-white">Hackathon Participation</h2>
            <div className="w-24 h-1 bg-blue-500 mx-auto mb-4"></div>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              Collaborative problem-solving and innovation through competitive programming events
            </p>
          </div>
          
          <div className="relative max-w-4xl mx-auto">
            {/* Timeline line */}
            <div className="absolute left-1/2 transform -translate-x-1/2 w-1 h-full bg-blue-500 z-0"></div>

            {/* Timeline cards */}
            <div className="space-y-24">
              {hackathons.map((hackathon) => (
                <div
                  key={hackathon.id}
                  className={`flex items-center ${hackathon.side === 'right' ? 'flex-row-reverse' : ''}`}
                  style={{
                    animation: `slideIn${hackathon.side === 'left' ? 'Left' : 'Right'} 0.8s ease-out ${hackathon.delay}ms both`
                  }}
                >
                  <div className={`w-1/2 ${hackathon.side === 'left' ? 'pr-8 text-right' : 'pl-8'}`}>
                    <div className="bg-gray-800 bg-opacity-70 glass-effect rounded-2xl p-6 shadow-xl border border-gray-700">
                      <h3 className="text-xl font-bold mb-2 text-white">{hackathon.name}</h3>
                      <p className="text-gray-300 mb-2 font-medium">{hackathon.role}</p>
                      <p className="text-gray-400 text-sm mb-3">{hackathon.organizer}</p>

                      {/* Certificate link */}
                      {hackathon.certificateUrl && (
                        <a
                          href={hackathon.certificateUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-block mt-2 text-blue-400 hover:text-blue-300 text-sm font-medium underline transition duration-200"
                        >
                          View Certificate →
                        </a>
                      )}
                    </div>
                  </div>
                  <div className="w-1/2"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
