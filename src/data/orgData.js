export default [
  // Root
  { id: 1, parentId: null, name: 'AX Capital', position: 'Company', experience: '', languages: '', avatar: 'https://source.unsplash.com/random/200x200/?company,logo' },

  // Departments (add simple icons or placeholders)
  { id: 2, parentId: 1, name: 'Sales Department', position: 'Department', avatar: 'https://source.unsplash.com/random/200x200/?sales,team' },
  { id: 3, parentId: 1, name: 'IT Department', position: 'Department', avatar: 'https://source.unsplash.com/random/200x200/?it,tech' },
  { id: 4, parentId: 1, name: 'Marketing Department', position: 'Department', avatar: 'https://source.unsplash.com/random/200x200/?marketing' },
  { id: 5, parentId: 1, name: 'HR Department', position: 'Department', avatar: 'https://source.unsplash.com/random/200x200/?hr,people' },
  { id: 6, parentId: 1, name: 'Operations Department', position: 'Department', avatar: 'https://source.unsplash.com/random/200x200/?operations' },

  // Sales examples (real agents - placeholders)
  { id: 7, parentId: 2, name: 'Ben Thomas', position: 'Head of Secondary', experience: '19 years', languages: 'English, Spanish', avatar: 'https://deeptechlabs.co.ke/wp-content/uploads/2021/09/robert.jpg' },
  { id: 8, parentId: 2, name: 'Dimitry Zolotco', position: 'Associate Director', experience: '15 years', languages: 'English, Russian, Romanian', avatar: 'https://deeptechlabs.co.ke/wp-content/uploads/2021/09/robert.jpg' },
  { id: 10, parentId: 7, name: 'Olga Gojin', position: 'Property Expert', experience: '18 years', languages: 'English, Russian, Romanian', avatar: 'https://deeptechlabs.co.ke/wp-content/uploads/2021/09/robert.jpg' },
  { id: 11, parentId: 7, name: 'Luiza Ribas Patane', position: 'Senior Property Expert', experience: '4 years', languages: 'English, Spanish, Portuguese', avatar: 'https://deeptechlabs.co.ke/wp-content/uploads/2021/09/robert.jpg' },

  // IT examples (fictional)
  { id: 16, parentId: 3, name: 'Alexei Petrov', position: 'Head of IT', experience: '12 years', languages: 'English, Russian', avatar: 'https://deeptechlabs.co.ke/wp-content/uploads/2021/09/robert.jpg' },
  { id: 17, parentId: 16, name: 'Sara Al-Mansoori', position: 'Senior Full-Stack Developer', experience: '8 years', languages: 'English, Arabic', avatar: 'https://deeptechlabs.co.ke/wp-content/uploads/2021/09/robert.jpg' },
  // Add more as needed...
];