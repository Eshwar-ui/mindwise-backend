/**
 * Healthcare Articles Seed Script
 * Adds commonly asked healthcare articles and removes duplicates
 */

const mongoose = require('mongoose');
require('dotenv').config();

const Article = require('./src/models/article.model');
const Category = require('./src/models/category.model');
const Chunk = require('./src/models/articleChunk.model');

const healthcareCategories = [
  {
    name: 'General Health',
    slug: 'general-health',
    description: 'Common health questions and wellness tips',
    icon: 'Heart'
  },
  {
    name: 'Appointments',
    slug: 'appointments',
    description: 'Scheduling, rescheduling, and managing your appointments',
    icon: 'Calendar'
  },
  {
    name: 'Prescriptions',
    slug: 'prescriptions',
    description: 'Medication refills, prescriptions, and pharmacy information',
    icon: 'Pill'
  },
  {
    name: 'Insurance & Billing',
    slug: 'insurance-billing',
    description: 'Insurance coverage, claims, and billing inquiries',
    icon: 'CreditCard'
  },
  {
    name: 'Test Results',
    slug: 'test-results',
    description: 'Lab results, imaging, and diagnostic test information',
    icon: 'FileText'
  },
  {
    name: 'Telehealth',
    slug: 'telehealth',
    description: 'Virtual visits, video consultations, and remote care',
    icon: 'Video'
  }
];

