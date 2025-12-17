export default [
  // Root Company
  {
    id: 1,
    parentId: null,
    name: 'AX Capital',
    position: 'Company',
    experience: '',
    languages: '',
    avatar: 'https://source.unsplash.com/random/300x300/?realestate,company,logo,dubai'
  },

  // ==================== SALES DEPARTMENT ====================
  {
    id: 2,
    parentId: 1,
    name: 'Sales Department',
    position: 'Department',
    avatar: 'https://source.unsplash.com/random/300x300/?sales,team,luxury'
  },
  {
    id: 7,
    parentId: 2,
    name: 'Ben Thomas',
    position: 'Head of Secondary Market',
    experience: '19 years',
    languages: 'English, Spanish',
    avatar: 'https://source.unsplash.com/random/300x300/?professional,man,50s,suit'
  },
  {
    id: 8,
    parentId: 2,
    name: 'Dimitry Zolotco',
    position: 'Associate Director - Off-Plan',
    experience: '15 years',
    languages: 'English, Russian, Romanian',
    avatar: 'https://source.unsplash.com/random/300x300/?businessman,european,40s'
  },
  // Under Ben Thomas
  {
    id: 10,
    parentId: 7,
    name: 'Olga Gojin',
    position: 'Senior Property Expert',
    experience: '18 years',
    languages: 'English, Russian, Romanian',
    avatar: 'https://source.unsplash.com/random/300x300/?professional,woman,blonde,40s'
  },
  {
    id: 11,
    parentId: 7,
    name: 'Luiza Ribas Patane',
    position: 'Senior Property Expert',
    experience: '4 years',
    languages: 'English, Spanish, Portuguese',
    avatar: 'https://source.unsplash.com/random/300x300/?latina,business,woman,30s'
  },
  {
    id: 12,
    parentId: 7,
    name: 'Ahmed Al-Mansoori',
    position: 'Property Consultant',
    experience: '6 years',
    languages: 'English, Arabic',
    avatar: 'https://source.unsplash.com/random/300x300/?arab,man,suit,30s'
  },

  // Under Dimitry
  {
    id: 13,
    parentId: 8,
    name: 'Aram Grigorian',
    position: 'Senior Property Expert',
    experience: '11 years',
    languages: 'English, Russian, Armenian, German',
    avatar: 'https://source.unsplash.com/random/300x300/?professional,man,beard,40s'
  },
  {
    id: 14,
    parentId: 8,
    name: 'Anastasia Jakovleva',
    position: 'Property Consultant',
    experience: '3 years',
    languages: 'English, Russian, Lithuanian',
    avatar: 'https://source.unsplash.com/random/300x300/?young,woman,professional,blonde'
  },

  // ==================== IT DEPARTMENT ====================
  {
    id: 3,
    parentId: 1,
    name: 'IT Department',
    position: 'Department',
    avatar: 'https://source.unsplash.com/random/300x300/?tech,team,office'
  },
  {
    id: 16,
    parentId: 3,
    name: 'Alexei Petrov',
    position: 'Head of IT',
    experience: '12 years',
    languages: 'English, Russian',
    avatar: 'https://source.unsplash.com/random/300x300/?it,manager,man,40s'
  },
  {
    id: 17,
    parentId: 16,
    name: 'Sara Al-Mansoori',
    position: 'Senior Full-Stack Developer',
    experience: '8 years',
    languages: 'English, Arabic',
    avatar: 'https://source.unsplash.com/random/300x300/?developer,woman,hijab'
  },
  {
    id: 18,
    parentId: 16,
    name: 'Raj Patel',
    position: 'Backend Developer',
    experience: '6 years',
    languages: 'English, Hindi, Gujarati',
    avatar: 'https://source.unsplash.com/random/300x300/?indian,developer,man,30s'
  },
  {
    id: 19,
    parentId: 16,
    name: 'Nina Kowalski',
    position: 'Frontend Developer',
    experience: '5 years',
    languages: 'English, Polish',
    avatar: 'https://source.unsplash.com/random/300x300/?european,woman,coder'
  },
  {
    id: 20,
    parentId: 16,
    name: 'Omar Hassan',
    position: 'DevOps Engineer',
    experience: '7 years',
    languages: 'English, Arabic',
    avatar: 'https://source.unsplash.com/random/300x300/?devops,engineer,arab'
  },
  {
    id: 21,
    parentId: 16,
    name: 'Lila Chen',
    position: 'Data Analyst',
    experience: '4 years',
    languages: 'English, Mandarin',
    avatar: 'https://source.unsplash.com/random/300x300/?asian,woman,analyst'
  },

  // ==================== MARKETING DEPARTMENT ====================
  {
    id: 4,
    parentId: 1,
    name: 'Marketing Department',
    position: 'Department',
    avatar: 'https://source.unsplash.com/random/300x300/?marketing,creative,team'
  },
  {
    id: 22,
    parentId: 4,
    name: 'Elena Vasquez',
    position: 'Head of Marketing',
    experience: '10 years',
    languages: 'English, Spanish',
    avatar: 'https://source.unsplash.com/random/300x300/?marketing,director,woman'
  },
  {
    id: 23,
    parentId: 22,
    name: 'Karim Ahmed',
    position: 'Digital Marketing Manager',
    experience: '7 years',
    languages: 'English, Arabic',
    avatar: 'https://source.unsplash.com/random/300x300/?digital,marketer,man'
  },
  {
    id: 24,
    parentId: 22,
    name: 'Sofia Moreau',
    position: 'Content Creator & Social Media Specialist',
    experience: '5 years',
    languages: 'English, French',
    avatar: 'https://source.unsplash.com/random/300x300/?content,creator,woman'
  },
  {
    id: 25,
    parentId: 22,
    name: 'Vikram Singh',
    position: 'Graphic Designer',
    experience: '4 years',
    languages: 'English, Hindi',
    avatar: 'https://source.unsplash.com/random/300x300/?designer,indian,man'
  },

  // ==================== HR DEPARTMENT ====================
  {
    id: 5,
    parentId: 1,
    name: 'HR Department',
    position: 'Department',
    avatar: 'https://source.unsplash.com/random/300x300/?hr,team,people'
  },
  {
    id: 26,
    parentId: 5,
    name: 'Maria Ivanova',
    position: 'Head of Human Resources',
    experience: '11 years',
    languages: 'English, Russian',
    avatar: 'https://source.unsplash.com/random/300x300/?hr,director,woman,40s'
  },
  {
    id: 27,
    parentId: 26,
    name: 'Aisha Khan',
    position: 'Senior Recruiter',
    experience: '8 years',
    languages: 'English, Urdu, Arabic',
    avatar: 'https://source.unsplash.com/random/300x300/?recruiter,woman,southasian'
  },
  {
    id: 28,
    parentId: 26,
    name: 'Tom Reynolds',
    position: 'HR Coordinator',
    experience: '3 years',
    languages: 'English',
    avatar: 'https://source.unsplash.com/random/300x300/?young,hr,man'
  },
  {
    id: 29,
    parentId: 26,
    name: 'Fatima Al-Sayed',
    position: 'Employee Relations Specialist',
    experience: '6 years',
    languages: 'English, Arabic',
    avatar: 'https://source.unsplash.com/random/300x300/?hr,woman,arab'
  },

  // ==================== OPERATIONS DEPARTMENT ====================
  {
    id: 6,
    parentId: 1,
    name: 'Operations Department',
    position: 'Department',
    avatar: 'https://source.unsplash.com/random/300x300/?operations,team,efficiency'
  },
  {
    id: 30,
    parentId: 6,
    name: 'David Leung',
    position: 'Head of Operations',
    experience: '14 years',
    languages: 'English, Cantonese, Mandarin',
    avatar: 'https://source.unsplash.com/random/300x300/?operations,manager,asian,man'
  },
  {
    id: 31,
    parentId: 30,
    name: 'Priya Sharma',
    position: 'Operations Manager',
    experience: '9 years',
    languages: 'English, Hindi',
    avatar: 'https://source.unsplash.com/random/300x300/?manager,woman,indian'
  },
  {
    id: 32,
    parentId: 30,
    name: 'Carlos Mendoza',
    position: 'Administrative Coordinator',
    experience: '5 years',
    languages: 'English, Spanish',
    avatar: 'https://source.unsplash.com/random/300x300/?admin,man,latin'
  },
  {
    id: 33,
    parentId: 30,
    name: 'Yasmin Khalil',
    position: 'Facilities & Logistics Officer',
    experience: '7 years',
    languages: 'English, Arabic',
    avatar: 'https://source.unsplash.com/random/300x300/?logistics,woman,arab'
  }
];