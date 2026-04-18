# Developer Documentation: Extending PathPilot 🏗️

Welcome to the PathPilot development guide. This document explains how to maintain and extend the application's data layers.

## 1. Adding New Careers 💼

Careers are stored in the `careers` array in `app.js`. Each career object follows this schema:

```javascript
{
    id: "unique-slug",
    title: "Official Job Title",
    category: "Technical | Commercial | Creative | Social",
    salary: "₹10L - ₹25L",
    skills: ["Skill 1", "Skill 2"],
    toolkit: ["Tool 1", "Tool 2"],
    day: "Description of daily responsibilities...",
    steps: ["Step 1", "Step 2", "Step 3", "Step 4", "Step 5"],
    labels: ["Class 10-12", "UG", "PG/Spec", "Junior", "Senior"]
}
```

## 2. Adding Colleges 🏛️

Colleges are stored in the `colleges` array. Update this to include local or global institutions:

```javascript
{
    id: "college-slug",
    name: "Institution Name",
    city: "Location",
    stream: "Science | Commerce | Arts",
    avgFee: 50000, // Annual numeric fee for ROI calc
    rank: 1 // Integer rank
}
```

## 3. Modifying the Assessment 📝

The aptitude test logic lives in the `questions` array.
- Use `points` for simple Yes/No profiling.
- Use `options` with specific point distributions for domain-specific MCQ questions.

## 4. State Management 🔋

The app uses a central `user` object and `savedRoadmaps` array.
- Changes to the user profile trigger `updateProfileDisplay()`.
- Data is automatically persisted to `localStorage` upon critical actions (Onboarding finish, Saving roadmap).

## 5. UI Customization 🎨

Styling is entirely driven by CSS Variables in `style.css`. 
- **Themes**: Update `:root` variables for global changes.
- **Schemes**: The "Neon" and "Forest" themes use data-attributes (`[data-theme-scheme]`) to override primary/secondary color tokens.

---

**Optimization Note**: When adding large datasets, the `renderCareers()` function handles lazy-loading automatically. Keep an eye on DOM weight!
