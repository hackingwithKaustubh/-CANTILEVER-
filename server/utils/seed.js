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
  { name: 'Kaustubh Gupta', username: 'kaustubh', email: 'kaustubh@example.com', password: 'password123', role: 'admin', bio: 'Founding editor and tech entrepreneur. Coffee lover and startup enthusiast.', location: 'Bangalore, Karnataka', phone: '+91-9876543210', website: 'https://kaustubh.tech' },
  { name: 'Mishika Verma', username: 'mishika_verma', email: 'mishika@example.com', password: 'password123', role: 'user', bio: 'AI researcher & data scientist. Passionate about machine learning and tech innovation.', location: 'Bangalore, India', phone: '+91-9123456789', website: 'https://mishikaverma.ai' },
  { name: 'Anshika Sharma', username: 'anshika_sharma', email: 'anshika@example.com', password: 'password123', role: 'user', bio: 'Full-stack developer, open-source contributor. Building scalable web apps with React & Node.', location: 'Mumbai, Maharashtra', phone: '+91-8765432109', website: 'https://anshikasharma.dev' },
  { name: 'Dhanshika Singh', username: 'dhanshika_singh', email: 'dhanshika@example.com', password: 'password123', role: 'user', bio: 'Travel blogger & photographer exploring hidden gems across India. Stories from Rajasthan to Northeast.', location: 'Jaipur, India', phone: '+91-9988776655', website: 'https://dhanshikatravels.com' },
  { name: 'Ayush Kumar', username: 'ayush_kumar', email: 'ayush@example.com', password: 'password123', role: 'user', bio: 'Product designer & UX specialist. Crafting digital experiences.', location: 'Gurgaon, Haryana', phone: '+91-9112233445', website: 'https://ayushux.design' },
  { name: 'Sakshi Malhotra', username: 'sakshi_malhotra', email: 'sakshi@example.com', password: 'password123', role: 'user', bio: 'Ayurveda enthusiast & wellness coach. Sharing ancient Indian wellness practices for modern living.', location: 'Delhi, India', phone: '+91-9876545678', website: 'https://sakshiwellness.in' },
  { name: 'Harsh Mahajan', username: 'harsh_mahajan', email: 'harsh@example.com', password: 'password123', role: 'user', bio: 'Venture capitalist & startup advisor. Investing in India\'s tech ecosystem.', location: 'Mumbai, India', phone: '+91-9001234567', website: 'https://harshvc.com' },
  { name: 'Avni Kapoor', username: 'avni_kapoor', email: 'avni@example.com', password: 'password123', role: 'user', bio: 'Tech writer & programming educator. Python enthusiast. Building tomorrow\'s developers.', location: 'Kochi, Kerala', phone: '+91-9845612345', website: 'https://avnicodes.dev' },
  { name: 'Aarav Singh', username: 'aarav_singh', email: 'aarav@example.com', password: 'password123', role: 'user', bio: 'Frontend engineer & web design lover. CSS wizard. UI/UX advocate.', location: 'Pune, Maharashtra', phone: '+91-9567891234', website: 'https://aarav.frontend.dev' },
  { name: 'Priyanka Nair', username: 'priyanka_nair', email: 'priyanka@example.com', password: 'password123', role: 'user', bio: 'Lifestyle & travel blogger. Adventure seeker. Documenting India\'s culture and cuisine.', location: 'Hyderabad, Telangana', phone: '+91-9654321098', website: 'https://priyankaadventures.com' }
];

