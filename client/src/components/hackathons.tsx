export default function Hackathons() {
  const hackathons = [
    {
      id: 1,
      name: 'InnoVyuh Hackathon 2025',
      role: 'Developer',
      team: 'Supreme',
      organizer: 'Google Developer Groups, MIT ACSC, Alandi',
      year: '2025',
      icon: 'fas fa-code',
      borderColor: 'border-blue-500',
      iconBg: 'bg-blue-500',
      yearBg: 'bg-blue-500 bg-opacity-20 text-blue-300'
    },
    {
      id: 2,
      name: 'INNERVE 9.0',
      role: 'Finalist (Online Mode)',
      team: 'Bit Benders',
      organizer: 'AIT Pune',
      year: 'Finalist',
      icon: 'fas fa-trophy',
      borderColor: 'border-green-500',
      iconBg: 'bg-green-500',
      yearBg: 'bg-green-500 bg-opacity-20 text-green-300'
    }
  ];

  return (
    <section id="hackathons" className="py-20 lg:py-32 bg-gray-900 bg-opacity-50">
      <div className="max-w-7xl mx-auto px-6 sm:px-8">
        <div className="section-reveal">
          <div className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl font-bold mb-6">Hackathon Participation</h2>
            <div className="w-24 h-1 bg-blue-500 mx-auto mb-4"></div>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              Collaborative problem-solving and innovation through competitive programming events
            </p>
          </div>
          
          <div className="space-y-8">
            {hackathons.map((hackathon) => (
              <div key={hackathon.id} className={`bg-gray-800 bg-opacity-50 glass-effect rounded-2xl p-8 border-l-4 ${hackathon.borderColor}`}>
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
                  <div className="flex-1 mb-4 lg:mb-0">
                    <h3 className={`text-2xl font-bold mb-2 ${hackathon.borderColor.replace('border-', 'text-')}`}>
                      {hackathon.name}
                    </h3>
                    <p className="text-gray-300 mb-2">
                      <strong>Role:</strong> {hackathon.role} | <strong>Team:</strong> {hackathon.team}
                    </p>
                    <p className="text-gray-400">
                      {hackathon.organizer}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className={`w-12 h-12 ${hackathon.iconBg} rounded-full flex items-center justify-center`}>
                      <i className={`${hackathon.icon} text-white text-xl`}></i>
                    </div>
                    <span className={`${hackathon.yearBg} px-4 py-2 rounded-full font-semibold`}>
                      {hackathon.year}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
