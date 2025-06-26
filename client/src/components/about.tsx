export default function About() {
  const skills = ['Python', 'C', 'C++', 'React', 'Node.js', 'SQL'];
  const tools = ['GitHub', 'VS Code', 'Power BI', 'Jupyter'];

  return (
    <section id="about" className="py-20 lg:py-32 relative">
      <div className="max-w-7xl mx-auto px-6 sm:px-8">
        <div className="section-reveal">
          <div className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl font-bold mb-6">About Me</h2>
            <div className="w-24 h-1 bg-blue-500 mx-auto"></div>
          </div>
          
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <p className="text-lg text-gray-300 leading-relaxed mb-8">
                BE Computer Science student committed to building smart and scalable solutions. 
                Blending tech knowledge and teamwork, I've created tools from AI crop advisors to phishing detectors.
              </p>
              
              <div className="space-y-6">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                    <i className="fas fa-graduation-cap text-white text-sm"></i>
                  </div>
                  <span className="text-lg">
                    <strong className="text-white">Education:</strong> BE CSE, SPPU (Expected 2027)
                  </span>
                </div>
                
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                    <i className="fas fa-globe text-white text-sm"></i>
                  </div>
                  <span className="text-lg">
                    <strong className="text-white">Languages:</strong> English, Hindi, Marathi
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
                  {skills.map((skill) => (
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
                  {tools.map((tool) => (
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
