const DB = {
    communities: [
        { id: "tech-innovators", name: "Tech Innovators (Delhi)", focus: "Technical", members: 1250, description: "Budding developers and AI enthusiasts." },
        { id: "fin-leaders", name: "Modern Finance Hub", focus: "Commercial", members: 840, description: "Discussing markets, CA prep, and fintech." },
        { id: "creative-space", name: "Design & Arts Collective", focus: "Creative", members: 2100, description: "Portfolio reviews and creative workshops." },
        { id: "impact-society", name: "Social Impact Forum", focus: "Social", members: 670, description: "Policy discussions and community service." }
    ],
    communityMessages: {
        "tech-innovators": [
            { user: "Arjun S.", text: "Just finished the Python bootcamp. Any tips for ML next?", time: "2h ago" },
            { user: "Priya K.", text: "Check out the Coursera link in the hub!", time: "1h ago" }
        ],
        "fin-leaders": [
            { user: "Rohan M.", text: "Anyone prepping for the CA foundation exam?", time: "3h ago" }
        ],
        "creative-space": [
            { user: "Maya L.", text: "Portfolio reviews starting at 5 PM today!", time: "30m ago" }
        ],
        "impact-society": [
            { user: "Sameer V.", text: "Volunteering opportunity at the local NGO this weekend.", time: "1d ago" }
        ]
    },
    experiences: [
        { title: "Junior Web Dev Intern", company: "TechFlow Solutions", role: "Web Developer", focus: "Technical", type: "Internship", duration: "4 Weeks", stipend: "₹5,000" },
        { title: "Financial Literacy Volunteer", company: "FinEdu NGO", role: "Volunteer", focus: "Commercial", type: "Volunteering", duration: "2 Weeks", stipend: "Unpaid" },
        { title: "Graphic Design Assistant", company: "Artisan Studios", role: "Designer", focus: "Creative", type: "Internship", duration: "6 Weeks", stipend: "₹8,000" },
        { title: "Policy Research Intern", company: "Youth Policy Lab", role: "Researcher", focus: "Social", type: "Internship", duration: "8 Weeks", stipend: "₹3,000" },
        { title: "Open Source Contributor", company: "GlobalCode", role: "Developer", focus: "Technical", type: "Volunteering", duration: "Ongoing", stipend: "Experience" },
        { title: "Virtual Software Intern", company: "JPMorgan Chase", role: "Software Engineer", duration: "5-6 Hours", type: "Virtual", link: "#", simId: "fullstack" },
        { title: "Strategy Consultant Job Sim", company: "BCG", role: "Consultant", duration: "6-7 Hours", type: "Virtual", link: "#", simId: "data-scientist" },
        { title: "Digital Design Experience", company: "EA Sports", role: "Designer", duration: "4-5 Hours", type: "Virtual", link: "#", simId: "creative" },
        { title: "Legal Virtual Experience", company: "Latham & Watkins", role: "Lawyer", duration: "5-6 Hours", type: "Virtual", link: "#", simId: "legal" },
        { title: "Data Analytics Simulation", company: "KPMG", role: "Data Analyst", duration: "4-5 Hours", type: "Virtual", link: "#", simId: "data-scientist" }
    ],
    questions: [
        { text: "Do you enjoy logic-based puzzles or debugging code?", domain: "Technical", points: { science: 10, commerce: 2 } },
        { text: "Are you interested in how economies and stock markets function?", domain: "Commercial", points: { commerce: 10 } },
        { text: "Do you enjoy creative writing or visual design?", domain: "Creative", points: { arts: 10 } },
        { text: "Does the idea of helping people through psychology or law appeal to you?", domain: "Social", points: { arts: 10, commerce: 3 } },
        {
            text: "How would you like to spend a weekend?", options: [
                { text: "Building a small robot or app", domain: "Technical", points: { science: 10 } },
                { text: "Running a fundraiser or trading mock stocks", domain: "Managerial", points: { commerce: 10 } },
                { text: "Visiting an art gallery or writing poetry", domain: "Creative", points: { arts: 10 } },
                { text: "Volunteering for a social cause", domain: "Social", points: { arts: 10 } }
            ]
        },
        {
            text: "Which subject attracts you most?", options: [
                { text: "Calculus / Quantum Physics", domain: "Analytical", points: { science: 10 } },
                { text: "Business Ethics / Accounting", domain: "Managerial", points: { commerce: 10 } },
                { text: "Philosophy / World Literature", domain: "Social", points: { arts: 10 } }
            ]
        },
        {
            text: "When you see a problem, do you first look at...", options: [
                { text: "The underlying technology and data", domain: "Technical", points: { science: 10 } },
                { text: "The financial impact and cost-benefit", domain: "Commercial", points: { commerce: 10 } },
                { text: "The human emotion and story involved", domain: "Humanistic", points: { arts: 10 } }
            ]
        },
        {
            text: "Do you prefer structured routines or creative freedom?", options: [
                { text: "Structured, with clear logical rules", points: { science: 8, commerce: 4 } },
                { text: "Flexible, where I can innovate daily", points: { arts: 10, science: 3 } }
            ]
        },
        {
            text: "What's your stance on mathematics?", options: [
                { text: "It's a beautiful language of nature", points: { science: 10 } },
                { text: "It's a tool for measuring success/profit", points: { commerce: 8 } },
                { text: "I prefer languages and social sciences", points: { arts: 10 } }
            ]
        },
        {
            text: "Which career sounds most prestigious to you?", options: [
                { text: "Chief Technology Officer / Surgeon", points: { science: 10 } },
                { text: "CEO / Investment Banker / CA", points: { commerce: 10 } },
                { text: "International Diplomat / Film Director", points: { arts: 10 } }
            ]
        }
    ],
    degrees: [
        { id: "btech", name: "B.Tech (Engineering)", duration: "4 Years", scope: "Very High", growth: "High", careers: "Software, Robotics, Civil", stream: "Science" },
        { id: "mbbs", name: "MBBS", duration: "5.5 Years", scope: "Critical", growth: "Steady", careers: "Doctor, Specialist, Surgeon", stream: "Science" },
        { id: "bcom", name: "B.Com", duration: "3 Years", scope: "High", growth: "High", careers: "Accountant, Banker, Tax Expert", stream: "Commerce" },
        { id: "bba", name: "BBA", duration: "3 Years", scope: "Moderate", growth: "Very High", careers: "Manager, HR, Marketing", stream: "Commerce" },
        { id: "ba", name: "B.A (Humanities)", duration: "3 Years", scope: "Diverse", growth: "Moderate", careers: "Media, Civil Services, Educator", stream: "Arts" },
        { id: "finarts", name: "B.Fine Arts", duration: "4 Years", scope: "Creative", growth: "Variable", careers: "Designer, Artist, Animator", stream: "Arts" }
    ],
    colleges: [
        {
            name: "Government Polytechnic, Mumbai",
            city: "Mumbai",
            state: "Maharashtra",
            streams: ["Science", "Engineering"],
            eligibility: "10th Pass (>35%)",
            fees: "₹10,500/yr",
            image: "https://images.unsplash.com/photo-1562774053-701939374585?auto=format&fit=crop&q=80&w=300"
        },
        {
            name: "Delhi College of Arts & Commerce",
            city: "Delhi",
            state: "Delhi",
            streams: ["Arts", "Commerce"],
            eligibility: "CUET Qualified",
            fees: "₹15,000/yr",
            image: "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&q=80&w=300"
        },
        {
            name: "Government Science College, Bangalore",
            city: "Bangalore",
            state: "Karnataka",
            streams: ["Science"],
            eligibility: "12th Pass (PCM)",
            fees: "₹7,100/yr",
            image: "https://images.unsplash.com/photo-1592280771190-3e2e4d571952?auto=format&fit=crop&q=80&w=300"
        },
        {
            name: "Government Arts College (Men), Chennai",
            city: "Chennai",
            state: "Tamil Nadu",
            streams: ["Arts", "Science"],
            eligibility: "12th Pass (>70%)",
            fees: "₹2,500/yr",
            image: "https://images.unsplash.com/photo-1525921429624-479b6a26d84d?auto=format&fit=crop&q=80&w=300"
        },
        {
            name: "Fergusson College",
            city: "Pune",
            state: "Maharashtra",
            streams: ["Arts", "Science"],
            eligibility: "12th Pass (>85%)",
            fees: "₹11,000/yr",
            image: "https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&q=80&w=300"
        },
        {
            name: "Nizam College",
            city: "Hyderabad",
            state: "Telangana",
            streams: ["Arts", "Science", "Commerce"],
            eligibility: "DOST Process",
            fees: "₹5,000/yr",
            image: "https://images.unsplash.com/photo-1551632811-561732d1e306?auto=format&fit=crop&q=80&w=300"
        },
        {
            name: "Presidency University",
            city: "Kolkata",
            state: "West Bengal",
            streams: ["Arts", "Science"],
            eligibility: "PUBDET Exam",
            fees: "₹8,500/yr",
            image: "https://images.unsplash.com/photo-1590012314607-cda9d9b699ae?auto=format&fit=crop&q=80&w=300"
        },
        {
            name: "University Maharaja College",
            city: "Jaipur",
            state: "Rajasthan",
            streams: ["Science"],
            eligibility: "12th Merit",
            fees: "₹8,300/yr",
            image: "https://images.unsplash.com/photo-1599689018442-5ba315e91763?auto=format&fit=crop&q=80&w=300"
        },
        {
            name: "Govt. College of Engineering & Technology",
            city: "Jammu",
            state: "Jammu and Kashmir",
            streams: ["Science", "Engineering"],
            eligibility: "JKCET Qualified",
            fees: "₹12,000/yr",
            image: "https://images.unsplash.com/photo-1541178735493-479c1a27ed24?auto=format&fit=crop&q=80&w=300"
        },
        {
            name: "Abdul Ahad Azad Memorial Degree College",
            city: "Srinagar",
            state: "Jammu and Kashmir",
            streams: ["Arts", "Commerce", "Science"],
            eligibility: "12th Merit",
            fees: "₹4,500/yr",
            image: "https://images.unsplash.com/photo-1588011930968-eadfa82f808f?auto=format&fit=crop&q=80&w=300"
        },
        {
            name: "GGM Science College",
            city: "Jammu",
            state: "Jammu and Kashmir",
            streams: ["Science"],
            eligibility: "12th Pass (>60%)",
            fees: "₹6,500/yr",
            image: "https://images.unsplash.com/photo-1562774053-701939374585?auto=format&fit=crop&q=80&w=300"
        },
        {
            name: "Government Medical College (GMC)",
            city: "Srinagar",
            state: "Jammu and Kashmir",
            streams: ["Science", "Medical"],
            eligibility: "NEET Qualified",
            fees: "₹25,000/yr",
            image: "https://images.unsplash.com/photo-1519452635265-7b1fbfd1e4e0?auto=format&fit=crop&q=80&w=300"
        },
        {
            name: "Government Degree College (GDC) Women",
            city: "Baramulla",
            state: "Jammu and Kashmir",
            streams: ["Arts", "Science", "Commerce"],
            eligibility: "12th Merit",
            fees: "₹3,200/yr",
            image: "https://images.unsplash.com/photo-1523050335392-495286105f9c?auto=format&fit=crop&q=80&w=300"
        }
    ],
    roleplays: {
        ds: [
            { q: "A stakeholder asks for a 99% accuracy model by tomorrow. The current baseline is 75%.", options: ["Promise it and work all night", "Explain the trade-offs and request more time/data", "Use a simpler model and fudge the results"], correct: 1, feedback: "Honesty and data integrity are key. Over-promising leads to technical debt." },
            { q: "You find a bias in your dataset that favors older users.", options: ["Ignore it, it's just data", "Remove the age column entirely", "Re-sample the data or add fairness constraints"], correct: 2, feedback: "Ethical AI requires actively mitigating bias, not just ignoring it." }
        ],
        lawyer: [
            { q: "Your client admits they are guilty, but you are defending them in court.", options: ["Withdraw from the case", "Focus on procedural fairness and legal rights", "Tell the judge the truth"], correct: 1, feedback: "A lawyer's duty is to ensure a fair trial and protect legal rights, regardless of personal belief." }
        ],
        ux_ui: [
            { q: "Users are struggling to find the 'checkout' button in your app.", options: ["Make it a bright neon color", "Conduct user interviews to find the friction point", "Add more text labels"], correct: 1, feedback: "User research should drive design changes, not just aesthetic guesses." }
        ],
        webdev: [
            { q: "A critical security vulnerability is found in a third-party library your app uses. What's the first step?", options: ["Rewrite the feature from scratch", "Update the library and deploy a hotfix", "Wait for the next scheduled release"], correct: 1, feedback: "Security issues require immediate attention through patching or hotfixing." },
            { q: "The site is loading slowly on mobile devices. What's the most effective optimization?", options: ["Compress large images and use lazy loading", "Remove all Javascript", "Tell users to use desktops"], correct: 0, feedback: "Modern web performance relies on optimizing heavy assets like high-res images." }
        ],
        consultant: [
            { q: "A client disagrees with your data-driven recommendation because of their 'gut feeling'.", options: ["Change the data to match their feeling", "Quietly ignore their feedback", "Presented the data again with clear visualization of the risks of the 'gut' choice"], correct: 2, feedback: "Consultants must back recommendations with clear evidence while acknowledging client concerns." }
        ],
        finance: [
            { q: "You are budgeting for a new project but the initial cost estimates exceed the available capital.", options: ["Take a high-interest loan without approval", "Prioritize essential features and defer non-critical scope", "Fudge the numbers to make it fit"], correct: 1, feedback: "Financial management involves making tough choices about resource allocation." }
        ]
    },
    scholarships: [
        { name: "SBI Asha Scholarship", category: "Merit", amount: "₹15,000 - ₹5L", eligibility: "Class 6-12 & UG (Top 300 Colleges)", stream: "All" },
        { name: "Reliance Foundation", category: "Needs", amount: "Up to ₹2 Lakhs", eligibility: "1st Yr UG, Income < ₹15L", stream: "All" },
        { name: "HDFC Parivartan ECSS", category: "Need", amount: "Up to ₹75,000", eligibility: "Income < ₹2.5L", stream: "All" },
        { name: "INSPIRE SHE", category: "Merit", amount: "₹80,000/yr", eligibility: "Top 1% Class 12 (Science)", stream: "Science" },
        { name: "Tata Capital Pankh", category: "Merit-Means", amount: "Up to 80% Fees", eligibility: "Income < ₹2.5L", stream: "All" },
        { name: "Central Sector Scheme", category: "Merit", amount: "₹12,000/yr", eligibility: "Top 20th Percentile Class 12", stream: "All" },
        { name: "AICTE PG Scholarship", category: "Technical", amount: "₹12,400/mo", eligibility: "GATE/GPAT Qualified", stream: "Technical" },
        { name: "Chevening Scholarship", category: "Global", amount: "Full Funding", eligibility: "Leadership + Graduation", stream: "All" }
    ],
    exams: [
        { name: "JEE Advanced", date: "May 19, 2025", scope: "IIT Admissions", eligibility: "Job Main Qualified", difficulty: "High" },
        { name: "NEET UG", date: "May 4, 2025", scope: "Medical Admissions", eligibility: "Class 12 (PCB)", difficulty: "High" },
        { name: "UPSC CSE Prelims", date: "May 25, 2025", scope: "Civil Services", eligibility: "Graduation", difficulty: "V. High" },
        { name: "SSC CGL", date: "Sept-Oct 2025", scope: "Govt Staff", eligibility: "Graduation", difficulty: "Medium-High" },
        { name: "CLAT", date: "Dec 3, 2025", scope: "National Law Universities", eligibility: "Class 12", difficulty: "Medium-High" },
        { name: "CAT", date: "Nov 24, 2024", scope: "IIM Admissions", eligibility: "Graduation", difficulty: "High" },
        { name: "GATE", date: "Feb 2025", scope: "M.Tech/PSU Jobs", eligibility: "Graduation", difficulty: "High" },
        { name: "NDA (I)", date: "April 21, 2025", scope: "Defence Services", eligibility: "Class 12", difficulty: "Medium" }
    ],
    examMapping: {
        "JEE Advanced": ["Technical", "Engineering", "Software Engineer", "Data Scientist", "Cloud Architect", "AI Engineer"],
        "NEET UG": ["Medical", "Healthcare", "Doctor", "Surgeon", "Clinical Psychologist"],
        "CLAT": ["Social", "Law", "Corporate Lawyer", "Legal Researcher"],
        "UPSC CSE": ["Social", "Administrative", "Diplomat", "Policy Analyst", "Social Worker"],
        "CAT": ["Commercial", "Management", "Product Manager", "Business Development", "Investment Banker"]
    },
    mentors: [
        { name: "Dr. Aris Thorne", role: "Principal AI Scientist", bio: "Ex-Google, specialized in NLP & LLMs.", focus: "Technical", advice: "Master the math before the code." },
        { name: "Sarah Jenkins", role: "Sr. Product Manager", bio: "Leading fintech products for 10+ years.", focus: "Commercial", advice: "Understand the 'Why' before the 'What'." },
        { name: "Leo Rivera", role: "Award-winning UX Lead", bio: "Design mentor for global startups.", focus: "Creative", advice: "Empathy is your strongest design tool." },
        { name: "Anya K.", role: "Public Policy Consultant", bio: "Advisor to international NGOs.", focus: "Social", advice: "Policy is about people, not just papers." },
        { name: "Marco V.", role: "Senior Admissions Expert", bio: "Former IVY League admissions officer.", focus: "Global Hub", advice: "Your SOP should tell a story, not just list grades." }
    ],
    globalColleges: [
        { name: "Stanford University", location: "California, USA", focus: "Technical", rank: "#1 (Tech)", scholarships: "Need-Blind", link: "https://www.stanford.edu" },
        { name: "University of Oxford", location: "UK", focus: "Social", rank: "#1 (Arts/Hum)", scholarships: "Rhodes Scholarship", link: "https://www.ox.ac.uk" },
        { name: "National University of Singapore (NUS)", location: "Singapore", focus: "Technical/Commercial", rank: "#1 (Asia)", scholarships: "ASEAN Scholarship", link: "https://www.nus.edu.sg" },
        { name: "University of Toronto", location: "Canada", focus: "Technical", rank: "#1 (Canada)", scholarships: "Lester B. Pearson", link: "https://www.utoronto.ca" },
        { name: "Massachusetts Institute of Technology (MIT)", location: "Massachusetts, USA", focus: "Technical", rank: "#1 (QS)", scholarships: "Need-Blind", link: "https://www.mit.edu" },
        { name: "University of Cambridge", location: "UK", focus: "Science/Arts", rank: "#2 (UK)", scholarships: "Gates Cambridge", link: "https://www.cam.ac.uk" },
        { name: "ETH Zurich", location: "Switzerland", focus: "Technical", rank: "#1 (Europe)", scholarships: "Excellence Scholarship", link: "https://ethz.ch" },
        { name: "University of Tokyo", location: "Japan", focus: "Research", rank: "#1 (Japan)", scholarships: "MEXT Scholarship", link: "https://www.u-tokyo.ac.jp" }
    ],
    interviewQuestions: {
        "Technical": [
            "Tell me about a time you solved a complex technical problem using a new tool.",
            "How do you stay updated with rapidly evolving technologies like AI?",
            "Describe a situation where you had to explain a technical concept to a non-technical stakeholder.",
            "How do you handle disagreements within a development team?",
            "Why do you want to pursue a career in technology?"
        ],
        "Commercial": [
            "Describe a time you identified a business opportunity or efficiency improvement.",
            "How do you handle high-pressure situations with tight deadlines?",
            "What is your approach to negotiating with difficult clients or stakeholders?",
            "Explain a time you had to pivot a strategy based on new data.",
            "Where do you see the future of global finance in the next 5 years?"
        ],
        "Creative": [
            "How do you handle constructive criticism on your creative work?",
            "Tell me about a project where you had to balance your artistic vision with client requirements.",
            "Where do you find inspiration when faced with a 'creative block'?",
            "Describe a time you used design to solve a user problem.",
            "What role does empathy play in your creative process?"
        ],
        "Social": [
            "Why are you passionate about making a social impact?",
            "Describe a time you had to manage a conflict within a community group.",
            "How do you measure the success of a social initiative?",
            "Tell me about a time you had to advocate for someone else's needs.",
            "How do you stay resilient when working on long-term social challenges?"
        ]
    },
    careers: [
        { id: "ds", title: "Data Scientist", category: "Technical", salary: "₹8L - ₹30L+", skills: ["Python", "ML", "Stats", "SQL"], day: "Modeling user data and visualizing insights.", toolkit: ["Jupyter", "TF", "Tableau"], metrics: { demand: 95, difficulty: 85, balance: 70 }, quiz: "Which algorithm is commonly used for classification?" },
        { id: "se", title: "Software Engineer", category: "Technical", salary: "₹6L - ₹25L+", skills: ["Git", "Web Dev", "System Design"], day: "Building scalable backend architectures.", toolkit: ["VS Code", "Docker", "React"], metrics: { demand: 90, difficulty: 75, balance: 80 }, quiz: "What does DRY stand for in coding?" },
        { id: "cyber", title: "Cybersecurity Analyst", category: "Technical", salary: "₹7L - ₹22L+", skills: ["Network Sec", "Pen-testing", "Ethics"], day: "Monitoring systems for breaches and vulnerabilities.", toolkit: ["Wireshark", "Kali", "Metasploit"], metrics: { demand: 92, difficulty: 80, balance: 65 }, quiz: "What is a 'Man-in-the-middle' attack?" },
        { id: "cloud", title: "Cloud Architect", category: "Technical", salary: "₹12L - ₹40L+", skills: ["AWS/Azure", "DevOps", "Networking"], day: "Designing cloud infrastructure and migration paths.", toolkit: ["Terraform", "Kubernetes", "IAM"], metrics: { demand: 94, difficulty: 88, balance: 75 }, quiz: "What is 'Serverless' computing?" },
        { id: "ai_eng", title: "AI Engineer", category: "Technical", salary: "₹10L - ₹35L+", skills: ["Deep Learning", "NLP", "Python"], day: "Deploying neural networks and fine-tuning LLMs.", toolkit: ["PyTorch", "HuggingFace", "GPU Clusters"], metrics: { demand: 98, difficulty: 92, balance: 68 }, quiz: "What is Backpropagation?" },
        { id: "game_dev", title: "Game Developer", category: "Technical", salary: "₹5L - ₹20L+", skills: ["C#", "Unity", "Physics", "Math"], day: "Implementing gameplay mechanics and rendering logic.", toolkit: ["Unity", "Unreal Engine", "Blender"], metrics: { demand: 70, difficulty: 85, balance: 60 }, quiz: "What is a 'Game Loop'?" },
        { id: "fullstack", title: "Full-Stack Developer", category: "Technical", salary: "₹6L - ₹24L+", skills: ["JS", "MongoDB", "CSS", "Node"], day: "Developing end-to-end features and user flows.", toolkit: ["MERN Stack", "Next.js", "Postman"], metrics: { demand: 88, difficulty: 70, balance: 78 }, quiz: "What is the difference between SQL and NoSQL?" },
        { id: "data_eng", title: "Data Engineer", category: "Technical", salary: "₹9L - ₹28L+", skills: ["ETL", "Big Data", "Spark", "NoSQL"], day: "Building robust data pipelines and warehouses.", toolkit: ["Airflow", "Kafka", "Snowflake"], metrics: { demand: 93, difficulty: 82, balance: 72 }, quiz: "What does ETL stand for?" },
        { id: "devops", title: "DevOps Engineer", category: "Technical", salary: "₹8L - ₹26L+", skills: ["CI/CD", "Linux", "Scripting"], day: "Automating deployments and ensuring uptime.", toolkit: ["Jenkins", "Ansible", "Grafana"], metrics: { demand: 91, difficulty: 84, balance: 74 }, quiz: "What is Infrastructure as Code?" },
        { id: "qa_eng", title: "QA Automation Engineer", category: "Technical", salary: "₹5L - ₹18L+", skills: ["Selenium", "Testing", "Python"], day: "Writing automated test suites for software releases.", toolkit: ["Pytest", "Cypress", "Appium"], metrics: { demand: 75, difficulty: 65, balance: 85 }, quiz: "What is Regression Testing?" },
        { id: "ca", title: "Chartered Accountant", category: "Commercial", salary: "₹7L - ₹20L+", skills: ["Tax", "Audit", "Law"], day: "Filing corporate taxes and auditing balance sheets.", toolkit: ["Tally", "Excel", "SAP"], metrics: { demand: 85, difficulty: 90, balance: 65 }, quiz: "What is Double Entry Bookkeeping?" },
        { id: "pm", title: "Product Manager", category: "Commercial", salary: "₹10L - ₹35L+", skills: ["Strategy", "UX", "Agile"], day: "Defining product roadmaps and feature backlogs.", toolkit: ["Jira", "Figma", "Mixpanel"], metrics: { demand: 88, difficulty: 70, balance: 75 }, quiz: "What is an MVP?" },
        { id: "inv_bank", title: "Investment Banker", category: "Commercial", salary: "₹12L - ₹50L+", skills: ["M&A", "Valuation", "Econ"], day: "Advising on mergers and raising capital.", toolkit: ["Bloomberg", "FactSet", "Excel"], metrics: { demand: 82, difficulty: 95, balance: 40 }, quiz: "What is an IPO?" },
        { id: "fin_analyst", title: "Financial Analyst", category: "Commercial", salary: "₹6L - ₹18L+", skills: ["Modelling", "Rpting", "Stocks"], day: "Tracking market trends and assessing investments.", toolkit: ["Python (Pandas)", "PowerBI", "SAP"], metrics: { demand: 80, difficulty: 75, balance: 70 }, quiz: "What is Fundamental Analysis?" },
        { id: "hr_mgr", title: "HR Manager", category: "Commercial", salary: "₹5L - ₹20L+", skills: ["Hiring", "Policy", "Culture"], day: "Managing talent acquisition and employee relations.", toolkit: ["Workday", "LinkedIn", "BambooHR"], metrics: { demand: 78, difficulty: 60, balance: 82 }, quiz: "What is 360-degree feedback?" },
        { id: "mkt_mgr", title: "Marketing Manager", category: "Commercial", salary: "₹6L - ₹22L+", skills: ["SEO", "Content", "Ads"], day: "Running growth campaigns and tracking ROI.", toolkit: ["Google Ads", "Hootsuite", "Semrush"], metrics: { demand: 84, difficulty: 65, balance: 78 }, quiz: "What is a Conversion Rate?" },
        { id: "supply_chain", title: "Supply Chain Manager", category: "Commercial", salary: "₹7L - ₹24L+", skills: ["Logistics", "Ops", "ERP"], day: "Optimizing global shipping and inventory flows.", toolkit: ["Oracle SCM", "Tableau", "Excel"], metrics: { demand: 86, difficulty: 72, balance: 72 }, quiz: "What is JIT (Just In Time)?" },
        { id: "risk_assoc", title: "Risk Associate", category: "Commercial", salary: "₹8L - ₹20L+", skills: ["Credit", "Risk", "Compliance"], day: "Evaluating financial risks for banks and insurers.", toolkit: ["SAS", "SQL", "Moody's"], metrics: { demand: 83, difficulty: 78, balance: 75 }, quiz: "What is Credit Risk?" },
        { id: "biz_dev", title: "Business Development", category: "Commercial", salary: "₹5L - ₹25L+", skills: ["Sales", "Negotiation", "CRM"], day: "Closing deals and expanding market share.", toolkit: ["Salesforce", "HubSpot", "ZoomInfo"], metrics: { demand: 89, difficulty: 68, balance: 70 }, quiz: "What is a Sales Funnel?" },
        { id: "actuary", title: "Actuary", category: "Commercial", salary: "₹10L - ₹30L+", skills: ["Risk", "Prob", "Math"], day: "Predicting financial outcomes for insurance.", toolkit: ["R", "Excel", "Prophet"], metrics: { demand: 85, difficulty: 98, balance: 80 }, quiz: "What is Actuarial Science?" },
        { id: "gd", title: "Graphic Designer", category: "Creative", salary: "₹4L - ₹15L+", skills: ["Type", "Color", "Brand"], day: "Creating visual assets and brand identities.", toolkit: ["Illustrator", "Photoshop", "Canva"], metrics: { demand: 75, difficulty: 60, balance: 85 }, quiz: "What is Kerning?" },
        { id: "ux_ui", title: "UX/UI Designer", category: "Creative", salary: "₹6L - ₹22L+", skills: ["Figma", "Interaction", "User Flow"], day: "Designing digital interfaces and prototyping mobile apps.", toolkit: ["Figma", "Adobe XD", "Miro"], metrics: { demand: 88, difficulty: 72, balance: 82 }, quiz: "What is a User Persona?" },
        { id: "content_str", title: "Content Strategist", category: "Creative", salary: "₹5L - ₹18L+", skills: ["Copy", "SEO", "Editing"], day: "Planning brand narratives and multi-channel content.", toolkit: ["Grammarly", "WordPress", "Buffer"], metrics: { demand: 78, difficulty: 55, balance: 88 }, quiz: "What is Content Pillar?" },
        { id: "animator", title: "3D Animator", category: "Creative", salary: "₹6L - ₹25L+", skills: ["Modeling", "Motion", "CGI"], day: "Bringing characters to life for movies and games.", toolkit: ["Maya", "Cinema 4D", "After Effects"], metrics: { demand: 72, difficulty: 82, balance: 65 }, quiz: "What are the 12 principles of animation?" },
        { id: "fashion_des", title: "Fashion Designer", category: "Creative", salary: "₹4L - ₹20L+", skills: ["Textiles", "Styling", "Tailoring"], day: "Designing seasonal collections and trend forecasting.", toolkit: ["Clo3D", "Illustrator", "PatternMaker"], metrics: { demand: 65, difficulty: 75, balance: 60 }, quiz: "What is Haute Couture?" },
        { id: "interior_des", title: "Interior Designer", category: "Creative", salary: "₹5L - ₹18L+", skills: ["Space", "CAD", "Lighting"], day: "Conceptualizing residential and commercial spaces.", toolkit: ["AutoCAD", "SketchUp", "Revit"], metrics: { demand: 70, difficulty: 70, balance: 72 }, quiz: "What is Ergonomics?" },
        { id: "copywriter", title: "Ad Copywriter", category: "Creative", salary: "₹4L - ₹16L+", skills: ["Creative Writing", "Ads", "Psyc"], day: "Writing punchy lines for high-budget ad campaigns.", toolkit: ["Jasper AI", "Notion", "Slack"], metrics: { demand: 74, difficulty: 58, balance: 90 }, quiz: "What is AIDA in advertising?" },
        { id: "photog", title: "Professional Photographer", category: "Creative", salary: "₹3L - ₹15L+", skills: ["Camera", "Edit", "Light"], day: "Capturing high-end commercial or fashion shoots.", toolkit: ["Lightroom", "Capture One", "EOS R"], metrics: { demand: 60, difficulty: 65, balance: 75 }, quiz: "What is Depth of Field?" },
        { id: "video_editor", title: "Video Editor", category: "Creative", salary: "₹4L - ₹18L+", skills: ["Cutting", "Color", "Sound"], day: "Editing YouTube content and TV commercials.", toolkit: ["Premiere Pro", "DaVinci", "Final Cut"], metrics: { demand: 82, difficulty: 62, balance: 80 }, quiz: "What is a 'Jump Cut'?" },
        { id: "arch", title: "Architect", category: "Creative", salary: "₹6L - ₹25L+", skills: ["Safety", "Cstn", "Math"], day: "Designing building blueprints and site supervision.", toolkit: ["ArchiCAD", "Lumion", "Bluebeam"], metrics: { demand: 80, difficulty: 88, balance: 60 }, quiz: "What is sustainable architecture?" },
        { id: "psy", title: "Clinical Psychologist", category: "Social", salary: "₹5L - ₹18L+", skills: ["Counselling", "Empathy", "Research"], day: "Conducting therapy sessions and treatment plans.", toolkit: ["DSM-5", "Assessment Scales", "CBT"], metrics: { demand: 80, difficulty: 80, balance: 70 }, quiz: "What is CBT (Cognitive Behavioral Therapy)?" },
        { id: "lawyer", title: "Corporate Lawyer", category: "Social", salary: "₹10L - ₹40L+", skills: ["Litigation", "Laws", "Drafting"], day: "Defending corporations and drafting legal contracts.", toolkit: ["Westlaw", "LexisNexis", "Clio"], metrics: { demand: 85, difficulty: 94, balance: 45 }, quiz: "What is 'Due Diligence'?" },
        { id: "policy_analyst", title: "Policy Analyst", category: "Social", salary: "₹6L - ₹22L+", skills: ["Stats", "Govt", "Econ"], day: "Researching and writing policy recommendations.", toolkit: ["Stata", "Nvivo", "Excel"], metrics: { demand: 78, difficulty: 82, balance: 85 }, quiz: "What is a 'Policy Brief'?" },
        { id: "edu_consult", title: "Education Consultant", category: "Social", salary: "₹5L - ₹15L+", skills: ["Guidance", "Adm", "Comm"], day: "Advising students on university admissions.", toolkit: ["CommonApp", "UCAS", "Noodle"], metrics: { demand: 72, difficulty: 60, balance: 90 }, quiz: "What is the Common App?" },
        { id: "sw", title: "Social Worker", category: "Social", salary: "₹3L - ₹10L+", skills: ["Crisis", "Support", "NGO"], day: "Helping underprivileged communities and case work.", toolkit: ["MyCase", "RedCross App", "Caseload"], metrics: { demand: 65, difficulty: 65, balance: 65 }, quiz: "What is Social Advocacy?" },
        { id: "pr_mgr", title: "PR Manager", category: "Social", salary: "₹6L - ₹25L+", skills: ["Media", "Reputation", "Press"], day: "Managing brand crises and media outreach.", toolkit: ["Muck Rack", "Prowly", "Cision"], metrics: { demand: 82, difficulty: 70, balance: 72 }, quiz: "What is a Press Release?" },
        { id: "hr_ops", title: "HR Operations Associate", category: "Social", salary: "₹4L - ₹12L+", skills: ["Admin", "Payroll", "Benefits"], day: "Processing internal employee data and requests.", toolkit: ["Gusto", "Zenefits", "ADP"], metrics: { demand: 76, difficulty: 55, balance: 95 }, quiz: "What is Payroll processing?" },
        { id: "diplomat", title: "Diplomat (IFS)", category: "Social", salary: "₹12L - ₹30L+", skills: ["Intl Relations", "Lang", "Neg"], day: "Representing India at global summits and embassies.", toolkit: ["Diplomacy Guides", "Secure Links", "Briefs"], metrics: { demand: 88, difficulty: 99, balance: 50 }, quiz: "What is Bilateralism?" },
        { id: "edu_tech", title: "Instructional Designer", category: "Social", salary: "₹5L - ₹18L+", skills: ["LMS", "Curriculum", "Pedagogy"], day: "Creating digital course maps for online learning.", toolkit: ["Articulate", "Canva", "Canvas"], metrics: { demand: 84, difficulty: 68, balance: 88 }, quiz: "What is ADDIE model?" },
        { id: "legal_research", title: "Legal Researcher", category: "Social", salary: "₹4L - ₹12L+", skills: ["Research", "Archive", "Cases"], day: "Finding precedent cases for major trial lawyers.", toolkit: ["Manupatra", "SCC Online", "Zotero"], metrics: { demand: 70, difficulty: 75, balance: 82 }, quiz: "What are Precedent cases?" },
        { id: "bi_dev", title: "BI Developer", category: "Technical", salary: "₹7L - ₹22L+", skills: ["PowerBI", "DAX", "SQL"], day: "Building interactive dashboards for CEO level reporting.", toolkit: ["PowerBI", "Azure", "SQL Server"], metrics: { demand: 88, difficulty: 72, balance: 80 }, quiz: "What is DAX?" },
        { id: "ios_dev", title: "iOS Developer", category: "Technical", salary: "₹8L - ₹25L+", skills: ["Swift", "UIKit", "CocoaPods"], day: "Building high-performance iPhone and iPad applications.", toolkit: ["Xcode", "TestFlight", "Firebase"], metrics: { demand: 85, difficulty: 78, balance: 75 }, quiz: "What is Swift?" },
        { id: "blockchain", title: "Blockchain Developer", category: "Technical", salary: "₹12L - ₹45L+", skills: ["Solidity", "Rust", "Crypto"], day: "Smart contract development and DApp security audits.", toolkit: ["Hardhat", "Truffle", "Polygon"], metrics: { demand: 90, difficulty: 95, balance: 65 }, quiz: "What is a Smart Contract?" },
        { id: "fin_mgr", title: "Financial Manager", category: "Commercial", salary: "₹10L - ₹28L+", skills: ["Budgeting", "Cash Flow", "Strategy"], day: "Managing company liquid assets and long term goals.", toolkit: ["NetSuite", "Oracle", "SAP"], metrics: { demand: 85, difficulty: 82, balance: 70 }, quiz: "What is Cash Flow Management?" },
        { id: "ops_analyst", title: "Operations Analyst", category: "Commercial", salary: "₹6L - ₹18L+", skills: ["Efficiency", "Lean", "Excel"], day: "Improving internal workflows and reducing cost lag.", toolkit: ["Signavio", "Asana", "Tableau"], metrics: { demand: 80, difficulty: 65, balance: 82 }, quiz: "What is Lean methodology?" },
        { id: "sound_eng", title: "Sound Engineer", category: "Creative", salary: "₹4L - ₹15L+", skills: ["Mixing", "Logic Pro", "Acoustics"], day: "Mixing audio tracks for studio albums and live shows.", toolkit: ["Logic Pro X", "Ableton", "Pro Tools"], metrics: { demand: 62, difficulty: 78, balance: 70 }, quiz: "What is MIDI?" },
        { id: "event_mgr", title: "Event Manager", category: "Commercial", salary: "₹4L - ₹12L+", skills: ["Coordination", "Vendors", "Sales"], day: "Running large scale corporate summits and weddings.", toolkit: ["Cvent", "Bizzabo", "Checkflow"], metrics: { demand: 75, difficulty: 55, balance: 50 }, quiz: "What is Vendor Management?" },
        { id: "anthropologist", title: "Anthropologist", category: "Social", salary: "₹4L - ₹14L+", skills: ["Fieldwork", "Ethical", "Culture"], day: "Studying human development and historical evolution.", toolkit: ["Research Logs", "Archiving", "GPS"], metrics: { demand: 45, difficulty: 85, balance: 75 }, quiz: "What is Ethnography?" },
        { id: "sc_writer", title: "Science Writer", category: "Social", salary: "₹5L - ₹15L+", skills: ["Research", "Writing", "Comm"], day: "Simplifying complex biology/physics for general public.", toolkit: ["Medium", "Substack", "Notion"], metrics: { demand: 68, difficulty: 72, balance: 90 }, quiz: "What is Science Communication?" },
        { id: "urban_planner", title: "Urban Planner", category: "Social", salary: "₹6L - ₹20L+", minYears: 5, skills: ["Zoning", "GIS", "Community"], day: "Designing sustainable city layouts and park systems.", toolkit: ["ArcGIS", "AutoCAD", "InDesign"], metrics: { demand: 78, difficulty: 80, balance: 85 }, jobSecurity: 85, remoteWork: 30, quiz: "What is Urban Zoning?" }
    ],
    dayInLifeData: {
        'fullstack': {
            title: "Full Stack Developer",
            events: [
                {
                    time: "09:00 AM",
                    situation: "Morning Standup: The product manager adds a last-minute feature request for today's release.",
                    choices: [
                        { text: "Push back: 'We need to stick to the sprint plan.'", effect: { energy: 0, stress: -10, msg: "Team respects your boundaries. Smooth start." } },
                        { text: "Accept it: 'Sure, I'll squeeze it in.'", effect: { energy: -20, stress: 20, msg: "Manager is happy, but you're already overbooked." } },
                        { text: "Compromise: 'I can do a basic version now.'", effect: { energy: -10, stress: 5, msg: "Fair trade-off. Work begins." } }
                    ]
                },
                {
                    time: "11:30 AM",
                    situation: "Critical Bug: Production server is throwing 500 errors. Users can't login.",
                    choices: [
                        { text: "Panic & Reboot everything immediately", effect: { energy: -5, stress: 15, msg: "It worked, but you lost the root cause logs." } },
                        { text: "Check Logs & Investigate first", effect: { energy: -10, stress: 5, msg: "Found the memory leak! Patched correctly." } },
                        { text: "Delegate to Junior Dev", effect: { energy: 5, stress: 25, msg: "They crashed the DB. Now you have two problems." } }
                    ]
                },
                {
                    time: "02:00 PM",
                    situation: "Deep Work Block: You have 3 hours to code the new payment integration.",
                    choices: [
                        { text: "Turn off Slack & Focus", effect: { energy: -15, stress: -10, msg: "In the zone! Code is clean and bug-free." } },
                        { text: "Multitask with meetings", effect: { energy: -25, stress: 15, msg: "Distracted. You introduced a typo in the API key." } },
                        { text: "Copy-paste code from StackOverflow", effect: { energy: 0, stress: 5, msg: "It works... mostly. Tech debt for later." } }
                    ]
                },
                {
                    time: "05:00 PM",
                    situation: "Code Review: A teammate nitpicks your variable names.",
                    choices: [
                        { text: "Argue: 'It works, doesn't it?'", effect: { energy: -5, stress: 10, msg: "Tension in the team. PR approved simply to end the fight." } },
                        { text: "Update it: 'Good catch, thanks.'", effect: { energy: -5, stress: -5, msg: "Code quality up, team trust up." } },
                        { text: "Ignore it and merge", effect: { energy: 0, stress: 5, msg: "Bad practice. It might come back to bite you." } }
                    ]
                }
            ]
        },
        'data-scientist': {
            title: "Data Scientist",
            events: [
                {
                    time: "09:30 AM",
                    situation: "Data Cleanup: The client sent the dataset, but it's full of missing values and messy formats.",
                    choices: [
                        { text: "Spend morning cleaning it thoroughly", effect: { energy: -20, stress: -5, msg: "Boring work, but now the model will train perfectly." } },
                        { text: "Drop all bad rows and proceed", effect: { energy: 0, stress: 10, msg: "Fast, but you lost 40% of the data. Accuracy suffers." } },
                        { text: "Complain to the client", effect: { energy: -5, stress: 15, msg: "Client is annoyed. You still have to clean it." } }
                    ]
                },
                {
                    time: "01:00 PM",
                    situation: "Model Training: The model accuracy is stuck at 75%. Target is 90%.",
                    choices: [
                        { text: "Try a more complex algorithm (XGBoost)", effect: { energy: -15, stress: 5, msg: "Accuracy jumped to 88%! Good move." } },
                        { text: "Add more features from the data", effect: { energy: -10, stress: 0, msg: "Slow progress, but steady improvement." } },
                        { text: "Tweak parameters randomly", effect: { energy: -5, stress: 10, msg: "No luck. Just wasted compute time." } }
                    ]
                },
                {
                    time: "04:30 PM",
                    situation: "Presentation: Explaining your findings to non-technical stakeholders.",
                    choices: [
                        { text: "Show raw code and confusion matrix", effect: { energy: 0, stress: 20, msg: "Blank stares. They didn't understand a thing." } },
                        { text: "Use simple charts and business value", effect: { energy: -10, stress: -10, msg: "They loved it! Budget approved." } },
                        { text: "Skip the meeting, send an email", effect: { energy: 5, stress: 10, msg: "Missed opportunity for visibility." } }
                    ]
                }
            ]
        }
    },
    learningResources: {
        "Python": "https://www.coursera.org/specializations/python",
        "Data Science": "https://www.kaggle.com/learn",
        "React JS": "https://react.dev/learn",
        "Digital Marketing": "https://learndigital.withgoogle.com/digitalgarage",
        "Graphic Design": "https://www.calarts.edu/design",
        "Finance": "https://www.investopedia.com/financial-term-dictionary-4769738"
    },
    weeklyMissions: [
        { id: "explore-careers", text: "Explore 3 new careers in the Encyclopedia", xp: 50, category: "Discovery" },
        { id: "aptitude-test", text: "Complete the Career Aptitude Assessment", xp: 100, category: "Assessment" },
        { id: "save-roadmap", text: "Save a career to your roadmap", xp: 40, category: "Planning" },
        { id: "join-group", text: "Join a career community", xp: 30, category: "Networking" },
        { id: "mock-interview", text: "Start your first mock interview", xp: 80, category: "Preparation" },
        { id: "convert-gpa", text: "Use the Global GPA Converter", xp: 20, category: "Global Hub" },
        { id: "research-uni", text: "Shortlist one International University", xp: 60, category: "Global Hub" }
    ],
    achievementsData: [
        { id: "first-interview", title: "Interview Ace", desc: "Completed your first mock interview simulation.", icon: "🎤" },
        { id: "community-pro", title: "Community Leader", desc: "Joined 3 or more career communities.", icon: "🤝" },
        { id: "assessment-done", title: "Path Finder", desc: "Completed the career assessment quiz.", icon: "🧭" },
        { id: "roadmap-builder", title: "Master Planner", desc: "Saved 3 or more career roadmaps.", icon: "🗺️" },
        { id: "top-marks", title: "Scholar", desc: "Maintained marks above 90% in any subject.", icon: "🎓" }
    ],
    pivotOutcomes: {
        ai_automation: {
            impact: "High Disruption",
            advice: "Your path is being automated. Focus on **Human-Centric Design** and **Complex Decision Making** to stay ahead.",
            pivotSkills: ["Strategic Leadership", "Ethical AI Governance"]
        },
        economic_recession: {
            impact: "Moderate Slowdown",
            advice: "Market demand is shrinking. Build **Cross-Functional Skills** in finance or efficiency management to remain essential.",
            pivotSkills: ["Resource Optimization", "Agile Management"]
        },
        tech_boom: {
            impact: "High Growth",
            advice: "Demand is surging! Accelerate your learning in **Emerging Technologies** to capture top-tier roles.",
            pivotSkills: ["R&D Implementation", "Global Scaling"]
        }
    },
    industryPulses: [
        { text: "AI Engineering demand up by 45% in Bangalore", sector: "Technical" },
        { text: "New Fintech specialization opens at IIT Delhi", sector: "Commercial" },
        { text: "Global shortage of UX Designers predicted for 2027", sector: "Creative" },
        { text: "Social Impact funding reaches record highs this quarter", sector: "Social" },
        { text: "New scholarship announced for Women in STEM", sector: "Technical" },
        { text: "LegalTech startups seeing 2x growth in seed funding", sector: "Social" },
        { text: "Bio-Medical research budgets increased for next fiscal", sector: "Technical" },
        { text: "Creative Arts roles moving towards hybrid-AR models", sector: "Creative" }
    ],
    skillUpResources: [
        { title: "CS50: Intro to Computer Science", provider: "Harvard (edX)", type: "Course", duration: "12 Weeks", cost: "Free", link: "#", tags: ["Tech", "Coding"] },
        { title: "Google UX Design Certificate", provider: "Coursera", type: "Certification", duration: "6 Months", cost: "Paid", link: "#", tags: ["Design", "Creative"] },
        { title: "Financial Markets", provider: "Yale (Coursera)", type: "Course", duration: "7 Weeks", cost: "Free", link: "#", tags: ["Finance", "Commerce"] },
        { title: "Introduction to Psychology", provider: "Yale", type: "Course", duration: "Self-Paced", cost: "Free", link: "#", tags: ["Social", "Arts"] },
        { title: "Digital Marketing Specialization", provider: "Illinois", type: "Specialization", duration: "4 Months", cost: "Paid", link: "#", tags: ["Marketing", "Business"] }
    ],
    readyScoreWeights: {
        assessment: 20,
        roadmapBase: 0,
        roadmapMultiplier: 7,
        roadmapMax: 20,
        interview: 30,
        badgeMultiplier: 5,
        badgeMax: 30
    }
};
