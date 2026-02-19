# question_bank.py - Complete with Model Answers for AI Comparison

QUESTION_BANK = {
    "frontend": {
        "round_1_background": [
            {
                "q": "Tell me about your experience with modern Frontend frameworks (React, Vue, etc.).",
                "keywords": ["react", "vue", "angular", "years", "projects", "components", "hooks"],
                "model_answer": "I have extensive experience with modern frontend frameworks, particularly React and Vue. I've worked on multiple projects using React with hooks and functional components for building dynamic single-page applications. I also have experience with Vue.js for smaller projects. My work spans over several years, during which I've built responsive web applications, implemented state management solutions, and worked with component-based architectures.",
                "weight": 1.0,
                "category": "behavioral",
                "difficulty": "easy"
            },
            {
                "q": "How do you stay updated with the latest web technologies?",
                "keywords": ["blog", "documentation", "community", "learning", "newsletter", "github", "courses"],
                "model_answer": "I stay updated through multiple channels: reading tech blogs like CSS-Tricks and Smashing Magazine, following official documentation updates, participating in developer communities on Discord and Reddit, subscribing to newsletters like JavaScript Weekly, attending webinars and conferences, contributing to open-source projects on GitHub, and taking online courses on platforms like Udemy and Frontend Masters.",
                "weight": 1.0,
                "category": "behavioral",
                "difficulty": "easy"
            },
            {
                "q": "What is your typical workflow for starting a new project from scratch?",
                "keywords": ["boilerplate", "npm", "architecture", "design", "planning", "git", "structure"],
                "model_answer": "My workflow starts with requirements analysis and planning the architecture. I then set up version control with Git, initialize the project using tools like Create React App or Vite, configure the folder structure with components, pages, and utilities. I set up linting with ESLint, formatting with Prettier, install necessary dependencies via npm, configure CSS framework like Tailwind, and establish a CI/CD pipeline for automated deployments.",
                "weight": 1.0,
                "category": "behavioral",
                "difficulty": "easy"
            },
            {
                "q": "How do you handle collaboration with UI/UX designers?",
                "keywords": ["figma", "prototype", "feedback", "communication", "handoff", "design system"],
                "model_answer": "I collaborate closely with designers using tools like Figma for design handoff and prototyping. I participate in design reviews to provide technical feedback on feasibility. We maintain a shared design system with consistent components, spacing, and typography. I communicate regularly about implementation constraints and suggest alternatives when needed. I also use tools like Storybook to showcase implemented components for designer approval.",
                "weight": 1.0,
                "category": "behavioral",
                "difficulty": "easy"
            },
            {
                "q": "What motivated you to specialize in Frontend development?",
                "keywords": ["creative", "user", "interface", "experience", "passion", "visual", "impact"],
                "model_answer": "I was drawn to frontend development because of the unique combination of creativity and technical problem-solving. I'm passionate about creating intuitive user interfaces that provide excellent user experiences. The immediate visual feedback of seeing my code come to life motivates me. I enjoy the challenge of making applications accessible, performant, and beautiful. The constantly evolving landscape of frontend technologies keeps me engaged and always learning.",
                "weight": 1.0,
                "category": "behavioral",
                "difficulty": "easy"
            }
        ],
        "round_2_domain": [
            {
                "q": "How does the Virtual DOM improve performance in web applications?",
                "keywords": ["reconciliation", "diffing", "repaint", "batching", "memory", "real dom", "efficient"],
                "model_answer": "The Virtual DOM is a lightweight JavaScript representation of the actual DOM kept in memory. When state changes occur, React creates a new Virtual DOM tree and compares it with the previous one using a diffing algorithm called reconciliation. It identifies the minimal set of changes needed and batches these updates to the real DOM in a single operation. This avoids expensive direct DOM manipulations, reduces repaints and reflows, and significantly improves rendering performance.",
                "weight": 2.0,
                "category": "technical",
                "difficulty": "medium"
            },
            {
                "q": "Explain the CSS Box Model and its importance in layout design.",
                "keywords": ["content", "padding", "border", "margin", "box-sizing", "width", "height"],
                "model_answer": "The CSS Box Model describes how every HTML element is rendered as a rectangular box with four layers: Content (the actual text or images), Padding (space between content and border), Border (surrounds the padding), and Margin (space outside the border). The box-sizing property determines how width and height are calculated. With content-box (default), padding and border are added to the specified width. With border-box, padding and border are included within the specified width, making layout calculations more predictable.",
                "weight": 2.0,
                "category": "technical",
                "difficulty": "medium"
            },
            {
                "q": "What are the differences between let, const, and var in JavaScript?",
                "keywords": ["scope", "hoisting", "reassignment", "block", "immutable", "function", "temporal"],
                "model_answer": "var is function-scoped and hoisted to the top of its function, which can lead to unexpected behavior. let is block-scoped, meaning it's only accessible within its enclosing block, and it's not hoisted in the same way. const is also block-scoped but creates a read-only reference that cannot be reassigned after initialization, though object properties can still be modified. Both let and const have a temporal dead zone where accessing them before declaration throws a ReferenceError. Modern JavaScript best practices recommend using const by default and let when reassignment is needed.",
                "weight": 2.0,
                "category": "technical",
                "difficulty": "medium"
            },
            {
                "q": "Explain Server-Side Rendering (SSR) vs. Client-Side Rendering (CSR).",
                "keywords": ["seo", "load time", "hydration", "nextjs", "browser", "server", "performance"],
                "model_answer": "Server-Side Rendering generates the full HTML on the server for each request, providing faster initial load times and better SEO since search engines can crawl the complete content. Client-Side Rendering sends a minimal HTML shell and JavaScript bundle to the browser, which then renders the content dynamically. CSR provides smoother navigation after initial load but has slower first paint. Next.js supports both approaches and introduces hydration, where server-rendered HTML is made interactive on the client. SSR is better for content-heavy pages while CSR suits highly interactive applications.",
                "weight": 2.0,
                "category": "technical",
                "difficulty": "medium"
            },
            {
                "q": "How do you handle state management in large-scale applications?",
                "keywords": ["redux", "context", "store", "props", "zustand", "global", "local"],
                "model_answer": "For large-scale applications, I use a combination of state management strategies. Local component state with useState for UI-specific state, React Context for theme and authentication data that many components need, and Redux or Zustand for complex global application state with predictable state transitions. I follow the principle of keeping state as local as possible and only lifting it up when necessary. For server state, I use React Query or SWR to handle caching, synchronization, and background updates efficiently.",
                "weight": 2.0,
                "category": "technical",
                "difficulty": "medium"
            }
        ],
        "round_3_project": [
            {
                "q": "Describe a complex UI bug you solved. What was your process?",
                "keywords": ["devtools", "console", "network", "reproducible", "fix", "debug", "root cause"],
                "model_answer": "I encountered a complex rendering bug where a dashboard component would flash incorrect data before showing the correct state. My process involved first reproducing the issue consistently, then using Chrome DevTools to inspect the component lifecycle and network requests. I added console logs to trace the data flow and discovered a race condition between two API calls updating the same state. I used the Network tab to analyze request timing and found that a cached response was overwriting fresh data. The fix involved implementing proper request cancellation with AbortController and adding a loading state to prevent premature renders.",
                "weight": 3.0,
                "category": "problem_solving",
                "difficulty": "hard"
            },
            {
                "q": "Walk me through a project where you had to optimize page load speed.",
                "keywords": ["lazy loading", "minification", "images", "caching", "lighthouse", "bundle", "code splitting"],
                "model_answer": "I optimized an e-commerce platform that had a Lighthouse performance score of 35. I started by analyzing the bundle with webpack-bundle-analyzer and found oversized dependencies. I implemented code splitting with React.lazy and dynamic imports, reducing initial bundle size by 60%. I added lazy loading for images using Intersection Observer, converted images to WebP format, and implemented responsive image sizing. I configured browser caching headers and added a service worker for static assets. I also minified CSS and JavaScript, removed unused code with tree shaking, and implemented critical CSS inline loading. The final Lighthouse score reached 92.",
                "weight": 3.0,
                "category": "problem_solving",
                "difficulty": "hard"
            },
            {
                "q": "Tell me about a time you had to implement a highly interactive feature.",
                "keywords": ["animation", "websocket", "events", "performance", "real-time", "state", "optimization"],
                "model_answer": "I built a real-time collaborative whiteboard feature using WebSockets for instant synchronization between users. The challenge was handling multiple simultaneous drawing events without performance degradation. I used Canvas API for rendering, implemented requestAnimationFrame for smooth 60fps animations, and batched WebSocket messages to reduce network overhead. I added optimistic updates so users saw their strokes immediately while syncing in the background. For state management, I used a CRDT-based approach to handle concurrent edits without conflicts. The feature supported up to 20 simultaneous users with sub-100ms latency.",
                "weight": 3.0,
                "category": "problem_solving",
                "difficulty": "hard"
            },
            {
                "q": "Describe a project where you used a CSS preprocessor or library like Tailwind.",
                "keywords": ["sass", "tailwind", "utility", "responsive", "config", "design system", "components"],
                "model_answer": "I rebuilt a company's marketing website using Tailwind CSS, creating a custom design system. I configured tailwind.config.js with brand colors, custom spacing scales, and typography presets. I used utility classes for rapid prototyping and created reusable component classes with @apply for complex patterns. I implemented responsive design using Tailwind's breakpoint prefixes and created dark mode support with the dark variant. I also set up PurgeCSS to remove unused styles, reducing the final CSS bundle from 3MB to 15KB. The development speed increased by approximately 40% compared to our previous SASS-based workflow.",
                "weight": 3.0,
                "category": "problem_solving",
                "difficulty": "hard"
            },
            {
                "q": "How did you manage version control and code reviews in your last project?",
                "keywords": ["git", "pull request", "branch", "conflict", "merge", "ci/cd", "review"],
                "model_answer": "I followed a Git Flow branching strategy with main, develop, and feature branches. Each feature was developed in a separate branch created from develop, with descriptive naming conventions like feature/user-auth. I created detailed pull requests with descriptions of changes, screenshots for UI changes, and linked Jira tickets. Code reviews required at least two approvals before merging. I set up CI/CD pipelines with GitHub Actions that ran automated tests, linting, and build checks on every PR. Merge conflicts were resolved locally using git rebase to maintain a clean commit history. We also used conventional commits for automated changelog generation.",
                "weight": 3.0,
                "category": "problem_solving",
                "difficulty": "hard"
            }
        ]
    },
    "backend": {
        "round_1_background": [
            {
                "q": "What inspired you to focus on Backend engineering?",
                "keywords": ["logic", "data", "architecture", "scale", "performance", "systems"],
                "model_answer": "I was drawn to backend engineering by the challenge of building robust, scalable systems that handle complex business logic. I enjoy designing efficient data architectures, optimizing database queries, and building APIs that serve millions of requests. The problem-solving aspect of ensuring data integrity, handling concurrent operations, and building fault-tolerant systems keeps me intellectually engaged. I find satisfaction in knowing that the systems I build form the backbone of applications that users rely on daily.",
                "weight": 1.0,
                "category": "behavioral",
                "difficulty": "easy"
            },
            {
                "q": "Describe your experience with different server-side languages.",
                "keywords": ["python", "node", "java", "api", "framework", "express", "django"],
                "model_answer": "I have professional experience with Node.js using Express for building RESTful APIs and real-time applications with Socket.io. I've also worked extensively with Python using Django and FastAPI for data-intensive applications and microservices. I have foundational knowledge of Java with Spring Boot for enterprise applications. My primary expertise is in Node.js where I've built scalable backend systems handling authentication, payment processing, and third-party integrations.",
                "weight": 1.0,
                "category": "behavioral",
                "difficulty": "easy"
            },
            {
                "q": "How do you ensure your code is maintainable for other developers?",
                "keywords": ["documentation", "clean code", "naming", "comments", "modular", "testing"],
                "model_answer": "I follow clean code principles with meaningful variable and function names that are self-documenting. I write modular code with single-responsibility functions and use consistent design patterns across the codebase. I add JSDoc comments for complex functions and maintain API documentation with Swagger or Postman collections. I write unit tests that serve as living documentation of expected behavior. I also create README files with setup instructions and architectural decision records for important design choices.",
                "weight": 1.0,
                "category": "behavioral",
                "difficulty": "easy"
            },
            {
                "q": "Tell me about your experience with relational vs. non-relational databases.",
                "keywords": ["sql", "nosql", "postgres", "mongodb", "schema", "relations", "flexible"],
                "model_answer": "I've worked extensively with both types. For relational databases, I've used PostgreSQL and MySQL for applications requiring complex queries, joins, transactions, and strict data integrity like e-commerce and financial systems. For NoSQL, I've used MongoDB for flexible schema applications like content management systems and real-time analytics where the data structure evolves frequently. I choose based on the use case: SQL for structured data with relationships, NoSQL for document-oriented data with horizontal scalability needs.",
                "weight": 1.0,
                "category": "behavioral",
                "difficulty": "easy"
            },
            {
                "q": "How do you handle pressure when a production server goes down?",
                "keywords": ["calm", "logs", "rollback", "priority", "communication", "incident", "monitoring"],
                "model_answer": "I stay calm and follow an incident response protocol. First, I check monitoring dashboards and error logs to identify the scope and root cause. I communicate the issue immediately to stakeholders with an estimated timeline. I prioritize getting the service back up, often by rolling back to the last known working deployment if the fix isn't immediately clear. After resolution, I conduct a post-mortem to document what happened, why, and how to prevent it in the future. I also set up better alerts and monitoring to catch similar issues earlier.",
                "weight": 1.0,
                "category": "behavioral",
                "difficulty": "easy"
            }
        ],
        "round_2_domain": [
            {
                "q": "How do RESTful APIs differ from GraphQL?",
                "keywords": ["endpoints", "query", "over-fetching", "schema", "stateless", "flexibility", "single"],
                "model_answer": "RESTful APIs use multiple endpoints with fixed data structures, one for each resource, following HTTP methods for CRUD operations. They can lead to over-fetching or under-fetching data. GraphQL uses a single endpoint where clients specify exactly what data they need through queries, eliminating over-fetching. GraphQL has a strongly typed schema that serves as a contract between client and server. REST is simpler for basic CRUD operations and better supported by caching, while GraphQL excels when clients have diverse data requirements or when working with complex, interconnected data.",
                "weight": 2.0,
                "category": "technical",
                "difficulty": "medium"
            },
            {
                "q": "What is the difference between synchronous and asynchronous processing?",
                "keywords": ["blocking", "non-blocking", "event loop", "callback", "promises", "async", "await"],
                "model_answer": "Synchronous processing executes operations sequentially, blocking the thread until each operation completes before moving to the next. Asynchronous processing allows operations to execute without blocking, using mechanisms like callbacks, Promises, and async/await in JavaScript. Node.js uses an event loop that handles I/O operations asynchronously, enabling it to serve thousands of concurrent connections on a single thread. Async processing is essential for I/O-heavy operations like database queries, API calls, and file operations to maintain application responsiveness and throughput.",
                "weight": 2.0,
                "category": "technical",
                "difficulty": "medium"
            },
            {
                "q": "Explain the concept of Microservices architecture and its benefits.",
                "keywords": ["scalable", "decoupled", "deployment", "independent", "gateway", "service", "communication"],
                "model_answer": "Microservices architecture breaks a monolithic application into small, independent services that each handle a specific business domain. Each service can be developed, deployed, and scaled independently using different technologies. Services communicate through APIs or message queues. Benefits include improved scalability where individual services scale based on demand, faster deployment cycles, technology flexibility, and better fault isolation. An API gateway manages routing, authentication, and load balancing across services. Challenges include increased operational complexity, distributed data management, and network latency between services.",
                "weight": 2.0,
                "category": "technical",
                "difficulty": "medium"
            },
            {
                "q": "How do you secure a backend API from common attacks like SQL Injection?",
                "keywords": ["sanitization", "validation", "prepared statements", "auth", "jwt", "rate limiting", "cors"],
                "model_answer": "I implement multiple layers of security. For SQL Injection prevention, I use parameterized queries or ORM tools that handle escaping. I validate and sanitize all user inputs using libraries like Joi or express-validator. I implement JWT-based authentication with proper token expiration and refresh mechanisms. I use CORS to restrict allowed origins, rate limiting to prevent brute force attacks, helmet.js for security headers, and HTTPS for encrypted communication. I also implement role-based access control, log suspicious activities, and regularly update dependencies to patch known vulnerabilities.",
                "weight": 2.0,
                "category": "technical",
                "difficulty": "medium"
            },
            {
                "q": "Explain database indexing and how it affects query performance.",
                "keywords": ["speed", "b-tree", "write overhead", "lookup", "scan", "index", "query"],
                "model_answer": "Database indexing creates additional data structures, typically B-trees, that allow the database to find rows without scanning the entire table. An index on a column creates a sorted reference that enables O(log n) lookups instead of O(n) full table scans. This dramatically improves SELECT query performance, especially on large tables. However, indexes add write overhead because they must be updated on every INSERT, UPDATE, and DELETE operation. Best practices include indexing columns used in WHERE clauses, JOIN conditions, and ORDER BY clauses. Compound indexes can optimize multi-column queries. Over-indexing should be avoided as it consumes storage and slows writes.",
                "weight": 2.0,
                "category": "technical",
                "difficulty": "medium"
            }
        ],
        "round_3_project": [
            {
                "q": "Describe a project where you designed a complex database schema.",
                "keywords": ["normalization", "relationships", "foreign key", "join", "migration", "design", "tables"],
                "model_answer": "I designed the database schema for a multi-tenant SaaS project management tool. The schema included normalized tables for Organizations, Users, Projects, Tasks, Comments, and Attachments with proper foreign key relationships. I implemented soft deletes for data recovery, polymorphic associations for the commenting system, and used junction tables for many-to-many relationships between Users and Projects. I created database migrations for version control and wrote seed scripts for development data. Performance was optimized with composite indexes on frequently queried column combinations and materialized views for dashboard analytics.",
                "weight": 3.0,
                "category": "problem_solving",
                "difficulty": "hard"
            },
            {
                "q": "Tell me about a time you optimized a slow API endpoint.",
                "keywords": ["profiling", "caching", "redis", "query optimization", "latency", "n+1", "pagination"],
                "model_answer": "I optimized an API endpoint that took 8 seconds to respond for a dashboard displaying user analytics. I first profiled the endpoint and discovered N+1 query problems where individual database calls were made inside loops. I implemented eager loading with proper JOIN queries, reducing 200+ queries to 3. I added Redis caching for frequently accessed data with appropriate TTL values. I implemented pagination to limit result sets and added database indexes on commonly filtered columns. I also moved heavy computation to background jobs using a message queue. The response time dropped from 8 seconds to 200 milliseconds.",
                "weight": 3.0,
                "category": "problem_solving",
                "difficulty": "hard"
            },
            {
                "q": "Walk me through an authentication system you implemented.",
                "keywords": ["oauth", "jwt", "session", "bcrypt", "hashing", "refresh", "middleware"],
                "model_answer": "I implemented a complete authentication system with JWT for a healthcare application. Users register with email and password, which is hashed using bcrypt with a salt factor of 12. On login, the server validates credentials and issues an access token with 15-minute expiry and a refresh token stored in an httpOnly cookie with 7-day expiry. A middleware validates the access token on protected routes and extracts user data. When the access token expires, the client uses the refresh token to obtain a new pair. I also implemented OAuth 2.0 with Google and GitHub for social login, role-based access control for admin and user roles, and account lockout after 5 failed login attempts.",
                "weight": 3.0,
                "category": "problem_solving",
                "difficulty": "hard"
            },
            {
                "q": "Describe a project where you integrated a third-party service or API.",
                "keywords": ["integration", "webhook", "sdk", "error handling", "retry", "api", "documentation"],
                "model_answer": "I integrated Stripe payment processing into an e-commerce platform. I studied the Stripe API documentation thoroughly and implemented the payment flow with PaymentIntents for secure card processing. I set up webhook endpoints to receive real-time notifications for payment confirmations, failures, and refunds. I implemented idempotency keys to prevent duplicate charges, retry logic with exponential backoff for failed API calls, and comprehensive error handling for different Stripe error types. I stored transaction records in our database and implemented reconciliation logic to ensure our records matched Stripe's dashboard.",
                "weight": 3.0,
                "category": "problem_solving",
                "difficulty": "hard"
            },
            {
                "q": "Tell me about a time you had to scale a backend to handle more traffic.",
                "keywords": ["load balancer", "sharding", "horizontal scaling", "concurrency", "caching", "optimization"],
                "model_answer": "I scaled a social media API from handling 1000 to 50000 concurrent users. I started by profiling bottlenecks and found the database was the main constraint. I implemented read replicas for distributing query load and Redis caching for hot data like user profiles and feeds. I set up horizontal scaling with multiple Node.js instances behind an Nginx load balancer using round-robin distribution. I implemented database connection pooling, moved file uploads to S3 with CloudFront CDN, and used message queues for asynchronous processing of notifications and analytics. The system maintained sub-200ms response times at peak load.",
                "weight": 3.0,
                "category": "problem_solving",
                "difficulty": "hard"
            }
        ]
    },
    "fullstack": {
        "round_1_background": [
            {
                "q": "Why do you prefer Fullstack development over specializing in one end?",
                "keywords": ["end-to-end", "versatile", "ownership", "generalist", "integration", "understand"],
                "model_answer": "I prefer fullstack development because it gives me end-to-end ownership of features. Understanding both frontend and backend allows me to make better architectural decisions, anticipate integration challenges, and debug issues faster. Being versatile means I can contribute to any part of the codebase and communicate effectively with specialized team members. I enjoy the variety of switching between user interface work and system design, and the holistic understanding helps me build more cohesive and efficient applications.",
                "weight": 1.0,
                "category": "behavioral",
                "difficulty": "easy"
            },
            {
                "q": "What tech stack are you most comfortable with?",
                "keywords": ["mern", "mean", "lamp", "django", "typescript", "stack", "database"],
                "model_answer": "I'm most comfortable with the MERN stack: MongoDB for flexible document storage, Express.js for backend API development, React with TypeScript for building interactive user interfaces, and Node.js as the runtime. I use TypeScript across the entire stack for type safety and better developer experience. For styling I prefer Tailwind CSS, and for deployment I use Docker with cloud platforms like AWS or Vercel. I also have experience with Next.js for server-side rendering and Django with Python for data-heavy applications.",
                "weight": 1.0,
                "category": "behavioral",
                "difficulty": "easy"
            },
            {
                "q": "How do you balance learning both Frontend and Backend trends?",
                "keywords": ["learning", "practice", "fundamentals", "reading", "side-projects", "focus"],
                "model_answer": "I focus on strong fundamentals that transfer across technologies rather than chasing every new framework. I dedicate specific time blocks for learning: mornings for reading documentation and articles, weekends for side projects experimenting with new tools. I follow curated newsletters for both frontend and backend, prioritizing technologies that are gaining real industry adoption. I build full-stack side projects that let me practice both ends simultaneously, and I participate in communities where I can learn from specialists in each area.",
                "weight": 1.0,
                "category": "behavioral",
                "difficulty": "easy"
            },
            {
                "q": "Tell me about your experience working in an Agile team.",
                "keywords": ["scrum", "sprints", "jira", "standup", "velocity", "retrospective", "planning"],
                "model_answer": "I've worked in Agile teams following Scrum methodology for over three years. Our two-week sprints started with planning sessions where we estimated stories using story points. Daily standups kept the team aligned on progress and blockers. I used Jira for tracking tasks and maintaining the backlog. Sprint retrospectives helped us continuously improve our processes. I've been both a contributor and a technical lead in Agile teams, helping refine user stories, break down complex features into manageable tasks, and maintain consistent sprint velocity.",
                "weight": 1.0,
                "category": "behavioral",
                "difficulty": "easy"
            },
            {
                "q": "What is the most challenging part of being a Fullstack developer?",
                "keywords": ["context switching", "depth", "landscape", "complexity", "updates", "breadth"],
                "model_answer": "The most challenging aspect is maintaining depth of knowledge while covering the breadth of both frontend and backend technologies. Context switching between UI work and system design requires different mindsets. The technology landscape evolves rapidly on both ends, making it challenging to stay current everywhere. I manage this by focusing on core concepts that remain stable, using TypeScript as a unifying language across the stack, and accepting that I may not be the deepest expert in every area while maintaining strong working knowledge across the full stack.",
                "weight": 1.0,
                "category": "behavioral",
                "difficulty": "easy"
            }
        ],
        "round_2_domain": [
            {
                "q": "Explain the flow of data from a user click to a database update.",
                "keywords": ["request", "controller", "model", "query", "response", "api", "http"],
                "model_answer": "When a user clicks a button, the frontend captures the event and sends an HTTP request via fetch or axios to the backend API endpoint. The request passes through middleware for authentication and validation. The router directs it to the appropriate controller function, which contains the business logic. The controller interacts with the Model layer which uses an ORM to construct a database query. The query executes against the database, the result propagates back through the model to the controller, which formats the response and sends it back as JSON. The frontend receives the response and updates the UI state accordingly.",
                "weight": 2.0,
                "category": "technical",
                "difficulty": "medium"
            },
            {
                "q": "How do you handle authentication across a Fullstack application?",
                "keywords": ["cookies", "jwt", "middleware", "session", "cors", "token", "secure"],
                "model_answer": "I implement JWT-based authentication where the login endpoint validates credentials and returns access and refresh tokens. The access token is stored in memory or localStorage on the frontend and included in the Authorization header for API requests. The backend middleware validates the token on every protected route. I configure CORS to allow only trusted origins. For enhanced security, I use httpOnly cookies for refresh tokens to prevent XSS attacks. The frontend implements an axios interceptor that automatically refreshes expired tokens and retries failed requests.",
                "weight": 2.0,
                "category": "technical",
                "difficulty": "medium"
            },
            {
                "q": "What are the benefits of using a Typed language like TypeScript for Fullstack?",
                "keywords": ["interfaces", "types", "debugging", "validation", "safety", "ide", "errors"],
                "model_answer": "TypeScript provides type safety across the entire stack, catching errors at compile time rather than runtime. Shared interfaces between frontend and backend ensure API contracts are consistent. IDE support with autocompletion and inline documentation dramatically improves developer productivity. Types serve as self-documenting code that makes the codebase easier to understand and maintain. Refactoring becomes safer because the compiler catches breaking changes. For fullstack development, sharing type definitions between client and server reduces bugs at the integration layer where most issues occur.",
                "weight": 2.0,
                "category": "technical",
                "difficulty": "medium"
            },
            {
                "q": "Explain how you would optimize a web app's overall performance.",
                "keywords": ["caching", "minification", "database query", "assets", "cdn", "lazy", "compression"],
                "model_answer": "I optimize at every layer: on the frontend, I implement code splitting and lazy loading to reduce initial bundle size, compress and optimize images, use a CDN for static assets, and enable gzip compression. On the backend, I optimize database queries with proper indexing, implement Redis caching for frequently accessed data, and use connection pooling. At the network level, I minimize API calls with data batching, implement HTTP/2 for multiplexing, and use service workers for offline caching. I monitor performance with Lighthouse and application performance monitoring tools to identify bottlenecks.",
                "weight": 2.0,
                "category": "technical",
                "difficulty": "medium"
            },
            {
                "q": "What is CORS and why is it important in web development?",
                "keywords": ["origin", "security", "header", "browser", "policy", "cross-origin", "access"],
                "model_answer": "CORS (Cross-Origin Resource Sharing) is a browser security mechanism that restricts web pages from making requests to a different domain than the one serving the page. It prevents malicious websites from accessing sensitive data from other origins. The server specifies which origins, methods, and headers are allowed through response headers like Access-Control-Allow-Origin. In fullstack development, CORS configuration is essential because the frontend typically runs on a different port or domain than the backend. I configure CORS on the backend to explicitly allow the frontend origin while blocking unauthorized domains.",
                "weight": 2.0,
                "category": "technical",
                "difficulty": "medium"
            }
        ],
        "round_3_project": [
            {
                "q": "Walk me through a project where you built a feature from DB to UI.",
                "keywords": ["schema", "api", "frontend", "components", "logic", "testing", "deployment"],
                "model_answer": "I built a task management feature end-to-end. I started by designing the database schema with Tasks, Labels, and Assignments tables with proper relationships. I created RESTful API endpoints for CRUD operations with validation middleware and error handling. On the frontend, I built reusable React components: a Kanban board with drag-and-drop, task cards, and filter panels. I implemented optimistic updates for smooth UX and proper error handling with toast notifications. I wrote unit tests for the API and component tests with React Testing Library. Finally, I deployed with CI/CD that runs tests before releasing to production.",
                "weight": 3.0,
                "category": "problem_solving",
                "difficulty": "hard"
            },
            {
                "q": "Describe a time you had to fix a bug that spanned both Frontend and Backend.",
                "keywords": ["tracing", "network tab", "logs", "integration", "fix", "debugging", "root cause"],
                "model_answer": "A checkout form was intermittently failing to process orders. I started debugging on the frontend using the Network tab and found the API was returning 400 errors for some requests. The server logs showed a validation error on the phone number field. I traced the issue across the stack: the frontend was sending the phone number with country code formatting, but the backend validation regex expected only digits. The fix required updating both the frontend to strip formatting before sending and the backend validation to accept formatted numbers. I added integration tests to prevent similar mismatches and documented the API contract in Swagger.",
                "weight": 3.0,
                "category": "problem_solving",
                "difficulty": "hard"
            },
            {
                "q": "Tell me about a project where you implemented real-time updates.",
                "keywords": ["socket.io", "websockets", "polling", "state", "ui", "real-time", "events"],
                "model_answer": "I implemented real-time notifications and live chat for a project management tool using Socket.io. On the backend, I set up a WebSocket server that authenticates connections using the same JWT tokens as the REST API. I created event rooms for each project so users only receive relevant updates. When a task is updated via the REST API, the controller also emits a WebSocket event. On the frontend, I created a custom hook that manages the socket connection, listens for events, and updates the local state. I implemented reconnection logic with exponential backoff and a message queue that syncs missed events when the connection is restored.",
                "weight": 3.0,
                "category": "problem_solving",
                "difficulty": "hard"
            },
            {
                "q": "Describe a project where you had to integrate a complex external API.",
                "keywords": ["documentation", "auth", "mapping", "testing", "usage", "api", "integration"],
                "model_answer": "I integrated Google Maps API with a custom routing algorithm for a delivery management system. I studied the API documentation and implemented geocoding for address conversion, distance matrix for route optimization, and Places API for address autocomplete. I built an adapter layer that mapped our internal data structures to Google's API format and vice versa. I implemented request caching to stay within API rate limits and reduce costs. Error handling covered network failures, invalid addresses, and quota exceeded scenarios. I wrote mock-based tests for the integration layer and monitored API usage costs with alerts for spending thresholds.",
                "weight": 3.0,
                "category": "problem_solving",
                "difficulty": "hard"
            },
            {
                "q": "How did you handle deployment and hosting for your last Fullstack project?",
                "keywords": ["vercel", "heroku", "docker", "ci/cd", "env variables", "deployment", "hosting"],
                "model_answer": "I deployed a MERN application with the frontend on Vercel and the backend on Railway with a MongoDB Atlas database. I containerized the backend with Docker for consistent environments. I set up CI/CD with GitHub Actions that runs tests, builds the Docker image, and deploys on merge to main. Environment variables are managed securely through each platform's dashboard. I configured custom domains with SSL certificates, set up monitoring with uptime checks, and implemented zero-downtime deployments using rolling updates. Database backups are automated daily through MongoDB Atlas.",
                "weight": 3.0,
                "category": "problem_solving",
                "difficulty": "hard"
            }
        ]
    },
    "datascience": {
        "round_1_background": [
            {
                "q": "What sparked your interest in Data Science and Analytics?",
                "keywords": ["patterns", "insights", "math", "impact", "predictions", "data", "decisions"],
                "model_answer": "My interest in data science was sparked by the power of turning raw data into actionable insights that drive real-world decisions. I was fascinated by how statistical analysis and machine learning could uncover hidden patterns in large datasets. The combination of mathematics, programming, and domain knowledge creates a unique problem-solving approach. Seeing how data-driven predictions could improve business outcomes, healthcare diagnoses, and user experiences motivated me to dive deeper into the field and develop expertise in both the technical and communication aspects of data science.",
                "weight": 1.0,
                "category": "behavioral",
                "difficulty": "easy"
            },
            {
                "q": "Describe your proficiency with tools like Python (Pandas/NumPy) or R.",
                "keywords": ["pandas", "numpy", "r", "libraries", "dataframe", "analysis", "visualization"],
                "model_answer": "I'm highly proficient with Python's data science ecosystem. I use Pandas extensively for data manipulation, cleaning, and analysis with DataFrames. NumPy is my go-to for numerical computations and array operations. For visualization, I work with Matplotlib, Seaborn, and Plotly for interactive charts. I use Scikit-learn for machine learning model building and evaluation. I also have experience with Jupyter notebooks for exploratory data analysis and presentation. While I've used R for statistical analysis, Python remains my primary tool due to its versatility and the breadth of its ecosystem.",
                "weight": 1.0,
                "category": "behavioral",
                "difficulty": "easy"
            },
            {
                "q": "How do you explain complex data findings to non-technical stakeholders?",
                "keywords": ["storytelling", "visualization", "simple", "business", "impact", "dashboard"],
                "model_answer": "I focus on data storytelling rather than technical details. I start with the business question and the actionable conclusion, then work backwards to show the supporting evidence. I use clear visualizations like bar charts and trend lines instead of complex statistical plots. I avoid jargon and use analogies that relate to the audience's domain knowledge. I create interactive dashboards in Tableau or Power BI that allow stakeholders to explore data at their own pace. I always frame findings in terms of business impact, such as revenue, cost savings, or risk reduction.",
                "weight": 1.0,
                "category": "behavioral",
                "difficulty": "easy"
            },
            {
                "q": "What is your approach to cleaning a messy dataset?",
                "keywords": ["missing values", "outliers", "duplicates", "standardization", "wrangling", "quality"],
                "model_answer": "My approach follows a systematic pipeline. First, I assess data quality by checking for missing values, duplicates, and inconsistent formats. I handle missing data through imputation methods appropriate for each column such as mean or median for numerical, mode for categorical, or dropping if the percentage is low. I identify and treat outliers using IQR or z-score methods. I standardize formats for dates, strings, and categories. I remove duplicates and validate data types. Throughout the process, I document every transformation for reproducibility and maintain both raw and cleaned versions of the dataset.",
                "weight": 1.0,
                "category": "behavioral",
                "difficulty": "easy"
            },
            {
                "q": "How do you stay updated with the latest AI and ML research?",
                "keywords": ["arxiv", "papers", "kaggle", "medium", "courses", "community", "conferences"],
                "model_answer": "I stay current through multiple channels. I follow key researchers and organizations on Twitter and LinkedIn. I regularly browse arXiv for new papers in my areas of interest and read summaries on Papers With Code. I participate in Kaggle competitions to practice new techniques. I take online courses on Coursera and fast.ai for structured learning. I read Medium publications like Towards Data Science and attend virtual conferences and local meetups. I also contribute to open-source ML projects which keeps me engaged with the latest tools and best practices.",
                "weight": 1.0,
                "category": "behavioral",
                "difficulty": "easy"
            }
        ],
        "round_2_domain": [
            {
                "q": "Explain the Bias-Variance tradeoff in Machine Learning.",
                "keywords": ["overfitting", "underfitting", "complexity", "error", "generalization", "balance"],
                "model_answer": "The bias-variance tradeoff is a fundamental concept in machine learning. High bias means the model is too simple and underfits the data, failing to capture important patterns leading to high error on both training and test data. High variance means the model is too complex and overfits the training data, capturing noise rather than true patterns, leading to low training error but high test error. The goal is to find the sweet spot where both bias and variance are balanced, achieving good generalization to unseen data. Techniques like cross-validation, regularization, and ensemble methods help manage this tradeoff.",
                "weight": 2.0,
                "category": "technical",
                "difficulty": "medium"
            },
            {
                "q": "What is the difference between Supervised and Unsupervised learning?",
                "keywords": ["labeled", "clustering", "regression", "classification", "unlabeled", "patterns"],
                "model_answer": "Supervised learning uses labeled training data where both inputs and desired outputs are provided. The model learns to map inputs to outputs for prediction tasks. It includes classification where outputs are categories like spam detection and regression where outputs are continuous values like price prediction. Unsupervised learning works with unlabeled data, discovering hidden patterns and structures without predefined outputs. It includes clustering to group similar data points, dimensionality reduction to simplify data, and anomaly detection to identify unusual patterns. Semi-supervised learning combines both approaches using small amounts of labeled data with large amounts of unlabeled data.",
                "weight": 2.0,
                "category": "technical",
                "difficulty": "medium"
            },
            {
                "q": "Explain how a Random Forest model works.",
                "keywords": ["decision trees", "ensemble", "bagging", "voting", "overfitting", "random", "features"],
                "model_answer": "Random Forest is an ensemble learning method that combines multiple decision trees to improve prediction accuracy and reduce overfitting. It uses bagging where each tree is trained on a random bootstrap sample of the training data. Additionally, at each split in a tree, only a random subset of features is considered, adding another layer of randomness. For classification, the final prediction is determined by majority voting across all trees. For regression, it's the average of all tree predictions. This approach reduces variance compared to a single decision tree while maintaining low bias, making it robust against overfitting and effective across many types of problems.",
                "weight": 2.0,
                "category": "technical",
                "difficulty": "medium"
            },
            {
                "q": "What is Cross-Validation and why is it important?",
                "keywords": ["folds", "training", "testing", "validation", "robustness", "k-fold", "evaluation"],
                "model_answer": "Cross-validation is a technique for assessing model performance by partitioning data into multiple subsets. In k-fold cross-validation, the data is divided into k equal folds. The model is trained k times, each time using k-1 folds for training and the remaining fold for validation. The final performance metric is the average across all k iterations. This provides a more reliable estimate of model performance than a single train-test split because every data point is used for both training and validation. It helps detect overfitting, ensures the model generalizes well to unseen data, and is essential for comparing different models or hyperparameter configurations.",
                "weight": 2.0,
                "category": "technical",
                "difficulty": "medium"
            },
            {
                "q": "How do you evaluate a classification model's performance?",
                "keywords": ["accuracy", "precision", "recall", "f1-score", "confusion matrix", "auc", "roc"],
                "model_answer": "I evaluate classification models using multiple metrics. The confusion matrix shows true positives, true negatives, false positives, and false negatives. Accuracy measures overall correctness but can be misleading with imbalanced classes. Precision measures the proportion of positive predictions that are correct, important when false positives are costly. Recall measures the proportion of actual positives correctly identified, critical when false negatives are dangerous. F1-score is the harmonic mean of precision and recall, providing a balanced metric. The ROC curve plots true positive rate versus false positive rate, and AUC summarizes the model's ability to discriminate between classes across all thresholds.",
                "weight": 2.0,
                "category": "technical",
                "difficulty": "medium"
            }
        ],
        "round_3_project": [
            {
                "q": "Walk me through a project where you built a predictive model.",
                "keywords": ["feature engineering", "selection", "training", "evaluation", "result", "deployment"],
                "model_answer": "I built a customer churn prediction model for a telecom company. I started with exploratory data analysis on 50000 customer records, identifying key patterns in churn behavior. Feature engineering included creating metrics like average monthly usage change, customer tenure categories, and service interaction frequency. I used correlation analysis and recursive feature elimination for feature selection. I compared Logistic Regression, Random Forest, and XGBoost models using 5-fold cross-validation. XGBoost performed best with an F1-score of 0.87. I deployed the model as a REST API that scores customers nightly, enabling the retention team to proactively reach out to at-risk customers, reducing churn by 15%.",
                "weight": 3.0,
                "category": "problem_solving",
                "difficulty": "hard"
            },
            {
                "q": "Describe a time you had to deal with highly imbalanced data.",
                "keywords": ["smote", "undersampling", "oversampling", "metrics", "weights", "imbalanced"],
                "model_answer": "I worked on fraud detection where only 0.5% of transactions were fraudulent. Standard models achieved 99.5% accuracy by simply predicting everything as legitimate. I addressed this by using SMOTE to generate synthetic minority samples, combined with random undersampling of the majority class to create a balanced training set. I also used class weights in the model loss function to penalize misclassification of fraud cases more heavily. I switched evaluation metrics from accuracy to precision-recall AUC and F1-score. I used stratified k-fold cross-validation to maintain class distribution across folds. The final ensemble model achieved 92% recall on fraud detection with only 3% false positive rate.",
                "weight": 3.0,
                "category": "problem_solving",
                "difficulty": "hard"
            },
            {
                "q": "Tell me about a data visualization project that drove a business decision.",
                "keywords": ["tableau", "matplotlib", "seaborn", "dashboard", "insight", "impact", "visualization"],
                "model_answer": "I created an interactive Tableau dashboard analyzing sales performance across 200 retail locations. The visualization revealed that stores near universities had 40% higher weekend sales but 25% lower weekday performance compared to business district locations. I designed heatmaps showing peak hours by location type, trend lines comparing seasonal patterns, and geographic maps with performance overlays. The dashboard allowed executives to drill down from national to individual store level. Based on these insights, the company adjusted staffing schedules for university locations and launched targeted weekday promotions, resulting in a 12% overall revenue increase within three months.",
                "weight": 3.0,
                "category": "problem_solving",
                "difficulty": "hard"
            },
            {
                "q": "Describe a project where you used NLP or Computer Vision.",
                "keywords": ["text", "images", "cnn", "tokenization", "transformer", "nlp", "processing"],
                "model_answer": "I built a customer support ticket classifier using NLP that automatically categorized and prioritized incoming tickets. I preprocessed text data with tokenization, stopword removal, and lemmatization using spaCy. I experimented with TF-IDF with SVM, LSTM networks, and fine-tuned BERT models. The BERT-based approach achieved 94% accuracy across 15 categories. I implemented a confidence threshold where tickets below 80% confidence were routed to human agents. The system also extracted key entities like product names and error codes using named entity recognition. Deployment reduced average ticket routing time from 4 hours to under 5 seconds, improving customer satisfaction scores by 20%.",
                "weight": 3.0,
                "category": "problem_solving",
                "difficulty": "hard"
            },
            {
                "q": "Tell me about a time you deployed a model into production.",
                "keywords": ["pickle", "flask", "api", "monitoring", "inference", "deployment", "pipeline"],
                "model_answer": "I deployed a recommendation engine for an e-commerce platform. The model was trained offline using collaborative filtering and serialized with joblib. I built a FastAPI service that loads the model and exposes prediction endpoints. I containerized the service with Docker and deployed to AWS ECS with auto-scaling based on request volume. I implemented a monitoring pipeline that tracks prediction latency, model drift by comparing prediction distributions weekly, and business metrics like click-through rates on recommendations. I set up A/B testing infrastructure to compare model versions and automated the retraining pipeline to run monthly with fresh data, triggering deployment only when the new model outperforms the current one on the validation set.",
                "weight": 3.0,
                "category": "problem_solving",
                "difficulty": "hard"
            }
        ]
    },
    "devops": {
        "round_1_background": [
            {
                "q": "What does DevOps mean to you in a modern software team?",
                "keywords": ["automation", "culture", "collaboration", "delivery", "pipeline", "continuous"],
                "model_answer": "DevOps is both a culture and a set of practices that bridges the gap between development and operations teams. It emphasizes automation of the software delivery pipeline, continuous integration and deployment, infrastructure as code, and monitoring. The core philosophy is about breaking down silos, enabling faster and more reliable software delivery through collaboration. It means shared responsibility for the entire application lifecycle from development through production. In modern teams, DevOps engineers enable developers to ship code confidently through automated testing, deployment pipelines, and robust monitoring systems.",
                "weight": 1.0,
                "category": "behavioral",
                "difficulty": "easy"
            },
            {
                "q": "Describe your experience with cloud providers like AWS, Azure, or GCP.",
                "keywords": ["aws", "azure", "cloud", "services", "infrastructure", "compute", "storage"],
                "model_answer": "I have extensive experience primarily with AWS, including EC2 for compute, S3 for storage, RDS for managed databases, Lambda for serverless functions, and ECS/EKS for container orchestration. I've also used CloudFront for CDN, Route53 for DNS management, and IAM for access control. I have working knowledge of Azure App Service and Azure DevOps for CI/CD pipelines. I follow the principle of using managed services where possible to reduce operational overhead, and I implement infrastructure as code using Terraform to maintain consistent environments across development, staging, and production.",
                "weight": 1.0,
                "category": "behavioral",
                "difficulty": "easy"
            },
            {
                "q": "How do you keep your infrastructure documentation up to date?",
                "keywords": ["readme", "diagrams", "confluence", "wiki", "auto-generated", "architecture"],
                "model_answer": "I maintain documentation at multiple levels. Architecture diagrams are created using tools like draw.io and stored alongside code. Infrastructure as Code files like Terraform serve as living documentation of the actual infrastructure state. I use auto-generated documentation where possible, such as Terraform docs and API specs from code annotations. Runbooks for common operational procedures are maintained in Confluence and reviewed quarterly. I require documentation updates as part of the code review process for infrastructure changes. Critical information like architecture decisions are recorded in ADRs stored in the repository.",
                "weight": 1.0,
                "category": "behavioral",
                "difficulty": "easy"
            },
            {
                "q": "What tools do you use for monitoring and alerting?",
                "keywords": ["prometheus", "grafana", "nagios", "datadog", "slack", "monitoring", "alerts"],
                "model_answer": "I use a comprehensive monitoring stack. Prometheus for metrics collection and time-series data storage, Grafana for visualization dashboards displaying system health, application performance, and business metrics. I set up alerting through Grafana and PagerDuty with tiered severity levels that route to appropriate channels including Slack for warnings and phone calls for critical issues. For application performance monitoring, I use Datadog or New Relic to trace requests across microservices. Log aggregation is handled through the ELK stack or CloudWatch Logs. I follow the principle of alerting on symptoms rather than causes to reduce alert fatigue.",
                "weight": 1.0,
                "category": "behavioral",
                "difficulty": "easy"
            },
            {
                "q": "How do you prioritize automation vs. manual fixes?",
                "keywords": ["repetition", "efficiency", "time-saving", "standardization", "risk", "frequency"],
                "model_answer": "I evaluate automation candidates based on frequency, time savings, and risk reduction. Tasks performed more than twice weekly are prime automation candidates. I calculate the break-even point by comparing automation development time against cumulative time saved. High-risk manual procedures like database migrations and deployments are prioritized for automation regardless of frequency because automation reduces human error. I start with simple automation that provides immediate value and iterate. However, I recognize that some rare troubleshooting scenarios are better handled manually with good runbooks than over-engineered automation.",
                "weight": 1.0,
                "category": "behavioral",
                "difficulty": "easy"
            }
        ],
        "round_2_domain": [
            {
                "q": "Explain the concept of Infrastructure as Code (IaC).",
                "keywords": ["terraform", "ansible", "versioning", "reproducible", "automation", "declarative"],
                "model_answer": "Infrastructure as Code is the practice of managing and provisioning infrastructure through machine-readable configuration files rather than manual processes. Tools like Terraform use a declarative approach where you define the desired state and the tool handles achieving it. Ansible uses a procedural approach for configuration management. IaC enables version control of infrastructure changes, reproducible environments across development and production, peer review of infrastructure modifications, and automated provisioning. It eliminates configuration drift and enables disaster recovery by recreating entire environments from code.",
                "weight": 2.0,
                "category": "technical",
                "difficulty": "medium"
            },
            {
                "q": "What is the difference between Continuous Integration and Continuous Deployment?",
                "keywords": ["testing", "merging", "production", "automated", "release", "pipeline", "build"],
                "model_answer": "Continuous Integration is the practice of frequently merging code changes into a shared repository, where each merge triggers automated builds and tests. It ensures code compatibility and catches integration issues early. Continuous Deployment extends CI by automatically deploying every change that passes all pipeline stages directly to production without manual approval. Continuous Delivery is the middle ground where code is always in a deployable state but requires manual approval for production release. A typical pipeline includes stages for building, unit testing, integration testing, staging deployment, and production deployment with automated rollback capabilities.",
                "weight": 2.0,
                "category": "technical",
                "difficulty": "medium"
            },
            {
                "q": "Explain Containerization vs. Virtualization.",
                "keywords": ["docker", "vm", "kernel", "resource", "isolation", "lightweight", "hypervisor"],
                "model_answer": "Virtualization creates full virtual machines with their own operating systems running on a hypervisor, providing complete isolation but consuming significant resources. Each VM includes a complete OS, drivers, and application stack. Containerization using Docker shares the host kernel while isolating applications in lightweight containers that include only the application and its dependencies. Containers start in seconds compared to minutes for VMs and use significantly less memory and disk space. Containers are ideal for microservices and application packaging, while VMs are better for running different operating systems or applications requiring complete isolation.",
                "weight": 2.0,
                "category": "technical",
                "difficulty": "medium"
            },
            {
                "q": "How do Blue-Green deployments work?",
                "keywords": ["zero downtime", "rollback", "traffic", "staging", "switch", "environments"],
                "model_answer": "Blue-Green deployment maintains two identical production environments called Blue and Green. At any time, one environment serves live traffic while the other is idle. During deployment, the new version is deployed to the idle environment and thoroughly tested. Once verified, traffic is switched from the active to the updated environment using a load balancer or DNS change. This enables zero-downtime deployments and instant rollback by simply switching traffic back to the previous environment if issues are detected. The idle environment can then be updated and used for the next deployment cycle.",
                "weight": 2.0,
                "category": "technical",
                "difficulty": "medium"
            },
            {
                "q": "What is a Kubernetes Cluster and its core components?",
                "keywords": ["node", "pod", "deployment", "service", "kubelet", "container", "orchestration"],
                "model_answer": "A Kubernetes cluster is a container orchestration platform consisting of a control plane and worker nodes. The control plane includes the API server for communication, etcd for cluster state storage, the scheduler for assigning pods to nodes, and the controller manager for maintaining desired state. Worker nodes run the kubelet agent, container runtime like Docker, and kube-proxy for networking. Pods are the smallest deployable units containing one or more containers. Deployments manage pod replicas and rolling updates. Services provide stable networking and load balancing. Kubernetes automates container deployment, scaling, and management across the cluster.",
                "weight": 2.0,
                "category": "technical",
                "difficulty": "medium"
            }
        ],
        "round_3_project": [
            {
                "q": "Describe a CI/CD pipeline you built from scratch.",
                "keywords": ["jenkins", "github actions", "yaml", "artifact", "stages", "testing", "deployment"],
                "model_answer": "I built a CI/CD pipeline using GitHub Actions for a microservices application. The pipeline consisted of multiple stages triggered on pull requests and merges. The first stage runs linting and unit tests in parallel for each service. The second stage builds Docker images and pushes them to ECR with semantic versioning tags. The third stage deploys to a staging environment and runs integration and end-to-end tests. Upon manual approval, the final stage deploys to production using rolling updates in EKS. I implemented caching for dependencies to speed up builds, parallel jobs for independent services, and Slack notifications for pipeline status. Rollback is automated if health checks fail post-deployment.",
                "weight": 3.0,
                "category": "problem_solving",
                "difficulty": "hard"
            },
            {
                "q": "Tell me about a time you handled a major infrastructure failure.",
                "keywords": ["root cause", "post-mortem", "recovery", "incident", "backup", "response"],
                "model_answer": "Our primary database server experienced a disk failure during peak hours, causing complete application downtime. I immediately initiated our incident response protocol, notifying stakeholders and assembling the response team. I failed over to our read replica and promoted it to primary within 15 minutes, restoring read operations. I spun up a new replica from the latest backup while investigating the root cause. Full service was restored within 45 minutes. The post-mortem revealed we lacked automated failover and our backup restoration hadn't been tested recently. I implemented automated failover with Amazon RDS Multi-AZ, established monthly backup restoration drills, and enhanced monitoring to detect disk health degradation before failure.",
                "weight": 3.0,
                "category": "problem_solving",
                "difficulty": "hard"
            },
            {
                "q": "Walk me through a project where you migrated a legacy app to Docker.",
                "keywords": ["dockerfile", "images", "registry", "compose", "volume", "migration", "container"],
                "model_answer": "I containerized a legacy PHP monolith running on bare metal servers. I started by documenting all dependencies and runtime requirements. I created a multi-stage Dockerfile that builds the application in one stage and produces a minimal production image. I used Docker Compose for local development with services for the app, MySQL, and Redis. I set up a private container registry on ECR for storing images. Data persistence was handled through Docker volumes for the database. I migrated gradually using a strangler pattern, running both containerized and legacy versions behind a load balancer. The migration reduced deployment time from 2 hours to 5 minutes and eliminated environment-specific bugs.",
                "weight": 3.0,
                "category": "problem_solving",
                "difficulty": "hard"
            },
            {
                "q": "Describe a project where you improved system security in the pipeline.",
                "keywords": ["secrets", "scanning", "vault", "encryption", "rbac", "security", "compliance"],
                "model_answer": "I improved the security posture of our CI/CD pipeline for a fintech application. I migrated hardcoded secrets to HashiCorp Vault with dynamic secret generation for database credentials. I integrated container image scanning with Trivy in the pipeline to catch vulnerabilities before deployment. I implemented RBAC in Kubernetes to restrict pod permissions using least privilege principles. I added SAST scanning with SonarQube and dependency vulnerability checking with Snyk to the build stage. I configured network policies to restrict pod-to-pod communication and implemented encrypted secrets management in Kubernetes. These changes helped us achieve SOC 2 compliance and reduced security incidents by 90%.",
                "weight": 3.0,
                "category": "problem_solving",
                "difficulty": "hard"
            },
            {
                "q": "Tell me about a time you optimized cloud costs for a project.",
                "keywords": ["instances", "reserved", "monitoring", "spot", "waste", "cost", "optimization"],
                "model_answer": "I reduced monthly AWS costs from $15000 to $6000 for a growing startup. I started by analyzing cost reports and identified several optimization opportunities. I right-sized over-provisioned EC2 instances by analyzing CPU and memory utilization, downgrading instances that consistently used less than 30% capacity. I purchased Reserved Instances for stable workloads, saving 40% compared to on-demand pricing. I implemented spot instances for batch processing jobs with proper interruption handling. I set up lifecycle policies for S3 to move infrequent data to Glacier. I identified and terminated unused resources like unattached EBS volumes and idle load balancers. I implemented auto-scaling to match capacity with actual demand and set up cost alerts and budgets.",
                "weight": 3.0,
                "category": "problem_solving",
                "difficulty": "hard"
            }
        ]
    }
}