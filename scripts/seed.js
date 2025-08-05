const { PrismaClient } = require('@prisma/client');
const { hashPassword } = require('../lib/auth');

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  // Create a test receptionist user
  const hashedPassword = hashPassword('password123');
  
  const testUser = await prisma.user.upsert({
    where: { username: 'receptionist' },
    update: {},
    create: {
      username: 'receptionist',
      password: hashedPassword,
      role: 'receptionist',
      isActive: true,
    },
  });

  console.log('Created test user:', testUser.username);

  // Create some sample customers
  const customers = await Promise.all([
    prisma.customer.create({
      data: {
        name: 'John Doe',
        phone: '+1-555-0123',
        email: 'john.doe@example.com',
        customFields: JSON.stringify({
          company: 'Acme Corp',
          position: 'Manager',
        }),
      },
    }),
    prisma.customer.create({
      data: {
        name: 'Jane Smith',
        phone: '+1-555-0456',
        email: 'jane.smith@example.com',
        customFields: JSON.stringify({
          company: 'Tech Solutions',
          position: 'Developer',
        }),
      },
    }),
    prisma.customer.create({
      data: {
        name: 'Bob Johnson',
        phone: '+1-555-0789',
        email: 'bob.johnson@example.com',
        customFields: JSON.stringify({
          company: 'Global Industries',
          position: 'Director',
        }),
      },
    }),
  ]);

  console.log('Created customers:', customers.map(c => c.name));

  // Create some sample field definitions
  const fields = await Promise.all([
    prisma.fieldDefinition.create({
      data: {
        name: 'company',
        label: 'Company',
        type: 'text',
        required: false,
        order: 1,
      },
    }),
    prisma.fieldDefinition.create({
      data: {
        name: 'position',
        label: 'Position',
        type: 'text',
        required: false,
        order: 2,
      },
    }),
    prisma.fieldDefinition.create({
      data: {
        name: 'department',
        label: 'Department',
        type: 'select',
        required: false,
        options: JSON.stringify(['Sales', 'Marketing', 'Engineering', 'HR', 'Finance']),
        order: 3,
      },
    }),
  ]);

  console.log('Created field definitions:', fields.map(f => f.label));

  // Create some sample notes
  const notes = await Promise.all([
    prisma.note.create({
      data: {
        content: 'Initial contact made. Customer interested in our services.',
        customerId: customers[0].id,
      },
    }),
    prisma.note.create({
      data: {
        content: 'Follow-up call scheduled for next week.',
        customerId: customers[0].id,
      },
    }),
    prisma.note.create({
      data: {
        content: 'Customer requested pricing information.',
        customerId: customers[1].id,
      },
    }),
  ]);

  console.log('Created notes:', notes.length);

  console.log('Database seeding completed!');
}

main()
  .catch((e) => {
    console.error('Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  }); 