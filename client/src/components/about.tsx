import { useQuery } from '@tanstack/react-query';
import { getQueryFn } from '@/lib/queryClient';

// Fallback data
const defaultAbout = {
  bio: 'BE Computer Science student passionate about solving real-world problems through innovation and teamwork. I\'ve participated in multiple national hackathons and developed impactful solutions, including AI-powered crop advisory platforms and cybersecurity detection tools.',
  education: 'BE CSE, SPPU (Expected 2027)',
  languages: 'English, Hindi, Marathi',
  skills: ['Python', 'C', 'C++', 'React', 'Node.js', 'SQL', 'n8n'],
  tools: ['GitHub', 'VS Code', 'Power BI', 'Jupyter'],
};

export default function About() {
  const { data: aboutData } = useQuery<any>({
    queryKey: ['/api/about'],
    queryFn: getQueryFn({ on401: 'returnNull' }),
  });

  const about = aboutData || defaultAbout;
  const skills = Array.isArray(about.skills) ? about.skills : defaultAbout.skills;
  const tools = Array.isArray(about.tools) ? about.tools : defaultAbout.tools;

  return (
    <section id="about" className="py-20 lg:py-32 relative scroll-mt-20">
      <div className="max-w-7xl mx-auto px-6 sm:px-8">
        <div className="section-reveal">
          <div className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl font-bold mb-6">About Me</h2>
            <div className="w-24 h-1 bg-blue-500 mx-auto"></div>
          </div>
          
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <p className="text-lg text-gray-300 leading-relaxed mb-8">
                {about.bio}
              </p>
              
              <div className="space-y-6">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                    <i className="fas fa-graduation-cap text-white text-sm"></i>
                  </div>
                  <span className="text-lg">
                    <strong className="text-white">Education:</strong> {about.education}
                  </span>
                </div>
                
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                    <i className="fas fa-globe text-white text-sm"></i>
                  </div>
                  <span className="text-lg">
                    <strong className="text-white">Languages:</strong> {about.languages}
                  </span>
                </div>
              </div>
            </div>
            
            <div className="space-y-8">
              {/* Technical Skills */}
              <div>
                <h3 className="text-2xl font-semibold mb-4 text-blue-400">
                  <i className="fas fa-code mr-2"></i>Technical Skills
                </h3>
                <div className="flex flex-wrap gap-2">
                  {skills.map((skill: string) => (
                    <span 
                      key={skill}
                      className="tech-tag bg-gray-800 text-gray-300 px-4 py-2 rounded-full text-sm font-medium hover:bg-blue-500 hover:text-white"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
              
              {/* Tools */}
              <div>
                <h3 className="text-2xl font-semibold mb-4 text-purple-400">
                  <i className="fas fa-tools mr-2"></i>Tools & Platforms
                </h3>
                <div className="flex flex-wrap gap-2">
                  {tools.map((tool: string) => (
                    <span 
                      key={tool}
                      className="tech-tag bg-gray-800 text-gray-300 px-4 py-2 rounded-full text-sm font-medium hover:bg-purple-500 hover:text-white"
                    >
                      {tool}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
