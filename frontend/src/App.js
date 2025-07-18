import React, { useState, useEffect, useRef, useMemo } from 'react';                        
import { 
  Mail, Phone, Github, ExternalLink, MapPin, Calendar, Award, Code, Server, Database, Shield, 
  Monitor, Users, BookOpen, Heart, Download, Star, Zap, ChevronDown, X, Eye, ArrowUp,
  Briefcase, GraduationCap, Trophy, Rocket,  Smartphone, Globe, Lock, Wifi, 
  Cloud, Terminal, FileCode, GitBranch, Palette, Laptop
} from 'lucide-react';
import './Portfolio.css';

const Portfolio = () => {
  const [activeSection, setActiveSection] = useState('hero');
  const [isLoading, setIsLoading] = useState(true);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  const heroRef = useRef(null);
  
  // Memoize titles array to prevent useEffect dependency issues
  const titles = useMemo(() => [
    "Full Stack Developer",
    "Cybersecurity Specialist", 
    "Cloud Computing Expert",
    "Software Engineer",
    "Network Security Analyst"
  ], []);
  
  const [currentTitleIndex, setCurrentTitleIndex] = useState(0);
  const [currentTitle, setCurrentTitle] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);

  // Typing animation effect
  useEffect(() => {
    const typeSpeed = isDeleting ? 100 : 150;
    const pauseTime = isDeleting ? 1000 : 2000;
    
    const timer = setTimeout(() => {
      const fullTitle = titles[currentTitleIndex];
      
      if (!isDeleting && currentTitle === fullTitle) {
        setTimeout(() => setIsDeleting(true), pauseTime);
      } else if (isDeleting && currentTitle === '') {
        setIsDeleting(false);
        setCurrentTitleIndex((prev) => (prev + 1) % titles.length);
      } else {
        setCurrentTitle(
          isDeleting 
            ? fullTitle.substring(0, currentTitle.length - 1)
            : fullTitle.substring(0, currentTitle.length + 1)
        );
      }
    }, typeSpeed);
    
    return () => clearTimeout(timer);
  }, [currentTitle, isDeleting, currentTitleIndex, titles]);

  // Mouse tracking for parallax effects
  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({
        x: (e.clientX / window.innerWidth) * 100,
        y: (e.clientY / window.innerHeight) * 100
      });
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Scroll animations and section tracking
  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      setShowScrollTop(scrollY > 500);
      
      // Update active section
      const sections = ['hero', 'about', 'experience', 'projects', 'skills', 'contact'];
      const current = sections.find(section => {
        const element = document.getElementById(section);
        if (element) {
          const rect = element.getBoundingClientRect();
          return rect.top <= 100 && rect.bottom >= 100;
        }
        return false;
      });
      
      if (current && current !== activeSection) {
        setActiveSection(current);
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [activeSection]);

  // Intersection Observer for animations - FIXED VERSION
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('animate');
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
          }
        });
      },
      { 
        threshold: 0.1, 
        rootMargin: '50px',
        triggerOnce: true // Add this to prevent re-hiding
      }
    );

    // Delay to ensure DOM is ready
    const initObserver = () => {
      const animatedElements = document.querySelectorAll('[data-animate]');
      animatedElements.forEach(el => {
        // Set initial state
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'all 0.6s ease';
        observer.observe(el);
      });
    };

    // Wait for DOM to be ready
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', initObserver);
    } else {
      setTimeout(initObserver, 100);
    }

    return () => {
      observer.disconnect();
      document.removeEventListener('DOMContentLoaded', initObserver);
    };
  }, []);

  // Dynamic page title based on active section
  useEffect(() => {
    const sectionTitles = {
      hero: 'Teddy Anangwe - Full Stack Developer',
      about: 'About - Teddy Anangwe',
      experience: 'Experience - Teddy Anangwe',
      projects: 'Projects - Teddy Anangwe',
      skills: 'Skills - Teddy Anangwe',
      contact: 'Contact - Teddy Anangwe'
    };
    
    document.title = sectionTitles[activeSection] || 'Teddy Anangwe - Portfolio';
  }, [activeSection]);

  // Enhanced scroll animations - FIXED VERSION
  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      setShowScrollTop(scrollY > 500);
      
      // Update active section with enhanced detection
      const sections = ['hero', 'about', 'experience', 'projects', 'skills', 'contact'];
      const current = sections.find(section => {
        const element = document.getElementById(section);
        if (element) {
          const rect = element.getBoundingClientRect();
          return rect.top <= 150 && rect.bottom >= 150;
        }
        return false;
      });
      
      if (current && current !== activeSection) {
        setActiveSection(current);
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Call once to set initial state
    return () => window.removeEventListener('scroll', handleScroll);
  }, [activeSection]);

  // Mouse tracking for parallax effects
  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({
        x: (e.clientX / window.innerWidth) * 100,
        y: (e.clientY / window.innerHeight) * 100
      });
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Loading simulation with progress - IMPROVED
  useEffect(() => {
    let progress = 0;
    const interval = setInterval(() => {
      progress += Math.random() * 30;
      if (progress >= 100) {
        progress = 100;
        clearInterval(interval);
        setTimeout(() => {
          setIsLoading(false);
          // Ensure all sections are visible after loading
          setTimeout(() => {
            const allSections = document.querySelectorAll('.section, [data-animate]');
            allSections.forEach(section => {
              section.style.opacity = '1';
              section.style.visibility = 'visible';
              section.style.transform = 'translateY(0)';
            });
          }, 100);
        }, 500);
      }
    }, 200);
    
    return () => clearInterval(interval);
  }, []);

  // Fallback visibility system - ensures sections are always visible
  useEffect(() => {
    const ensureVisibility = () => {
      const sections = ['about', 'experience', 'projects', 'skills', 'contact'];
      sections.forEach(sectionId => {
        const element = document.getElementById(sectionId);
        if (element) {
          element.style.opacity = '1';
          element.style.visibility = 'visible';
          element.style.display = 'block';
        }
      });
      
      // Also ensure all data-animate elements are visible
      const animatedElements = document.querySelectorAll('[data-animate]');
      animatedElements.forEach(el => {
        el.style.opacity = '1';
        el.style.visibility = 'visible';
        el.style.transform = 'translateY(0)';
      });
    };

    // Run after component mounts and after loading
    const timer = setTimeout(ensureVisibility, 100);
    
    // Also run when loading finishes
    if (!isLoading) {
      setTimeout(ensureVisibility, 100);
    }

    return () => clearTimeout(timer);
  }, [isLoading]);

  // Add notification system
  const [notification, setNotification] = useState(null);
  
  const showNotification = (message, type = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  // Enhanced project modal functions
  const openProjectModal = (project) => {
    setSelectedProject(project);
    document.body.style.overflow = 'hidden';
    showNotification('Project details loaded', 'info');
  };

  const closeProjectModal = () => {
    setSelectedProject(null);
    document.body.style.overflow = 'unset';
  };

  // Keyboard navigation for accessibility
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && selectedProject) {
        closeProjectModal();
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedProject]);

  // Copy contact info to clipboard
  const copyToClipboard = (text, label) => {
    navigator.clipboard.writeText(text).then(() => {
      showNotification(`${label} copied to clipboard!`, 'success');
    }).catch(() => {
      showNotification('Failed to copy to clipboard', 'error');
    });
  };

  // Scroll to top function
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Tech icons mapping
  const techIcons = {
    'ReactJs': <Code className="tech-icon" />,
    'Angular': <Monitor className="tech-icon" />,
    'TypeScript': <FileCode className="tech-icon" />,
    'JavaScript': <Terminal className="tech-icon" />,
    'HTML5': <Globe className="tech-icon" />,
    'CSS3': <Palette className="tech-icon" />,
    'SpringBoot': <Server className="tech-icon" />,
    'Laravel': <Code className="tech-icon" />,
    'Node.js': <Server className="tech-icon" />,
    'PHP': <FileCode className="tech-icon" />,
    'Python': <Terminal className="tech-icon" />,
    'MySQL': <Database className="tech-icon" />,
    'PostgreSQL': <Database className="tech-icon" />,
    'MongoDB': <Database className="tech-icon" />,
    'Git': <GitBranch className="tech-icon" />,
    'MS Azure': <Cloud className="tech-icon" />,
    'Penetration Testing': <Shield className="tech-icon" />,
    'VAPT': <Lock className="tech-icon" />,
    'Network Security': <Wifi className="tech-icon" />,
    'Bootstrap': <Monitor className="tech-icon" />
  };

  const projects = [
    {
      title: "Home Work Helper For Busy Parents",
      description: "A comprehensive AI enabled system built with modern web technologies, featuring real-time chat with AI and homework help.",
      technologies: ["Angular 19", "JavaScript", "React", "SpringBoot"],
      period: "March 2025 - April 2025",
      type: "Full Stack Application",
      liveLink: "https://eduedge.netlify.app", // You'll replace with actual links
      githubLink: "https://github.com/scylla8434/homeworkHelper"
    },
    {
      title: "Fintech Accounts & Transaction Management System",
      description: "A comprehensive financial management system built with modern web technologies, featuring real-time transaction processing and secure account management.",
      technologies: ["Angular 19", "JavaScript", "React", "SpringBoot"],
      period: "January 2025 - February 2025",
      type: "Full Stack Application",
      liveLink: "#", // You'll replace with actual links
      githubLink: "#"
    },
    {
      title: "Loan Management System",
      description: "Advanced loan processing and management platform with automated approval workflows and comprehensive reporting capabilities.",
      technologies: ["Angular 19", "JavaScript", "React", "SpringBoot"],
      period: "February 2025 - March 2025",
      type: "Enterprise Solution",
      liveLink: "#",
      githubLink: "#"
    },
    {
      title: "eSecurity System",
      description: "Robust security management platform with real-time monitoring, vulnerability assessment capabilities, and comprehensive reporting.",
      technologies: ["ReactJs", "MySQL", "Spring Boot", "Git", "Trello", "MS Azure"],
      period: "January 2023 - March 2023",
      type: "Security Platform",
      liveLink: "#",
      githubLink: "#"
    },
    {
      title: "House Rental System",
      description: "Modern property management solution featuring property listings, tenant management, and automated rental processes.",
      technologies: ["HTML", "CSS", "JavaScript", "React", "Node.js"],
      period: "April 2023 - June 2023",
      type: "Web Application",
      liveLink: "#",
      githubLink: "#"
    },
    {
      title: "eShopping Portal",
      description: "Full-featured e-commerce platform with secure payment processing, inventory management, and user-friendly shopping experience.",
      technologies: ["PHP", "Laravel", "MySQL", "Bootstrap"],
      period: "July 2021 - September 2021",
      type: "E-commerce Platform",
      liveLink: "#",
      githubLink: "#"
    }
  ];

  const experiences = [
    {
      title: "Software Developer",
      company: "E&M TECH",
      location: "Tatu City, Nairobi",
      period: "2025 - Present",
      type: "Full-time",
      responsibilities: [
        "Frontend software development using ReactJs, Angular, and TypeScript",
        "Backend software development with SpringBoot",
        "Network troubleshooting and system optimization",
        "Building scalable web applications for enterprise clients"
      ]
    },
    {
      title: "Trainee - Full Stack Software Development",
      company: "Cyber Shujaa",
      location: "Nairobi",
      period: "2023 - 2024",
      type: "Training Program",
      responsibilities: [
        "Intensive training in full-stack development",
        "Penetration testing and cybersecurity practices",
        "Cloud and network security implementation",
        "VAPT (Vulnerability Assessment and Penetration Testing)"
      ]
    },
    {
      title: "IT Assistant Intern",
      company: "Computer Ways",
      location: "Mfangano St., Nairobi",
      period: "2023 - 2024",
      type: "Internship",
      responsibilities: [
        "Frontend development with ReactJS and Angular",
        "Software installation and system maintenance",
        "CCTV installation and network configuration",
        "Technical support and troubleshooting"
      ]
    },
    {
      title: "Intern",
      company: "Kenya Airports Authority, JKIA",
      location: "Nairobi",
      period: "2022",
      type: "Internship",
      responsibilities: [
        "Network troubleshooting and mitigation",
        "Fibre cable laying and termination",
        "Network and CCTV switch configuration",
        "General preventive maintenance"
      ]
    }
  ];

  const skills = {
    frontend: ["ReactJs", "Angular", "TypeScript", "HTML5", "CSS3", "JavaScript", "Bootstrap"],
    backend: ["SpringBoot", "Laravel", "Node.js", "PHP", "Python"],
    database: ["MySQL", "PostgreSQL", "MongoDB"],
    tools: ["Git", "Trello", "MS Azure", "Adobe Illustrator", "Canva"],
    security: ["Penetration Testing", "VAPT", "Network Security", "Cybersecurity Essentials"]
  };

  // Emergency visibility function - can be called from console
  window.showAllSections = () => {
    console.log('🚑 Emergency: Forcing all sections visible...');
    const sections = ['hero', 'about', 'experience', 'projects', 'skills', 'contact'];
    sections.forEach(id => {
      const element = document.getElementById(id);
      if (element) {
        element.style.opacity = '1';
        element.style.visibility = 'visible';
        element.style.display = 'block';
        element.style.transform = 'translateY(0)';
        console.log(`✅ Fixed section: ${id}`);
      } else {
        console.log(`❌ Section not found: ${id}`);
      }
    });
    
    // Also fix all data-animate elements
    document.querySelectorAll('[data-animate]').forEach(el => {
      el.style.opacity = '1';
      el.style.visibility = 'visible';
      el.style.transform = 'translateY(0)';
    });
    
    console.log('🎉 All sections should now be visible!');
  };

  // Debug effect to log component state
  useEffect(() => {
    console.log('Portfolio Debug Info:', {
      isLoading,
      activeSection,
      selectedProject: !!selectedProject,
      showScrollTop,
      currentTitle
    });
  }, [isLoading, activeSection, selectedProject, showScrollTop, currentTitle]);

  if (isLoading) {
    return (
      <div className="loading-screen">
        <div className="loading-content">
          <div className="loading-spinner-container">
            <div className="loading-spinner"></div>
            <div className="loading-particles">
              {[...Array(6)].map((_, i) => (
                <div key={i} className={`loading-particle particle-${i}`}></div>
              ))}
            </div>
          </div>
          <div className="loading-text-container">
            <p className="loading-text">Loading Portfolio</p>
            <div className="loading-dots">
              <span></span><span></span><span></span>
            </div>
          </div>
          <div className="loading-progress">
            <div className="loading-progress-bar"></div>
          </div>
        </div>
        <div className="loading-background">
          {[...Array(20)].map((_, i) => (
            <div key={i} className={`floating-element floating-${i}`}>
              {i % 4 === 0 && <Code size={16} />}
              {i % 4 === 1 && <Zap size={12} />}
              {i % 4 === 2 && <Star size={14} />}
              {i % 4 === 3 && <Rocket size={18} />}
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="portfolio-container">
      {/* Notification System */}
      {notification && (
        <div className={`notification notification-${notification.type}`}>
          <div className="notification-content">
            {notification.type === 'success' && <Star size={20} />}
            {notification.type === 'error' && <X size={20} />}
            {notification.type === 'info' && <Eye size={20} />}
            <span>{notification.message}</span>
          </div>
        </div>
      )}

      {/* Floating Background Elements */}
      <div className="floating-background">
        {[...Array(15)].map((_, i) => (
          <div 
            key={i} 
            className={`floating-bg-element floating-bg-${i}`}
            style={{
              transform: `translate(${mousePosition.x * 0.02}px, ${mousePosition.y * 0.02}px)`,
              animationDelay: `${i * 0.5}s`
            }}
          >
            {i % 5 === 0 && <Code size={20} />}
            {i % 5 === 1 && <Zap size={16} />}
            {i % 5 === 2 && <Star size={18} />}
            {i % 5 === 3 && <Rocket size={14} />}
            {i % 5 === 4 && <Heart size={16} />}
          </div>
        ))}
      </div>

      {/* Navigation */}
      <nav className="navbar">
        <div className="nav-content">
          <div className="nav-inner">
            <h1 className="nav-logo">
              <span className="nav-logo-icon">⚡</span>
              Teddy Anangwe
            </h1>
            
            {/* Desktop Navigation */}
            <div className="nav-links">
              {['About', 'Experience', 'Projects', 'Skills', 'Contact'].map((item) => (
                <a
                  key={item}
                  href={`#${item.toLowerCase()}`}
                  className={`nav-link ${activeSection === item.toLowerCase() ? 'nav-link-active' : ''}`}
                  onClick={(e) => {
                    e.preventDefault();
                    document.getElementById(item.toLowerCase())?.scrollIntoView({ behavior: 'smooth' });
                  }}
                >
                  {item}
                </a>
              ))}
            </div>
            
            {/* Mobile Menu Button */}
            <button 
              className="mobile-menu-btn"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label="Toggle mobile menu"
            >
              <div className={`hamburger ${isMobileMenuOpen ? 'hamburger-open' : ''}`}>
                <span></span>
                <span></span>
                <span></span>
              </div>
            </button>
          </div>
          
          {/* Mobile Navigation Menu */}
          <div className={`mobile-nav ${isMobileMenuOpen ? 'mobile-nav-open' : ''}`}>
            {['About', 'Experience', 'Projects', 'Skills', 'Contact'].map((item) => (
              <a
                key={item}
                href={`#${item.toLowerCase()}`}
                className={`mobile-nav-link ${activeSection === item.toLowerCase() ? 'mobile-nav-link-active' : ''}`}
                onClick={(e) => {
                  e.preventDefault();
                  setIsMobileMenuOpen(false);
                  setTimeout(() => {
                    document.getElementById(item.toLowerCase())?.scrollIntoView({ behavior: 'smooth' });
                  }, 300);
                }}
              >
                {item}
              </a>
            ))}
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section id="hero" className="hero-section" ref={heroRef}>
        <div className="hero-background">
          <div className="hero-gradient"></div>
          <div className="hero-pattern"></div>
        </div>
        
        <div className="hero-content">
          <div className="hero-inner">
            {/* Profile Picture Section */}
            <div className="hero-profile" data-animate>
              <div className="profile-container">
                <div className="profile-image-wrapper">
                  <img 
                    src="/images/profile/teddy-profile.jpg" 
                    alt="Teddy Anangwe" 
                    className="profile-image"
                    onLoad={(e) => {
                      e.target.style.display = 'block';
                      e.target.nextSibling.style.display = 'none';
                    }}
                    onError={(e) => {
                      console.log('Profile image failed to load, showing placeholder');
                      e.target.style.display = 'none';
                      e.target.nextSibling.style.display = 'flex';
                    }}
                  />
                  <div className="profile-placeholder" style={{ display: 'flex' }}>
                    <Code size={48} />
                  </div>
                </div>
                <div className="profile-status">
                  <div className="status-indicator"></div>
                  <span>Available for Work</span>
                </div>
              </div>
            </div>

            {/* Hero Content */}
            <div className="hero-text" data-animate>
              <h1 className="hero-title">
                <span className="hero-greeting">Hello, I'm</span>
                <span className="hero-name">Teddy Anangwe</span>
              </h1>
              
              <div className="hero-typing">
                <span className="typing-label">I'm a </span>
                <span className="typing-text">
                  {currentTitle}
                  <span className="typing-cursor">|</span>
                </span>
              </div>
              
              <p className="hero-description">
                A motivated and results-driven tech enthusiast with a strong foundation in software development, 
                cybersecurity, and cloud computing. Passionate about leveraging technical skills and innovative 
                solutions to drive organizational success.
              </p>
              
              <div className="hero-stats">
                <div className="hero-stat">
                  <Trophy className="stat-icon" />
                  <div className="stat-content">
                    <span className="stat-number">5+</span>
                    <span className="stat-label">Projects</span>
                  </div>
                </div>
                <div className="hero-stat">
                  <Briefcase className="stat-icon" />
                  <div className="stat-content">
                    <span className="stat-number">3+</span>
                    <span className="stat-label">Years Experience</span>
                  </div>
                </div>
                <div className="hero-stat">
                  <GraduationCap className="stat-icon" />
                  <div className="stat-content">
                    <span className="stat-number">10+</span>
                    <span className="stat-label">Certifications</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="hero-actions" data-animate>
              <a href="#contact" className="btn btn-primary btn-animated">
                <Rocket size={20} />
                Let's Work Together
              </a>
              <a href="#projects" className="btn btn-secondary btn-animated">
                <Eye size={20} />
                View My Work
              </a>
              <a href="/resume/teddy-anangwe-resume.pdf" className="btn btn-outline btn-animated" download>
                <Download size={20} />
                Download Resume
              </a>
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="scroll-indicator">
          <div className="scroll-text">Scroll to explore</div>
          <ChevronDown className="scroll-arrow" />
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="section section-alt">
        <div className="container">
          <h2 className="section-title" data-animate>
            My Journey
          </h2>
          <div className="about-grid">
            <div className="about-text" data-animate>
              <h3 className="about-subtitle">From Network Infrastructure to Software Innovation</h3>
              <p className="about-paragraph">
                My journey began at Kenya Airports Authority where I gained hands-on experience with network infrastructure, 
                laying the foundation for my technical expertise. This experience taught me the importance of robust, 
                reliable systems and attention to detail.
              </p>
              <p className="about-paragraph">
                Transitioning into software development, I've mastered both frontend and backend technologies, 
                specializing in creating scalable web applications and implementing security-first solutions. 
                My unique background in networking gives me a comprehensive understanding of how applications 
                interact with infrastructure.
              </p>
              <p className="about-paragraph">
                Today, I combine my technical expertise with a passion for innovation, building solutions that 
                not only meet business requirements but also contribute to meaningful social impact through 
                volunteer work and community engagement.
              </p>
              
              <div className="journey-timeline" data-animate>
                <div className="timeline-item">
                  <div className="timeline-icon">
                    <Briefcase size={20} />
                  </div>
                  <div className="timeline-content">
                    <h4>2025 - Present</h4>
                    <p>Software Developer at E&M TECH</p>
                  </div>
                </div>
                <div className="timeline-item">
                  <div className="timeline-icon">
                    <GraduationCap size={20} />
                  </div>
                  <div className="timeline-content">
                    <h4>2024</h4>
                    <p>BSc. Computer Science - Second Class Honours Upper Division</p>
                  </div>
                </div>
                <div className="timeline-item">
                  <div className="timeline-icon">
                    <Shield size={20} />
                  </div>
                  <div className="timeline-content">
                    <h4>2023-2024</h4>
                    <p>Full Stack Development Training</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="about-cards" data-animate>
              <div className="about-card about-card-animated">
                <BookOpen className="about-card-icon about-card-icon-blue" size={32} />
                <h4 className="about-card-title">Education Excellence</h4>
                <p className="about-card-text">BSc. Computer Science - Upper Division</p>
                <p className="about-card-subtext">Maseno University (2018-2024)</p>
                <div className="about-card-stats">
                  <div className="about-stat">
                    <Trophy size={16} />
                    <span>Upper Division</span>
                  </div>
                </div>
              </div>
              
              <div className="about-card about-card-animated">
                <Award className="about-card-icon about-card-icon-purple" size={32} />
                <h4 className="about-card-title">Certifications</h4>
                <p className="about-card-text">Cloud and Network Security</p>
                <p className="about-card-subtext">Cybersecurity Essentials</p>
                <div className="about-card-stats">
                  <div className="about-stat">
                    <Star size={16} />
                    <span>10+ Certificates</span>
                  </div>
                </div>
              </div>
              
              <div className="about-card about-card-animated">
                <Heart className="about-card-icon about-card-icon-pink" size={32} />
                <h4 className="about-card-title">Community Impact</h4>
                <p className="about-card-text">Volunteer at thisIT</p>
                <p className="about-card-subtext">Supporting underprivileged students</p>
                <div className="about-card-stats">
                  <div className="about-stat">
                    <Users size={16} />
                    <span>100+ Lives Impacted</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Experience Section */}
      <section id="experience" className="section">
        <div className="container">
          <h2 className="section-title" data-animate>
            Professional Experience
          </h2>
          <div className="experience-list">
            {experiences.map((exp, index) => (
              <div key={index} className="experience-item" data-animate>
                <div className="experience-header">
                  <div>
                    <h3 className="experience-title">{exp.title}</h3>
                    <div className="experience-meta">
                      <span className="experience-meta-item">
                        <Monitor size={16} />
                        {exp.company}
                      </span>
                      <span className="experience-meta-item">
                        <MapPin size={16} />
                        {exp.location}
                      </span>
                    </div>
                  </div>
                  <div>
                    <span className="experience-type">
                      {exp.type}
                    </span>
                    <p className="experience-period">
                      <Calendar size={16} />
                      {exp.period}
                    </p>
                  </div>
                </div>
                <ul className="experience-responsibilities">
                  {exp.responsibilities.map((resp, i) => (
                    <li key={i} className="experience-responsibility">
                      {resp}
                    </li>
                  ))}
                </ul>
                
                {/* Experience Achievement Badges */}
                <div className="experience-achievements">
                  {index === 0 && (
                    <>
                      <div className="achievement-badge">
                        <Code size={16} />
                        <span>MERN Stack</span>
                      </div>
                      <div className="achievement-badge">
                        <Shield size={16} />
                        <span>Security Focus</span>
                      </div>
                    </>
                  )}
                  {index === 1 && (
                    <>
                      <div className="achievement-badge">
                        <GraduationCap size={16} />
                        <span>Certified</span>
                      </div>
                      <div className="achievement-badge">
                        <Shield size={16} />
                        <span>VAPT Expert</span>
                      </div>
                    </>
                  )}
                  {index === 2 && (
                    <>
                      <div className="achievement-badge">
                        <Monitor size={16} />
                        <span>Frontend</span>
                      </div>
                      <div className="achievement-badge">
                        <Wifi size={16} />
                        <span>Networking</span>
                      </div>
                    </>
                  )}
                  {index === 3 && (
                    <>
                      <div className="achievement-badge">
                        <Briefcase size={16} />
                        <span>First Role</span>
                      </div>
                      <div className="achievement-badge">
                        <Rocket size={16} />
                        <span>Foundation</span>
                      </div>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Projects Section */}
      <section id="projects" className="section section-alt">
        <div className="container">
          <h2 className="section-title" data-animate>
            Featured Projects
          </h2>
          <div className="projects-grid">
            {projects.map((project, index) => (
              <div key={index} className="project-card" data-animate>
                <div className="project-image">
                  <img 
                    src={`/images/projects/${project.title.toLowerCase().replace(/\s+/g, '-')}-preview.jpg`}
                    alt={project.title}
                    className="project-img"
                    onError={(e) => {
                      e.target.style.display = 'none';
                      e.target.nextSibling.style.display = 'flex';
                    }}
                  />
                  <div className="project-img-placeholder">
                    <Monitor size={48} />
                  </div>
                  <div className="project-overlay">
                    <button 
                      className="project-preview-btn"
                      onClick={() => openProjectModal(project)}
                    >
                      <Eye size={20} />
                      Quick View
                    </button>
                  </div>
                </div>
                
                <div className="project-content">
                  <div className="project-header">
                    <h3 className="project-title">{project.title}</h3>
                    <span className="project-type">
                      {project.type}
                    </span>
                  </div>
                  
                  <p className="project-description">{project.description}</p>
                  
                  <div className="project-technologies">
                    {project.technologies.map((tech, i) => (
                      <span key={i} className="project-tech">
                        {techIcons[tech] || <Code className="tech-icon-small" />}
                        {tech}
                      </span>
                    ))}
                  </div>
                  
                  <p className="project-period">{project.period}</p>
                  
                  <div className="project-links">
                    <a href={project.liveLink} className="project-link project-link-live">
                      <ExternalLink size={16} />
                      Live Demo
                    </a>
                    <a href={project.githubLink} className="project-link project-link-github">
                      <Github size={16} />
                      Source Code
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Skills Section */}
      <section id="skills" className="section">
        <div className="container">
          <h2 className="section-title" data-animate>
            Technical Expertise
          </h2>
          <div className="skills-grid">
            <div className="skill-category" data-animate>
              <div className="skill-header">
                <Monitor className="skill-icon skill-icon-blue" size={32} />
                <h3 className="skill-title skill-title-blue">Frontend Development</h3>
              </div>
              <div className="skill-items">
                {skills.frontend.map((skill, i) => (
                  <div key={i} className="skill-item">
                    <div className="skill-item-header">
                      {techIcons[skill] || <Code className="tech-icon" />}
                      <span className="skill-name">{skill}</span>
                    </div>
                    <div className="skill-progress">
                      <div 
                        className="skill-progress-bar skill-progress-blue"
                        style={{ 
                          width: `${85 + (i * 3)}%`,
                          animationDelay: `${i * 0.1}s`
                        }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="skill-category" data-animate>
              <div className="skill-header">
                <Server className="skill-icon skill-icon-purple" size={32} />
                <h3 className="skill-title skill-title-purple">Backend Development</h3>
              </div>
              <div className="skill-items">
                {skills.backend.map((skill, i) => (
                  <div key={i} className="skill-item">
                    <div className="skill-item-header">
                      {techIcons[skill] || <Server className="tech-icon" />}
                      <span className="skill-name">{skill}</span>
                    </div>
                    <div className="skill-progress">
                      <div 
                        className="skill-progress-bar skill-progress-purple"
                        style={{ 
                          width: `${80 + (i * 4)}%`,
                          animationDelay: `${i * 0.1}s`
                        }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="skill-category" data-animate>
              <div className="skill-header">
                <Database className="skill-icon skill-icon-green" size={32} />
                <h3 className="skill-title skill-title-green">Database & Tools</h3>
              </div>
              <div className="skill-items">
                {[...skills.database, ...skills.tools].map((skill, i) => (
                  <div key={i} className="skill-item">
                    <div className="skill-item-header">
                      {techIcons[skill] || <Database className="tech-icon" />}
                      <span className="skill-name">{skill}</span>
                    </div>
                    <div className="skill-progress">
                      <div 
                        className="skill-progress-bar skill-progress-green"
                        style={{ 
                          width: `${75 + (i * 3)}%`,
                          animationDelay: `${i * 0.1}s`
                        }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="skill-category skill-category-wide" data-animate>
              <div className="skill-header">
                <Shield className="skill-icon skill-icon-red" size={32} />
                <h3 className="skill-title skill-title-red">Cybersecurity & Networking</h3>
              </div>
              <div className="skill-items">
                {skills.security.map((skill, i) => (
                  <div key={i} className="skill-item">
                    <div className="skill-item-header">
                      {techIcons[skill] || <Shield className="tech-icon" />}
                      <span className="skill-name">{skill}</span>
                    </div>
                    <div className="skill-progress">
                      <div 
                        className="skill-progress-bar skill-progress-red"
                        style={{ 
                          width: `${88 + (i * 2)}%`,
                          animationDelay: `${i * 0.1}s`
                        }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Project Modal */}
      {selectedProject && (
        <div className="modal-overlay" onClick={closeProjectModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button 
              className="modal-close"
              onClick={closeProjectModal}
            >
              <X size={24} />
            </button>
            
            <div className="modal-header">
              <h3 className="modal-title">{selectedProject.title}</h3>
              <span className="modal-type">{selectedProject.type}</span>
            </div>
            
            <div className="modal-image">
              <img 
                src={`/images/projects/${selectedProject.title.toLowerCase().replace(/\s+/g, '-')}-full.jpg`}
                alt={selectedProject.title}
                onError={(e) => {
                  e.target.style.display = 'none';
                  e.target.nextSibling.style.display = 'flex';
                }}
              />
              <div className="modal-img-placeholder">
                <Monitor size={64} />
                <p>Project Screenshot</p>
              </div>
            </div>
            
            <div className="modal-body">
              <p className="modal-description">{selectedProject.description}</p>
              
              <div className="modal-details">
                <div className="modal-detail">
                  <h4>Technologies Used</h4>
                  <div className="modal-technologies">
                    {selectedProject.technologies.map((tech, i) => (
                      <span key={i} className="modal-tech">
                        {techIcons[tech] || <Code className="tech-icon-small" />}
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
                
                <div className="modal-detail">
                  <h4>Project Duration</h4>
                  <p>{selectedProject.period}</p>
                </div>
                
                <div className="modal-detail">
                  <h4>Key Features</h4>
                  <ul className="modal-features">
                    <li>Responsive design for all devices</li>
                    <li>Modern UI/UX with smooth animations</li>
                    <li>Secure authentication and data handling</li>
                    <li>Real-time updates and notifications</li>
                    <li>Comprehensive admin dashboard</li>
                  </ul>
                </div>
              </div>
              
              <div className="modal-actions">
                <a href={selectedProject.liveLink} className="btn btn-primary">
                  <ExternalLink size={20} />
                  View Live Project
                </a>
                <a href={selectedProject.githubLink} className="btn btn-secondary">
                  <Github size={20} />
                  View Source Code
                </a>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Scroll to Top Button */}
      {showScrollTop && (
        <button className="scroll-top-btn" onClick={scrollToTop}>
          <ArrowUp size={20} />
        </button>
      )}

      {/* Contact Section */}
      <section id="contact" className="section section-alt">
        <div className="container">
          <h2 className="section-title" data-animate>
            Let's Connect
          </h2>
          <div className="contact-grid">
            <div className="contact-info" data-animate>
              <h3>Get In Touch</h3>
              <p className="contact-description">
                I'm always excited to discuss new opportunities, innovative projects, and ways to contribute 
                to meaningful technological solutions. Whether you're looking for a dedicated developer, 
                cybersecurity expertise, or just want to connect, I'd love to hear from you.
              </p>
              <div className="contact-methods">
                <div className="contact-method-group">
                  <a href="mailto:teddyanangwe@gmail.com" className="contact-method">
                    <Mail size={20} />
                    teddyanangwe@gmail.com
                  </a>
                  <button 
                    className="contact-copy-btn"
                    onClick={() => copyToClipboard('teddyanangwe@gmail.com', 'Email')}
                    title="Copy email"
                  >
                    <Star size={16} />
                  </button>
                </div>
                
                <div className="contact-method-group">
                  <a href="tel:+254746711570" className="contact-method">
                    <Phone size={20} />
                    +254 746 711 570
                  </a>
                  <button 
                    className="contact-copy-btn"
                    onClick={() => copyToClipboard('+254746711570', 'Phone number')}
                    title="Copy phone number"
                  >
                    <Star size={16} />
                  </button>
                </div>
                
                <a href="https://github.com/Scylla8434" className="contact-method">
                  <Github size={20} />
                  Scylla8434
                </a>
                
                <div className="contact-method">
                  <MapPin size={20} />
                  Nairobi, Kenya
                </div>
              </div>
            </div>
            <div className="contact-card" data-animate>
              <h4>Ready to Collaborate?</h4>
              <div className="contact-card-content">
                <p className="contact-card-description">
                  I'm currently available for new opportunities and exciting projects. 
                  Let's discuss how we can work together to bring your ideas to life.
                </p>
                <div className="contact-actions">
                  <a 
                    href="mailto:teddyanangwe@gmail.com?subject=Project Inquiry&body=Hi Teddy, I'd like to discuss a project opportunity with you."
                    className="contact-action contact-action-email"
                  >
                    <Mail size={20} />
                    Send Email
                  </a>
                  <a 
                    href="https://wa.me/254746711570?text=Hi%20Teddy,%20I'd%20like%20to%20discuss%20a%20project%20opportunity"
                    className="contact-action contact-action-whatsapp"
                  >
                    <Smartphone size={20} />
                    WhatsApp
                  </a>
                  <a 
                    href="tel:+254746711570"
                    className="contact-action contact-action-phone"
                  >
                    <Phone size={20} />
                    Call Now
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="footer-content">
          <div className="footer-social">
            <a href="https://github.com/Scylla8434" className="social-link">
              <Github size={20} />
            </a>
            <a href="mailto:teddyanangwe@gmail.com" className="social-link">
              <Mail size={20} />
            </a>
            <a href="https://linkedin.com/in/teddy-anangwe" className="social-link">
              <Users size={20} />
            </a>
          </div>
          <p className="footer-text">
            © 2025 Teddy Anangwe.
          </p>
          <div className="footer-fun">
            <Laptop size={16} />
            <span>Powered by Passion</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Portfolio;