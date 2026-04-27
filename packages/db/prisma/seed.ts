import { PrismaClient, Role, MemberCategory, MemberStatus } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  // Admin user
  const adminPassword = await bcrypt.hash('Admin@1234', 12);
  const admin = await prisma.user.upsert({
    where: { email: 'admin@jra.jo' },
    update: {},
    create: {
      name: 'JRA Admin',
      email: 'admin@jra.jo',
      passwordHash: adminPassword,
      role: Role.ADMIN,
    },
  });
  console.log('Admin created:', admin.email);

  // Member users + profiles
  const members = [
    {
      name: 'Ahmad Al-Rashid',
      email: 'ahmad@levantgrill.jo',
      business: 'Levant Grill',
      category: MemberCategory.FINE_DINING,
      stars: 5,
      location: 'Amman, 1st Circle',
      phone: '+962 6 4612345',
      bio: 'Award-winning fine dining experience showcasing the best of Levantine cuisine.',
    },
    {
      name: 'Rania Haddad',
      email: 'rania@cafeamman.jo',
      business: 'Café Amman',
      category: MemberCategory.CAFE,
      stars: 4,
      location: 'Amman, Rainbow Street',
      phone: '+962 6 4623456',
      bio: 'A beloved café on Rainbow Street known for specialty coffee and artisan pastries.',
    },
    {
      name: 'Khalid Nasser',
      email: 'khalid@aqabafish.jo',
      business: 'Aqaba Seafood House',
      category: MemberCategory.CASUAL_DINING,
      stars: 4,
      location: 'Aqaba, Corniche',
      phone: '+962 3 2013456',
      bio: 'Fresh Red Sea seafood served with stunning Aqaba waterfront views.',
    },
    {
      name: 'Lina Barakat',
      email: 'lina@petraeast.jo',
      business: 'Petra Eastern Kitchen',
      category: MemberCategory.CASUAL_DINING,
      stars: 3,
      location: 'Petra, Wadi Musa',
      phone: '+962 3 2156789',
      bio: 'Traditional Jordanian meals welcoming tourists exploring the rose city.',
    },
    {
      name: 'Omar Zreiqat',
      email: 'omar@zaitounafastfood.jo',
      business: 'Zaitouna Fast Food',
      category: MemberCategory.FAST_FOOD,
      stars: 3,
      location: 'Zarqa, Downtown',
      phone: '+962 5 3821234',
      bio: 'Quick, fresh, and affordable Middle Eastern street food since 2010.',
    },
  ];

  for (const m of members) {
    const password = await bcrypt.hash('Member@1234', 12);
    const user = await prisma.user.upsert({
      where: { email: m.email },
      update: {},
      create: {
        name: m.name,
        email: m.email,
        passwordHash: password,
        role: Role.MEMBER,
        profile: {
          create: {
            businessName: m.business,
            category: m.category,
            stars: m.stars,
            location: m.location,
            phone: m.phone,
            bio: m.bio,
            status: MemberStatus.ACTIVE,
          },
        },
      },
    });
    console.log('Member created:', user.email);
  }

  // Events
  await prisma.event.createMany({
    skipDuplicates: true,
    data: [
      {
        title: 'JRA Annual Restaurant Summit 2025',
        slug: 'jra-annual-restaurant-summit-2025',
        description:
          'The flagship gathering of Jordan\'s hospitality leaders. Network with 500+ industry professionals, attend keynote sessions on tourism trends, and celebrate the annual JRA Awards.',
        date: new Date('2025-09-15T09:00:00Z'),
        location: 'Four Seasons Hotel, Amman',
        createdBy: admin.id,
      },
      {
        title: 'Food Safety & Hygiene Certification Workshop',
        slug: 'food-safety-hygiene-certification-workshop',
        description:
          'A mandatory certification workshop for restaurant owners and managers. Covers HACCP principles, staff hygiene protocols, and Jordanian food safety regulations.',
        date: new Date('2025-07-20T08:00:00Z'),
        location: 'JRA Headquarters, Amman',
        createdBy: admin.id,
      },
    ],
  });
  console.log('Events created');

  // Trainings
  await prisma.training.createMany({
    skipDuplicates: true,
    data: [
      {
        title: 'Restaurant Management Excellence',
        slug: 'restaurant-management-excellence',
        description:
          'A comprehensive 3-day program covering financial management, staff leadership, menu engineering, and customer experience strategy for restaurant managers.',
        date: new Date('2025-08-05T09:00:00Z'),
        price: 250.0,
        seats: 30,
        createdBy: admin.id,
      },
      {
        title: 'Digital Marketing for Restaurants',
        slug: 'digital-marketing-for-restaurants',
        description:
          'Learn how to grow your restaurant\'s online presence through social media strategy, Google My Business optimization, food photography, and review management.',
        date: new Date('2025-08-18T10:00:00Z'),
        price: 150.0,
        seats: 25,
        createdBy: admin.id,
      },
    ],
  });
  console.log('Trainings created');

  // Posts
  await prisma.post.createMany({
    skipDuplicates: true,
    data: [
      {
        title: 'JRA Welcomes New Tourism Season with Record Member Growth',
        slug: 'jra-welcomes-new-tourism-season-record-member-growth',
        excerpt:
          'The Jordan Restaurants Association reports a 15% increase in membership as Jordan\'s tourism sector rebounds strongly.',
        content: `<p>The Jordan Restaurants Association (JRA) is proud to announce a record 15% increase in membership registrations as Jordan enters its most promising tourism season in years.</p>
<p>With international arrivals at an all-time high and domestic dining confidence restored, JRA now represents over 1,200 establishments across the Kingdom — from fine dining venues in Amman to traditional kitchens welcoming visitors to Petra.</p>
<p>"This growth reflects the resilience and dynamism of Jordan's hospitality sector," said the JRA Board Chairman. "Our members are investing in quality, training, and innovation."</p>
<p>JRA will be hosting a series of workshops and networking events throughout the season to support members in maximizing this opportunity.</p>`,
        published: true,
        authorId: admin.id,
      },
      {
        title: 'New Food Safety Regulations: What Restaurant Owners Must Know',
        slug: 'new-food-safety-regulations-what-owners-must-know',
        excerpt:
          'Jordan\'s Ministry of Health has updated food safety standards. Here\'s a practical summary for JRA members.',
        content: `<p>The Jordanian Ministry of Health recently issued updated food safety standards that affect all registered food service establishments. JRA has reviewed these regulations and prepared this summary to help members comply efficiently.</p>
<h2>Key Changes</h2>
<ul>
<li>All food handlers must complete certified hygiene training within 6 months</li>
<li>Cold chain documentation requirements are now mandatory for all categories</li>
<li>Allergen labeling on menus is now legally required</li>
<li>Annual inspection cycles are being increased to semi-annual for establishments above 50 seats</li>
</ul>
<p>JRA is organizing a free briefing session for all members on July 20th. Registration is open through the member portal.</p>`,
        published: true,
        authorId: admin.id,
      },
      {
        title: 'JRA Partners with Jordan Tourism Board to Promote Culinary Tourism',
        slug: 'jra-partners-jordan-tourism-board-culinary-tourism',
        excerpt:
          'A new strategic partnership will promote Jordanian cuisine internationally and drive culinary tourism across the Kingdom.',
        content: `<p>The Jordan Restaurants Association has signed a strategic partnership agreement with the Jordan Tourism Board (JTB) to jointly promote Jordanian cuisine as a pillar of the Kingdom's tourism offering.</p>
<p>The partnership will include:</p>
<ul>
<li>A dedicated "Taste of Jordan" section on the Visit Jordan website featuring JRA member restaurants</li>
<li>Joint participation in international food tourism exhibitions</li>
<li>A "Jordan Culinary Trail" initiative connecting signature restaurants across key tourism destinations</li>
<li>Collaborative social media campaigns targeting food travelers</li>
</ul>
<p>"Jordanian cuisine is one of our greatest untapped tourism assets," said the JTB Director General. "This partnership places our restaurants at the heart of the visitor experience."</p>`,
        published: true,
        authorId: admin.id,
      },
    ],
  });
  console.log('Posts created');

  // Board members
  await prisma.boardMember.createMany({
    skipDuplicates: false,
    data: [
      { name: 'Dr. Fares Al-Aqrabawi', title: 'Chairman of the Board', order: 1 },
      { name: 'Eng. Samar Khoury', title: 'Vice Chairman', order: 2 },
      { name: 'Mr. Bassam Tarabeh', title: 'Secretary General', order: 3 },
    ],
  });
  console.log('Board members created');

  console.log('Seeding complete.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
