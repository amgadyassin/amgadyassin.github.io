/**
 * Main Application Logic
 * Navigation, scroll animations, typewriter, counter metrics, Lucide icons
 */

document.addEventListener('DOMContentLoaded', () => {
    // 1. Initialize Lucide Icons
    if (window.lucide) {
        window.lucide.createIcons();
    }

    // 2. Mobile Menu Navigation
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');
    const navItems = document.querySelectorAll('.nav-links a');

    if (hamburger && navLinks) {
        hamburger.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            const isOpen = navLinks.classList.contains('active');
            hamburger.setAttribute('aria-expanded', isOpen);
        });

        navItems.forEach(item => {
            item.addEventListener('click', () => {
                if (navLinks.classList.contains('active')) {
                    navLinks.classList.remove('active');
                    hamburger.setAttribute('aria-expanded', 'false');
                }
            });
        });
    }

    // 3. ScrollSpy & Active Navigation Highlighting
    const sections = document.querySelectorAll('section, header');
    const navMenuLinks = document.querySelectorAll('.nav-links a');

    function updateActiveNav() {
        let current = '';
        const scrollPosition = window.pageYOffset || document.documentElement.scrollTop;

        sections.forEach(section => {
            const sectionTop = section.offsetTop - 140;
            const sectionHeight = section.offsetHeight;
            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                current = section.getAttribute('id');
            }
        });

        navMenuLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    }

    window.addEventListener('scroll', updateActiveNav, { passive: true });
    updateActiveNav();

    // 4. Scroll Fade-In Observer
    const fadeElements = document.querySelectorAll('.fade-in');
    if (fadeElements.length > 0) {
        const fadeObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -40px 0px'
        });

        fadeElements.forEach(el => fadeObserver.observe(el));
    }

    // 5. Animated Number Counters
    const counters = document.querySelectorAll('.counter');
    let countersAnimated = false;

    const statsSection = document.getElementById('stats');
    if (statsSection && counters.length > 0) {
        const counterObserver = new IntersectionObserver((entries) => {
            const entry = entries[0];
            if (entry.isIntersecting && !countersAnimated) {
                countersAnimated = true;
                counters.forEach(counter => {
                    const target = +counter.getAttribute('data-target');
                    const duration = 1800; // ms
                    const frameRate = 16;
                    const totalFrames = duration / frameRate;
                    const increment = target / totalFrames;
                    let current = 0;

                    const updateCounter = () => {
                        current += increment;
                        if (current < target) {
                            counter.innerText = Math.ceil(current).toLocaleString();
                            requestAnimationFrame(updateCounter);
                        } else {
                            counter.innerText = target.toLocaleString();
                        }
                    };

                    updateCounter();
                });
            }
        }, { threshold: 0.3 });

        counterObserver.observe(statsSection);
    }

    // 6. Typewriter Effect
    const typewriterElement = document.getElementById('typewriter');
    if (typewriterElement) {
        const titles = [
            'Senior Data Analyst',
            'Microsoft Fabric & BI Specialist',
            'Enterprise Customer Intelligence Lead',
            'Data Platform Modernization Architect'
        ];

        let titleIndex = 0;
        let charIndex = 0;
        let isDeleting = false;

        function type() {
            const currentTitle = titles[titleIndex];

            if (isDeleting) {
                typewriterElement.textContent = currentTitle.substring(0, charIndex - 1);
                charIndex--;
            } else {
                typewriterElement.textContent = currentTitle.substring(0, charIndex + 1);
                charIndex++;
            }

            let typeSpeed = isDeleting ? 40 : 80;

            if (!isDeleting && charIndex === currentTitle.length) {
                typeSpeed = 2200; // Pause when title is fully typed
                isDeleting = true;
            } else if (isDeleting && charIndex === 0) {
                isDeleting = false;
                titleIndex = (titleIndex + 1) % titles.length;
                typeSpeed = 400; // Brief pause before starting next title
            }

            setTimeout(type, typeSpeed);
        }

        setTimeout(type, 800);
    }

    // 7. Project Category Filtering
    const filterButtons = document.querySelectorAll('.filter-btn');
    const projectCards = document.querySelectorAll('.project-card[data-category]');

    if (filterButtons.length > 0 && projectCards.length > 0) {
        filterButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                filterButtons.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');

                const filter = btn.getAttribute('data-filter');

                projectCards.forEach(card => {
                    const categories = card.getAttribute('data-category').split(' ');
                    if (filter === 'all' || categories.includes(filter)) {
                        card.style.display = 'block';
                        setTimeout(() => {
                            card.style.opacity = '1';
                            card.style.transform = 'translateY(0)';
                        }, 50);
                    } else {
                        card.style.opacity = '0';
                        card.style.transform = 'translateY(15px)';
                        setTimeout(() => {
                            card.style.display = 'none';
                        }, 250);
                    }
                });
            });
        });
    }

    // 8. Case Study Modal Data & Handlers
    const caseStudies = {
        'fabric-migration': {
            badge: 'Enterprise Architecture & Cloud Modernization',
            title: 'Enterprise Cloud Migration: Oracle to Microsoft Fabric',
            flow: [
                'Oracle On-Premises & SFDA DB',
                'Azure Blob Storage & Fabric Dataflows Gen2',
                'OneLake Bronze/Silver Delta Tables',
                'Gold Star-Schema Warehouses',
                'Power BI Direct Lake & Import Semantic Models'
            ],
            situation: 'The commercial organization relied on an on-premises Oracle database with legacy ETL processes struggling with latency and high operational cost. 5,000+ line SQL transformations were bottlenecking daily reporting, and legacy BI tools (MicroStrategy) lacked native connectivity to modern ad platforms (Meta, Google Ads, GA4), delaying strategic decision-making across 3,000+ users.',
            actions: [
                'Migrated 300+ tables containing millions of rows using Microsoft Fabric Dataflows and PySpark Notebooks with automated incremental refresh.',
                'Architected a Lakehouse Medallion pattern: Bronze raw ingestion, Silver cleansed delta tables, and Gold dimensional star-schema warehouses.',
                'Automated multi-channel marketing data ingestion (Meta, Google Ads, GA4) into Azure Blob Storage and OneLake, eliminating all manual reporting.',
                'Built an automated daily Python scraper monitoring the SFDA database, instantly alerting commercial teams to price variances and saving millions in supplier negotiations.',
                'Deployed high-performance Power BI semantic models utilizing Direct Lake mode for sub-second query latency and Import mode with robust Row-Level Security (RLS).'
            ],
            kpis: [
                { val: '3,000+', lbl: 'Active Enterprise Users' },
                { val: '80%', lbl: 'ETL Processing Reduction' },
                { val: '99.9%', lbl: 'Pipeline Availability' },
                { val: 'Millions', lbl: 'Saved in Negotiations via SFDA Scraper' }
            ]
        },
        'cdp-implementation': {
            badge: 'Commercial Analytics & Omnichannel Intelligence',
            title: 'Oracle Customer Data Platform (CDP) & Journey Automation',
            flow: [
                'In-Store & Digital Touchpoints',
                'Oracle Unity CDP (Unified 360° Identity)',
                'Responsys & Infinity Automation Engine',
                'Automated SFTP CSV Feeds & Python REST APIs',
                'OneLake / Power BI Central Analytics'
            ],
            situation: 'Customer touchpoints were fragmented across a 20+ store regional pharmacy network, online retail, and mobile applications. Disconnected commercial and marketing teams lacked a single unified customer view of 7.8M consumers to execute hyper-personalized communications and measure true ROI.',
            actions: [
                'Integrated Oracle Unity CDP, Responsys, and Infinity alongside cross-functional engineering and commercial teams to build a single 360-degree customer profile.',
                'Constructed secure outbound data pipelines via SFTP using Python to automate the daily generation and dispatch of 15+ complex enterprise CSV feeds.',
                'Programmed custom Python REST APIs to ingest campaign interaction logs into a centralized Power BI performance dashboard.',
                'Configured real-time triggers to send targeted medication dosage reminder notifications, retaining over 230,000 active chronic patients.',
                'Formulated 32 automated customer journeys and event-driven triggers, supported by RFM clustering and persona models in Python and SQL.',
                'Enforced strict IP warming protocols for high-volume email channels, maintaining a 99% deliverability rate baseline.'
            ],
            kpis: [
                { val: '$116M+', lbl: 'Attributed Revenue Generated' },
                { val: '55.5M', lbl: 'Communications Dispatched' },
                { val: '+13%', lbl: 'Prescription Refill Rate' },
                { val: '+12%', lbl: 'In-Store Average Order Value (AOV)' }
            ]
        },
        'itsm-sentiment': {
            badge: 'AI & Operational Analytics Case Study',
            title: 'ITSM Performance & Sentiment Analysis Dashboard',
            flow: [
                'Oracle RightNow Support Logs',
                'Automated Python & Dataflow Extraction',
                'Fabric Notebook (Azure OpenAI Service Sentiment Modeling)',
                'Star-Schema Analytical Model',
                'Power BI Executive SLA Intelligence Dashboard'
            ],
            situation: 'The enterprise IT Service Management team managed high volumes of tickets with limited visibility into friction points and sentiment trends. Operational reporting was purely retrospective, tracking only time-to-close without understanding the root causes of customer frustration or anticipating SLA breaches.',
            actions: [
                'Engineered an automated ETL pipeline extracting and transforming operational support logs from Oracle RightNow into a clean star-schema model.',
                'Connected Microsoft Fabric Notebooks with Azure OpenAI Service to analyze support ticket transcripts, classifying sentiment, urgency, and core topic drivers.',
                'Formulated advanced DAX measures for SLA compliance, first-contact resolution rates, and departmental backlog trends.',
                'Delivered an interactive executive Power BI dashboard enabling regional leadership to proactively address friction points and prevent service level breaches.'
            ],
            kpis: [
                { val: 'Real-Time', lbl: 'SLA Breach Prevention' },
                { val: 'Azure OpenAI', lbl: 'NLP Sentiment Classification' },
                { val: '100%', lbl: 'Star Schema Data Model Coverage' },
                { val: 'Proactive', lbl: 'Leadership Visibility' }
            ]
        }
    };

    const modalOverlay = document.getElementById('case-study-modal');
    const modalBadge = document.getElementById('modal-badge');
    const modalTitle = document.getElementById('modal-title');
    const modalFlow = document.getElementById('modal-flow');
    const modalSituation = document.getElementById('modal-situation');
    const modalActions = document.getElementById('modal-actions');
    const modalKpis = document.getElementById('modal-kpis');
    const modalCloseBtn = document.getElementById('modal-close-btn');

    function openModal(projectId) {
        const data = caseStudies[projectId];
        if (!data || !modalOverlay) return;

        modalBadge.textContent = data.badge;
        modalTitle.textContent = data.title;
        modalSituation.textContent = data.situation;

        // Render Architecture Flow
        modalFlow.innerHTML = data.flow.map((step, idx) => {
            const separator = idx < data.flow.length - 1 ? '<span class="arch-separator">➔</span>' : '';
            return `<div class="arch-step"><span>${step}</span></div>${separator}`;
        }).join('');

        // Render Action Bullets
        modalActions.innerHTML = data.actions.map(act => `<li>${act}</li>`).join('');

        // Render KPIs
        modalKpis.innerHTML = data.kpis.map(kpi => `
            <div class="kpi-card">
                <div class="kpi-val">${kpi.val}</div>
                <div class="kpi-lbl">${kpi.lbl}</div>
            </div>
        `).join('');

        modalOverlay.classList.add('active');
        document.body.style.overflow = 'hidden';

        if (window.lucide) {
            window.lucide.createIcons();
        }
    }

    function closeModal() {
        if (!modalOverlay) return;
        modalOverlay.classList.remove('active');
        document.body.style.overflow = '';
    }

    document.querySelectorAll('.btn-case-study').forEach(btn => {
        btn.addEventListener('click', () => {
            const projectId = btn.getAttribute('data-project');
            openModal(projectId);
        });
    });

    if (modalCloseBtn) {
        modalCloseBtn.addEventListener('click', closeModal);
    }

    if (modalOverlay) {
        modalOverlay.addEventListener('click', (e) => {
            if (e.target === modalOverlay) {
                closeModal();
            }
        });
    }

    window.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modalOverlay && modalOverlay.classList.contains('active')) {
            closeModal();
        }
    });

    // 9. Consultation Inquiry Modal & Smart Email Dispatch
    const consultModal = document.getElementById('consultation-modal');
    const consultCloseBtn = document.getElementById('consult-close-btn');
    const consultForm = document.getElementById('consultation-form');
    const serviceSelect = document.getElementById('inquiry-service');
    const formStatus = document.getElementById('form-status');

    const serviceMap = {
        'fabric': 'Microsoft Fabric & Cloud Modernization',
        'powerbi': 'Power BI & Advanced DAX Architecture',
        'pipeline': 'Data Pipeline Engineering & Automation',
        'mentoring': '1-on-1 Data Strategy & Mentoring',
        'mentor': '1-on-1 Data Strategy & Mentoring'
    };

    function openConsultModal(defaultService) {
        if (!consultModal) return;
        if (serviceSelect && defaultService) {
            const mappedService = serviceMap[defaultService] || defaultService;
            serviceSelect.value = mappedService;
        }
        if (formStatus) {
            formStatus.classList.remove('active');
        }
        consultModal.classList.add('active');
        document.body.style.overflow = 'hidden';

        if (window.lucide) {
            window.lucide.createIcons();
        }
    }

    function closeConsultModal() {
        if (!consultModal) return;
        consultModal.classList.remove('active');
        document.body.style.overflow = '';
    }

    document.querySelectorAll('.btn-inquire').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            const service = btn.getAttribute('data-service') || 'fabric';
            openConsultModal(service);
        });
    });

    if (consultCloseBtn) {
        consultCloseBtn.addEventListener('click', closeConsultModal);
    }

    if (consultModal) {
        consultModal.addEventListener('click', (e) => {
            if (e.target === consultModal) {
                closeConsultModal();
            }
        });
    }

    window.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && consultModal && consultModal.classList.contains('active')) {
            closeConsultModal();
        }
    });

    if (consultForm) {
        consultForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            const submitBtn = document.getElementById('consult-submit-btn');
            const originalBtnHtml = submitBtn ? submitBtn.innerHTML : '';
            if (submitBtn) {
                submitBtn.disabled = true;
                submitBtn.innerHTML = `<span>Sending...</span>`;
            }

            if (formStatus) {
                formStatus.className = 'form-status-alert';
                formStatus.style.display = 'none';
            }

            const formData = new FormData(consultForm);

            try {
                const response = await fetch('https://api.web3forms.com/submit', {
                    method: 'POST',
                    body: formData
                });
                const data = await response.json();

                if (data.success) {
                    if (formStatus) {
                        formStatus.innerHTML = `
                            <i data-lucide="check-circle-2" style="width: 18px; height: 18px; color: #10b981;"></i>
                            <span style="color: #10b981;">Thank you! Your consultation inquiry has been sent directly to Amgad Yassin. I'll get back to you within 24 hours.</span>
                        `;
                        formStatus.style.display = 'flex';
                        formStatus.classList.add('active');
                        if (window.lucide) window.lucide.createIcons();
                    }
                    consultForm.reset();
                    if (submitBtn) {
                        submitBtn.innerHTML = `<i data-lucide="check" style="width: 16px; height: 16px;"></i> Sent Successfully!`;
                        if (window.lucide) window.lucide.createIcons();

                        setTimeout(() => {
                            submitBtn.disabled = false;
                            submitBtn.innerHTML = originalBtnHtml;
                            if (window.lucide) window.lucide.createIcons();
                        }, 4000);
                    }
                } else {
                    throw new Error(data.message || 'Submission failed');
                }
            } catch (err) {
                if (formStatus) {
                    formStatus.innerHTML = `
                        <i data-lucide="alert-circle" style="width: 18px; height: 18px; color: #ef4444;"></i>
                        <span style="color: #ef4444;">Submission failed. You can reach out directly via <a href="mailto:amgad.m.yassin@gmail.com" style="text-decoration: underline; color: inherit;">amgad.m.yassin@gmail.com</a>.</span>
                    `;
                    formStatus.style.display = 'flex';
                    formStatus.classList.add('active');
                    if (window.lucide) window.lucide.createIcons();
                }
                if (submitBtn) {
                    submitBtn.disabled = false;
                    submitBtn.innerHTML = originalBtnHtml;
                    if (window.lucide) window.lucide.createIcons();
                }
            }
        });
    }

    // 9. Interactive Card Spotlight Tracking (Linear / Raycast Style)
    const spotlightCards = document.querySelectorAll('.project-card, .service-card, .stat-item, .skill-card, .contact-card');
    spotlightCards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            card.style.setProperty('--mouse-x', `${x}px`);
            card.style.setProperty('--mouse-y', `${y}px`);
        });
    });
});