const blogTitles = [
  { t: 'AI Startups Thriving in Bangalore\'s Tech Hub', c: 1, tag: ['AI', 'Startup', 'India'] },
  { t: '10 Git Workflows Every Indian Developer Should Master', c: 2, tag: ['Git', 'Coding', 'Tips'] },
  { t: 'Backpacking Through Rajasthan on ₹2000/Day', c: 4, tag: ['Travel', 'India', 'Budget'] },
  { t: 'Building Tech Startups in India: VC Landscape 2024', c: 5, tag: ['Business', 'Startup', 'India'] },
  { t: 'Modern CSS Techniques for Indian E-commerce Platforms', c: 2, tag: ['CSS', 'Frontend', 'Design'] },
  { t: 'Machine Learning with Indian Language Processing', c: 1, tag: ['AI', 'NLP', 'ML'] },
  { t: 'Ancient Ayurvedic Wellness Practices for Modern Life', c: 3, tag: ['Lifestyle', 'Wellness', 'India'] },
  { t: 'Discovering the Spiritual Beauty of Varanasi and Rishikesh', c: 4, tag: ['Travel', 'Culture', 'Spirituality'] },
  { t: 'Productivity Tips from Indian Philosophy and Yoga', c: 3, tag: ['Lifestyle', 'Wellness', 'Productivity'] },
  { t: 'Scaling Apps for 400M+ Indian Internet Users', c: 0, tag: ['Database', 'Scaling', 'India'] },
  { t: 'Building Secure APIs for Indian Digital Payments', c: 2, tag: ['Security', 'Payment', 'Backend'] },
  { t: 'Prompt Engineering for Indic Language Models', c: 1, tag: ['AI', 'NLP', 'India'] },
  { t: 'Web Accessibility Best Practices for Indian Users', c: 2, tag: ['Accessibility', 'UI', 'UX'] },
  { t: 'Sustainable Food Tech Innovation in India', c: 0, tag: ['Tech', 'Food', 'Innovation'] },
  { t: 'Building React Apps with Indian Data Structures', c: 2, tag: ['React', 'Frontend', 'Performance'] },
  { t: 'Trekking the Himalayas: A Complete Adventure Guide', c: 4, tag: ['Travel', 'Adventure', 'Himalayas'] },
  { t: 'Understanding Fintech Growth in India and Southeast Asia', c: 5, tag: ['Business', 'Fintech', 'India'] },
  { t: 'Open Source Contributions from Indian Developers', c: 2, tag: ['OpenSource', 'Community', 'India'] },
  { t: 'Ethical AI: Challenges in the Indian Context', c: 1, tag: ['AI', 'Ethics', 'India'] },
  { t: '10 Morning Rituals from Hindu Philosophy', c: 3, tag: ['Lifestyle', 'Wellness', 'Culture'] },
  { t: 'Exploring the Beaches of Goa: Hidden Gems and Must-Visit Spots', c: 4, tag: ['Travel', 'Beaches', 'Goa'] },
  { t: 'TypeScript Best Practices for Indian Tech Teams', c: 2, tag: ['TypeScript', 'Programming', 'TeamWork'] },
  { t: 'Cloud Architecture for Indian Startups: AWS vs Azure', c: 0, tag: ['Cloud', 'AWS', 'Infrastructure'] },
  { t: 'Mental Health and Meditation: Ancient Indian Wisdom', c: 3, tag: ['Health', 'Wellness', 'Meditation'] },
  { t: 'Building Brands for Indian Audiences: Marketing Guide', c: 5, tag: ['Business', 'Marketing', 'India'] },
  { t: 'Street Food Tour: The Culinary Heart of Delhi', c: 4, tag: ['Travel', 'Food', 'Culture'] },
  { t: 'Animation Techniques for Indian User Interfaces', c: 2, tag: ['React', 'Animation', 'UI'] },
  { t: 'GraphQL in Production: Real-world Indian Case Studies', c: 0, tag: ['GraphQL', 'API', 'Production'] },
  { t: 'Quantum Computing and India\'s Tech Future', c: 0, tag: ['Tech', 'Quantum', 'Innovation'] },
  { t: 'Creator Economy in India: Monetization Strategies', c: 5, tag: ['Business', 'Creator', 'India'] }
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
        subtitle: 'How artificial intelligence is reshaping software development in India\'s growing tech ecosystem.',
        content: '<p>Artificial intelligence is revolutionizing Indian software development. Tools like GitHub Copilot, Gemini, and Claude are helping developers in Bangalore, Mumbai, and Pune write cleaner, more efficient code.</p><p>India\'s tech workforce of 5+ million developers stands at the forefront of this AI revolution. Instead of spending hours on syntax, developers can now focus on architecture and design. This shift accelerates prototyping and allows individual engineers to build full-stack applications in days rather than weeks.</p><p>For Indian startups bootstrapping with limited resources, AI assistants are game-changers. They reduce development costs and time-to-market significantly. However, security, licensing, and code quality remain critical concerns. The developers who master AI tools will lead India\'s next wave of innovation.</p>',
        coverImage: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&auto=format&fit=crop&q=60',
        tags: ['WebDev', 'AI', 'India'],
        category: createdCategories[0]._id, // Technology
        author: createdUsers[0]._id, // Kaustubh
        status: 'published',
        views: 240,
        readTime: 4
      },
      {
        title: 'Building Scalable Backend Systems for Indian E-Commerce',
        subtitle: 'Best practices for Node.js applications handling millions of Indian customers.',
        content: '<p>India\'s e-commerce market is exploding with 500M+ online shoppers. Building scalable backend systems is now essential for startups and enterprises alike.</p><ol><li><strong>Distributed Architecture:</strong> Use microservices to handle peak traffic during festival sales (Diwali, Holi) when traffic surges 10x.</li><li><strong>Database Optimization:</strong> MongoDB indexing becomes critical when dealing with millions of product SKUs and customer records.</li><li><strong>Payment Integration:</strong> Handle multiple payment gateways (Razorpay, PayU, PhonePe) with proper state management and retry logic.</li><li><strong>Geographic Distribution:</strong> Deploy across India\'s data centers (AWS Mumbai, GCP Delhi) to reduce latency for users across metros and tier-2 cities.</li></ol><p>Proper caching, API rate limiting, and asynchronous processing are vital for Indian platforms scaling rapidly.</p>',
        coverImage: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&auto=format&fit=crop&q=60',
        tags: ['NodeJS', 'Backend', 'India'],
        category: createdCategories[2]._id, // Programming
        author: createdUsers[1]._id, // Priya
        status: 'published',
        views: 185,
        readTime: 5
      },
      {
        title: 'Solo Travel Through Rajasthan: A Budget Traveler\'s Paradise',
        subtitle: 'Explore the majestic palaces, desert landscapes, and vibrant culture of Rajasthan.',
        content: '<p>Rajasthan is India\'s crown jewel for travelers. The golden deserts, magnificent forts, and colorful cities offer an unforgettable experience without breaking the bank.</p><p><strong>Budget Breakdown (per day):</strong> Accommodation: ₹400-600 | Food: ₹400-600 | Activities: ₹300-500 | Transport: ₹200-400</p><p><strong>Must-Visit Destinations:</strong> Jaipur\'s City Palace and Jantar Mantar, Jodhpur\'s blue city and Mehrangarh Fort, Udaipur\'s romantic lakes and palaces, Pushkar\'s camel fair (Oct-Nov), Jaisalmer\'s desert dunes and golden fort.</p><p>Best time to visit: October to March when the weather is pleasant. Use local buses for budget travel, stay in hostels or guesthouses, and eat at local dhaba restaurants for authentic flavors at minimal cost.</p>',
        coverImage: 'https://images.unsplash.com/photo-1537209519191-a41e4ef0e84e?w=800&auto=format&fit=crop&q=60',
        tags: ['Travel', 'Rajasthan', 'Budget'],
        category: createdCategories[4]._id, // Travel
        author: createdUsers[3]._id, // Ananya
        status: 'published',
        views: 520,
        readTime: 5
      },
      {
        title: 'Ayurvedic Wellness: Ancient Wisdom for Modern Stress',
        subtitle: 'How traditional Indian medicine can help you achieve balance and inner peace.',
        content: '<p>Ayurveda, India\'s 5000-year-old system of medicine, offers profound wisdom for managing modern stress and achieving optimal health.</p><p><strong>Understanding Your Dosha:</strong> Vata (air), Pitta (fire), and Kapha (earth). Each person has a unique combination. Knowing yours helps customize diet, exercise, and lifestyle.</p><p><strong>Daily Practices (Dinacharya):</strong> Wake at sunrise, oil massage (abhyanga), tongue scraping, meditation, and proper digestion with warm spices. These simple practices transform your energy and focus.</p><p><strong>Seasonal Eating:</strong> Eat warm foods in winter, cooling foods in summer. Use sesame oil in cold months, coconut oil in summer. Follow nature\'s rhythms.</p><p>Integrate these practices gradually. Even small changes in diet and daily routine can bring remarkable improvements in health and mental clarity.</p>',
        coverImage: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=800&auto=format&fit=crop&q=60',
        tags: ['Wellness', 'Ayurveda', 'Lifestyle'],
        category: createdCategories[3]._id, // Lifestyle
        author: createdUsers[5]._id, // Neha
        status: 'published',
        views: 380,
        readTime: 4
      },
      {
        title: 'Street Food Adventure: Flavors of Old Delhi',
        subtitle: 'Discover the culinary heritage and authentic street food of Delhi\'s historic lanes.',
        content: '<p>Old Delhi is a sensory explosion. Narrow lanes filled with crowds, the aroma of spices, sizzling street food, and vibrant energy make it one of India\'s most authentic experiences.</p><p><strong>Must-Try Street Foods:</strong> Jalebi-imarti at Haldiram\'s lane, samosas at Paranthe Wali Gali, aloo tikki at Raj Kachori stalls, chaat varieties (pani puri, gol gappa), kebabs at Jama Masjid, kulfi from street vendors.</p><p><strong>Best Time to Visit:</strong> Early morning for fresh items, or evening when the lanes come alive with activity and families out for evening walks.</p><p><strong>Pro Tips:</strong> Go with locals if possible, eat where there\'s high turnover (food is fresher), and embrace the chaos. The magic of Delhi lies in its unfiltered, authentic street culture.</p>',
        coverImage: 'https://images.unsplash.com/photo-1589985643552-c7e13d0b96fa?w=800&auto=format&fit=crop&q=60',
        tags: ['Travel', 'Food', 'Delhi'],
        category: createdCategories[4]._id, // Travel
        author: createdUsers[9]._id, // Pooja
        status: 'published',
        views: 450,
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

      // Context-aware content for India-themed blogs
      let content = '';
      if (item.t.toLowerCase().includes('india') || item.t.toLowerCase().includes('indian') || item.t.toLowerCase().includes('rajasthan') || item.t.toLowerCase().includes('delhi') || item.t.toLowerCase().includes('goa')) {
        content = `<p><strong>Exploring India's Unique Landscape</strong></p><p>This comprehensive guide covers key insights about <strong>${item.t}</strong>. From bustling metropolitan cities to serene temples and beaches, India offers diverse experiences for both tech professionals and travel enthusiasts.</p><p>Whether you're looking to understand India's tech ecosystem, explore its cultural heritage, or plan your next adventure, this post provides practical tips, real-world examples, and actionable strategies.</p><p>India's rapid growth in technology, sustainable practices, and cultural tourism makes it an exciting subject to explore. Discover how modern innovation is blending with ancient traditions to create unique opportunities.</p>`;
      } else if (item.t.toLowerCase().includes('travel') || item.t.toLowerCase().includes('trek') || item.t.toLowerCase().includes('beach') || item.t.toLowerCase().includes('himalaya')) {
        content = `<p><strong>Adventure Awaits in India</strong></p><p>This detailed exploration of <strong>${item.t}</strong> will guide you through some of India's most spectacular destinations and experiences.</p><p>From the snow-capped Himalayas to the tropical beaches of the south, from bustling city exploration to serene ashram retreats—India has it all. Learn insider tips, budget planning strategies, and hidden gems that most tourists miss.</p><p>Join thousands of travel enthusiasts who have shared their journeys and recommendations. Your next unforgettable experience in India starts here!</p>`;
      } else if (item.t.toLowerCase().includes('ayurveda') || item.t.toLowerCase().includes('wellness') || item.t.toLowerCase().includes('yoga') || item.t.toLowerCase().includes('meditation') || item.t.toLowerCase().includes('ritual')) {
        content = `<p><strong>Ancient Wisdom for Modern Living</strong></p><p>Discover the timeless practices behind <strong>${item.t}</strong> and how they can transform your daily life.</p><p>Rooted in India's ancient philosophical traditions, these practices have been refined over millennia. In today's fast-paced world, they offer proven methods for stress relief, better health, and spiritual growth.</p><p>Learn how to integrate these practices into your daily routine and experience the profound benefits of combining traditional wisdom with modern science.</p>`;
      } else if (item.t.toLowerCase().includes('fintech') || item.t.toLowerCase().includes('startup') || item.t.toLowerCase().includes('business') || item.t.toLowerCase().includes('creator') || item.t.toLowerCase().includes('marketing')) {
        content = `<p><strong>Building India's Digital Future</strong></p><p>Understand the dynamics of <strong>${item.t}</strong> in India's rapidly growing market.</p><p>India has emerged as a global hub for digital innovation, with millions of entrepreneurs building world-class companies. This post explores the opportunities, challenges, and strategies for success in India's dynamic business ecosystem.</p><p>Whether you're an aspiring entrepreneur, investor, or business professional, these insights will help you navigate and capitalize on India's growth story.</p>`;
      } else if (item.t.toLowerCase().includes('ai') || item.t.toLowerCase().includes('nlp') || item.t.toLowerCase().includes('machine learning')) {
        content = `<p><strong>AI Innovation in India</strong></p><p>Dive deep into <strong>${item.t}</strong> and its applications in the Indian tech landscape.</p><p>India's AI community is rapidly growing, with researchers and developers contributing cutting-edge solutions to global challenges. This post explores state-of-the-art techniques, real-world applications, and the future of AI in India.</p><p>Learn from industry experts, understand practical implementations, and join the AI revolution shaping India's technological future.</p>`;
      } else {
        content = `<p>This is a premium blog post about <strong>${item.t}</strong>. Reading this post will reveal key strategies, insights, and practices to master this subject.</p><p>As we explore this topic deeper, we find that structure and execution represent 90% of the battle. Working closely with modern methods gives developers, creators, and leaders the competitive edge they need in today's fast-paced environment.</p><p>Stay tuned for more updates, tips, and articles covering similar fields!</p>`;
      }

      const views = Math.floor(Math.random() * 300) + 20;
      const status = i === 5 || i === 12 ? 'draft' : 'published';

      const newB = await Blog.create({
        title: item.t,
        subtitle: `Everything you need to know about ${item.t}`,
        slug,
        content,
        coverImage: category.image,
        author: author._id,
        category: category._id,
        tags: item.tag || ['Tech', 'India'],
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