const healthcareArticles = [
  // General Health
  {
    title: 'How to Schedule an Appointment',
    problemStatement: 'I need to book a doctor\'s appointment',
    content: `Scheduling an appointment with MindWise Health is easy and can be done in several ways:

**Online Booking (Recommended)**
1. Log in to your patient portal at portal.mindwisehealth.com
2. Click "Schedule Appointment" on your dashboard
3. Select your preferred doctor and specialty
4. Choose an available date and time slot
5. Confirm your appointment details
6. You'll receive a confirmation email and SMS

**By Phone**
Call our appointment center at 1-800-MINDWISE (1-800-646-3947)
- Available Monday-Friday: 8 AM - 8 PM
- Saturday: 9 AM - 5 PM

**Walk-in Availability**
For urgent (non-emergency) care, walk-in appointments are available at select locations. Wait times vary.

**New Patients**
First-time patients should allow extra time (15-20 minutes) to complete registration forms. Bring:
- Valid ID
- Insurance card
- List of current medications
- Medical records (if available)`,
    tags: ['appointment', 'scheduling', 'booking', 'doctor', 'visit'],
    category: 'appointments'
  },
  {
    title: 'How to Reschedule or Cancel an Appointment',
    problemStatement: 'I need to change or cancel my upcoming appointment',
    content: `To reschedule or cancel your appointment:

**Online (Patient Portal)**
1. Log in to your patient portal
2. Go to "My Appointments"
3. Find the appointment you wish to modify
4. Click "Reschedule" or "Cancel"
5. If rescheduling, select a new date/time
6. Confirm your changes

**By Phone**
Call 1-800-MINDWISE at least 24 hours before your appointment.

**Cancellation Policy**
- Please provide at least 24 hours notice
- Late cancellations (less than 24 hours) may incur a $25 fee
- No-shows may incur a $50 fee
- Emergency situations are handled on a case-by-case basis

**Tip**: If you need to cancel last-minute, still call us. We may be able to fill your slot with another patient who needs urgent care.`,
    tags: ['reschedule', 'cancel', 'appointment', 'change'],
    category: 'appointments'
  },
  {
    title: 'How to Refill a Prescription',
    problemStatement: 'I need to refill my medication',
    content: `There are several ways to request a prescription refill:

**Online (Fastest)**
1. Log in to your patient portal
2. Navigate to "Prescriptions" or "Medications"
3. Find the medication you need refilled
4. Click "Request Refill"
5. Select your preferred pharmacy
6. Submit your request

**By Phone**
- Call your pharmacy directly with your prescription number
- Or call our clinic at 1-800-MINDWISE and press 2 for prescriptions

**Refill Timeline**
- Most refills are processed within 24-48 hours
- Controlled substances may require an office visit
- Allow 3-5 days for mail-order prescriptions

**When You Can't Get a Refill**
Some reasons a refill may be denied:
- The prescription has expired (older than 1 year)
- No refills remaining - you need a new prescription
- Controlled substance requires in-person visit
- Lab work is needed before renewal

**Out of Medication?**
If you've run out and need medication urgently, call our office. We may be able to provide a short-term supply while processing your refill.`,
    tags: ['prescription', 'refill', 'medication', 'pharmacy', 'drugs'],
    category: 'prescriptions'
  },
  {
    title: 'How to View My Lab Results',
    problemStatement: 'I want to see my blood test or lab results',
    content: `Your lab results are available through our patient portal:

**Viewing Results Online**
1. Log in to the patient portal at portal.mindwisehealth.com
2. Click "Test Results" or "Lab Results"
3. Select the test you want to view
4. Results include values, reference ranges, and status

**Understanding Your Results**
- **Normal**: Your value is within the healthy range
- **Abnormal High/Low**: Your value is outside the normal range
- **Critical**: Requires immediate attention (a nurse will contact you)

**When Are Results Available?**
- Basic blood work: 1-2 business days
- Specialized tests: 3-7 business days
- Genetic testing: 2-4 weeks
- Pathology/biopsy: 5-10 business days

**Questions About Results?**
- Send a message to your doctor through the portal
- Schedule a follow-up appointment to discuss results
- For concerning results, our team will reach out to you directly

**Note**: Some results require physician review before release. You'll receive a notification when they're ready.`,
    tags: ['lab', 'results', 'blood test', 'test', 'bloodwork', 'labs'],
    category: 'test-results'
  },
  {
    title: 'How to Start a Telehealth Visit',
    problemStatement: 'I want to do a video visit with my doctor',
    content: `Telehealth visits let you see your doctor from home via video call.

**Before Your Visit**
1. Ensure you have a device with a camera and microphone (phone, tablet, or computer)
2. Test your internet connection
3. Download the MindWise Health app (optional, but recommended)
4. Find a quiet, private location with good lighting

**Starting Your Visit**
1. Log in to the patient portal 10 minutes before your appointment
2. Click "Join Video Visit" or "Start Telehealth"
3. Allow camera and microphone access when prompted
4. Wait in the virtual waiting room
5. Your doctor will join when ready

**Troubleshooting**
- If video doesn't work, try refreshing the page
- Use Chrome or Safari for best compatibility
- Disable VPN if you're having connection issues
- Have your phone ready as a backup

**What Telehealth is Good For**
✓ Follow-up visits
✓ Medication reviews
✓ Mental health consultations
✓ Minor illness assessment
✓ Chronic disease management 
✓ Reviewing test results

**What Requires In-Person Visit**
✗ Physical examinations
✗ Vaccinations/injections
✗ Lab draws
✗ Imaging (X-ray, MRI, etc.)
✗ Procedures`,
    tags: ['telehealth', 'video', 'virtual', 'telemedicine', 'online visit'],
    category: 'telehealth'
  },
  {
    title: 'Understanding Your Insurance Coverage',
    problemStatement: 'What does my insurance cover?',
    content: `Understanding your insurance coverage helps you plan for healthcare costs.

**What's Typically Covered**
- Annual physical exams (preventive care)
- Vaccinations and immunizations
- Screenings (mammograms, colonoscopies at appropriate ages)
- Primary care visits
- Specialist visits (may require referral)
- Emergency room visits
- Hospital stays
- Prescription drugs (varies by plan)

**Common Insurance Terms**
- **Premium**: Monthly payment to maintain coverage
- **Deductible**: Amount you pay before insurance kicks in
- **Copay**: Fixed amount you pay per visit (e.g., $25)
- **Coinsurance**: Percentage you pay after deductible (e.g., 20%)
- **Out-of-Pocket Maximum**: Most you'll pay in a year

**Checking Your Coverage**
1. Call the number on your insurance card
2. Use your insurance company's website or app
3. Ask our billing department to verify coverage
4. Review your Summary of Benefits document

**Prior Authorization**
Some services require pre-approval from your insurance:
- Certain medications
- MRI/CT scans
- Specialist referrals
- Surgeries
- Durable medical equipment

We handle most prior authorizations, but approval can take 3-5 business days.`,
    tags: ['insurance', 'coverage', 'benefits', 'copay', 'deductible'],
    category: 'insurance-billing'
  },
  {
    title: 'How to Pay My Bill Online',
    problemStatement: 'I want to pay my medical bill',
    content: `Pay your MindWise Health bill quickly and securely online.

**Online Payment (Recommended)**
1. Visit pay.mindwisehealth.com
2. Enter your account number (found on your statement)
3. Verify your identity with date of birth
4. Review your balance
5. Enter payment information
6. Submit payment

**Payment Methods Accepted**
- Credit cards (Visa, MasterCard, American Express, Discover)
- Debit cards
- HSA/FSA cards
- Bank transfer (ACH)
- Apple Pay / Google Pay

**Payment Plans**
If you can't pay in full, we offer interest-free payment plans:
- Balances under $500: Up to 6 months
- Balances $500-$2,000: Up to 12 months
- Balances over $2,000: Up to 24 months

Contact our billing department at 1-800-MINDWISE ext. 3 to set up a plan.

**Financial Assistance**
If you're experiencing financial hardship, you may qualify for:
- Sliding scale fees
- Charity care
- Payment reduction programs

Apply online or request an application from our billing department.

**Questions About Your Bill?**
Call billing at 1-800-MINDWISE ext. 3
Monday-Friday 8 AM - 6 PM`,
    tags: ['bill', 'payment', 'pay', 'invoice', 'statement', 'billing'],
    category: 'insurance-billing'
  },
  {
    title: 'What to Do in a Medical Emergency',
    problemStatement: 'When should I call 911 or go to the ER?',
    content: `Knowing when to seek emergency care can save lives.

**Call 911 Immediately For:**
🚨 Chest pain or pressure
🚨 Difficulty breathing
🚨 Signs of stroke (face drooping, arm weakness, speech difficulty)
🚨 Severe bleeding that won't stop
🚨 Loss of consciousness
🚨 Severe allergic reaction (anaphylaxis)
🚨 Seizures (especially first-time)
🚨 Suicidal thoughts with plan or intent
🚨 Poisoning or overdose
🚨 Severe burns
🚨 Major trauma or injury

**Go to Emergency Room For:**
- Broken bones
- High fever (over 103°F) with severe symptoms
- Severe abdominal pain
- Head injury with vomiting or confusion
- Coughing or vomiting blood
- Sudden severe headache

**Urgent Care is Better For:**
- Minor cuts needing stitches
- Sprains and minor fractures
- Flu symptoms
- Urinary tract infections
- Minor allergic reactions
- Ear or sinus infections

**Our 24/7 Nurse Hotline**
Not sure where to go? Call 1-800-MINDWISE and press 0 for our nurse line. We're available 24/7 to help you decide.

**Remember**: When in doubt, it's always better to seek care. Don't delay if something feels seriously wrong.`,
    tags: ['emergency', 'ER', 'urgent', '911', 'crisis', 'urgent care'],
    category: 'general-health'
  },
  {
    title: 'How to Access My Medical Records',
    problemStatement: 'I need a copy of my medical records',
    content: `You have the right to access your complete medical records.

**View Records Online**
1. Log in to the patient portal
2. Navigate to "Medical Records" or "Health Summary"
3. View visit summaries, medications, allergies, immunizations

**Request Full Records**
For complete records or records transfer:
1. Log in to patient portal
2. Go to "Request Records"
3. Specify the date range and type of records needed
4. Indicate if records should be sent to you or another provider
5. Submit request

**Processing Time**
- Electronic requests: 3-5 business days
- Paper copies: 7-10 business days
- Rush requests: Additional fee may apply

**Fees**
- Electronic delivery: Free
- First 25 pages (paper): Free
- Additional pages: $0.25 per page
- CD/USB: $10

**Sending Records to Another Doctor**
We can send records directly to another healthcare provider:
1. Complete a Release of Information form
2. Provide the receiving provider's contact information
3. Records are typically sent within 5-7 business days

**Questions?**
Contact Medical Records: records@mindwisehealth.com or call ext. 4`,
    tags: ['records', 'medical records', 'health records', 'documents', 'history'],
    category: 'general-health'
  },
  {
    title: 'How to Update My Personal Information',
    problemStatement: 'I need to change my address, phone, or insurance',
    content: `Keep your information current to ensure you receive important updates.

**Update Online (Fastest)**
1. Log in to the patient portal
2. Click your name or "My Profile"
3. Select "Update Information"
4. Make your changes
5. Save and submit

**What You Can Update Online**
✓ Phone number
✓ Email address
✓ Home address
✓ Emergency contact
✓ Preferred pharmacy
✓ Communication preferences

**What Requires Additional Verification**
These changes require documentation:
- **Legal name change**: Copy of new ID or court order
- **Date of birth correction**: Copy of birth certificate
- **Insurance information**: Copy of new insurance card (front and back)

**How to Update Insurance**
1. Log in to patient portal
2. Go to "Insurance Information"
3. Upload images of your new insurance card
4. Our team will verify within 1-2 business days
5. You'll receive confirmation once updated

**Important Notes**
- Always update insurance BEFORE your next visit
- Bring your new insurance card to your appointment
- Old insurance information may result in billing issues

**Need Help?**
Call 1-800-MINDWISE ext. 1 for registration assistance.`,
    tags: ['update', 'information', 'address', 'phone', 'insurance', 'profile'],
    category: 'general-health'
  },
  {
    title: 'Preparing for Your First Visit',
    problemStatement: 'What should I bring to my first appointment?',
    content: `Welcome to MindWise Health! Here's how to prepare for your first visit.

**What to Bring**
📋 **Required Documents**
- Valid photo ID (driver's license, passport, state ID)
- Insurance card (front and back)
- Completed new patient forms (available online)

📋 **Medical Information**
- List of current medications (including dosages)
- Previous medical records (if available)
- List of allergies
- Immunization records
- Recent test results from other providers

📋 **Payment**
- Copay or payment (we accept credit/debit, HSA/FSA)
- Questions about your bill or coverage

**Before Your Visit**
1. Complete online registration at portal.mindwisehealth.com
2. Fill out the new patient questionnaire
3. Arrive 15-20 minutes early
4. Write down questions for your doctor

**During Your Visit**
- A medical assistant will take your vitals
- Review your medical history with the doctor
- Discuss your health concerns and goals
- Create a care plan together
- Ask any questions you have

**After Your Visit**
- Review your visit summary in the patient portal
- Schedule any follow-up appointments
- Complete recommended lab work
- Fill any prescriptions at your preferred pharmacy

**Questions?**
Call us at 1-800-MINDWISE or message us through the patient portal.`,
    tags: ['first visit', 'new patient', 'prepare', 'appointment', 'registration'],
    category: 'appointments'
  },
  {
    title: 'Managing Chronic Conditions',
    problemStatement: 'How do I manage my diabetes, hypertension, or other chronic condition?',
    content: `MindWise Health provides comprehensive chronic disease management.

**Chronic Conditions We Manage**
- Diabetes (Type 1 & Type 2)
- Hypertension (High Blood Pressure)
- Heart Disease
- Asthma & COPD
- Arthritis
- Thyroid Disorders
- Chronic Kidney Disease
- Mental Health Conditions

**Your Care Team**
You'll work with a dedicated team including:
- Primary Care Physician
- Specialists as needed
- Care Coordinator
- Nurse Educator
- Nutritionist/Dietitian
- Pharmacist

**Tools for Self-Management**
- **Patient Portal**: Track vitals, medications, and appointments
- **Health Trackers**: Integrate data from fitness devices
- **Educational Resources**: Disease-specific guides and videos
- **Medication Reminders**: Set up through our app
- **Telehealth Check-ins**: Quick virtual visits between appointments

**How We Monitor Your Health**
- Regular lab work and screenings
- Periodic check-ups (monthly to quarterly)
- Medication reviews and adjustments
- Lifestyle and nutrition counseling
- Goal setting and progress tracking

**Helpful Resources**
- Diabetes: American Diabetes Association (diabetes.org)
- Heart Health: American Heart Association (heart.org)
- Lung Health: American Lung Association (lung.org)

**Getting Started**
Schedule a chronic care visit to develop your personalized management plan. Call 1-800-MINDWISE or book online.`,
    tags: ['chronic', 'diabetes', 'hypertension', 'management', 'disease'],
    category: 'general-health'
  },
  {
    title: 'Mental Health Resources and Support',
    problemStatement: 'I need help with anxiety, depression, or mental health',
    content: `Your mental health matters. MindWise Health offers comprehensive mental health services.

**Services We Offer**
- Individual therapy and counseling
- Psychiatric evaluations
- Medication management
- Group therapy sessions
- Crisis intervention
- Telehealth mental health visits

**Getting Started**
1. Schedule an initial mental health assessment
2. Meet with a counselor or therapist
3. Develop a personalized treatment plan
4. Begin therapy and/or medication as recommended
5. Regular follow-up appointments

**Immediate Help Resources**
If you're in crisis, please use these resources:

🆘 **National Suicide Prevention Lifeline**: 988
🆘 **Crisis Text Line**: Text HOME to 741741
🆘 **SAMHSA Helpline**: 1-800-662-4357
🆘 **Emergency**: Call 911

**Insurance Coverage**
Most insurance plans cover mental health services with the same benefits as physical health. We verify your coverage before your first visit.

**Confidentiality**
Your mental health records are protected by law. Information is only shared with your explicit written consent, except in cases of immediate safety concerns.

**Self-Help Resources**
- Mindfulness apps: Calm, Headspace
- CBT workbooks available in our patient portal
- Support group listings in your community
- Online peer support communities

**You Are Not Alone**
Seeking help is a sign of strength. Our compassionate team is here to support your journey to better mental health.

Book a mental health appointment online or call 1-800-MINDWISE.`,
    tags: ['mental health', 'anxiety', 'depression', 'therapy', 'counseling', 'psychiatry'],
    category: 'general-health'
  },
  {
    title: 'COVID-19, Flu, and Vaccination Information',
    problemStatement: 'I need information about vaccinations or COVID-19',
    content: `Stay protected with up-to-date vaccinations.

**Vaccinations We Offer**
- COVID-19 (primary series and boosters)
- Influenza (annual flu shot)
- Tdap (Tetanus, Diphtheria, Pertussis)
- Pneumonia (Pneumococcal)
- Shingles (Shingrix)
- MMR (Measles, Mumps, Rubella)
- Hepatitis A & B
- HPV (Human Papillomavirus)
- Meningitis

**Scheduling a Vaccination**
1. Log in to your patient portal
2. Click "Schedule Vaccination" or "Immunizations"
3. Select the vaccine(s) you need
4. Choose an available appointment slot
5. Complete any pre-visit questionnaires

**COVID-19 Information**
- **Testing**: Available with or without symptoms
- **Vaccines**: All approved boosters available
- **Treatment**: Paxlovid and other treatments available if eligible
- **Isolation Guidelines**: Follow current CDC recommendations

**When to Get the Flu Shot**
- Best time: September-October
- Still beneficial through winter months
- Recommended for everyone 6 months and older

**Vaccine Records**
Your vaccination history is available in your patient portal under "Immunizations."

**Common Questions**
Q: Can I get COVID and flu shots together?
A: Yes, it's safe and convenient to get both at the same visit.

Q: Do I need an appointment for vaccines?
A: Appointments are preferred, but walk-ins may be available.

Q: Is there a cost?
A: Most vaccines are covered by insurance at no cost. Check with your plan.

**Stay Informed**
Visit cdc.gov for the latest guidelines and recommendations.`,
    tags: ['vaccine', 'vaccination', 'COVID', 'flu', 'immunization', 'shots'],
    category: 'general-health'
  },
  {
    title: 'Specialist Referrals: How They Work',
    problemStatement: 'I need to see a specialist',
    content: `Sometimes you need care from a specialist. Here's how referrals work.

**When You Need a Referral**
Many insurance plans require a referral from your primary care doctor before seeing a specialist. This includes:
- Cardiologists (heart)
- Dermatologists (skin)
- Orthopedists (bones/joints)
- Gastroenterologists (digestive)
- Neurologists (brain/nerves)
- Endocrinologists (hormones)
- And others

**How to Get a Referral**
1. Schedule a visit with your primary care doctor
2. Discuss your symptoms and concerns
3. Your doctor will evaluate if specialist care is needed
4. If approved, we submit the referral to your insurance
5. Once authorized, you can schedule with the specialist

**Referral Timeline**
- Routine referrals: 3-5 business days for insurance approval
- Urgent referrals: 1-2 business days
- We'll notify you when your referral is approved

**Tracking Your Referral**
1. Log in to your patient portal
2. Go to "Referrals" or "Authorizations"
3. View status, specialist information, and expiration date

**What If I Need a Specialist Not in Network?**
In some cases, we can request authorization for out-of-network specialists. This may require:
- Documentation of medical necessity
- Proof that in-network options are inadequate
- Additional review time (7-14 days)

**Urgent Specialist Needs**
For urgent specialist care, call our office. We have relationships with specialists who can see patients quickly when needed.

**After Your Specialist Visit**
The specialist will send notes to your primary care doctor. You can view these in your patient portal.`,
    tags: ['specialist', 'referral', 'authorization', 'insurance', 'doctor'],
    category: 'appointments'
  }
];

