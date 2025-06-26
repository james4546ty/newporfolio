import { useEffect } from 'react';
import Navbar from '@/components/navbar';
import Hero from '@/components/hero';
import About from '@/components/about';
import Projects from '@/components/projects';
import Certifications from '@/components/certifications';
import Hackathons from '@/components/hackathons';
import Contact from '@/components/contact';
import Footer from '@/components/footer';

export default function Home() {
  useEffect(() => {
    // Intersection Observer for section animations
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
        }
      });
    }, observerOptions);

    // Observe all sections with animation
    document.querySelectorAll('.section-reveal').forEach(section => {
      observer.observe(section);
    });

    // Initial animations on page load
    setTimeout(() => {
      document.querySelectorAll('.section-reveal').forEach((section, index) => {
        setTimeout(() => {
          if (section.getBoundingClientRect().top < window.innerHeight) {
            section.classList.add('revealed');
          }
        }, index * 200);
      });
    }, 100);

    return () => {
      observer.disconnect();
    };
  }, []);

  return (
    <div className="bg-black text-white overflow-x-hidden">
      <Navbar />
      <Hero />
      <About />
      <Projects />
      <Certifications />
      <Hackathons />
      <Contact />
      <Footer />
    </div>
  );
}
