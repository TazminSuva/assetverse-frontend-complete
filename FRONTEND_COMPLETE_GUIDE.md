# AssetVerse Frontend - Complete Implementation Guide

## 📁 Complete Project Structure

```
assetverse-frontend/
├── public/
├── src/
│   ├── components/
│   │   ├── Navbar.jsx
│   │   ├── Footer.jsx (to be created)
│   │   └── LoadingSpinner.jsx (optional)
│   │
│   ├── context/
│   │   └── AuthContext.jsx
│   │
│   ├── pages/
│   │   ├── Home.jsx
│   │   ├── LoginPage.jsx
│   │   ├── RegisterHR.jsx
│   │   ├── RegisterEmployee.jsx
│   │   ├── NotFound.jsx
│   │   ├── Profile.jsx
│   │   │
│   │   ├── HR/
│   │   │   ├── HRDashboard.jsx
│   │   │   ├── AssetList.jsx
│   │   │   ├── AddAsset.jsx
│   │   │   ├── AllRequests.jsx
│   │   │   ├── EmployeeList.jsx
│   │   │   └── UpgradePackage.jsx
│   │   │
│   │   └── Employee/
│   │       ├── EmployeeDashboard.jsx
│   │       ├── MyAssets.jsx
│   │       ├── RequestAsset.jsx
│   │       └── MyTeam.jsx
│   │
│   ├── routes/
│   │   └── PrivateRoute.jsx
│   │
│   ├── utils/
│   │   ├── helpers.js
│   │   └── constants.js
│   │
│   ├── api.js
│   ├── App.jsx
│   ├── main.jsx
│   ├── index.css
│   │
│   └── assets/
│       ├── images/
│       ├── icons/
│       └── fonts/
│
├── index.html
├── vite.config.js
├── tailwind.config.js
├── postcss.config.js
├── package.json
├── .env.example
├── .env.local
├── .gitignore
├── README.md
└── FRONTEND_SETUP_GUIDE.md
```

## 📝 File Organization by Category

### 1. Core Configuration Files
- `vite.config.js` - Vite bundler config
- `tailwind.config.js` - Tailwind CSS theme
- `postcss.config.js` - PostCSS plugins
- `package.json` - Dependencies
- `.env.example` - Environment template

### 2. Entry Points
- `index.html` - Main HTML file
- `main.jsx` - React entry point
- `App.jsx` - Main app component with routing

### 3. Pages (19 files total)

#### Public Pages (4 files)
- `Home.jsx` - Landing page
- `LoginPage.jsx` - Login form
- `RegisterHR.jsx` - HR registration
- `RegisterEmployee.jsx` - Employee registration
- `NotFound.jsx` - 404 page

#### HR Dashboard (6 files)
- `HRDashboard.jsx` - Main dashboard with analytics
- `AssetList.jsx` - Asset management table
- `AddAsset.jsx` - Add new asset form
- `AllRequests.jsx` - Request management
- `EmployeeList.jsx` - Employee grid view
- `UpgradePackage.jsx` - Package upgrade page

#### Employee Dashboard (4 files)
- `EmployeeDashboard.jsx` - Main dashboard
- `MyAssets.jsx` - Assigned assets list
- `RequestAsset.jsx` - Asset request form
- `MyTeam.jsx` - Team members view

#### Shared Pages (1 file)
- `Profile.jsx` - User profile management

### 4. Components (2 files)
- `Navbar.jsx` - Navigation bar
- `PrivateRoute.jsx` - Route protection

### 5. Context & State
- `AuthContext.jsx` - Authentication context

### 6. API Integration
- `api.js` - All API calls with axios

## 🚀 Setup Instructions

### Step 1: Create React App with Vite
```bash
npm create vite@latest assetverse-frontend -- --template react
cd assetverse-frontend
npm install
```

### Step 2: Install Dependencies
```bash
# Styling & UI
npm install -D tailwindcss postcss autoprefixer
npm install daisyui

# Core libraries
npm install react-router-dom axios
npm install framer-motion
npm install recharts
npm install react-hot-toast
npm install react-to-print jspdf html2canvas
```

### Step 3: Create Folder Structure
```bash
mkdir -p src/{components,context,pages/{HR,Employee},routes,utils,assets}
```

### Step 4: Copy Configuration Files
Copy these files to project root:
- `vite.config.js`
- `tailwind.config.js`
- `postcss.config.js`
- `index.html`

### Step 5: Create Component Files
Create all files in their respective directories as per the structure above.

### Step 6: Setup Environment
```bash
# Create .env.local
cat > .env.local << EOF
VITE_API_URL=http://localhost:5000/api
EOF
```

### Step 7: Start Development Server
```bash
npm run dev
```

Server runs on `http://localhost:3000`

## 📊 Page Breakdown

### Public Pages

#### 1. Home (`pages/Home.jsx`)
- Hero section with CTA buttons
- Features showcase grid
- Pricing packages
- Testimonials/stats
- Footer with links

#### 2. Login (`pages/LoginPage.jsx`)
- Email/password form
- Remember me checkbox
- Test credentials display
- Links to registration pages

#### 3. Register HR (`pages/RegisterHR.jsx`)
- Company name field
- Company logo upload
- HR personal details
- Form validation
- Benefits highlight box

#### 4. Register Employee (`pages/RegisterEmployee.jsx`)
- Personal details form
- Email and password fields
- Simple clean form
- Benefits highlight box

### HR Dashboard Pages

#### 1. HRDashboard (`pages/HR/HRDashboard.jsx`)
- Welcome message
- 4 stat cards (Total Assets, Pending Requests, etc.)
- 2 Recharts (Pie chart + Bar chart)
- Top assets table
- Recent requests list

