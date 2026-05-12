# Contributing to Vestial

We welcome contributions! This document provides guidelines and instructions for contributing.

## Code of Conduct

- Be respectful and inclusive
- Provide constructive feedback
- Focus on ideas, not on individuals

## Getting Started

1. **Fork the repository** on GitHub
2. **Clone your fork** locally:
   ```bash
   git clone https://github.com/YOUR_USERNAME/vestial.git
   cd vestial
   ```
3. **Create a feature branch**:
   ```bash
   git checkout -b feature/your-feature-name
   ```
4. **Follow the development setup** in [SETUP.md](./SETUP.md)

## Development Workflow

### Before Starting

- Check existing issues and discussions
- Create an issue for larger changes
- Discuss your approach first if it's substantial

### Code Standards

- **TypeScript**: Write fully typed code, no `any` unless necessary
- **Components**: Keep components small and focused
- **Naming**: Use clear, descriptive names (camelCase for JS, PascalCase for components)
- **Comments**: Add comments for complex logic
- **Formatting**: Run prettier (automatic on save in VS Code)

Example component structure:
```typescript
'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'

interface MyComponentProps {
  title: string
  onAction?: () => void
}

export function MyComponent({ title, onAction }: MyComponentProps) {
  const [isLoading, setIsLoading] = useState(false)

  // Clear logic and well-named functions
  const handleClick = async () => {
    setIsLoading(true)
    try {
      await performAction()
    } finally {
      setIsLoading(false)
    }
  }

  return <Button onClick={handleClick}>{title}</Button>
}
```

### Testing Locally

```bash
# Run type checking
npm run type-check

# Check styling
npm run lint

# Build for production
npm run build

# Start production server
npm start
```

## Making Changes

### 1. Bug Fixes
- Create a descriptive commit message
- Add a comment explaining the bug
- Include before/after behavior

### 2. New Features
- Add TypeScript types
- Create UI components in `components/ui` if reusable
- Add API helpers in `lib/api` if using external services
- Update types in `lib/types.ts` if adding new data structures
- Document the feature in README.md

### 3. UI/Style Changes
- Use Tailwind CSS classes
- Maintain dark mode compatibility
- Test on mobile devices
- Ensure accessibility (keyboard navigation, contrast)

### 4. API Integration
- Add helpers in `lib/api/`
- Include error handling
- Add environment variables to `.env.example`
- Implement caching for performance

### File Locations

```
New API integration?     → lib/api/
New UI component?       → components/ui/
New page?              → app/[path]/page.tsx
New API endpoint?      → app/api/[path]/route.ts
New utility function?  → lib/utils.ts or new file
New type?              → lib/types.ts
```

## Commit Guidelines

```bash
# Good commit messages are clear and descriptive
git commit -m "feat: add company comparison feature"
git commit -m "fix: resolve memory leak in search component"
git commit -m "docs: update setup instructions"

# Avoid generic messages
# ❌ git commit -m "update stuff"
# ✅ git commit -m "fix: prevent search results from overlapping on mobile"
```

Format: `type: description`

Types:
- `feat:` - New feature
- `fix:` - Bug fix
- `docs:` - Documentation
- `style:` - Code formatting (no logic change)
- `refactor:` - Code restructuring (no feature change)
- `perf:` - Performance improvement
- `test:` - Tests (coverage/fixes)

## Pull Request Process

1. **Push your feature branch**:
   ```bash
   git push origin feature/your-feature-name
   ```

2. **Create a Pull Request** on GitHub:
   - Clear title summarizing changes
   - Description of what changed and why
   - Reference any related issues (#123)
   - Screenshots if UI changes

3. **PR Title Format**:
   ```
   [type] Short description
   
   [fix] Search input not clearing after submission
   [feat] Add price alert notifications
   [docs] Expand API integration guide
   ```

4. **Respond to feedback**:
   - Address review comments promptly
   - Push updates to the same branch
   - Resolve conversations when addressed

5. **Merge**:
   - Ensure all checks pass
   - Squash commits if requested
   - Delete branch after merge

## Areas Where We Welcome Contributions

### High Priority
- 🐛 Fixing bugs and edge cases
- 📱 Mobile responsiveness improvements
- ♿ Accessibility enhancements
- 📚 Documentation and guides
- 🎨 UI polish and animations

### Features to Build
- [ ] User authentication (NextAuth)
- [ ] Dark/light mode toggle
- [ ] Price alerts
- [ ] Portfolio tracking
- [ ] Advanced charting
- [ ] Export functionality
- [ ] Email notifications
- [ ] API rate limiting improvements

### Ideas for Exploration
- Cryptocurrency support
- Sentiment analysis enhancements
- Real-time price updates
- Technical indicators
- Options data integration

## Review Process

### Your PR will be reviewed for:
- ✅ Code quality and style
- ✅ TypeScript correctness
- ✅ Mobile responsiveness
- ✅ Accessibility compliance
- ✅ Performance impact
- ✅ Documentation completeness
- ✅ Testing coverage

### Tips for faster reviews:
- Keep PRs focused (one feature per PR)
- Include screenshots for UI changes
- Add comments explaining complex logic
- Link to related issues
- Test thoroughly before submitting

## Using VS Code

Recommended extensions:
- **ESLint** - Code quality
- **Prettier** - Auto formatting
- **Tailwind CSS IntelliSense** - CSS suggestions
- **Thunder Client** - API testing (alternative to Postman)

Settings (`.vscode/settings.json`):
```json
{
  "editor.formatOnSave": true,
  "[typescript]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  },
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  }
}
```

## Questions?

- 💬 Open a GitHub Discussion
- 🐛 Report bugs as Issues
- 📝 Check existing documentation
- 💡 Share ideas in Discussions

## Appreciation

All contributions—big or small—help improve Vestial! Thank you for:
- Finding and reporting bugs
- Improving documentation
- Building new features
- Optimizing performance
- Enhancing accessibility
- Sharing feedback

Your effort helps create a better tool for everyone. 🙏

---

**Happy contributing!** 🚀
