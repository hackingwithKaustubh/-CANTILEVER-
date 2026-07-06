const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');
const path = require('path');

const User = require('../models/User');
const Category = require('../models/Category');
const Blog = require('../models/Blog');
const Comment = require('../models/Comment');

dotenv.config({ path: path.join(__dirname, '../.env') });

const categoriesData = [
  { name: 'Technology', description: 'Latest advancements in gadgets, networks, and general computing.', image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=600&auto=format&fit=crop&q=60' },
  { name: 'AI', description: 'Machine learning, deep neural networks, and the future of cognitive computing.', image: 'https://images.unsplash.com/photo-1677442136019-21780efad99a?w=600&auto=format&fit=crop&q=60' },
  { name: 'Programming', description: 'Software engineering, syntax, architecture, and developer resources.', image: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=600&auto=format&fit=crop&q=60' },
  { name: 'Lifestyle', description: 'Balancing work, hobbies, daily habits, and personal growth.', image: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=600&auto=format&fit=crop&q=60' },
  { name: 'Travel', description: 'Guides, cultural experiences, itineraries, and stories from around the globe.', image: 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=600&auto=format&fit=crop&q=60' },
  { name: 'Business', description: 'Market insights, leadership tips, and organizational strategies.', image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&auto=format&fit=crop&q=60' }
];

const usersData = [
  { name: 'Kaustubh Gupta', username: 'kaustubh', email: 'kaustubh@example.com', password: 'password123', role: 'admin', bio: 'Founding editor. Tech enthusiast and coffee lover.' },
  { name: 'Alice Smith', username: 'alice', email: 'alice@example.com', password: 'password123', role: 'user', bio: 'AI researcher and computer scientist writing about cognitive futures.' },
  { name: 'Bob Johnson', username: 'bob', email: 'bob@example.com', password: 'password123', role: 'user', bio: 'Full-stack software architect specializing in Node and React.' },
  { name: 'Emily Davis', username: 'emily', email: 'emily@example.com', password: 'password123', role: 'user', bio: 'Global traveler, photographer, and writer sharing wanderlust diaries.' },
  { name: 'Daniel Wilson', username: 'daniel', email: 'daniel@example.com', password: 'password123', role: 'user', bio: 'Product designer focusing on human-centered modern UI/UX.' },
  { name: 'Sophia Martinez', username: 'sophia', email: 'sophia@example.com', password: 'password123', role: 'user', bio: 'Nutritionist and yoga practitioner sharing simple lifestyle tips.' },
  { name: 'Michael Taylor', username: 'michael', email: 'michael@example.com', password: 'password123', role: 'user', bio: 'Venture analyst and serial startup founder discussing business trends.' },
  { name: 'Olivia Brown', username: 'olivia', email: 'olivia@example.com', password: 'password123', role: 'user', bio: 'Data analyst turned copywriter exploring programming and AI trends.' },
  { name: 'David Miller', username: 'david', email: 'david@example.com', password: 'password123', role: 'user', bio: 'Front-end engineer writing CSS layouts and CSS tricks.' },
  { name: 'Emma Garcia', username: 'emma', email: 'emma@example.com', password: 'password123', role: 'user', bio: 'Creative writer sharing daily thoughts and lifestyle philosophy.' }
];

const blogTitles = [
  { t: 'Demystifying Large Language Models', c: 1, tag: ['AI', 'LLM', 'Tech'] },
  { t: '10 Git Commands Every Developer Should Know', c: 2, tag: ['Git', 'Coding', 'Tips'] },
  { t: 'A Guide to Solo Travel on a Budget', c: 4, tag: ['Travel', 'Adventure', 'Budget'] },
  { t: 'Startup Funding: Bootstrapping vs VC', c: 5, tag: ['Business', 'Finance', 'Startup'] },
  { t: 'The Evolution of CSS Grid and Flexbox', c: 2, tag: ['CSS', 'Frontend', 'Design'] },
  { t: 'Introduction to Neural Networks in Python', c: 1, tag: ['AI', 'Python', 'ML'] },
  { t: 'Healthy Meal Prep for Busy Professionals', c: 3, tag: ['Lifestyle', 'Food', 'Health'] },
  { t: 'Exploring the Hidden Temples of Kyoto', c: 4, tag: ['Travel', 'Culture', 'Kyoto'] },
  { t: 'Effective Time Management with Pomodoro', c: 3, tag: ['Lifestyle', 'Productivity'] },
  { t: 'Scaling Databases in Production Environments', c: 0, tag: ['Database', 'Scaling', 'DevOps'] },
  { t: 'Deep Dive into JWT and Express Security', c: 2, tag: ['Security', 'Express', 'JWT'] },
  { t: 'Prompt Engineering: Tips for Better Outputs', c: 1, tag: ['AI', 'Prompts', 'ChatGPT'] },
  { t: 'Creating Accessible Web User Interfaces', c: 2, tag: ['Accessibility', 'UI', 'UX'] },
  { t: 'The Rise of Clean Meat Technology', c: 0, tag: ['Tech', 'Science', 'Food'] },
  { t: 'Mastering React State with Context API', c: 2, tag: ['React', 'Frontend', 'Hooks'] },
  { t: 'A Weekend Escape in the Swiss Alps', c: 4, tag: ['Travel', 'Nature', 'Alps'] },
  { t: 'Understanding Modern Corporate Finance', c: 5, tag: ['Finance', 'Business', 'Stocks'] },
  { t: 'How to Build a Custom Static Site Generator', c: 2, tag: ['Node', 'Static', 'WebDev'] },
  { t: 'Ethics in the Age of Autonomous Machines', c: 1, tag: ['AI', 'Ethics', 'Future'] },
  { t: '10 Morning Habits of High Achievers', c: 3, tag: ['Lifestyle', 'Mindset', 'Growth'] },
  { t: 'Exploring Iceland\'s Dramatic Ring Road', c: 4, tag: ['Travel', 'Nature', 'Roadtrip'] },
  { t: 'Mastering TypeScript: Advanced Utility Types', c: 2, tag: ['TypeScript', 'Programming'] },
  { t: 'Why Serverless Architecture is the Future', c: 0, tag: ['Cloud', 'Serverless', 'Tech'] },
  { t: 'Managing Burnout in High-Pressure Jobs', c: 3, tag: ['Health', 'MentalCare', 'Lifestyle'] },
  { t: 'Visual Branding: Creating a Memorable Logo', c: 5, tag: ['Business', 'Branding', 'Design'] },
  { t: 'A Foodie\'s Journey Through Bangkok', c: 4, tag: ['Travel', 'Food', 'StreetFood'] },
  { t: 'Creating Smooth Framer Motion Animations', c: 2, tag: ['React', 'FramerMotion', 'UI'] },
  { t: 'Introduction to GraphQL and Apollo Client', c: 0, tag: ['GraphQL', 'API', 'WebDev'] },
  { t: 'How Quantum Computing Works: Simple Terms', c: 0, tag: ['Tech', 'Quantum', 'Physics'] },
  { t: 'Making Sense of the Creator Economy', c: 5, tag: ['Business', 'Creator', 'Web'] }
];

const seedDB = async () => {
  try {
    console.log('Connecting to database for seeding...');
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/premium_blog_db');
    console.log('Database connected. Clearing existing collections...');

    await User.deleteMany({});
    await Category.deleteMany({});
    await Blog.deleteMany({});
    await Comment.deleteMany({});

    console.log('Inserting categories...');
    const createdCategories = [];
    for (const cat of categoriesData) {
      const slug = cat.name.toLowerCase();
      const newCat = await Category.create({ ...cat, slug });
      createdCategories.push(newCat);
    }

    console.log('Hashing passwords and inserting users...');
    const createdUsers = [];
    for (const usr of usersData) {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(usr.password, salt);
      const username = usr.username;
      const profilePicture = `https://api.dicebear.com/7.x/adventurer/svg?seed=${username}`;

      const newUsr = await User.create({
        ...usr,
        password: hashedPassword,
        profilePicture
      });
      createdUsers.push(newUsr);
    }

    console.log('Creating initial blogs list...');
    const createdBlogs = [];

    const detailedBlogs = [
      {
        title: 'The Future of Web Development with AI Helpers',
        subtitle: 'How artificial intelligence is changing the way developers write and deploy code.',
        content: '<p>Artificial intelligence is no longer just a futuristic concept; it is actively rewriting the rules of software development. Tools like GitHub Copilot, Gemini, and Claude are helping developers write cleaner code, draft tests, and even architect full features. But what does this mean for human developers?</p><p>First, it shifts our focus from syntax details to design architecture. Instead of spending hours googling for specific API forms, we can state our intent and refine the outputs. Second, it accelerates prototyping. A single engineer can build a fully functional CRUD app in hours rather than days.</p><p>However, AI assistants also bring new challenges. We must be vigilant about security issues, license compliance, and debugging code we did not write. Ultimately, AI will not replace developers, but developers who use AI will replace those who do not.</p>',
        coverImage: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=800&auto=format&fit=crop&q=60',
        tags: ['WebDev', 'AI', 'Coding'],
        category: createdCategories[0]._id, // Technology
        author: createdUsers[0]._id, // Kaustubh
        status: 'published',
        views: 140,
        readTime: 3
      },
      {
        title: 'Building Scalable Node.js Applications',
        subtitle: 'Best practices for organizing and structural design of backend microservices.',
        content: '<p>Node.js is extremely fast, but keeping it scalable requires a clean codebase and proper asynchronous resource handling. In this post, we discuss the core design principles of scalability.</p><ol><li><strong>Layered Architecture:</strong> Always separate your routers, controllers, business services, and database models to maintain high decoupling.</li><li><strong>State Management:</strong> Treat your Node server as stateless. Delegate sessions to Redis or JWT and store file uploads in cloud storage (or structured paths).</li><li><strong>Database Optimization:</strong> Use indexes effectively in MongoDB. Query selective fields using <code>.select()</code> and paginate queries.</li></ol>',
        coverImage: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=800&auto=format&fit=crop&q=60',
        tags: ['NodeJS', 'Backend', 'Scaling'],
        category: createdCategories[2]._id, // Programming
        author: createdUsers[0]._id, // Kaustubh
        status: 'published',
        views: 85,
        readTime: 4
      }
    ];

    for (const b of detailedBlogs) {
      const slug = b.title.toLowerCase().replace(/\s+/g, '-').replace(/[^\w\-]+/g, '');
      const newB = await Blog.create({ ...b, slug });
      createdBlogs.push(newB);
    }

    // Populate programmatic list to cross 30 entries
    for (let i = 0; i < blogTitles.length; i++) {
      const item = blogTitles[i];
      const authorIndex = (i + 1) % createdUsers.length;
      const author = createdUsers[authorIndex];
      const category = createdCategories[item.c];
      const slug = item.t.toLowerCase().replace(/\s+/g, '-').replace(/[^\w\-]+/g, '') + `-${i}`;

      const content = `<p>This is a premium blog post about <strong>${item.t}</strong>. Reading this post will reveal key strategies, insights, and practices to master this subject.</p><p>As we explore this topic deeper, we find that structure and execution represent 90% of the battle. Working closely with modern methods gives developers, creators, and leaders the competitive edge they need in today's fast-paced environment.</p><p>Stay tuned for more updates, tips, and articles covering similar fields!</p>`;

      const views = Math.floor(Math.random() * 200) + 10;
      const status = i === 5 || i === 12 ? 'draft' : 'published';

      const newB = await Blog.create({
        title: item.t,
        subtitle: `Understanding the core concepts and modern principles of ${item.t}.`,
        slug,
        content,
        coverImage: category.image,
        author: author._id,
        category: category._id,
        tags: item.tag || ['Tech', 'Innovation'],
        status,
        readTime: Math.floor(Math.random() * 5) + 2,
        views
      });
      createdBlogs.push(newB);
    }

    console.log(`Created ${createdBlogs.length} blog posts.`);

    console.log('Generating sample likes & bookmarks...');
    for (const blog of createdBlogs) {
      const likersCount = Math.floor(Math.random() * 4) + 1;
      const shuffledUsers = [...createdUsers].sort(() => 0.5 - Math.random());
      const likers = shuffledUsers.slice(0, likersCount);

      blog.likes = likers.map(u => u._id);
      await blog.save();

      for (const u of likers) {
        u.likedBlogs.push(blog._id);
        await u.save();
      }

      if (Math.random() > 0.6) {
        const bookmarker = shuffledUsers[0];
        bookmarker.savedBlogs.push(blog._id);
        await bookmarker.save();
      }
    }

    console.log('Generating sample comments and nested replies...');
    for (let j = 0; j < 5; j++) {
      const blog = createdBlogs[j];
      for (let k = 0; k < 3; k++) {
        const userIndex = (j + k + 1) % createdUsers.length;
        const commenter = createdUsers[userIndex];

        const comment = await Comment.create({
          blog: blog._id,
          user: commenter._id,
          content: `Great read! This article really clarifies some key points about ${blog.title}. Looking forward to the next part.`,
          likes: [createdUsers[(userIndex + 1) % createdUsers.length]._id]
        });

        const replier = createdUsers[(userIndex + 2) % createdUsers.length];
        await Comment.create({
          blog: blog._id,
          user: replier._id,
          content: `Absolutely agree with you @${commenter.username}. The architectural separation mentioned is particularly critical.`,
          parentComment: comment._id
        });
      }
    }

    const reportedComment = await Comment.create({
      blog: createdBlogs[0]._id,
      user: createdUsers[9]._id,
      content: 'This comment contains spam and promotion for crypto websites! Go to scamsite.com now!',
      isReported: true
    });

    console.log('Database successfully seeded!');
    mongoose.disconnect();
  } catch (error) {
    console.error('Seeding failure:', error.stack || error.message);
    process.exit(1);
  }
};

seedDB();