#### 2. AssetList (`pages/HR/AssetList.jsx`)
- Search functionality
- Pagination controls
- Asset table with actions (Edit/Delete)
- Edit modal
- Delete confirmation modal

#### 3. AddAsset (`pages/HR/AddAsset.jsx`)
- Form with validation
- Image preview
- Asset type selection
- Quantity input
- Tips section

#### 4. AllRequests (`pages/HR/AllRequests.jsx`)
- Request statistics cards
- Filter buttons (All, Pending, Approved, Rejected)
- Requests table
- Approve/Reject modals
- Status badges

#### 5. EmployeeList (`pages/HR/EmployeeList.jsx`)
- Employee cards grid
- Employee count display
- Usage progress bars
- Remove employee button
- Info box explaining affiliation

#### 6. UpgradePackage (`pages/HR/UpgradePackage.jsx`)
- Current plan display
- 3 package cards (Basic, Standard, Premium)
- Pricing comparison
- Stripe integration ready
- FAQ section

### Employee Dashboard Pages

#### 1. EmployeeDashboard (`pages/Employee/EmployeeDashboard.jsx`)
- Welcome greeting
- 3 stat cards (My Assets, Companies, Pending Returns)
- Quick action buttons
- My companies grid
- Recent assets table

#### 2. MyAssets (`pages/Employee/MyAssets.jsx`)
- Search and filter functionality
- Asset cards grid
- Return button for returnable items
- Print functionality (hidden section)
- Stats cards

#### 3. RequestAsset (`pages/Employee/RequestAsset.jsx`)
- Available assets grid
- Search and filter
- Asset details (company, quantity, type)
- Request modal with notes field
- Progress bars showing availability

#### 4. MyTeam (`pages/Employee/MyTeam.jsx`)
- Company selector sidebar
- Company info display
- Upcoming birthdays section
- Team members grid
- Contact information

### Shared Pages

#### Profile (`pages/Profile.jsx`)
- Avatar preview
- Name edit field
- Email (read-only)
- Profile image URL
- HR-specific company info
- Edit/Save buttons
- Tips sections

## 🎨 Component Features

### Navbar (`components/Navbar.jsx`)
- Logo with brand name
- Dynamic links based on role
- Responsive mobile menu
- User avatar with dropdown
- Logout button
- Breadcrumb-style navigation

### PrivateRoute (`routes/PrivateRoute.jsx`)
- Auth check
- Role verification
- Loading state
- Redirect to login if not authenticated

## 🔐 Authentication Flow

1. User registers on `/register/hr` or `/register/employee`
2. Backend returns JWT token
3. Token stored in localStorage
4. Token attached to all API requests
5. Token validated on private routes
6. Automatic redirect to login if token invalid/expired

## 📱 Responsive Design

All pages are fully responsive:
- Mobile: 1 column
- Tablet: 2 columns
- Desktop: 3+ columns

Uses Tailwind's responsive prefixes (`md:`, `lg:`)

## 🎯 Key Features Implemented

### Authentication
- JWT token handling
- Protected routes
- Role-based access
- Persistent login

### HR Features
- Asset CRUD operations
- Request management (Approve/Reject)
- Employee affiliation tracking
- Package upgrades
- Analytics & charts
- Pagination

### Employee Features
- Asset requests
- Asset tracking
- Team member view
- Birthday notifications
- Asset returns
- PDF reports

### UI/UX
- Framer Motion animations
- Toast notifications
- Loading states
- Form validation
- Error handling
- Modal dialogs
- Skeleton states

## 🚀 Deployment

### Build for Production
```bash
npm run build
```

Creates optimized `dist/` folder.

### Deploy to Netlify
```bash
# Option 1: Direct
npm run build
netlify deploy --prod --dir=dist

# Option 2: GitHub Integration
# Connect repo in Netlify dashboard
# Automatic deploys on push to main
```

### Deploy to Vercel
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

### Environment Variables for Production
```
VITE_API_URL=https://your-api.herokuapp.com/api
```

## 🧪 Testing Features

### Test as HR Manager
1. Register at `/register/hr`
2. Go to `/hr/dashboard`
3. Create assets
4. View employee requests
5. Manage team

### Test as Employee
1. Register at `/register/employee`
2. Go to `/employee/dashboard`
3. Request assets
4. View assigned assets
5. Check team members

## 🐛 Common Issues & Solutions

### CORS Errors
- **Problem**: API requests blocked
- **Solution**: Ensure backend CORS configuration allows frontend domain

### Token Issues
- **Problem**: "Invalid token" errors
- **Solution**: Check JWT_SECRET in backend .env matches

### Images Not Loading
- **Problem**: Product/profile images broken
- **Solution**: Verify image URLs are accessible, check CORS for image hosts

### Responsive Issues
- **Problem**: Layout broken on mobile
- **Solution**: Check Tailwind responsive classes, clear cache

## 📞 Support & Help

For issues:
1. Check console for errors
2. Verify backend is running
3. Check network tab in DevTools
4. Verify environment variables
5. Test with mock data

## ✅ Checklist Before Deployment

- [ ] All pages created and functional
- [ ] API integration tested
- [ ] Forms validated
- [ ] Authentication working
- [ ] Responsive design verified
- [ ] Loading states implemented
- [ ] Error handling added
- [ ] Environment variables configured
- [ ] Build successful
- [ ] No console errors
- [ ] All routes protected
- [ ] Test user flows

## 📚 Additional Resources

- [React Documentation](https://react.dev)
- [Tailwind CSS](https://tailwindcss.com)
- [DaisyUI Components](https://daisyui.com)
- [Framer Motion](https://www.framer.com/motion/)
- [Recharts](https://recharts.org)
- [React Router](https://reactrouter.com)

---

**Happy Coding! 🚀**
