# Invoice Management Frontend

A modern Angular application for managing invoices with features like user authentication, invoice CRUD operations, status tracking, AI assistance, and dark mode support. Built with Angular 20, PrimeNG, and TypeScript.

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Running the Application](#running-the-application)
- [Project Structure](#project-structure)
- [Key Concepts](#key-concepts)
- [Components Overview](#components-overview)
- [Services](#services)
- [Routing](#routing)
- [State Management](#state-management)
- [Styling](#styling)
- [Building for Production](#building-for-production)
- [Testing](#testing)
- [Contributing](#contributing)

## Overview

This is the frontend application for the Invoice Management System. It's built using Angular 20 with standalone components, providing a modern, responsive interface for creating and managing invoices. The application communicates with a REST API backend for data persistence and includes an AI assistant powered by OpenAI.

**Live Demo:** [Add your demo link here]

## Features

### Core Features

- ✅ **User Authentication** - Secure login and registration with JWT
- ✅ **Invoice Dashboard** - View all invoices with filtering options
- ✅ **Create Invoices** - Rich form with client info, line items, and automatic totals
- ✅ **Edit Invoices** - Update existing invoices seamlessly
- ✅ **Delete Invoices** - Remove invoices with confirmation dialogs
- ✅ **Invoice Details** - Comprehensive view of individual invoices
- ✅ **Status Management** - Track invoices as Draft, Pending, or Paid
- ✅ **Mark as Paid** - Quick status updates
- ✅ **Filter by Status** - Filter invoices by their current status
- ✅ **AI Assistant** - Chat with AI for invoice-related help
- ✅ **Dark Mode** - Toggle between light and dark themes
- ✅ **Test User Login** - Quick demo access
- ✅ **Responsive Design** - Mobile-first, works on all screen sizes
- ✅ **Route Guards** - Protected routes for authenticated users
- ✅ **Lazy Loading** - Optimized performance with code splitting

### UI/UX Features

- Smooth page transitions
- Toast notifications for user feedback
- Confirmation dialogs for destructive actions
- Loading states and spinners
- Form validation with error messages
- Drawer-based UI for forms
- Material icons throughout

## Tech Stack

### Core

- **Angular** - v20.x (Standalone Components, Zoneless)
- **TypeScript** - v5.8.2
- **RxJS** - v7.x - Reactive programming

### UI Libraries

- **PrimeNG** - Complete UI component library
  - Buttons, Tables, Cards, Drawers, Dialogs
  - Forms, Inputs, Selects, Date pickers
  - Toast notifications, Progress spinners
- **PrimeUI Themes** - Nora theme preset
- **Tailwind CSS** - Utility-first CSS framework
- **Material Icons** - Google Material Design icons

### Development Tools

- **Angular CLI** - v20.x
- **Vite** (or Angular's default builder)
- **ESLint** - Code linting
- **Prettier** - Code formatting

## Prerequisites

- **Node.js** - v20.x or higher ([Download](https://nodejs.org/))
- **npm** - v10.x or higher (comes with Node.js)
- **Angular CLI** - v20.x
  ```bash
  npm install -g @angular/cli@20
  ```

## Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/lubosJurca/invoices-angular-frontend
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Verify installation**
   ```bash
   ng version
   ```

## Running the Application

### Development Server

```bash
ng serve
```

Navigate to `http://localhost:4200/`. The application will automatically reload when you make changes to source files.

### Development Server with Custom Port

```bash
ng serve --port 4300
```

### Open Browser Automatically

```bash
ng serve --open
```

## Project Structure

```
src/
├── app/
│   ├── core/                          # Core functionality
│   │   └── auth/
│   │       ├── auth.service.ts        # Authentication service
│   │       └── auth-guard-guard.ts    # Route guard
│   │
│   │
│   ├── features/                      # Feature modules/components
│   │   ├── home-page/                 # Landing page
│   │   │   ├── home-page.ts
│   │   │   └── home-page.html
│   │   │
│   │   ├── login-page/                # Login component
│   │   ├── sign-up-page/              # Registration component
│   │   ├── dashboard/                 # Main dashboard layout
│   │   ├── table-page/                # Invoice table view
│   │   ├── detail-page/               # Invoice detail view
│   │   ├── invoice-drawer/            # Create/Edit invoice drawer
│   │   ├── invoice-form/              # Invoice form component
│   │   ├── action-bar/                # Filter and action bar
│   │   ├── main-table/                # Main invoice table
│   │   ├── delete-button/             # Delete with confirmation
│   │   ├── mark-as-paid-button/       # Status update button
│   │   ├── ai-drawer/                 # AI assistant drawer
│   │   ├── navbar/                    # Navigation bar
│   │   ├── footer/                    # Footer component
│   │   └── not-found-page/            # 404 page
│   │
│   ├── shared/                        # Shared resources
│   │   ├── models/
│   │   │   └── models.ts              # TypeScript interfaces
│   │   └── services/
│   │       ├── data.service.ts        # Invoice data service
│   │       ├── toast.service.ts       # Toast notifications
│   │       ├── ai-assistant.service.ts # AI service
│   │       └── dark-theme.service.ts  # Theme switching
│   │
│   ├── app.ts                         # Root component
│   ├── app.html                       # Root template
│   ├── app.css                        # Root styles
│   ├── app.config.ts                  # App configuration
│   └── app.routes.ts                  # Route definitions
│
├── assets/                            # Static assets
│   ├── images/
│   └── fonts/
│
├── environments/                      # Environment configs
│   ├── environment.ts
│   └── environment.prod.ts
│
├── index.html                         # Main HTML file
├── main.ts                            # Application entry point
└── styles.css                         # Global styles
```

## Key Concepts

### 1. Standalone Components

This project uses Angular's modern standalone components (no NgModules):

```typescript
@Component({
  selector: "app-dashboard",
  imports: [Navbar, Footer, RouterOutlet], // Direct imports
  templateUrl: "./dashboard.html",
})
export class Dashboard {}
```

### 2. Zoneless Change Detection

The app uses Angular's new zoneless change detection for better performance:

```typescript
// app.config.ts
provideZonelessChangeDetection();
```

### 3. Signals & RxJS

Combines modern Angular signals with RxJS observables for state management.

### 4. Dependency Injection with `inject()`

Uses the modern `inject()` function instead of constructor injection:

```typescript
export class DataService {
  private authService = inject(AuthService);
  private router = inject(Router);
}
```

## Components Overview

### Page Components

#### Home Page (`home-page/`)

- Landing page with hero section
- Feature highlights
- CTA buttons for login/signup
- Test user quick login

#### Login Page (`login-page/`)

- User authentication form
- Form validation
- Error handling
- Redirect after login

#### Dashboard (`dashboard/`)

- Main layout wrapper
- Navbar and footer
- Outlet for child routes

#### Table Page (`table-page/`)

- Displays all invoices in a table
- Filter by status
- Click to view details
- Loading states

#### Detail Page (`detail-page/`)

- Full invoice information
- Itemized billing table
- Action buttons (Edit, Delete, Mark as Paid)
- Status badge

### Feature Components

#### Invoice Drawer (`invoice-drawer/`)

- Slide-out drawer for creating/editing invoices
- Reusable for both create and edit operations
- Form submission handling

#### Invoice Form (`invoice-form/`)

- Complex reactive form
- Client information section
- Sender address section
- Dynamic line items (add/remove)
- Automatic total calculation
- Date pickers for due dates
- Validation

#### Action Bar (`action-bar/`)

- Status filter dropdown
- Total invoice count
- Filter state management

#### AI Drawer (`ai-drawer/`)

- Chat interface with AI assistant
- Question input
- Streaming or immediate responses
- Loading states

#### Delete Button (`delete-button/`)

- Confirmation dialog before deletion
- Integrates with ConfirmationService
- Success/error toast notifications

#### Mark as Paid Button (`mark-as-paid-button/`)

- Quick status update to "Paid"
- Confirmation dialog
- Real-time UI updates

## Services

### AuthService (`auth.service.ts`)

Handles all authentication logic:

- Login/logout/register
- JWT token management
- Current user state
- Auth initialization
- HTTP headers with token

```typescript
// Usage example
const authService = inject(AuthService);
authService.login(credentials).subscribe(...);
```

### DataService (`data.service.ts`)

Manages all invoice data operations:

- Fetch all invoices with filtering
- Create new invoices
- Edit existing invoices
- Delete invoices
- Mark as paid
- Loading and error states
- Reactive data streams with BehaviorSubjects

```typescript
// Usage example
const dataService = inject(DataService);
invoices$ = dataService.allInvoicesData$;
```

### ToastService (`toast.service.ts`)

Displays toast notifications:

- Success messages
- Error messages
- Info messages
- Wraps PrimeNG MessageService

```typescript
// Usage example
toastService.success("Invoice created!");
toastService.error("Failed to delete invoice");
```

### AiAssistant (`ai-assistant.service.ts`)

Communicates with AI endpoint:

- Send questions to AI
- Receive responses
- Loading states

### DarkTheme (`dark-theme.service.ts`)

Manages theme switching:

- Toggle dark/light mode
- Persist preference
- Observable for theme state

## Routing

### Route Configuration (`app.routes.ts`)

```typescript
export const routes: Routes = [
  { path: "", component: HomePage },
  { path: "login", component: LoginPage },
  {
    path: "sign-up",
    loadComponent: () => import("./features/sign-up-page/sign-up-page"),
  },
  {
    path: "dashboard",
    component: Dashboard,
    canActivate: [authGuard], // Protected route
    children: [
      { path: "", component: TablePage },
      { path: "detail/:id", component: DetailPage },
    ],
  },
  { path: "**", component: NotFoundPage },
];
```

### Route Guard

The `authGuard` protects routes from unauthorized access:

```typescript
// Redirects to login if not authenticated
canActivate: [authGuard];
```

### Lazy Loading

Components are lazy-loaded for better performance:

```typescript
loadComponent: () => import("./features/sign-up-page/sign-up-page");
```

## State Management

### Reactive State with RxJS

#### BehaviorSubjects for State

```typescript
private filterStatus = new BehaviorSubject<string>('all');
public filterStatus$ = this.filterStatus.asObservable();
```

#### Combined Observables

```typescript
public allInvoicesData$ = combineLatest([
  this.auth.currentUser$,
  this.filterStatus$,
  this.refreshTrigger$
]).pipe(
  switchMap(([user, filter]) => this.fetchAllInvoices(filter)),
  shareReplay(1)
);
```

#### Async Pipe in Templates

```html
<div *ngIf="invoices$ | async as invoices">
  <!-- Template code -->
</div>
```

### Refresh Trigger Pattern

Used to manually trigger data refreshes:

```typescript
this.dataService.refreshTrigger$.next(!this.dataService.refreshTrigger$.value);
```

## Styling

### Tailwind CSS

Utility-first CSS framework for rapid UI development:

```html
<div class="flex items-center justify-between p-4 bg-white rounded-lg shadow-md">
  <!-- Content -->
</div>
```

### PrimeNG Theming

Using Nora theme with custom dark mode:

```typescript
providePrimeNG({
  theme: {
    preset: Nora,
    options: {
      darkModeSelector: ".dark-theme",
    },
  },
});
```

### Global Styles

Global styles in `src/styles.css` for:

- CSS resets
- PrimeNG theme imports
- Tailwind directives
- Custom utility classes

``

### Deployment

The `dist/` folder can be deployed to:

- **Netlify** - Drop the folder or connect to Git
- **Vercel** - Import project and deploy
- **Firebase Hosting** - `firebase deploy`
- **AWS S3 + CloudFront** - Upload to S3 bucket
- **GitHub Pages** - Use `angular-cli-ghpages`
- **Docker** - Serve with Nginx

Example Netlify `netlify.toml`:

```toml
[build]
  command = "ng build --configuration production"
  publish = "dist/frontend/browser"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

## Testing

### Run Unit Tests

```bash
ng test
```

### Run Tests with Coverage

```bash
ng test --code-coverage
```

Coverage reports are generated in `coverage/` directory.

### Run E2E Tests (if configured)

```bash
ng e2e
```

### Writing Tests

Example component test:

```typescript
import { TestBed } from "@angular/core/testing";
import { Dashboard } from "./dashboard";

describe("Dashboard", () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Dashboard],
    }).compileComponents();
  });

  it("should create", () => {
    const fixture = TestBed.createComponent(Dashboard);
    const component = fixture.componentInstance;
    expect(component).toBeTruthy();
  });
});
```

## Development Tips for Junior Developers

### 1. Component Communication

- **@Input()** - Pass data from parent to child
- **@Output()** - Emit events from child to parent
- **Services** - Share data between unrelated components

### 2. Observables & Subscriptions

- Always unsubscribe to prevent memory leaks
- Use `async` pipe in templates (auto-unsubscribes)
- Use `takeUntilDestroyed()` for automatic cleanup

```typescript
private destroyRef$ = inject(DestroyRef);

this.dataService.getData()
  .pipe(takeUntilDestroyed(this.destroyRef$))
  .subscribe(...);
```

### 3. Form Handling

- Use Reactive Forms for complex forms
- Template-driven forms for simple cases
- Validators for form validation

### 4. Error Handling

- Always handle errors in HTTP requests
- Show user-friendly error messages
- Log errors for debugging

### 5. Performance

- Use `OnPush` change detection (if needed)
- Lazy load routes
- Use `trackBy` in `*ngFor`
- Avoid unnecessary subscriptions

### 6. Debugging

- Use Angular DevTools (Chrome extension)
- Console.log strategically
- Use breakpoints in browser DevTools
- Check Network tab for API calls

## Common Commands

```bash
# Generate new component
ng generate component features/my-component

# Generate new service
ng generate service shared/services/my-service

# Generate new guard
ng generate guard core/my-guard

```

## Troubleshooting

### Port Already in Use

```bash
# Kill process on port 4200
npx kill-port 4200

# Or use different port
ng serve --port 4300
```

### Module Not Found Errors

```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
```

### CORS Errors

- Check backend CORS configuration
- Ensure API URL is correct in environment file
- Check browser console for specific errors

### Authentication Issues

- Verify token is being sent in headers
- Check token expiration
- Clear localStorage and re-login

## Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

### Code Style

- Follow Angular Style Guide
- Use meaningful variable names
- Comment complex logic
- Keep components small and focused
- Write unit tests for new features

## Additional Resources

- [Angular Documentation](https://angular.dev/)
- [PrimeNG Documentation](https://primeng.org/)
- [RxJS Documentation](https://rxjs.dev/)
- [Tailwind CSS Documentation](https://tailwindcss.com/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)

## License

ISC License

---

**Made using Angular 20**