async function main() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/chatbot');
    console.log('✅ Connected to MongoDB');

    // Step 1: Create/update healthcare categories
    console.log('\n📁 Setting up healthcare categories...');
    const categoryMap = {};
    
    for (const catData of healthcareCategories) {
      let category = await Category.findOne({ slug: catData.slug });
      if (!category) {
        category = await Category.create(catData);
        console.log(`  ✅ Created category: ${catData.name}`);
      } else {
        console.log(`  ℹ️  Category exists: ${catData.name}`);
      }
      categoryMap[catData.slug] = category._id;
    }

    // Step 2: Remove duplicate articles
    console.log('\n🧹 Removing duplicate articles...');
    const allArticles = await Article.find({});
    const titleCounts = {};
    const duplicateIds = [];

    for (const article of allArticles) {
      const normalizedTitle = article.title.toLowerCase().trim();
      if (titleCounts[normalizedTitle]) {
        duplicateIds.push(article._id);
        console.log(`  🗑️  Duplicate found: "${article.title}"`);
      } else {
        titleCounts[normalizedTitle] = true;
      }
    }

    if (duplicateIds.length > 0) {
      // Delete duplicate articles
      await Article.deleteMany({ _id: { $in: duplicateIds } });
      // Also delete their chunks
      await Chunk.deleteMany({ articleId: { $in: duplicateIds } });
      console.log(`  ✅ Removed ${duplicateIds.length} duplicate articles and their chunks`);
    } else {
      console.log('  ℹ️  No duplicates found');
    }

    // Step 3: Remove non-healthcare articles (those with tech/API-related content)
    console.log('\n🧹 Removing non-healthcare articles...');
    const nonHealthcareKeywords = ['API', 'CloudSync', 'timeout', 'integration', 'OAuth', 'webhook', 'SDK', 'developer'];
    const nonHealthcareArticles = await Article.find({
      $or: [
        { title: { $regex: nonHealthcareKeywords.join('|'), $options: 'i' } },
        { content: { $regex: 'API endpoint|developer|OAuth|SDK', $options: 'i' } }
      ]
    });

    if (nonHealthcareArticles.length > 0) {
      const nonHealthcareIds = nonHealthcareArticles.map(a => a._id);
      await Article.deleteMany({ _id: { $in: nonHealthcareIds } });
      await Chunk.deleteMany({ articleId: { $in: nonHealthcareIds } });
      console.log(`  ✅ Removed ${nonHealthcareArticles.length} non-healthcare articles`);
    }

    // Step 4: Add new healthcare articles
    console.log('\n📝 Adding healthcare articles...');
    let addedCount = 0;
    let skippedCount = 0;

    for (const articleData of healthcareArticles) {
      const existingArticle = await Article.findOne({ 
        $or: [
          { title: articleData.title },
          { slug: articleData.title.toLowerCase().replace(/[^a-z0-9]+/g, '-') }
        ]
      });

      if (existingArticle) {
        console.log(`  ℹ️  Article exists: "${articleData.title}"`);
        skippedCount++;
        continue;
      }

      const categoryId = categoryMap[articleData.category];
      if (!categoryId) {
        console.log(`  ⚠️  Category not found for: "${articleData.title}"`);
        continue;
      }

      const article = await Article.create({
        title: articleData.title,
        problemStatement: articleData.problemStatement,
        content: articleData.content,
        tags: articleData.tags,
        categoryId: categoryId,
        status: 'published'
      });

      // Create chunk for the article content
      await Chunk.create({
        articleId: article._id,
        chunkIndex: 0,
        chunkText: articleData.content,
        status: 'published'
      });

      console.log(`  ✅ Added: "${articleData.title}"`);
      addedCount++;
    }

    // Step 5: Summary
    console.log('\n📊 Summary:');
    const finalArticleCount = await Article.countDocuments({ status: 'published' });
    const finalChunkCount = await Chunk.countDocuments({ status: 'published' });
    console.log(`  📄 Total published articles: ${finalArticleCount}`);
    console.log(`  📦 Total published chunks: ${finalChunkCount}`);
    console.log(`  ✅ New articles added: ${addedCount}`);
    console.log(`  ℹ️  Articles skipped (already exist): ${skippedCount}`);
    console.log(`  🗑️  Duplicates removed: ${duplicateIds.length}`);

    console.log('\n✅ Healthcare articles seeding complete!');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await mongoose.disconnect();
    console.log('📡 Disconnected from MongoDB');
  }
}

main();
